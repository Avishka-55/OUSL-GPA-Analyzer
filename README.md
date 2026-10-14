<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=8B1A1A&height=220&section=header&text=OUSL%20GPA%20Analyzer&fontSize=48&fontAlignY=40&desc=Fast%2C%20Accurate%20and%20Private%20Academic%20Analytics%20for%20Open%20University%20Students&descAlignY=62&descAlign=50" width="100%" alt="OUSL GPA Analyzer Banner"/>
</p>

<p align="center">
  <a href="https://git.io/typing-svg">
    <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=8B1A1A&center=true&vCenter=true&width=650&lines=Instant+BSc+GPA+Analytics;Subject+and+Level-wise+Discipline+Breakdowns;BSc+General+(90cr)+and+Honours+(120cr)+Support;Smart+Excess+Credits+Intelligence;What-If+Scenario+GPA+Simulator;100%25+Client-Side+and+Privacy-Focused" alt="Typing SVG" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/ESLint-Passing-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint" />
  <img src="https://img.shields.io/badge/OUSL-SLQF%20Compliant-8B1A1A?style=for-the-badge" alt="OUSL SLQF" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

---

## 🌟 Overview

**OUSL GPA Analyzer** is a comprehensive, privacy-first web application designed specifically for students of **The Open University of Sri Lanka (OUSL)**. 

Simply drop your result sheet export (from the myOUSL portal in `.xlsx`, `.xls`, or `.html` format) to receive instant, in-depth academic analytics, degree classification tracking, discipline-level breakdowns, and future projections.

> [!NOTE]
> **100% Client-Side & Private:** All grade parsing, calculations, and analytics run completely inside your browser using Web APIs. No student IDs, marks, or personal data are ever uploaded to an external server.

---

## ✨ Features & Highlights

### 🧪 1. GPA by Subject & Level (Experimental) — *NEW!*
- **Discipline-Specific Cards:** Displays individual performance cards for your major disciplines across every completed level.
- **Progress-Bar-Free Clean Metrics:** High-contrast metric cards focusing on raw numbers, credit quotas, and classification colors.
- **Dual-Cohort Intelligence:** Fully supports both the modern post-2019 curriculum (Regulation No. 20.NS) and legacy pre-2019 curriculum course codes:
  * 💻 **Computer Science:** `CSU`
  * 🔬 **Physics:** `PHU`
  * 🧪 **Chemistry:** `CYU` *(Modern)* & `CMU` *(Legacy)*
  * 🌿 **Botany / Plant Sciences:** `BYU` *(Modern)* & `BTU` *(Legacy)*
  * 🐾 **Zoology:** `ZYU` *(Modern)* & `ZLU` *(Legacy)*
  * 📐 **Applied Mathematics:** `ADU` *(Modern)* & `AMU` *(Legacy)*
  * ♾️ **Pure Mathematics:** `PEU` *(Modern)* & `PMU` *(Legacy)*
  * 📚 **Continuing Education & Electives:** Categorized automatically.

### ⚠️ 2. Smart Excess Credits Intelligence — *NEW!*
- Under OUSL regulations, individual levels (specifically Level 5 and Level 6) are capped at **30 credits** for GPA computation.
- The analyzer intelligently isolates when Level 5 or Level 6 exceeds 30 credits—even if total completed credits have not reached the 120-credit degree threshold—and guides you to exclude extra/elective courses cleanly.

### 📌 3. Honours Department Calculation Advisories — *NEW!*
- Highlighting that department-specific criteria may vary for Special/Honours programs based on major subject guidelines.
- Clearly notes that weighted GPA ($\times 2$ for Levels 3 & 4; $\times 3$ for Levels 5 & 6) is applied across all 4 levels.

### 📊 4. Core Degree Analytics & Classification
- **Cumulative Final GPA:** Dynamic classification against OUSL thresholds:
  * 🔴 **First Class:** GPA $\ge 3.70$
  * 🟡 **Second Class (Upper Division):** GPA $\ge 3.30$
  * 🔵 **Second Class (Lower Division):** GPA $\ge 3.00$
  * 🟢 **Pass:** GPA $\ge 2.00$
- **Credit Progress by Level:** Real-time visual tracking of completed credits against required quotas.
- **Repeat / Retake Handling:** Best-grade retention logic automatically accounts for repeated courses without double-counting credits.

### 🔮 5. What-If Scenario Simulator
- Test hypothetical grades for pending or upcoming courses to calculate your projected final degree GPA and determine the minimum grade average needed to hit your target degree class.

### 🖨️ 6. Publication-Ready PDF Export
- Generate polished academic reports with one click. Dedicated `@media print` styling removes interactive buttons and adjusts layouts for standard A4 printing.

---

## 🏛️ OUSL Course Code Mapping Matrix

| Subject Discipline | Modern Prefix (2019+) | Legacy Prefix (Pre-2019) | Handbooks & Syllabus Examples |
| :--- | :---: | :---: | :--- |
| **Computer Science** | `CSU` | — | `CSU5302`, `CSU5305`, `CSU5308`, `CSU5320` |
| **Physics** | `PHU` | — | `PHU3300`, `PHU4303`, `PHU5302`, `PHU5312` |
| **Chemistry** | `CYU` | `CMU` | `CYU3300`, `CYU4301`, `CYU5300`, `CMU1220` |
| **Botany / Plant Sciences** | `BYU` | `BTU` | `BYU3500`, `BYU5305`, `BTU2104`, `BTU3111` |
| **Zoology** | `ZYU` | `ZLU` | `ZYU5304`, `ZYU5306`, `ZYU5608`, `ZLU3180` |
| **Applied Mathematics** | `ADU` | `AMU` | `ADU3300`, `ADU3302`, `AMU3181`, `AMU3182` |
| **Pure Mathematics** | `PEU` | `PMU` | `PEU4300`, `PMU2191`, `PMU3292`, `PMU3295` |
| **Continuing Education** | `CYE`, `LTE`, `LEE`, `CSE`, `FDE`, `ADE`, `FNE` | Excluded by default | `CYE3200`, `LEE3410`, `CSE3213`, `FDE3020` |

---

## 📐 Mathematical Framework

### 1. General Degree (90 Credits)
* Equal weighting across all completed courses:
$$\text{General GPA} = \frac{\sum (\text{Credits} \times \text{GPV})}{\sum \text{Credits}}$$

### 2. Honours / Special Degree (120 Credits)
* Multi-level weighting using OUSL's effective credit factors:
  * **Levels 3 & 4:** Weighted by $\times 2$
  * **Levels 5 & 6:** Weighted by $\times 3$
$$\text{Honours GPA} = \frac{\sum (\text{Effective Credits} \times \text{GPV})}{\sum \text{Effective Credits}}$$

> [!TIP]
> **Why is single-level GPA equal in both degrees?**  
> Within any single level, the multiplier (e.g. $2$ at Level 3, or $3$ at Level 5) applies to both the numerator and the denominator, canceling out mathematically. The Honours weighting makes its impact when combining multiple levels together into the **Final Cumulative GPA**.

---

## 📁 Supported File Formats

| Format | Source / Platform | Parser Implementation | Status |
| :---: | :--- | :--- | :---: |
| **`.xlsx`** | Microsoft Excel, Google Sheets, myOUSL export | Native zero-dependency ZIP XML parser | ✅ Full Support |
| **`.xls`** | Legacy Excel exports | HTML / XML Workbook table extraction | ✅ Full Support |
| **`.html` / `.htm`** | Direct portal web page save | DOMParser table structure recognizer | ✅ Full Support |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js** (v18.0 or higher recommended)
* **npm** or **pnpm** or **yarn**

### Quick Setup

```bash
# 1. Clone the repository
git clone https://github.com/Avishka-55/OUSL-GPA-Analyzer.git
cd OUSL-GPA-Analyzer

# 2. Install dependencies
npm install

# 3. Start development server with Hot Module Replacement
npm run dev
```

The application will launch locally at `http://localhost:5173`.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Architecture

```
OUSL-GPA-Analyzer/
├── public/                  # Static assets & SVG icons
├── src/
│   ├── assets/              # Logos and graphics
│   ├── components/          # Reusable UI widgets
│   │   ├── DegreeToggle.jsx # General vs. Honours switch
│   │   ├── Dropzone.jsx     # Drag-and-drop file upload
│   │   ├── InfoPill.jsx     # Status alert pill
│   │   └── SectionHeader.jsx
│   ├── hooks/
│   │   └── useGpaAnalyzer.jsx # Central state & course management engine
│   ├── lib/
│   │   └── gpa.jsx          # Core math formulas, criteria & parsers
│   ├── pages/
│   │   ├── SetupCard.jsx    # Step 1: Upload, options & notices
│   │   ├── ReportCard.jsx   # Step 2: In-depth analytics dashboard
│   │   └── WhatIfCard.jsx   # Step 3: Grade projection simulator
│   ├── report/              # Dashboard sub-components
│   │   ├── ClassificationPath.jsx
│   │   ├── CourseTables.jsx
│   │   ├── CreditProgress.jsx
│   │   ├── DegreeBadge.jsx
│   │   ├── LevelGpaBars.jsx
│   │   ├── RequirementsBreakdown.jsx
│   │   ├── StatRow.jsx
│   │   └── SubjectGpaCards.jsx # Modern subject metric card grid
│   ├── styles/
│   │   └── app.css          # Theme variables & responsive grid
│   ├── App.jsx              # Main shell
│   └── main.jsx             # React DOM root
├── eslint.config.js
├── package.json
└── vite.config.js
```

---

## 🛠️ Technology Stack

* **Frontend:** [React 19](https://react.dev/)
* **Build Tool:** [Vite 8](https://vitejs.dev/)
* **Styling:** Vanilla CSS3 with Modern Variables & Grid Systems
* **Excel Engine:** Custom client-side XML/ZIP decompression stream parser (zero heavy dependencies)
* **Linter:** ESLint with strict React hooks rules

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=8B1A1A&height=120&section=footer" width="100%" alt="Footer Banner"/>
</p>

<p align="center">
  <b>Built with ❤️ for students of The Open University of Sri Lanka</b>
</p>
