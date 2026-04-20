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

          <label className="field-label" htmlFor="exclude-search">
            Exclude non-GPA courses
          </label>

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