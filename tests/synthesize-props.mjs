import path from "node:path";
import ts from "typescript";

const root = process.cwd();

export const ENTRY = "dist/index.d.ts";

const COMPILER_OPTIONS = {
  target: ts.ScriptTarget.ES2020,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  jsx: ts.JsxEmit.ReactJSX,
  strict: true,
  skipLibCheck: true,
};

const MAX_DEPTH = 6;

/**
 * Build minimal valid props for a component directly from its declared types,
 * so the harness covers every exported component without hand-written fixtures
 * that would drift as props change.
 *
 * Only required props are synthesized. The goal is a renderable component, not
 * a realistic one — these values exercise structure, not visual design.
 */
export function createSynthesizer() {
  const program = ts.createProgram([path.resolve(root, ENTRY)], COMPILER_OPTIONS);
  const checker = program.getTypeChecker();
  const entry = program.getSourceFile(path.resolve(root, ENTRY));
  if (!entry) throw new Error(`Cannot read ${ENTRY}. Run "npm run build" first.`);

  const moduleSymbol = checker.getSymbolAtLocation(entry);
  const components = [];

  for (const symbol of checker.getExportsOfModule(moduleSymbol)) {
    const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    const declaration = resolved.declarations?.[0];
    if (!declaration || !(resolved.flags & ts.SymbolFlags.Value)) continue;

    const type = checker.getTypeOfSymbolAtLocation(resolved, declaration);
    const [signature] = type.getCallSignatures();
    if (!signature) continue;
    if (!/Element|ReactNode|JSX/.test(checker.typeToString(signature.getReturnType()))) continue;

    const name = symbol.getName();
    if (/^use[A-Z]/.test(name)) continue; // hooks render nothing

    components.push({
      name,
      sourceFile: path.relative(root, declaration.getSourceFile().fileName),
      props: synthesizeProps(checker, signature),
    });
  }

  return components.sort((a, b) => a.name.localeCompare(b.name));
}

function synthesizeProps(checker, signature) {
  const [parameter] = signature.getParameters();
  if (!parameter) return {};

  const declaration = parameter.valueDeclaration ?? parameter.declarations?.[0];
  if (!declaration) return {};

  const parameterType = checker.getTypeOfSymbolAtLocation(parameter, declaration);
  const props = synthesizeObject(checker, parameterType, 0, "");

  // `children` is normally inherited from React's own prop types, which are
  // skipped as node_modules declarations. A control rendered without children
  // has no text, which reads as a missing accessible name rather than as an
  // artefact of synthesis, so supply it whenever the component accepts it.
  if (props.children === undefined && parameterType.getProperty("children")) {
    props.children = "Sample content";
  }

  return props;
}

/** Only own, required properties — inherited DOM attributes are all optional. */
function synthesizeObject(checker, type, depth, pathPrefix) {
  const value = {};
  if (depth > MAX_DEPTH) return value;

  for (const property of type.getProperties()) {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    if (!declaration) continue;
    if (declaration.getSourceFile().fileName.includes("node_modules")) continue;
    // `children` is optional almost everywhere, but a control rendered without
    // it has no text, which would look like a missing accessible name rather
    // than an artefact of synthesis.
    const isChildren = property.getName() === "children";
    if (property.flags & ts.SymbolFlags.Optional && !isChildren) continue;

    const propertyType = checker.getTypeOfSymbolAtLocation(property, declaration);
    value[property.getName()] = synthesizeValue(checker, propertyType, depth + 1, property.getName(), pathPrefix);
  }

  return value;
}

function synthesizeValue(checker, type, depth, name, pathPrefix) {
  if (depth > MAX_DEPTH) return undefined;

  const text = checker.typeToString(type);

  // Arrays are checked before anything text-based: an array of objects whose
  // members mention ReactNode would otherwise be mistaken for a content slot.
  if (checker.isArrayType(type)) {
    const [element] = checker.getTypeArguments(type);
    if (!element) return [];
    // Two entries: enough for a component to render a list, a selection, and a
    // relationship between items.
    return [0, 1].map((index) => synthesizeValue(checker, element, depth, name, `${pathPrefix}${index}`));
  }

  // Callbacks: components may invoke them during render.
  if (type.getCallSignatures().length > 0) return () => {};

  // React content slots, matched exactly so composite types are not caught.
  if (/^(React\.)?(ReactNode|ReactElement\b.*|JSX\.Element)$/.test(text)) {
    return name === "children" ? "Sample content" : `Sample ${name}`;
  }

  if (type.isUnion()) {
    // A union of string literals is an enum: take the first member so the value
    // is always one the component knows how to render.
    const literals = type.types.filter((member) => member.isStringLiteral());
    if (literals.length > 0) return literals[0].value;

    const usable = type.types.find((member) => !(member.flags & (ts.TypeFlags.Undefined | ts.TypeFlags.Null)));
    return usable ? synthesizeValue(checker, usable, depth, name, pathPrefix) : undefined;
  }

  if (type.isStringLiteral()) return type.value;
  if (type.isNumberLiteral()) return type.value;
  if (type.flags & ts.TypeFlags.String) return synthesizeString(name, pathPrefix);
  if (type.flags & ts.TypeFlags.Number) return synthesizeNumber(name);
  if (type.flags & ts.TypeFlags.Boolean || type.flags & ts.TypeFlags.BooleanLiteral) return true;

  if (type.flags & ts.TypeFlags.Object) return synthesizeObject(checker, type, depth, pathPrefix);

  return undefined;
}

function synthesizeString(name, pathPrefix) {
  const suffix = pathPrefix === "" ? "" : `-${pathPrefix}`;
  if (/^id$/i.test(name)) return `item${suffix || "-0"}`;
  if (/id$/i.test(name)) return `item${suffix || "-0"}`;
  if (/label|name|title|heading|merchant|resource|period|chain|network/i.test(name)) {
    return `Sample ${name}${suffix}`;
  }
  if (/amount|total|cost|price/i.test(name)) return "10.00";
  if (/date|expires|at$/i.test(name)) return "2026-01-01";
  return `Sample ${name}${suffix}`;
}

function synthesizeNumber(name) {
  if (/percent|rate|readiness|score|confidence|participation|quorum|sentiment|weight/i.test(name)) return 50;
  if (/max/i.test(name)) return 100;
  if (/^x$/i.test(name)) return 40;
  if (/^y$/i.test(name)) return 40;
  return 10;
}
