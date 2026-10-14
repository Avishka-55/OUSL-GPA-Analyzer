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

      {gpa.degreeType === "honours" && (
        <div
          className="honours-notice"
          style={{
            margin: "14px 0 16px 0",
            padding: "12px 16px",
            borderRadius: "8px",
            backgroundColor: "#EBF8FF",
            border: "1px solid #BEE3F8",
            color: "#2A4365",
            fontSize: "13px",
            lineHeight: "1.5",
          }}
        >
          <strong
            style={{
              color: "#C53030",
              backgroundColor: "#FED7D7",
              padding: "2px 7px",
              borderRadius: "4px",
              display: "inline-block",
              marginRight: "6px",
              fontWeight: "700",
            }}
          >
            📌 Please Read:
          </strong>{" "}
          In Honours / Special degrees, GPA calculation methods can vary from department to department based on the major subject. Therefore, please confirm with your department guidelines. In this tool, we calculate GPA using the weighted GPA value across all 4 levels.
        </div>
      )}

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

          {gpa.excessCreditsInfo && (() => {
            const notices = [];
            if (gpa.excessCreditsInfo.hasLevel5Excess) {
              notices.push(
                <>
                  You have completed{" "}
                  <strong>{gpa.excessCreditsInfo.level5Credits} credits at Level 5</strong>, but a
                  maximum of <strong>30 credits</strong> at Level 5 can be counted toward your degree (
                  {gpa.excessCreditsInfo.level5Extra} excess credit
                  {gpa.excessCreditsInfo.level5Extra > 1 ? "s" : ""}).
                </>
              );
            }
            if (gpa.excessCreditsInfo.hasLevel6Excess) {
              notices.push(
                <>
                  You have completed{" "}
                  <strong>{gpa.excessCreditsInfo.level6Credits} credits at Level 6</strong>, but a
                  maximum of <strong>30 credits</strong> at Level 6 can be counted toward your degree (
                  {gpa.excessCreditsInfo.level6Extra} excess credit
                  {gpa.excessCreditsInfo.level6Extra > 1 ? "s" : ""}).
                </>
              );
            }
            if (gpa.excessCreditsInfo.hasTotalExcess) {
              notices.push(
                <>
                  You have completed{" "}
                  <strong>{gpa.excessCreditsInfo.totalCredits} total credits</strong>, but GPA is
                  only calculated for <strong>{gpa.excessCreditsInfo.targetCredits} credits</strong> (
                  {gpa.degreeType === "general" ? "General Degree" : "Honours Degree"}) (
                  {gpa.excessCreditsInfo.totalExtra} excess credit
                  {gpa.excessCreditsInfo.totalExtra > 1 ? "s" : ""}).
                </>
              );
            }

            return (
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
                <strong style={{ display: "block", marginBottom: 6 }}>
                  ⚠️ Excess Credits Notice:
                </strong>
                {notices.length === 1 ? (
                  <p style={{ margin: "0 0 6px 0" }}>{notices[0]}</p>
                ) : (
                  <ul style={{ margin: "0 0 8px 18px", padding: 0 }}>
                    {notices.map((note, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {note}
                      </li>
                    ))}
                  </ul>
                )}
                <span>
                  Please select the course(s) you wish to exclude from the GPA calculation in the exclude box below.
                </span>
              </div>
            );
          })()}

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