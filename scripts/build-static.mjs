import {
  cpSync,
  existsSync,
  mkdirSync,
  rmSync,
  copyFileSync,
  readFileSync,
  statSync,
  writeFileSync
} from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { writePerformanceReportData } from "./generate-performance-report-data.mjs";
import { validatePerformanceReportData } from "./validate-performance-report-data.mjs";

const root = process.cwd();
const sourceDir = join(root, "outputs");
const dashboardFile = join(sourceDir, "m-agent-kiosk-monthly-dashboard.html");
const distDir = join(root, "dist");
const assetsDir = join(sourceDir, "assets");
const designDir = join(root, "work", "Design", "M Agent");

function stampPerformanceDataVersion(filePath, cacheKey) {
  const html = readFileSync(filePath, "utf8");
  const updated = html.replace(
    /\.\/assets\/performance-report-data\.js(?:\?v=[^"]+)?/g,
    `./assets/performance-report-data.js?v=${cacheKey}`
  );
  if (updated !== html) writeFileSync(filePath, updated, "utf8");
}

function inlinePerformanceData(filePath, dataFilePath) {
  const html = readFileSync(filePath, "utf8");
  // Customer-typed question/answer text is embedded verbatim in this JSON payload, and a
  // literal "</script" sequence anywhere in it (accidental or adversarial kiosk input) makes
  // the HTML parser close the <script> tag early, corrupting the page. Escape it so the tag
  // always closes exactly where we intend, regardless of what's inside the JSON strings.
  const dataScript = readFileSync(dataFilePath, "utf8").trim().replace(/<\/script/gi, "<\\/script");
  const externalScriptPattern = /<script src="\.\/assets\/performance-report-data\.js(?:\?v=[^"]+)?"><\/script>/;
  const inlineScriptTag = `<script id="performance-report-data-inline">\n${dataScript}\n</script>`;
  const updated = externalScriptPattern.test(html)
    ? html.replace(externalScriptPattern, inlineScriptTag)
    : html.replace(
        /<script id="performance-report-data-inline">[\s\S]*?<\/script>/,
        inlineScriptTag
      );
  if (updated !== html) writeFileSync(filePath, updated, "utf8");
}

const eventAssetCopies = [
  ["Default.png", "event-default.jpg"],
  ["THE MALL LIFESTORE SPORTS FEST .png", "event-the-mall-lifestore-sports-fest.jpg"],
  ["Power Mall Gamer Festival.png", "event-power-mall-gamer-festival.jpg"],
  ["Power Mall Electronica.png", "event-electronica-2025.jpg"],
  ["SUSTAINABILITY FORUM 2026 Shift Forward.png", "event-sustainability-forum-2026.jpg"],
  ["World Pup - M Pet Club.png", "event-world-pup-expo-2025.jpg"],
  ["อร่อยทั่วไทย M8.png", "event-aroi-thua-thai-m8.jpg"],
  ["Women Inspired 2026 Sunflower Social Club.png", "event-women-inspired-2026-sunflower-social-club.jpg"]
];

// Source event posters are full-resolution kiosk-screen exports (multi-MB PNGs) but only ever
// render at a few hundred px wide in the dashboard, so downscale + re-encode as JPEG on copy.
function copyEventAsset(sourcePath, targetPath) {
  try {
    execFileSync("sips", ["--resampleWidth", "640", "-s", "format", "jpeg", "-s", "formatOptions", "85", sourcePath, "--out", targetPath], { stdio: "ignore" });
  } catch {
    copyFileSync(sourcePath, targetPath);
  }
}

if (!existsSync(dashboardFile)) {
  throw new Error("Missing outputs/m-agent-kiosk-monthly-dashboard.html");
}

const performanceDataFile = writePerformanceReportData(root);
validatePerformanceReportData(root);
const performanceDataVersion = String(Math.floor(statSync(performanceDataFile).mtimeMs));
stampPerformanceDataVersion(dashboardFile, performanceDataVersion);
inlinePerformanceData(dashboardFile, performanceDataFile);
mkdirSync(assetsDir, { recursive: true });
for (const [sourceName, targetName] of eventAssetCopies) {
  const sourcePath = join(designDir, sourceName);
  if (existsSync(sourcePath)) copyEventAsset(sourcePath, join(assetsDir, targetName));
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(sourceDir, distDir, { recursive: true });
copyFileSync(dashboardFile, join(distDir, "index.html"));

console.log("Static dashboard prepared in dist/");
