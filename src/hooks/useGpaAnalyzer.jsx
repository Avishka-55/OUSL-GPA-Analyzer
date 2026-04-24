import { useEffect, useMemo, useRef, useState } from "react";
import {
  CRITERIA,
  GPV,
  RENDER_LIMIT,
  effectiveCredit,
  getCredits,
  getDegreeClass,
  getLevel,
  parseOUSLFromXlsxFile,
  parseOUSLFromHtmlText,
} from "../lib/gpa.jsx";

export function useGpaAnalyzer() {
  const [degreeType, setDegreeType] = useState("general");
  const [excludeText, setExcludeText] = useState(
    "LTE3401, FDE3020, CYE3200, CSE3213, FNE3000, ADE3200"
  );

  const [fileLabel, setFileLabel] = useState(
    "Tap to upload or drag & drop .xls/.xlsx/.html here"
  );
  const [fileStatus, setFileStatus] = useState({ kind: "idle", message: "" });

  const [allCourses, setAllCourses] = useState([]);

  // collapses
  const [incExpanded, setIncExpanded] = useState(false);
  const [skipExpanded, setSkipExpanded] = useState(false);
  const [whatIfExpanded, setWhatIfExpanded] = useState(false);

  // what-if selections
  const [whatIfGrades, setWhatIfGrades] = useState({}); // { [code]: "A" }

  const reportRef = useRef(null);

  const excluded = useMemo(() => {
    return excludeText
      .split(",")
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);
  }, [excludeText]);

  function setExcludedCodes(codes) {
    const cleanCodes = [...new Set(codes.map((code) => String(code || "").trim().toUpperCase()).filter(Boolean))];
    setExcludeText(cleanCodes.join(", "));
  }

  function addExcludedCode(code) {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized || excluded.includes(normalized)) return;
    setExcludedCodes([...excluded, normalized]);
  }

  function removeExcludedCode(code) {
    const normalized = String(code || "").trim().toUpperCase();
    if (!normalized) return;
    setExcludedCodes(excluded.filter((item) => item !== normalized));
  }

  const degreeCrit = useMemo(() => CRITERIA[degreeType], [degreeType]);

  const baseData = useMemo(() => {
    if (!allCourses.length) return null;

    const included = [];
    const skipped = [];
    const gradesWithGPV = [];

    for (const c of allCourses) {
      const code = (c.code || "").toUpperCase();

      if (excluded.includes(code)) {
        skipped.push({ ...c, reason: "Excluded" });
        continue;
      }

      const notCompleted =
        c.status === "Eligible" || c.status === "Pending" || c.grade === "-";
      if (notCompleted) {
        skipped.push({ ...c, reason: "Not completed yet" });
        continue;
      }

      if (!(c.grade in GPV)) {
        skipped.push({ ...c, reason: "Ungraded" });
        continue;
      }

      const cr = getCredits(c.code);
      if (!cr) {
        skipped.push({ ...c, reason: "No credits parsed" });
        continue;
      }

      gradesWithGPV.push({ ...c, code, cr });
    }

    const bestByCode = {};
    const lowerGrades = [];

    for (const c of gradesWithGPV) {
      const gpv = GPV[c.grade];
      if (!bestByCode[c.code]) {
        bestByCode[c.code] = { ...c, gpv };
      } else {
        if (gpv > bestByCode[c.code].gpv) {
          lowerGrades.push(bestByCode[c.code]);
          bestByCode[c.code] = { ...c, gpv };
        } else {
          lowerGrades.push({ ...c, gpv });
        }
      }
    }

    for (const c of lowerGrades) {
      skipped.push({ ...c, reason: "Lower Retake Grade" });
    }

    for (const c of Object.values(bestByCode)) {
      const level = getLevel(c.code);
      const effCredit = effectiveCredit(c.cr, level, degreeType);
      const weighted = effCredit * c.gpv;

      included.push({ ...c, credits: c.cr, level, effCredit, weighted });
    }

    const totalEffCredits = included.reduce((s, c) => s + c.effCredit, 0);
    const totalWeighted = included.reduce((s, c) => s + c.weighted, 0);
    const totalRealCredits = included.reduce((s, c) => s + c.credits, 0);
    const gpa = totalEffCredits > 0 ? totalWeighted / totalEffCredits : 0;

    const levels = {};
    const gradeDist = {};

    for (const c of included) {
      if (c.level) {
        if (!levels[c.level]) {
          levels[c.level] = {
            weighted: 0,
            effCredits: 0,
            realCredits: 0,
            courses: [],
          };
        }
        levels[c.level].weighted += c.weighted;
        levels[c.level].effCredits += c.effCredit;
        levels[c.level].realCredits += c.credits;
        levels[c.level].courses.push(c);
      }

      gradeDist[c.grade] = (gradeDist[c.grade] || 0) + c.credits;
    }

    const levelGPA = Object.entries(levels)
      .map(([l, d]) => ({
        level: Number(l),
        gpa: d.effCredits > 0 ? d.weighted / d.effCredits : 0,
        realCredits: d.realCredits,
        courses: d.courses,
      }))
      .sort((a, b) => a.level - b.level);

    return {
      gpa,
      totalEffCredits,
      totalWeighted,
      totalRealCredits,
      included,
      skipped,
      levelGPA,
      gradeDist,
    };
  }, [allCourses, excluded, degreeType]);

  const activeClass = useMemo(() => getDegreeClass(baseData?.gpa ?? 0), [baseData]);

  const progressPct = useMemo(() => {
    if (!baseData) return 0;
    return Math.min(
      Math.round((baseData.totalRealCredits / degreeCrit.totalCredits) * 100),
      100
    );
  }, [baseData, degreeCrit.totalCredits]);

  const incompleteCourses = useMemo(() => {
    if (!allCourses.length) return [];
    const pendings = allCourses.filter((c) => {
      const code = (c.code || "").toUpperCase();
      if (excluded.includes(code)) return false;
      return c.status === "Eligible" || c.status === "Pending" || c.grade === "-";
    });
    
    const seen = new Set();
    const uniquePendings = [];
    for (const c of pendings) {
      const code = (c.code || "").toUpperCase();
      if (!seen.has(code)) {
        seen.add(code);
        uniquePendings.push(c);
      }
    }
    return uniquePendings;
  }, [allCourses, excluded]);

  const projected = useMemo(() => {
    if (!baseData) return null;

    let newEff = baseData.totalEffCredits;
    let newW = baseData.totalWeighted;
    let addedAny = false;

    for (const c of incompleteCourses) {
      const g = whatIfGrades[c.code];
      if (!g) continue;

      const code = (c.code || "").toUpperCase();
      const cr = getCredits(c.code);
      const level = getLevel(c.code);
      if (!cr) continue;

      const eff = effectiveCredit(cr, level, degreeType);
      const newGpv = GPV[g];

      const prevAttempt = baseData.included.find(inc => inc.code === code);

      if (prevAttempt) {
        if (newGpv > prevAttempt.gpv) {
          newEff = newEff - prevAttempt.effCredit + eff;
          newW = newW - prevAttempt.weighted + (eff * newGpv);
          addedAny = true;
        }
      } else {
        newEff += eff;
        newW += eff * newGpv;
        addedAny = true;
      }
    }

    if (!addedAny) return null;

    const projGPA = newEff > 0 ? newW / newEff : 0;
    const cls = getDegreeClass(projGPA);
    const delta = projGPA - baseData.gpa;
    return { projGPA, cls, delta };
  }, [baseData, incompleteCourses, whatIfGrades, degreeType]);

  // Progress bar animation after DOM paint
  useEffect(() => {
    const t = setTimeout(() => {
      document.querySelectorAll(".prog-fill").forEach((el) => {
        el.style.width = (el.dataset.pct || 0) + "%";
      });
    }, 60);
    return () => clearTimeout(t);
  }, [baseData, degreeType]);

  async function loadFile(file) {
    if (!file) return;

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      const parsed =
        extension === "xlsx"
          ? await parseOUSLFromXlsxFile(file)
          : parseOUSLFromHtmlText(await file.text());
      if (!parsed.length) throw new Error("No courses found.");

      setAllCourses(parsed);
      setFileLabel(file.name);
      setFileStatus({
        kind: "ok",
        message: `✅ ${parsed.length} courses loaded successfully`,
      });

      // reset UI expansions for new file
      setIncExpanded(false);
      setSkipExpanded(false);
      setWhatIfExpanded(false);
      setWhatIfGrades({});
    } catch (e) {
      setFileStatus({
        kind: "err",
        message: `⚠️ ${e?.message || String(e)}`,
      });
    }
  }

  function scrollToReport() {
    reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function exportPDF() {
    if (!baseData) {
      alert("Generate the report first.");
      return;
    }

    // expand everything for printing
    setIncExpanded(true);
    setSkipExpanded(true);
    setWhatIfExpanded(true);

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        window.print();
      })
    );
  }

  return {
    // core state
    degreeType,
    setDegreeType,
    excludeText,
    setExcludeText,
    setExcludedCodes,
    addExcludedCode,
    removeExcludedCode,

    fileLabel,
    fileStatus,
    loadFile,

    allCourses,
    excluded,

    // computed
    degreeCrit,
    baseData,
    activeClass,
    progressPct,
    incompleteCourses,
    projected,

    // UI
    reportRef,
    scrollToReport,
    exportPDF,

    // collapses
    incExpanded,
    setIncExpanded,
    skipExpanded,
    setSkipExpanded,
    whatIfExpanded,
    setWhatIfExpanded,

    // what-if
    whatIfGrades,
    setWhatIfGrades,

    // constants for rendering
    RENDER_LIMIT,
  };
}