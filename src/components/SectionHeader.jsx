export default function SectionHeader({ step, title, center = false, stepStyle }) {
  return (
    <div
      className="section-header"
      style={center ? { justifyContent: "center", marginBottom: 24 } : undefined}
    >
      {step !== undefined && step !== null && (
        <div className="step-number" style={stepStyle}>
          {step}
        </div>
      )}
      <div className="section-title">{title}</div>
    </div>
  );
}