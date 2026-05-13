import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import postcss from "postcss";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

await mkdir("dist/styles", { recursive: true });

const globals = await readFile("src/styles/globals.css", "utf8");
const result = await postcss([tailwindcss("./tailwind.config.ts"), autoprefixer]).process(globals, {
  from: "src/styles/globals.css",
  to: "dist/styles/globals.css",
});

await writeFile("dist/styles/globals.css", result.css);
await copyFile("src/styles/modeless-theme.css", "dist/styles/modeless-theme.css");
