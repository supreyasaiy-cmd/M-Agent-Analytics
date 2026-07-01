import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { writePerformanceReportData } from "./generate-performance-report-data.mjs";

const root = process.cwd();
const sourceDir = join(root, "outputs");
const dashboardFile = join(sourceDir, "m-agent-kiosk-monthly-dashboard.html");
const distDir = join(root, "dist");
const assetsDir = join(sourceDir, "assets");
const designDir = join(root, "work", "Design", "M Agent");

const eventAssetCopies = [
  ["Default.png", "event-default.png"],
  ["THE MALL LIFESTORE SPORTS FEST .png", "event-the-mall-lifestore-sports-fest.png"],
  ["Power Mall Gamer Festival.png", "event-power-mall-gamer-festival.png"],
  ["Power Mall Electronica.png", "event-electronica-2025.png"],
  ["SUSTAINABILITY FORUM 2026 Shift Forward.png", "event-sustainability-forum-2026.png"],
  ["World Pup - M Pet Club.png", "event-world-pup-expo-2025.png"],
  ["อร่อยทั่วไทย M8.png", "event-aroi-thua-thai-m8.png"]
];

if (!existsSync(dashboardFile)) {
  throw new Error("Missing outputs/m-agent-kiosk-monthly-dashboard.html");
}

writePerformanceReportData(root);
mkdirSync(assetsDir, { recursive: true });
for (const [sourceName, targetName] of eventAssetCopies) {
  const sourcePath = join(designDir, sourceName);
  if (existsSync(sourcePath)) copyFileSync(sourcePath, join(assetsDir, targetName));
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(sourceDir, distDir, { recursive: true });
copyFileSync(dashboardFile, join(distDir, "index.html"));

console.log("Static dashboard prepared in dist/");
