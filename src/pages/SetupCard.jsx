import { useMemo, useState } from "react";
import DegreeToggle from "../components/DegreeToggle.jsx";
import Dropzone from "../components/Dropzone.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import InfoPill from "../components/InfoPill.jsx";

export default function SetupCard({ gpa }) {
  const hasCourses = gpa.allCourses.length > 0;
  const [excludeSearch, setExcludeSearch] = useState("");

  const query = excludeSearch.trim().toUpperCase();
  const courseOptions = useMemo(() => {
    const unique = new Map();

    for (const course of gpa.allCourses) {
      const code = String(course.code || "").trim().toUpperCase();
      if (!code || unique.has(code)) continue;
      unique.set(code, {
        code,
        name: String(course.name || "").trim(),
      });
    }

    return [...unique.values()];
  }, [gpa.allCourses]);

  const suggestions = useMemo(() => {
    if (!query) return [];

    return courseOptions
      .filter((course) => {
        if (gpa.excluded.includes(course.code)) return false;
        return (
          course.code.includes(query) ||
          course.name.toUpperCase().includes(query)
        );
      })
      .slice(0, 8);
  }, [courseOptions, gpa.excluded, query]);

  return (
    <div className="card" id="card-setup">
      <SectionHeader step={1} title="Setup & Upload" />
      <p className="card-desc">Select your programme and drop your result sheet export.</p>

      <DegreeToggle degreeType={gpa.degreeType} onChange={gpa.setDegreeType} />

      <Dropzone
        label={gpa.fileLabel}
        hint="Exports straight from the myOUSL portal"
        accept=".xls,.xlsx,.html,.htm"
        onFile={gpa.loadFile}
      />

      <div id="file-status" style={{ marginTop: 16, textAlign: "center" }}>
        {gpa.fileStatus.kind === "ok" && (
          <InfoPill kind="ok">{gpa.fileStatus.message}</InfoPill>
        )}
        {gpa.fileStatus.kind === "err" && (
          <InfoPill kind="err">{gpa.fileStatus.message}</InfoPill>
        )}
      </div>

      {hasCourses && (
        <>
          <div className="divider" style={{ marginTop: 40 }} />

          {gpa.excessCreditsInfo && (
            <div
              className="excess-notice"
              style={{
                margin: "16px 0 24px 0",
                padding: "14px 18px",
                borderRadius: "10px",
                backgroundColor: "#FEFCBF",
                border: "1px solid #F6E05E",
                color: "#744210",
                fontSize: "14px",
                lineHeight: "1.5",
              }}
            >
              <strong style={{ display: "block", marginBottom: 4 }}>
                ⚠️ Excess Credits Notice:
              </strong>
              <span>
                You have completed{" "}
                {gpa.degreeType === "honours" && gpa.excessCreditsInfo.level6Credits > 30
                  ? `${gpa.excessCreditsInfo.level6Credits} credits at Level 6`
                  : gpa.excessCreditsInfo.level5Credits > 30
                  ? `${gpa.excessCreditsInfo.level5Credits} credits at Level 5`
                  : `${gpa.excessCreditsInfo.totalCredits} total credits`}
                , bringing your total to {gpa.excessCreditsInfo.totalCredits} credits.
                However, GPA is only calculated for {gpa.excessCreditsInfo.targetCredits} credits (
                {gpa.degreeType === "general" ? "General Degree" : "Honours Degree"}).
                Please select the course(s) you wish to exclude from the GPA calculation in the exclude box below.
              </span>
            </div>
          )}

          <label className="field-label" htmlFor="exclude-search">
            Exclude Extra Courses if any & Continuing Education Courses
          </label>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, lineHeight: "1.4" }}>
            Exclude extra courses not used to calculate your GPA, Continuing Education Courses, or any courses which you wish not to include in your GPA calculation.
            Note: Common Continuing Education Courses are excluded by default—please check the selected list carefully.
          </p>

          <div className="exclude-picker">
            <div className="exclude-selected" aria-live="polite">
              {gpa.excluded.length === 0 ? (
                <span className="exclude-empty">No exclusions selected.</span>
              ) : (
                gpa.excluded.map((code) => (
                  <button
                    key={code}
                    type="button"
                    className="exclude-chip selected"
                    onClick={() => gpa.removeExcludedCode(code)}
                    title="Click to remove"
                  >
                    {code} <span aria-hidden="true">×</span>
                  </button>
                ))
              )}
            </div>

            <input
              type="text"
              id="exclude-search"
              value={excludeSearch}
              placeholder="Enter course code or name"
              onChange={(e) => setExcludeSearch(e.target.value)}
            />

            {query && suggestions.length > 0 && (
              <div className="exclude-suggestions" role="listbox" aria-label="Course suggestions">
                {suggestions.map((course) => (
                  <button
                    key={course.code}
                    type="button"
                    className="exclude-suggestion-item"
                    onClick={() => {
                      gpa.addExcludedCode(course.code);
                      setExcludeSearch("");
                    }}
                  >
                    <span className="exclude-suggestion-code">{course.code}</span>
                    <span className="exclude-suggestion-name">{course.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
            Tap a selected chip to remove it. Search and tap a suggestion to add exclusions.
          </p>

          <div className="btn-center">
            <button className="btn" onClick={gpa.scrollToReport}>
              Analyze My Results ↓
            </button>
          </div>
        </>
      )}
    </div>
  );
}