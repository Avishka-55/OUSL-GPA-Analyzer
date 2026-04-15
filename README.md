# OUSL GPA Analyzer

A modern web application for analyzing academic performance and calculating GPA for Open University of Sri Lanka (OUSL) students. Upload your grade sheet and get instant insights into your academic standing, projected grades, and degree classification.

## Features

- 📊 **Real-time GPA Calculation** — Instantly compute your GPA based on uploaded grades
- 📁 **Multiple File Format Support** — Import grades from `.xls`, `.xlsx`, HTML exports, or directly from the myOUSL portal
- 🎓 **Degree Type Support** — Analyze performance for both General and Honours degree programmes
- 🔍 **Detailed Analytics** — View grade distribution, credit progress, level-wise GPA breakdown, and classification path
- 🤔 **What-If Scenarios** — Project your final GPA with different grades for incomplete courses
- 📄 **PDF Export** — Print or export your analysis report
- 🎯 **Custom Exclusions** — Exclude non-GPA courses or electives from your calculation
- 🚀 **Fast & Offline-Ready** — Client-side processing with no server dependency

## Supported File Formats

| Format | Origin | Support |
|--------|--------|---------|
| `.xlsx` | Microsoft Excel, Google Sheets | ✅ Full support |
| `.xls` | Legacy Excel | ✅ Full support |
| HTML | myOUSL Portal export | ✅ Full support with table detection |

## Getting Started

### Prerequisites

- **Node.js** v14+ and **npm** (or **yarn**)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Avishka-55/OUSL-GPA-Analyzer.git
   cd OUSL-GPA-Analyzer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The app will open at `http://localhost:5173` (Vite default).

### Production Build

```bash
npm run build
npm run preview
```

The optimized build outputs to the `dist/` folder.

## Usage

### Step 1: Select Your Degree Type
Choose between **General** (90 credits) or **Honours** (120 credits) at the top of the Setup card.

### Step 2: Upload Your Results
Drag and drop (or click to select) your grade sheet in any of these formats:
- Excel file (`.xlsx` or `.xls`) exported from myOUSL
- HTML file exported from the myOUSL portal
- Browser-autofilled HTML from your transcript page

### Step 3: Customize Exclusions
By default, non-GPA courses are excluded. Edit the comma-separated list to customize which courses to skip.

### Step 4: Analyze Results
Click **Analyze My Results** to see:
- **Cumulative GPA** and degree classification
- **Course breakdown** — Included vs. excluded courses
- **Credit progress** — Visual progress toward degree completion
- **Level-wise GPA** — Performance by level (3, 4, 5, 6)
- **Grade distribution** — How grades factor into your GPA

### Step 5: Project Future Performance (Optional)
Use the **What-If** section to simulate completing pending courses with different grades and see your projected GPA.

### Step 6: Export
Click **Export PDF** to save or print your full analysis report.

## Project Structure

```
OUSL-GPA-Analyzer/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dropzone.jsx     # File upload area
│   │   ├── DegreeToggle.jsx  # Degree type selector
│   │   ├── InfoPill.jsx      # Status notifications
│   │   └── ...
│   ├── hooks/
│   │   └── useGpaAnalyzer.jsx # Main state management
│   ├── lib/
│   │   └── gpa.jsx          # Core GPA calculation & parsing logic
│   ├── pages/               # Page-level components
│   │   ├── SetupCard.jsx    # Upload & configuration
│   │   ├── ReportCard.jsx   # Analysis results display
│   │   └── WhatIfCard.jsx   # Scenario simulator
│   ├── report/              # Report sub-components
│   │   ├── CourseTables.jsx
│   │   ├── LevelGpaBars.jsx
│   │   ├── DegreeBadge.jsx
│   │   └── ...
│   ├── styles/              # Global styles
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css
├── public/                  # Static assets
├── package.json
├── vite.config.js
├── eslint.config.js
└── README.md
```

## Technologies Used

- **React** (v19.2) — UI framework with hooks-based architecture
- **Vite** (v8) — Lightning-fast build tool and dev server
- **CSS3** — Custom styling with variables and flexbox layouts
- **Vanilla JavaScript** — XLSX/ZIP parsing without external dependencies

## Key Features in Detail

### Excel File Parsing
- Native XLSX reader that extracts ZIP-compressed workbook XML
- Supports both uncompressed and deflate-compressed sheets
- Parses shared strings, cell references, and data types

### GPA Calculation
- **General Degree** — Equal weighting across levels
- **Honours Degree** — Double credit weighting for Level 5+ courses, triple for Level 6
- Automatic credit extraction from course code (5th character)
- Automatic level detection from course code (4th character)

### Grade Point Values

| Grade | Points |
|-------|--------|
| A+    | 4.0    |
| A     | 4.0    |
| A-    | 3.7    |
| B+    | 3.3    |
| B     | 3.0    |
| B-    | 2.7    |
| C+    | 2.3    |
| C     | 2.0    |
| C-    | 1.7    |
| D+    | 1.3    |
| D     | 1.0    |
| E     | 0.0    |

## Development

### Available Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Create optimized production build
npm run lint      # Run ESLint checker
npm run preview   # Preview production build locally
```

### Code Quality

The project uses **ESLint** with React-specific rules. To check for issues:

```bash
npm run lint
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any browser with ES2020+ and Compression Stream support

*Note: `.xlsx` decompression requires the native Compression Streams API. Modern browsers have this by default.*

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Known Limitations

- Only reads the first non-empty sheet from Excel files
- Course codes must follow OUSL format (e.g., `CSC3105` for Level 3, 1 credit)
- HTML parsing expects standard myOUSL table format
- Compressed `.xlsx` files require Compression Streams API support

## Troubleshooting

### "No courses found" error
- Ensure your file contains a table with columns: Course Code, Course Name, Year, Status, Grade
- Check that the first column is labeled "Course Code"

### Grades not calculating
- Verify all grades are valid (A+, A, A-, B+, B, B-, C+, C, C-, D+, D, E)
- Ensure the Status column shows "Completed" or a grade is present
- Check that course codes are properly formatted

### PDF export doesn't work
- Try a different browser (Chrome/Firefox recommended)
- Ensure your browser isn't blocking popups

## License

This project is open source. Check the LICENSE file for details.

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

**Built with ❤️ for OUSL students**
