import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseHTML } from "linkedom";

import { createSynthesizer } from "./synthesize-props.mjs";
import * as library from "../dist/index.js";

/**
 * Structural accessibility rules, checked against what the components actually
 * render rather than against their source. Every rule here corresponds to a
 * defect that shipped: roles that suppressed state, labels on elements that
 * cannot carry them, and controls with no accessible name.
 *
 * These rules are structural. They cannot detect meaning carried only by color
 * — that still needs review.
 */

/**
 * Elements with no implicit role, so an aria-label on them is not exposed.
 * <section> is deliberately absent: a named section maps to the region role,
 * which does accept a label. <footer> and <header> map to contentinfo/banner
 * only at document scope; nested inside a component they are generic.
 */
const GENERIC_ELEMENTS = new Set(["DIV", "SPAN", "P", "FOOTER", "HEADER"]);

/**
 * Widget roles a <button> may legitimately take. Tabs, radios, switches and
 * menu items are all built on buttons; what breaks a button is being given a
 * non-interactive role such as listitem, which discards its own semantics.
 */
const INTERACTIVE_BUTTON_ROLES = new Set([
  "button", "tab", "radio", "checkbox", "switch", "link", "option",
  "menuitem", "menuitemcheckbox", "menuitemradio", "treeitem",
]);

/** aria-hidden applies to the whole subtree, so ancestors must be consulted. */
function isHidden(element) {
  for (let node = element; node; node = node.parentElement) {
    if (node.getAttribute?.("aria-hidden") === "true") return true;
  }
  return false;
}

const RULES = [
  {
    id: "button-role-override",
    describe: "a <button> must not be given a non-interactive role",
    check(document) {
      return [...document.querySelectorAll("button[role]")]
        .filter((element) => !INTERACTIVE_BUTTON_ROLES.has(element.getAttribute("role")))
        .map((element) => `<button role="${element.getAttribute("role")}"> discards the implicit button role`);
    },
  },
  {
    id: "aria-pressed-needs-button",
    describe: "aria-pressed is only valid on an element with the button role",
    check(document) {
      return [...document.querySelectorAll("[aria-pressed]")]
        .filter((element) => {
          const role = element.getAttribute("role");
          return role ? role !== "button" : element.tagName !== "BUTTON";
        })
        .map((element) => `<${element.tagName.toLowerCase()}${element.getAttribute("role") ? ` role="${element.getAttribute("role")}"` : ""}> carries aria-pressed`);
    },
  },
  {
    id: "list-owns-listitem",
    describe: "role=list may only own listitems",
    check(document) {
      const violations = [];
      for (const list of document.querySelectorAll('[role="list"]')) {
        for (const child of list.children) {
          const role = child.getAttribute("role");
          const implicitListItem = child.tagName === "LI";
          if (role !== "listitem" && !implicitListItem) {
            violations.push(`role="list" owns <${child.tagName.toLowerCase()}>, which is not a listitem`);
          }
        }
      }
      return violations;
    },
  },
  {
    id: "label-needs-role",
    describe: "aria-label on a generic element is not exposed without a role",
    check(document) {
      return [...document.querySelectorAll("[aria-label]")]
        .filter((element) => GENERIC_ELEMENTS.has(element.tagName) && !element.getAttribute("role"))
        .map((element) => `<${element.tagName.toLowerCase()} aria-label="${element.getAttribute("aria-label")}"> has no role`);
    },
  },
  {
    id: "button-needs-name",
    describe: "every button needs an accessible name",
    check(document) {
      return [...document.querySelectorAll("button")]
        .filter((element) => {
          if (isHidden(element)) return false;
          if (element.getAttribute("aria-label")?.trim()) return false;
          if (element.getAttribute("aria-labelledby")?.trim()) return false;
          return !element.textContent?.trim();
        })
        .map(() => "a <button> has neither text content nor an accessible name");
    },
  },
  {
    id: "focus-must-stay-visible",
    describe: "an element that clears its outline must show a focus ring, or sit in a wrapper that does",
    check(document) {
      // ModelessTextField cleared the native outline and drew nothing in its
      // place, so focusing the most-used control in the system showed nothing.
      return [...document.querySelectorAll("input, textarea, select, button, a[href], [tabindex]")]
        .filter((element) => {
          const own = element.getAttribute("class") ?? "";
          if (!/\boutline-none\b/.test(own)) return false;
          if (/ring-\d|ring-ring|shadow-\[/.test(own)) return false;
          for (let node = element.parentElement; node; node = node.parentElement) {
            if (/focus-within:ring/.test(node.getAttribute("class") ?? "")) return false;
          }
          return true;
        })
        .map((element) => `<${element.tagName.toLowerCase()}> clears its outline with no focus ring on it or any ancestor`);
    },
  },
  {
    id: "svg-needs-name-or-hidden",
    describe: "an <svg> must be hidden from assistive technology or carry a name",
    check(document) {
      return [...document.querySelectorAll("svg")]
        .filter((element) => {
          if (isHidden(element)) return false;
          const named = element.getAttribute("aria-label")?.trim() || element.getAttribute("aria-labelledby")?.trim();
          return !named;
        })
        .map(() => "an <svg> is exposed with no accessible name");
    },
  },
];

/**
 * Components whose synthesized props cannot be made coherent by type alone.
 * Each needs a reason; the list is asserted to stay accurate, so an entry that
 * starts rendering must be removed.
 */
const CANNOT_SYNTHESIZE = new Map();

/**
 * Violations that exist on this branch and are fixed in review elsewhere.
 * Entries are asserted to still fail, so a merged fix makes this list stale
 * and the suite tells you to delete the entry rather than letting it linger.
 */
const KNOWN_FAILURES = new Map();

const components = createSynthesizer();

function render(name, props) {
  const Component = library[name];
  assert.ok(Component, `${name} is not exported from dist/index.js`);

  let html;
  try {
    html = renderToStaticMarkup(React.createElement(Component, props));
  } catch (error) {
    // Components that render a void element (inputs, for example) reject the
    // synthesized `children`. Retry without it rather than excluding them.
    if (props.children === undefined) throw error;
    const { children, ...rest } = props;
    html = renderToStaticMarkup(React.createElement(Component, rest));
  }

  return parseHTML(`<!doctype html><html><body>${html}</body></html>`).document;
}

for (const { name, props } of components) {
  const skip = CANNOT_SYNTHESIZE.get(name);

  test(`${name} renders accessibly`, { skip }, () => {
    const document = render(name, props);

    const violations = RULES.flatMap((rule) =>
      rule.check(document).map((detail) => `[${rule.id}] ${detail}`),
    );

    const known = KNOWN_FAILURES.get(name);
    if (known) {
      assert.notDeepEqual(violations, [], `${name} no longer violates any rule — remove it from KNOWN_FAILURES (${known})`);
      return;
    }

    assert.deepEqual(violations, [], `\n${name} violated ${violations.length} rule(s):\n  ${violations.join("\n  ")}\n`);
  });
}

test("every exported component is covered", () => {
  const covered = new Set(components.map((component) => component.name));
  const exported = Object.entries(library)
    .filter(([name, value]) => typeof value === "function" && /^[A-Z]/.test(name))
    .map(([name]) => name);

  const missing = exported.filter((name) => !covered.has(name));
  assert.deepEqual(missing, [], `components with no render coverage: ${missing.join(", ")}`);
});

test("the cannot-synthesize list is accurate", () => {
  const stale = [];
  for (const [name] of CANNOT_SYNTHESIZE) {
    const component = components.find((entry) => entry.name === name);
    if (!component) {
      stale.push(`${name} is no longer exported`);
      continue;
    }
    try {
      render(name, component.props);
      stale.push(`${name} now renders and should be removed from CANNOT_SYNTHESIZE`);
    } catch {
      // still cannot be synthesized, which is what the entry claims
    }
  }
  assert.deepEqual(stale, [], `stale exclusions: ${stale.join("; ")}`);
});
