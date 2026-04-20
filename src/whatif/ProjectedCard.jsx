import { formatGpa } from "../lib/gpa.jsx";

export default function ProjectedCard({ projected }) {
  const { projGPA, cls, delta } = projected;

  return (
    <div className="whatif-result-card" style={{ marginTop: 24 }}>
      <div className="whatif-label">Projected Final GPA</div>
      <div className="whatif-gpa" style={{ color: cls.color }}>
        {formatGpa(projGPA)}
      </div>

      <div>
        <span className="degree-badge" style={{ marginTop: 12, color: cls.color, background: cls.bg }}>
          {cls.label}
        </span>
      </div>

      <div
        className="whatif-delta"
        style={{
          color: delta > 0 ? "var(--green)" : delta < 0 ? "var(--red)" : "var(--muted)",
        }}
      >
        {delta > 0
          ? `▲ +${delta.toFixed(3)} increase`
          : delta < 0
          ? `▼ ${delta.toFixed(3)} decrease`
          : "No change to GPA"}
      </div>
    </div>
  );
}