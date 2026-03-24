export default function CreditProgress({ degreeCrit, levelGPA }) {
  return (
    <div id="credit-progress" style={{ marginBottom: 32 }}>
      {Object.entries(degreeCrit.levelCredits).map(([lvl, target]) => {
        const found = levelGPA.find((l) => l.level === Number(lvl));
        const actual = found ? found.realCredits : 0;
        const pct = Math.min((actual / target) * 100, 100);
        const col = actual >= target ? "var(--green)" : actual > 0 ? "var(--gold)" : "var(--border)";

        return (
          <div className="prog-wrap" key={lvl}>
            <div className="prog-header">
              <span className="prog-label">Level {lvl} Credits</span>
              <span className="prog-val">
                {actual}/{target} {actual >= target ? "✅" : ""}
              </span>
            </div>
            <div className="prog-track">
              <div className="prog-fill" data-pct={pct} style={{ background: col }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}