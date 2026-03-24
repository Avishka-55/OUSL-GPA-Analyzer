import { DEGREE_CLASSES, GPV, gpvMeetsGrade } from "../lib/gpa.jsx";

export default function RequirementsBreakdown({ degreeCrit, gpaValue, gradeDist, included, activeLabel }) {
  const totalCreditsNow = included.reduce((s, c) => s + (c.credits || 0), 0);

  return (
    <div id="criteria-content" style={{ marginBottom: 10 }}>
      {degreeCrit.classes.map((c) => {
        const dc = DEGREE_CLASSES.find((d) => d.label === c.label) || DEGREE_CLASSES[4];
        const isActive = activeLabel === c.label;

        const gpaPass = gpaValue >= c.minGPA;

        let gradePass = null;
        let gradeDetail = null;

        if (c.gradeReq) {
          const req = c.gradeReq;

          const qualCredits = Object.entries(gradeDist)
            .filter(([g]) => gpvMeetsGrade(GPV[g] ?? 0, req.grade))
            .reduce((s, [, cr]) => s + cr, 0);

          gradePass = qualCredits >= req.credits;

          let l56note = "";
          if (req.l56credits) {
            const l56q = included
              .filter((c2) => (c2.level === 5 || c2.level === 6) && gpvMeetsGrade(c2.gpv, req.grade))
              .reduce((s, c2) => s + c2.credits, 0);

            l56note = ` · L5/L6: ${l56q}/${req.l56credits}`;
            if (l56q < req.l56credits) gradePass = false;
          }

          gradeDetail = `${req.grade}+ in ≥${req.credits}cr · You: ${qualCredits}cr${l56note}`;
        }

        const creditsPass = totalCreditsNow >= degreeCrit.totalCredits;

        return (
          <div key={c.label} style={{ marginBottom: 28 }}>
            <h4
              style={{
                color: dc.color,
                marginBottom: 12,
                borderBottom: `1px solid ${dc.color}30`,
                paddingBottom: 8,
              }}
            >
              {isActive ? "▶ " : ""}
              {c.label}
            </h4>

            <div className="criteria-grid">
              <div className={"crit-item " + (gpaPass ? "pass" : "fail")}>
                <div className="crit-icon">{gpaPass ? "✅" : "❌"}</div>
                <div className="crit-text">
                  <span className="crit-title">GPA Req</span>
                  <span className="crit-detail">
                    Need ≥ {c.minGPA.toFixed(2)} · You: {gpaValue.toFixed(2)}
                  </span>
                </div>
              </div>

              {c.gradeReq && (
                <div className={"crit-item " + (gradePass ? "pass" : "fail")}>
                  <div className="crit-icon">{gradePass ? "✅" : "❌"}</div>
                  <div className="crit-text">
                    <span className="crit-title">Grades</span>
                    <span className="crit-detail">{gradeDetail}</span>
                  </div>
                </div>
              )}

              <div
                className={
                  "crit-item " +
                  (creditsPass ? "pass" : totalCreditsNow > 0 ? "pending" : "fail")
                }
              >
                <div className="crit-icon">{creditsPass ? "✅" : "⏳"}</div>
                <div className="crit-text">
                  <span className="crit-title">Credits</span>
                  <span className="crit-detail">
                    Need {degreeCrit.totalCredits} · You: {totalCreditsNow}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}