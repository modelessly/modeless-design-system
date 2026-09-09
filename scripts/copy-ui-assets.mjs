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

// Type declarations for the CSS subpath exports. Without these, a consumer whose
// tsconfig sets `noUncheckedSideEffectImports` — the default in the Vite react-ts
// template — cannot typecheck `import "@modeless/design-system/globals"`.
const cssTypes = 'declare const _default: string;\nexport default _default;\n';
await writeFile("dist/styles/globals.d.ts", cssTypes);
await writeFile("dist/styles/modeless-theme.d.ts", cssTypes);
