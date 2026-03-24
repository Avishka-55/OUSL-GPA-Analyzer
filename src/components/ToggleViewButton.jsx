export default function ToggleViewButton({ expanded, onClick, expandLabel, collapseLabel = "Show Less ↑" }) {
  return (
    <button className="toggle-view-btn" onClick={onClick}>
      {expanded ? collapseLabel : expandLabel}
    </button>
  );
}