import SectionHeader from "../components/SectionHeader.jsx";
import ToggleViewButton from "../components/ToggleViewButton.jsx";

import { GRADE_ORDER, getCredits, getLevel } from "../lib/gpa.jsx";
import ProjectedCard from "../whatif/ProjectedCard.jsx";
import TargetCalculator from "../whatif/TargetCalculator.jsx";

export default function WhatIfCard({ gpa }) {
  const incomplete = gpa.incompleteCourses;
  const totalTarget = gpa.degreeCrit?.totalCredits ?? (gpa.degreeType === "general" ? 90 : 120);
  const totalReal = gpa.baseData?.totalRealCredits ?? 0;
  const isDegreeComplete = totalReal >= totalTarget;
  const missingCredits = Math.max(0, totalTarget - totalReal);
  const degreeLabel = gpa.degreeType === "general" ? "General Degree" : "Honours Degree";

  return (
    <div className="card" id="card-whatif">
      <SectionHeader
        step="?"
        stepStyle={{ background: "var(--gold-pale)", color: "var(--gold)" }}
        title="Future Projections & Targets"
      />

      <p className="card-desc">
        {incomplete.length > 0 ? (
          <>
            Your incomplete courses have been skipped above. Assign hypothetical grades here to see
            your <b>Projected Final GPA</b>.
          </>
        ) : isDegreeComplete ? (
          <>All required degree credits have been completed.</>
        ) : (
          <>Project target grades needed across your remaining degree credits.</>
        )}
      </p>

      {incomplete.length === 0 ? (
        isDegreeComplete ? (
          <div
            className="info-box"
            style={{
              background: "#F0FFF4",
              borderColor: "#C6F6D5",
              color: "var(--green)",
            }}
          >
            ✅ All your registered courses are fully completed and you have reached the {totalTarget}-credit requirement! No projections needed.
          </div>
        ) : (
          <div
            className="info-box"
            style={{
              background: "#EBF8FF",
              borderColor: "#BEE3F8",
              color: "#2A4365",
            }}
          >
            ℹ️ All courses in your uploaded result sheet have final grades, but you have completed{" "}
            <strong>
              {totalReal} of {totalTarget} credits
            </strong>{" "}
            ({missingCredits} credit{missingCredits > 1 ? "s" : ""} remaining for your {degreeLabel}).
            <div style={{ marginTop: 6, fontSize: "13px" }}>
              Use the <strong>Target Class Calculator</strong> below to see what average grade you
              need across your remaining {missingCredits} credit{missingCredits > 1 ? "s" : ""} to
              achieve your desired degree class!
            </div>
          </div>
        )
      ) : (
        <>
          <div className="whatif-grid">
            {incomplete
              .filter((_, i) => gpa.whatIfExpanded || i < gpa.RENDER_LIMIT)
              .map((c) => (
                <div className="whatif-course" key={c.code}>
                  <div className="whatif-code">
                    {c.code} · L{getLevel(c.code) ?? "?"} · {getCredits(c.code) ?? "?"}cr
                  </div>
                  <div className="whatif-name">{c.name}</div>

                  <div className="whatif-grade-grid" role="group" aria-label={`Projected grade for ${c.code}`}>
                    {GRADE_ORDER.map((gr) => {
                      const isSelected = gpa.whatIfGrades[c.code] === gr;

                      return (
                        <button
                          key={gr}
                          type="button"
                          className={"whatif-grade-btn" + (isSelected ? " active" : "")}
                          aria-pressed={isSelected}
                          onClick={() => {
                            gpa.setWhatIfGrades((prev) => ({
                              ...prev,
                              [c.code]: isSelected ? undefined : gr,
                            }));
                          }}
                        >
                          {gr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          {incomplete.length > gpa.RENDER_LIMIT && (
            <ToggleViewButton
              expanded={gpa.whatIfExpanded}
              onClick={() => gpa.setWhatIfExpanded((v) => !v)}
              expandLabel={`Show All ${incomplete.length} Remaining Courses ↓`}
            />
          )}

          {gpa.projected && <ProjectedCard projected={gpa.projected} currentGpa={gpa.baseData.gpa} />}
        </>
      )}

      <div className="divider"></div>

      <TargetCalculator
        degreeType={gpa.degreeType}
        excluded={gpa.excluded}
        allCourses={gpa.allCourses}
        baseData={gpa.baseData}
        degreeCrit={gpa.degreeCrit}
      />
    </div>
  );
}