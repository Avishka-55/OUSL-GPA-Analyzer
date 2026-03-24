export default function DegreeToggle({ degreeType, onChange }) {
  return (
    <div className="degree-toggle">
      <div
        className={"deg-btn " + (degreeType === "general" ? "active" : "")}
        onClick={() => onChange("general")}
        role="button"
        tabIndex={0}
      >
        <span className="deg-title">BSc General Degree</span>
        <span className="deg-sub">S1 Structure · 90 Credits</span>
      </div>

      <div
        className={"deg-btn " + (degreeType === "honours" ? "active" : "")}
        onClick={() => onChange("honours")}
        role="button"
        tabIndex={0}
      >
        <span className="deg-title">BSc Honours Degree</span>
        <span className="deg-sub">SS Structure · 120 Credits</span>
      </div>
    </div>
  );
}