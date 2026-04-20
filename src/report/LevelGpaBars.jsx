import { formatGpa, getDegreeClass } from "../lib/gpa.jsx";

export default function LevelGpaBars({ levelGPA }) {
  return (
    <div id="level-bars" style={{ marginBottom: 32 }}>
      {levelGPA.map((l) => {
        const cls = getDegreeClass(l.gpa);
        const pct = (l.gpa / 4) * 100;

        return (
          <div className="prog-wrap" key={l.level}>
            <div className="prog-header">
              <span className="prog-label">Level {l.level}</span>
              <span className="prog-val" style={{ color: cls.color }}>
                {formatGpa(l.gpa)}
              </span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" data-pct={pct} style={{ background: cls.color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}