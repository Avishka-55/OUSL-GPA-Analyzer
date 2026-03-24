import DegreeToggle from "../components/DegreeToggle.jsx";
import Dropzone from "../components/Dropzone.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import InfoPill from "../components/InfoPill.jsx";

export default function SetupCard({ gpa }) {
  const hasCourses = gpa.allCourses.length > 0;

  return (
    <div className="card" id="card-setup">
      <SectionHeader step={1} title="Setup & Upload" />
      <p className="card-desc">Select your programme and drop your result sheet export.</p>

      <DegreeToggle degreeType={gpa.degreeType} onChange={gpa.setDegreeType} />

      <Dropzone
        label={gpa.fileLabel}
        hint="Exports straight from the myOUSL portal"
        accept=".xls,.html,.htm"
        onFile={gpa.loadFile}
      />

      <div id="file-status" style={{ marginTop: 16, textAlign: "center" }}>
        {gpa.fileStatus.kind === "ok" && (
          <InfoPill kind="ok">{gpa.fileStatus.message}</InfoPill>
        )}
        {gpa.fileStatus.kind === "err" && (
          <InfoPill kind="err">{gpa.fileStatus.message}</InfoPill>
        )}
      </div>

      {hasCourses && (
        <>
          <div className="divider" style={{ marginTop: 40 }} />

          <label className="field-label" htmlFor="exclude-input">
            Exclude these non-GPA courses (Comma separated)
          </label>

          <input
            type="text"
            id="exclude-input"
            value={gpa.excludeText}
            onChange={(e) => gpa.setExcludeText(e.target.value)}
          />

          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>
            Pre-filled with your custom exclusions.
          </p>

          <div className="btn-center">
            <button className="btn" onClick={gpa.scrollToReport}>
              Analyze My Results ↓
            </button>
          </div>
        </>
      )}
    </div>
  );
}