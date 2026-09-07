/**
 * The trust tier table, enforced at the query layer.
 *
 * This is the point of the server: a component's maturity stops being
 * documentation an agent may or may not read, and becomes a gate on what the
 * agent can retrieve and what it may do with the result.
 */
export const TIER_POLICY = {
  stable: {
    retrievable: true,
    unsupervisedUse: true,
    guidance: "Safe to use in generated output without human review.",
  },
  beta: {
    retrievable: true,
    unsupervisedUse: true,
    requiresHumanReview: true,
    guidance: "Usable in generated output, but flag any output referencing this component for human review.",
  },
  experimental: {
    retrievable: true,
    unsupervisedUse: false,
    guidance:
      "Prototyping only. Not eligible for unsupervised or auto-merged output. Do not use in generated output a human will not review before it ships.",
  },
  // Not in the original table, but the vocabulary in docs/component-readiness.md
  // defines it, so the layer needs a defined behaviour rather than a gap.
  deprecated: {
    retrievable: true,
    unsupervisedUse: false,
    guidance: "Present for compatibility only. Do not use for new work. Not eligible for unsupervised output.",
  },
  internal: {
    retrievable: false,
    unsupervisedUse: false,
    guidance: "Not part of the public package contract. It is reserved for the Modeless site and product-specific surfaces.",
  },
};

export const RETRIEVABLE_TIERS = Object.entries(TIER_POLICY)
  .filter(([, policy]) => policy.retrievable)
  .map(([tier]) => tier);

/** A tier with no policy is treated as unretrievable rather than as allowed. */
export function policyFor(tier) {
  return TIER_POLICY[tier] ?? { retrievable: false, unsupervisedUse: false, guidance: `Unknown tier "${tier}". Treated as not retrievable.` };
}

export function isRetrievable(tier) {
  return policyFor(tier).retrievable === true;
}
