export default function DegreeBadge({ label, color, bg }) {
  return (
    <div className="degree-badge" style={{ color, background: bg }}>
      {label}
    </div>
  );
}