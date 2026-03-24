import ToggleViewButton from "../components/ToggleViewButton.jsx";
import { gradeColor } from "../lib/gpa.jsx";

export default function CourseTables({
  included,
  skipped,
  incExpanded,
  setIncExpanded,
  skipExpanded,
  setSkipExpanded,
  renderLimit,
}) {
  return (
    <>
      {/* Included */}
      <div className="sub-title" id="inc-title">
        Included Courses ({included.length})
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Lvl</th>
              <th>Grade</th>
              <th>Cr</th>
              <th>GPV</th>
              <th>Wt.</th>
            </tr>
          </thead>
          <tbody>
            {included
              .filter((_, i) => incExpanded || i < renderLimit)
              .map((c, i) => {
                const gc = gradeColor(c.grade);
                return (
                  <tr key={c.code + ":" + i}>
                    <td className="code">{c.code}</td>
                    <td>{c.name}</td>
                    <td className="center">{c.level ?? "?"}</td>
                    <td>
                      <span className="grade-chip" style={{ color: gc.color, background: gc.bg }}>
                        {c.grade}
                      </span>
                    </td>
                    <td className="center">{c.credits}</td>
                    <td className="center mono">{c.gpv.toFixed(2)}</td>
                    <td className="center mono">{c.weighted.toFixed(2)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {included.length > renderLimit && (
        <ToggleViewButton
          expanded={incExpanded}
          onClick={() => setIncExpanded((v) => !v)}
          expandLabel={`Show All ${included.length} Courses ↓`}
        />
      )}

      {/* Skipped */}
      {skipped.length > 0 && (
        <div id="skip-section">
          <div className="sub-title" id="skip-title" style={{ marginTop: 32 }}>
            Skipped Courses ({skipped.length})
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Course Name</th>
                  <th>Grade</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {skipped
                  .filter((_, i) => skipExpanded || i < renderLimit)
                  .map((c, i) => (
                    <tr key={c.code + ":" + i}>
                      <td className="code">{c.code}</td>
                      <td>{c.name}</td>
                      <td className="mono muted">{c.grade}</td>
                      <td className="muted">{c.reason}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {skipped.length > renderLimit && (
            <ToggleViewButton
              expanded={skipExpanded}
              onClick={() => setSkipExpanded((v) => !v)}
              expandLabel={`Show All ${skipped.length} Skipped Courses ↓`}
            />
          )}
        </div>
      )}
    </>
  );
}