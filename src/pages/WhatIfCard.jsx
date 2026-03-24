import SectionHeader from "../components/SectionHeader.jsx";
import ToggleViewButton from "../components/ToggleViewButton.jsx";

import { GRADE_ORDER, getCredits, getLevel } from "../lib/gpa.jsx";
import ProjectedCard from "../whatif/ProjectedCard.jsx";
import TargetCalculator from "../whatif/TargetCalculator.jsx";

export default function WhatIfCard({ gpa }) {
  const incomplete = gpa.incompleteCourses;

  return (
    <div className="card" id="card-whatif">
      <SectionHeader
        step="?"
        stepStyle={{ background: "var(--gold-pale)", color: "var(--gold)" }}
        title="Future Projections & Targets"
      />

      <p className="card-desc">
        Your incomplete courses have been skipped above. Assign hypothetical grades here to see your <b>Projected Final GPA</b>.
      </p>

      {incomplete.length === 0 ? (
        <div
          className="info-box"
          style={{
            background: "#F0FFF4",
            borderColor: "#C6F6D5",
            color: "var(--green)",
          }}
        >
          ✅ All your registered courses are fully completed. No projections needed!
        </div>
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

                  <select
                    className="whatif-select"
                    value={gpa.whatIfGrades[c.code] || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      gpa.setWhatIfGrades((prev) => ({
                        ...prev,
                        [c.code]: value || undefined,
                      }));
                    }}
                  >
                    <option value="">— Hypothesize —</option>
                    {GRADE_ORDER.map((gr) => (
                      <option key={gr} value={gr}>
                        {gr}
                      </option>
                    ))}
                  </select>
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
      />
    </div>
  );
}