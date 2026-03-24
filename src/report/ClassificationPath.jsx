import { DEGREE_CLASSES } from "../lib/gpa.jsx";

export default function ClassificationPath({ degreeCrit, activeLabel }) {
  return (
    <div id="cls-scale" style={{ marginBottom: 32 }}>
      {degreeCrit.classes.map((c) => {
        const dc = DEGREE_CLASSES.find((d) => d.label === c.label) || DEGREE_CLASSES[4];
        const active = activeLabel === c.label;

        return (
          <div
            key={c.label}
            className={"cls-row" + (active ? " active" : "")}
            style={active ? { background: dc.bg, borderColor: dc.color + "40" } : undefined}
          >
            <div>
              <div className="cls-name" style={{ color: active ? dc.color : undefined }}>
                {active ? "▶ " : ""}
                {c.label}
              </div>
              <div className="cls-reqs">{c.extraLabel}</div>
            </div>
            <div className="cls-min">≥ {c.minGPA.toFixed(2)}</div>
          </div>
        );
      })}
    </div>
  );
}