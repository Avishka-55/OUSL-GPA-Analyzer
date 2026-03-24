export default function StatRow({ totalRealCredits, totalTarget, progressPct, includedCount }) {
  return (
    <div className="stat-row">
      <div className="stat">
        <div className="stat-val">
          {totalRealCredits} <span style={{ fontSize: 16, color: "var(--muted)" }}>/ {totalTarget}</span>
        </div>
        <div className="stat-lbl">Credits Counted</div>
      </div>

      <div className={"stat " + (progressPct >= 100 ? "good" : "warn")}>
        <div className="stat-val">{progressPct}%</div>
        <div className="stat-lbl">Progress</div>
      </div>

      <div className="stat">
        <div className="stat-val">{includedCount}</div>
        <div className="stat-lbl">Courses Included</div>
      </div>
    </div>
  );
}