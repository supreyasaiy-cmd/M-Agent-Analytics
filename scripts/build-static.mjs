import { cpSync, existsSync, mkdirSync, rmSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const sourceDir = join(root, "outputs");
const dashboardFile = join(sourceDir, "m-agent-kiosk-monthly-dashboard.html");
const distDir = join(root, "dist");

if (!existsSync(dashboardFile)) {
  throw new Error("Missing outputs/m-agent-kiosk-monthly-dashboard.html");
}

rmSync(distDir, { recursive: true, force: true });
mkdirSync(distDir, { recursive: true });
cpSync(sourceDir, distDir, { recursive: true });
copyFileSync(dashboardFile, join(distDir, "index.html"));

console.log("Static dashboard prepared in dist/");
