import fs from "node:fs/promises";
import path from "node:path";

const installedPackage = path.join(process.cwd(), "examples", "vite-consumer", "node_modules", "@modeless", "design-system");

await fs.rm(installedPackage, { recursive: true, force: true });
console.log("Removed installed consumer package copy before local tarball refresh.");
