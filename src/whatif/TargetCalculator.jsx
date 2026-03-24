import { useState } from "react";
import { GPV, GRADE_ORDER, effectiveCredit, getCredits, getLevel } from "../lib/gpa.jsx";

export default function TargetCalculator({ degreeType, excluded, allCourses, baseData }) {
  const [target, setTarget] = useState(3.7);
  const [result, setResult] = useState(null);

  function calcTarget() {
    const incomplete = allCourses.filter((c) => {
      const code = (c.code || "").toUpperCase();
      if (excluded.includes(code)) return false;
      return c.status === "Eligible" || c.status === "Pending" || c.grade === "-";
    });

    const remainingEff = incomplete.reduce((s, c) => {
      const cr = getCredits(c.code);
      if (!cr) return s;
      return s + effectiveCredit(cr, getLevel(c.code), degreeType);
    }, 0);

    if (remainingEff === 0) {
      setResult({ kind: "info", message: "You have no remaining courses to factor in!" });
      return;
    }

    const neededW = target * (baseData.totalEffCredits + remainingEff) - baseData.totalWeighted;
    const neededAvgGPV = neededW / remainingEff;

    if (neededAvgGPV <= 0) {
      setResult({
        kind: "ok",
        title: "Secured!",
        body: `You've already locked in this class. Even if you bomb the remaining courses, your GPA won't drop below ${target.toFixed(2)}.`,
      });
      return;
    }

    if (neededAvgGPV > 4.0) {
      setResult({
        kind: "bad",
        title: "Mathematically impossible.",
        body: `Even if you pull straight A+ grades across all remaining courses, you won't reach ${target.toFixed(2)}.`,
      });
      return;
    }

    const closestGrade = [...GRADE_ORDER].reverse().find((g) => GPV[g] >= neededAvgGPV) || "A+";
    setResult({ kind: "need", closestGrade, neededAvgGPV });
  }

  return (
    <>
      <div className="sub-title">Target Class Calculator</div>
      <p className="card-desc">
        Select the degree class you want, and we'll tell you the exact average grade you need across your remaining courses.
      </p>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label className="field-label">Desired Degree Class</label>
          <select value={String(target)} onChange={(e) => setTarget(parseFloat(e.target.value))}>
            <option value="3.70">First Class (GPA ≥ 3.70)</option>
            <option value="3.30">Second Class Upper (GPA ≥ 3.30)</option>
            <option value="3.00">Second Class Lower (GPA ≥ 3.00)</option>
            <option value="2.00">Pass (GPA ≥ 2.00)</option>
          </select>
        </div>

        <button
          className="btn btn-outline"
          style={{ padding: "12px 24px", color: "var(--text)", borderColor: "var(--border)" }}
          onClick={calcTarget}
        >
          Calculate Needed Grade
        </button>
      </div>

      {result && (
        <div
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: 24,
            marginTop: 16,
            boxShadow: "var(--shadow-sm)",
          }}
        >
          {result.kind === "info" && <div className="info-box">{result.message}</div>}

          {result.kind === "ok" && (
            <>
              <p style={{ color: "var(--green)", fontSize: 16, fontWeight: 600 }}>{result.title}</p>
              <p style={{ color: "var(--muted)", marginTop: 4 }}>{result.body}</p>
            </>
          )}

          {result.kind === "bad" && (
            <>
              <p style={{ color: "var(--red)", fontSize: 16, fontWeight: 600 }}>{result.title}</p>
              <p style={{ color: "var(--muted)", marginTop: 4 }}>{result.body}</p>
            </>
          )}

          {result.kind === "need" && (
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "var(--maroon)", fontFamily: "'Courier Prime',monospace" }}>
                {result.closestGrade}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500 }}>
                  You need an average GPV of <strong>{result.neededAvgGPV.toFixed(2)}</strong> across all remaining courses.
                </p>
                <p style={{ color: "var(--muted)", fontSize: 13, marginTop: 4 }}>
                  That basically means you need to average a {result.closestGrade} to clutch the degree class.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}