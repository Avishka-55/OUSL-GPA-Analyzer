import { formatGpa, getDegreeClass, calculateSubjectsAcrossLevels } from "../lib/gpa.jsx";

export default function SubjectGpaCards({ included = [] }) {
  const subjects = calculateSubjectsAcrossLevels(included);
  if (!subjects.length) return null;

  return (
    <div className="subject-cards-grid">
      {subjects.map((sub) => {
        const overallCls = getDegreeClass(sub.overallGpa);

        return (
          <div className="subject-metric-card" key={sub.key}>
            <div className="subject-card-header">
              <div className="subject-card-title-group">
                <span className="subject-code-chip">{sub.code}</span>
                <span className="subject-card-name">{sub.name}</span>
              </div>
              <span className="subject-card-cr-badge">
                {sub.totalRealCredits} cr
              </span>
            </div>

            <div className="subject-levels-list">
              {sub.levels.map((lvl) => {
                const lvlCls = getDegreeClass(lvl.gpa);
                return (
                  <div className="subject-level-row" key={lvl.level}>
                    <span className="subject-level-tag">Level {lvl.level}</span>
                    <span className="subject-level-cr">{lvl.realCredits} cr</span>
                    <span className="subject-level-gpa" style={{ color: lvlCls.color }}>
                      {formatGpa(lvl.gpa)}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="subject-card-footer">
              <span className="subject-footer-lbl">Overall Subject GPA</span>
              <span className="subject-footer-gpa" style={{ color: overallCls.color }}>
                {formatGpa(sub.overallGpa)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
