import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

/** Packages a copied component may import from npm. */
const RUNTIME_PACKAGES = new Set(["class-variance-authority", "clsx", "lucide-react", "tailwind-merge"]);

const SOURCE_EXTENSIONS = [".tsx", ".ts"];

/** Resolve a relative import to a file on disk, trying extensions and /index. */
export function resolveLocalImport(fromFile, specifier) {
  const base = path.resolve(path.dirname(path.join(root, fromFile)), specifier);
  const candidates = [
    ...SOURCE_EXTENSIONS.map((extension) => `${base}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) => path.join(base, `index${extension}`)),
  ];
  const found = candidates.find((candidate) => fs.existsSync(candidate));
  return found ? path.relative(root, found) : null;
}

function readImports(file) {
  const source = fs.readFileSync(path.join(root, file), "utf8");
  const specifiers = new Set();
  for (const [, specifier] of source.matchAll(/(?:^|\n)\s*(?:import|export)[\s\S]*?from\s+"([^"]+)"/g)) {
    specifiers.add(specifier);
  }
  return [...specifiers];
}

/**
 * Walk a component's local imports transitively.
 *
 * The registry's value is that copying an item gives you something that
 * compiles, so an item must list every local file it reaches — not just its
 * own — plus the npm packages those files import.
 */
export function collectFileGraph(entryFile) {
  const files = new Set();
  const packages = new Set();
  const queue = [entryFile];

  while (queue.length > 0) {
    const file = queue.shift();
    if (files.has(file)) continue;
    files.add(file);

    for (const specifier of readImports(file)) {
      if (specifier.startsWith(".")) {
        const resolved = resolveLocalImport(file, specifier);
        // A barrel import from a component would drag in the whole library, so
        // only follow imports that resolve to a real file we are not already
        // carrying.
        if (resolved && !files.has(resolved)) queue.push(resolved);
        continue;
      }

      const packageName = specifier.startsWith("@")
        ? specifier.split("/").slice(0, 2).join("/")
        : specifier.split("/")[0];
      if (RUNTIME_PACKAGES.has(packageName)) packages.add(packageName);
    }
  }

  return { files: [...files].sort(), packages: [...packages].sort() };
}

/** registry:file for plain modules, registry:component for anything with JSX. */
export function registryFileType(file) {
  return file.endsWith(".tsx") ? "registry:component" : file.startsWith("src/lib/") ? "registry:lib" : "registry:file";
}

export { RUNTIME_PACKAGES };
