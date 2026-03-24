export const GPV = {
  "A+": 4,
  A: 4,
  "A-": 3.7,
  "B+": 3.3,
  B: 3,
  "B-": 2.7,
  "C+": 2.3,
  C: 2,
  "C-": 1.7,
  "D+": 1.3,
  D: 1,
  E: 0,
};

export const GRADE_ORDER = ["A+","A","A-","B+","B","B-","C+","C","C-","D+","D","E"];

export const DEGREE_CLASSES = [
  { label: "First Class", color: "#8B1A1A", bg: "#FFF5F5", minGPA: 3.7 },
  { label: "Second Class Upper", color: "#D69E2E", bg: "#FFFFF0", minGPA: 3.3 },
  { label: "Second Class Lower", color: "#2B6CB0", bg: "#EBF8FF", minGPA: 3.0 },
  { label: "Pass", color: "#38A169", bg: "#F0FFF4", minGPA: 2.0 },
  { label: "Fail", color: "#718096", bg: "#F7FAFC", minGPA: 0 },
];

export const CRITERIA = {
  general: {
    totalCredits: 90,
    levelCredits: { 3: 30, 4: 30, 5: 30 },
    classes: [
      { label: "First Class", minGPA: 3.7, gradeReq: { grade: "A", credits: 45 }, extraLabel: "A grades in 45 credits" },
      { label: "Second Class Upper", minGPA: 3.3, gradeReq: { grade: "B+", credits: 45 }, extraLabel: "B+ grades in 45 credits" },
      { label: "Second Class Lower", minGPA: 3.0, gradeReq: { grade: "B", credits: 45 }, extraLabel: "B grades in 45 credits" },
      { label: "Pass", minGPA: 2.0, gradeReq: null, extraLabel: "C grades or better in 84 credits" },
    ],
  },
  honours: {
    totalCredits: 120,
    levelCredits: { 3: 30, 4: 30, 5: 30, 6: 30 },
    weighted: true,
    classes: [
      { label: "First Class", minGPA: 3.7, gradeReq: { grade: "A", credits: 60, l56credits: 39 }, extraLabel: "A grades in 60cr (39 from L5/L6)" },
      { label: "Second Class Upper", minGPA: 3.3, gradeReq: { grade: "B+", credits: 60, l56credits: 39 }, extraLabel: "B+ grades in 60cr (39 from L5/L6)" },
      { label: "Second Class Lower", minGPA: 3.0, gradeReq: { grade: "B", credits: 60, l56credits: 39 }, extraLabel: "B grades in 60cr (39 from L5/L6)" },
      { label: "Pass", minGPA: 2.0, gradeReq: null, extraLabel: "C grades or above for 120 credits" },
    ],
  },
};

export const RENDER_LIMIT = 5;

export function getCredits(code) {
  return code && code.length >= 5 && !isNaN(code[4]) ? parseInt(code[4], 10) : null;
}

export function getLevel(code) {
  return code && code.length >= 4 && !isNaN(code[3]) ? parseInt(code[3], 10) : null;
}

export function getDegreeClass(gpa) {
  return DEGREE_CLASSES.find((c) => gpa >= c.minGPA) || DEGREE_CLASSES[DEGREE_CLASSES.length - 1];
}

export function gradeColor(grade) {
  const g = GPV[grade] ?? 0;
  if (g >= 3.7) return { color: "#22543D", bg: "#C6F6D5" };
  if (g >= 3.0) return { color: "#744210", bg: "#FEEBC8" };
  if (g >= 2.0) return { color: "#2A4365", bg: "#BEE3F8" };
  return { color: "#742A2A", bg: "#FED7D7" };
}

export function gpvMeetsGrade(gpv, grade) {
  return gpv >= (GPV[grade] ?? 0);
}

export function effectiveCredit(credits, level, degType) {
  if (degType !== "honours") return credits;
  return level >= 5 ? credits * 3 : credits * 2;
}

export function parseOUSLFromHtmlText(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const rows = doc.querySelectorAll("tr");
  const courses = [];

  rows.forEach((row) => {
    const cols = [...row.querySelectorAll("td")].map((td) => td.textContent.trim());
    if (cols.length >= 5 && cols[0] !== "Course Code") {
      courses.push({
        code: cols[0],
        name: cols[1],
        year: cols[2],
        status: cols[3],
        grade: cols[4],
      });
    }
  });

  return courses;
}