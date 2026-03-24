import Header from "./components/Header.jsx";
import FooterNote from "./components/FooterNote.jsx";
import SetupCard from "./pages/SetupCard.jsx";
import ReportCard from "./pages/ReportCard.jsx";
import WhatIfCard from "./pages/WhatIfCard.jsx";

import { useGpaAnalyzer } from "./hooks/useGpaAnalyzer.jsx";

export default function App() {
  const gpa = useGpaAnalyzer();

  return (
    <>
      <Header />

      <div className="body">
        <SetupCard gpa={gpa} />

        {gpa.baseData && (
          <>
            <ReportCard gpa={gpa} />
            <WhatIfCard gpa={gpa} />
          </>
        )}

        <FooterNote />
      </div>
    </>
  );
}