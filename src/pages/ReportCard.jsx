import SectionHeader from "../components/SectionHeader.jsx";
import ToggleViewButton from "../components/ToggleViewButton.jsx";

import DegreeBadge from "../report/DegreeBadge.jsx";
import StatRow from "../report/StatRow.jsx";
import ClassificationPath from "../report/ClassificationPath.jsx";
import CreditProgress from "../report/CreditProgress.jsx";
import LevelGpaBars from "../report/LevelGpaBars.jsx";
import RequirementsBreakdown from "../report/RequirementsBreakdown.jsx";
import CourseTables from "../report/CourseTables.jsx";
import { formatGpa } from "../lib/gpa.jsx";

export default function ReportCard({ gpa }) {
  const { baseData, degreeType, activeClass } = gpa;

  return (
    <div id="pdf-export-area">
      <div className="card" id="card-report" ref={gpa.reportRef}>
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
          totalTarget={gpa.degreeCrit.totalCredits}
          progressPct={gpa.progressPct}
          includedCount={baseData.included.length}
        />

        <div className="divider"></div>

        <div className="sub-title">Degree Classification Path</div>
        <ClassificationPath degreeCrit={gpa.degreeCrit} activeLabel={activeClass.label} />

        <div className="sub-title">Credit Progress by Level</div>
        <CreditProgress degreeCrit={gpa.degreeCrit} levelGPA={baseData.levelGPA} />

        <div className="sub-title">GPA by Level</div>
        <LevelGpaBars levelGPA={baseData.levelGPA} />

        <div className="divider"></div>

        <div className="sub-title">Degree Requirements Breakdown</div>
        <RequirementsBreakdown
          degreeCrit={gpa.degreeCrit}
          gpaValue={baseData.gpa}
          gradeDist={baseData.gradeDist}
          included={baseData.included}
          activeLabel={activeClass.label}
        />

        <div className="divider"></div>

        <CourseTables
          included={baseData.included}
          skipped={baseData.skipped}
          incExpanded={gpa.incExpanded}
          setIncExpanded={gpa.setIncExpanded}
          skipExpanded={gpa.skipExpanded}
          setSkipExpanded={gpa.setSkipExpanded}
          renderLimit={gpa.RENDER_LIMIT}
        />

        <button className="btn btn-pdf" id="pdf-btn" onClick={gpa.exportPDF}>
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