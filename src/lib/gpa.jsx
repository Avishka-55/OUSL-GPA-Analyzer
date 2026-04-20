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

export function formatGpa(value, decimals = 4) {
  return Number.isFinite(value) ? value.toFixed(decimals) : "0.0000";
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

export async function parseOUSLFromXlsxFile(file) {
  const entries = await readZipEntries(await file.arrayBuffer());
  const workbookXml = decodeText(entries.get("xl/workbook.xml"));
  if (!workbookXml) return [];

  const relsXml = decodeText(entries.get("xl/_rels/workbook.xml.rels"));
  const sharedStringsXml = decodeText(entries.get("xl/sharedStrings.xml"));

  const workbookDoc = new DOMParser().parseFromString(workbookXml, "text/xml");
  const sheet = workbookDoc.getElementsByTagName("sheet")[0];
  if (!sheet) return [];

  const relId = sheet.getAttribute("r:id") || sheet.getAttribute("id");
  const relsDoc = relsXml ? new DOMParser().parseFromString(relsXml, "text/xml") : null;
  const relationship = relId && relsDoc
    ? Array.from(relsDoc.getElementsByTagName("Relationship")).find(
        (node) => node.getAttribute("Id") === relId
      )
    : null;

  const sheetPath = normalizeXlsxPath(relationship?.getAttribute("Target") || "worksheets/sheet1.xml");
  const sheetXml = decodeText(entries.get(sheetPath));
  if (!sheetXml) return [];

  const sharedStrings = parseSharedStrings(sharedStringsXml);
  const sheetDoc = new DOMParser().parseFromString(sheetXml, "text/xml");
  const rows = Array.from(sheetDoc.getElementsByTagName("row"));
  const courses = [];

  for (const row of rows) {
    const cells = [];
    for (const cell of Array.from(row.getElementsByTagName("c"))) {
      const ref = cell.getAttribute("r") || "";
      const index = columnIndexFromRef(ref);
      if (index == null) continue;
      cells[index] = extractCellValue(cell, sharedStrings);
    }

    if (cells.length < 5) continue;

    const [code, name, year, status, grade] = Array.from({ length: 5 }, (_, index) =>
      String(cells[index] ?? "").trim()
    );
    if (!code || code === "Course Code") continue;

    courses.push({ code, name, year, status, grade });
  }

  return courses;
}

function parseSharedStrings(sharedStringsXml) {
  if (!sharedStringsXml) return [];

  const doc = new DOMParser().parseFromString(sharedStringsXml, "text/xml");
  return Array.from(doc.getElementsByTagName("si")).map((node) =>
    Array.from(node.getElementsByTagName("t"))
      .map((textNode) => textNode.textContent || "")
      .join("")
  );
}

function extractCellValue(cell, sharedStrings) {
  const type = cell.getAttribute("t");

  if (type === "s") {
    const index = Number(cell.getElementsByTagName("v")[0]?.textContent || 0);
    return sharedStrings[index] || "";
  }

  if (type === "inlineStr") {
    return cell.getElementsByTagName("t")[0]?.textContent || "";
  }

  if (type === "b") {
    return cell.getElementsByTagName("v")[0]?.textContent === "1" ? "TRUE" : "FALSE";
  }

  return cell.getElementsByTagName("v")[0]?.textContent || "";
}

function columnIndexFromRef(ref) {
  const match = ref.match(/^[A-Z]+/i);
  if (!match) return null;

  let index = 0;
  for (const char of match[0].toUpperCase()) {
    index = index * 26 + (char.charCodeAt(0) - 64);
  }

  return index - 1;
}

function normalizeXlsxPath(path) {
  if (!path) return "xl/worksheets/sheet1.xml";
  if (path.startsWith("xl/")) return path;
  if (path.startsWith("/")) return path.slice(1);
  return `xl/${path.replace(/^\.\//, "")}`;
}

function decodeText(bytes) {
  if (!bytes) return "";
  return new TextDecoder().decode(bytes);
}

async function readZipEntries(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  const eocdOffset = findEndOfCentralDirectory(bytes);
  if (eocdOffset < 0) throw new Error("Invalid XLSX file.");

  const entryCount = view.getUint16(eocdOffset + 10, true);
  const centralDirectoryOffset = view.getUint32(eocdOffset + 16, true);
  const entries = new Map();
  let offset = centralDirectoryOffset;

  for (let index = 0; index < entryCount; index += 1) {
    if (view.getUint32(offset, true) !== 0x02014b50) break;

    const compression = view.getUint16(offset + 10, true);
    const compressedSize = view.getUint32(offset + 20, true);
    const fileNameLength = view.getUint16(offset + 28, true);
    const extraLength = view.getUint16(offset + 30, true);
    const commentLength = view.getUint16(offset + 32, true);
    const localHeaderOffset = view.getUint32(offset + 42, true);

    const fileName = new TextDecoder().decode(
      bytes.slice(offset + 46, offset + 46 + fileNameLength)
    );

    const localNameLength = view.getUint16(localHeaderOffset + 26, true);
    const localExtraLength = view.getUint16(localHeaderOffset + 28, true);
    const dataStart = localHeaderOffset + 30 + localNameLength + localExtraLength;
    const compressed = bytes.slice(dataStart, dataStart + compressedSize);

    let content;
    if (compression === 0) {
      content = compressed;
    } else if (compression === 8) {
      if (typeof DecompressionStream === "undefined") {
        throw new Error("This browser cannot decompress .xlsx files.");
      }

      content = new Uint8Array(
        await new Response(
          new Blob([compressed]).stream().pipeThrough(new DecompressionStream("deflate-raw"))
        ).arrayBuffer()
      );
    } else {
      throw new Error("Unsupported XLSX compression method.");
    }

    entries.set(fileName, content);
    offset += 46 + fileNameLength + extraLength + commentLength;
  }

  return entries;
}

function findEndOfCentralDirectory(bytes) {
  for (let index = bytes.length - 22; index >= 0; index -= 1) {
    if (
      bytes[index] === 0x50 &&
      bytes[index + 1] === 0x4b &&
      bytes[index + 2] === 0x05 &&
      bytes[index + 3] === 0x06
    ) {
      return index;
    }
  }

  return -1;
}