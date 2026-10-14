import SectionHeader from "../components/SectionHeader.jsx";
import ToggleViewButton from "../components/ToggleViewButton.jsx";

import DegreeBadge from "../report/DegreeBadge.jsx";
import StatRow from "../report/StatRow.jsx";
import ClassificationPath from "../report/ClassificationPath.jsx";
import CreditProgress from "../report/CreditProgress.jsx";
import LevelGpaBars from "../report/LevelGpaBars.jsx";
import SubjectGpaCards from "../report/SubjectGpaCards.jsx";
import RequirementsBreakdown from "../report/RequirementsBreakdown.jsx";
import CourseTables from "../report/CourseTables.jsx";
import { formatGpa } from "../lib/gpa.jsx";

export default function ReportCard({ gpa }) {
  const {
    baseData,
    degreeType,
    activeClass,
    reportRef,
    degreeCrit,
    progressPct,
    incExpanded,
    setIncExpanded,
    skipExpanded,
    setSkipExpanded,
    exportPDF,
    RENDER_LIMIT,
  } = gpa;

  return (
    <div id="pdf-export-area">
      <div className="card" id="card-report" ref={reportRef}>
        <SectionHeader
          step={null}
          center
          title={degreeType === "general" ? "Current General Degree GPA" : "Current Honours Degree GPA"}
        />

        <div className="gpa-hero">
          <div className="gpa-number" style={{ color: activeClass.color }}>
            {formatGpa(baseData.gpa)}
          </div>
          <div className="gpa-label">Current Grade Point Average</div>
          <DegreeBadge label={activeClass.label} color={activeClass.color} bg={activeClass.bg} />
        </div>

        <StatRow
          totalRealCredits={baseData.totalRealCredits}
          totalTarget={degreeCrit.totalCredits}
          progressPct={progressPct}
          includedCount={baseData.included.length}
        />

        {degreeType === "honours" && (
          <div
            className="honours-notice"
            style={{
              margin: "16px 0 0 0",
              padding: "10px 14px",
              borderRadius: "8px",
              backgroundColor: "#EBF8FF",
              border: "1px solid #BEE3F8",
              color: "#2A4365",
              fontSize: "12px",
              lineHeight: "1.5",
              textAlign: "center",
            }}
          >
            <strong
              style={{
                color: "#C53030",
                backgroundColor: "#FED7D7",
                padding: "2px 7px",
                borderRadius: "4px",
                display: "inline-block",
                marginRight: "6px",
                fontWeight: "700",
              }}
            >
              📌 Please Read:
            </strong>{" "}
            In Honours / Special degrees, GPA calculation methods can vary from department to department based on the major subject. Therefore, please confirm with your department guidelines. In this report, weighted GPA is used across all 4 levels.
          </div>
        )}

        <div className="divider"></div>

        <div className="sub-title">Degree Classification Path</div>
        <ClassificationPath degreeCrit={degreeCrit} activeLabel={activeClass.label} />

        <div className="sub-title">Credit Progress by Level</div>
        <CreditProgress degreeCrit={degreeCrit} levelGPA={baseData.levelGPA} />

        <div className="sub-title">GPA by Subject & Level (Experimental)</div>
        <SubjectGpaCards included={baseData.included} />

        <div className="sub-title">GPA by Level</div>
        <LevelGpaBars levelGPA={baseData.levelGPA} />

        <div className="divider"></div>

        <div className="sub-title">Degree Requirements Breakdown</div>
        <RequirementsBreakdown
          degreeCrit={degreeCrit}
          gpaValue={baseData.gpa}
          gradeDist={baseData.gradeDist}
          included={baseData.included}
          activeLabel={activeClass.label}
        />

        <div className="divider"></div>

        <CourseTables
          included={baseData.included}
          skipped={baseData.skipped}
          incExpanded={incExpanded}
          setIncExpanded={setIncExpanded}
          skipExpanded={skipExpanded}
          setSkipExpanded={setSkipExpanded}
          renderLimit={RENDER_LIMIT}
        />

        <button className="btn btn-pdf" id="pdf-btn" onClick={exportPDF}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download Report as PDF
        </button>

        {/* Optional: you can show a hint near the button */}
        <div style={{ textAlign: "center", color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
          Tip: In Firefox choose “Save to PDF” in the print dialog.
        </div>
      </div>
    </div>
  );
}