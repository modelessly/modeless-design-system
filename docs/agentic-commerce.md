# Agentic Commerce Components

Modeless Design System includes a first-pass component family for agentic payments and machine commerce. These are not payment processors and do not move money. They are reusable interface components for products that need to explain authorization, spend limits, scoped payment credentials, checkout state, and machine-payment handshakes.

## Why This Exists

Agent-first products need new payment surfaces because the buyer, operator, approver, merchant, and machine actor may not be the same party. Traditional checkout and finance dashboards hide too much of that boundary.

Use these components when a product needs to show:

- what an agent is trying to buy
- who approved the action
- which merchant or resource is allowed
- how much the agent can spend
- whether a credential is scoped or reusable
- what protocol state is currently active
- where a human review gate still exists

## Maturity

The first commerce family uses explicit maturity labels:

| Component | Maturity | Notes |
| --- | --- | --- |
| `AgentPaymentAuthorization` | Experimental | The core authorization pattern is useful, but payment policy models will vary by product. |
| `ScopedSpendControl` | Stable | The budget-envelope pattern is broadly reusable and maps cleanly to real admin interfaces. |
| `SharedPaymentTokenCard` | Research | The visual metaphor is promising, but credential semantics should be tested with real payment-token flows. |
| `AgenticCheckoutSession` | Experimental | Actor handoff is clear, but the event model may need to expand for production commerce. |
| `X402PaymentHandshake` | Research | Useful protocol visualization, but still tied to a fast-moving machine-payment space. |
| `AgentReceipt` | Experimental | Useful audit artifact, but receipt evidence schemas vary across products. |
| `DelegatedPaymentTimeline` | Experimental | Clear handoff model, but real workflows may need richer event taxonomies. |
| `CommerceTrustBoundary` | Research | Strong visual grammar for liability edges, still needs real-world validation. |
| `ProductFeedReadinessPanel` | Stable | Readiness scoring maps cleanly to merchant and catalog operations. |
| `MachinePaymentMeter` | Stable | Operational usage, cost, failure, and settlement metrics are broadly reusable. |

## Quick Start

```tsx
import {
  AgentPaymentAuthorization,
  ScopedSpendControl,
  SharedPaymentTokenCard,
  AgenticCheckoutSession,
  X402PaymentHandshake,
  type AgentPaymentAuthorizationStep,
} from "@modeless/design-system";
import "@modeless/design-system/styles";
```

Every commerce component accepts `motion="off" | "subtle" | "live" | "high"`. Use `subtle` for ordinary product screens and `off` for dense admin surfaces or user-controlled reduced-motion modes.

```tsx
<ScopedSpendControl
  agentName="Research buyer"
  period="monthly policy"
  totalLimit={1970}
  totalSpent={872}
  scopes={[
    { id: "supplies", label: "Supplies", limit: 500, spent: 184 },
    { id: "research", label: "Research", limit: 320, spent: 276, tone: "review" },
    { id: "apis", label: "API credits", limit: 900, spent: 412, tone: "machine" },
  ]}
  motion="subtle"
/>
```

## Components

### AgentPaymentAuthorization

Use case: an agent wants permission to make a bounded purchase.

Primary users: finance approvers, operations leads, trust reviewers, and builders of agentic workflows.

Why include it: money movement needs visible authorization boundaries. The component makes intent, merchant, amount, risk, and human approval legible before settlement.

```tsx
const steps = [
  {
    id: "intent",
    label: "Agent identifies replenishment need",
    actor: "agent",
    state: "requested",
    detail: "Office supply stock below threshold.",
  },
  {
    id: "human",
    label: "Human approves boundary",
    actor: "human",
    state: "approved",
    detail: "Spend below policy limit; delivery address verified.",
  },
] satisfies AgentPaymentAuthorizationStep[];

<AgentPaymentAuthorization
  merchant="SupplyNet"
  agentName="Procurement agent"
  amount="248.00"
  state="approved"
  riskScore={28}
  steps={steps}
  selectedStepId="human"
  onSelectedStepChange={(stepId) => console.log(stepId)}
/>
```

Accessibility: the flow diagram carries `role="img"` with an `aria-label`, and each step renders its `label` and `actor` as text. Step rows are native buttons, so they are reachable and operable by keyboard with a visible focus ring. Selection is currently shown by border and color only — see the known gaps below — so include any state a reviewer must not miss in `label` itself. Amount, merchant, and risk score are exposed as text metrics rather than through the diagram.

### ScopedSpendControl

Use case: a team gives an autonomous agent a limited operating budget across categories.

Primary users: platform admins, finance teams, compliance teams, and product owners.

Why include it: agent permissions should feel like envelopes, not passwords. Users need to see what remains, what is close to policy limits, and which categories need review.

```tsx
<ScopedSpendControl
  agentName="Research buyer"
  period="monthly policy"
  totalLimit={1970}
  totalSpent={872}
  scopes={[
    { id: "research", label: "Research", limit: 320, spent: 276, tone: "review" },
    { id: "apis", label: "API credits", limit: 900, spent: 412, tone: "machine" },
  ]}
  selectedScopeId="apis"
/>
```

Accessibility: the radial meter carries `role="img"` with an `aria-label`, and its numeric values are rendered as adjacent text metrics rather than inside the label, so budget figures remain readable when the meter is not. Scope rows are native buttons with a visible focus ring.

### SharedPaymentTokenCard

Use case: an agent receives a scoped payment token instead of a reusable payment method.

Primary users: commerce teams, security reviewers, marketplace teams, and consumer AI app builders.

Why include it: payment credentials are usually invisible. This component turns token scope into an inspectable artifact: merchant lock, expiry, reuse policy, shipping scope, and revocation story.

```tsx
<SharedPaymentTokenCard
  tokenLabel="SPT-04A7"
  merchant="SupplyNet"
  network="card"
  expiresAt="14m"
  permissions={[
    { id: "merchant", label: "Merchant locked", enabled: true },
    { id: "amount", label: "Amount capped", enabled: true },
    { id: "reuse", label: "Reusable credential", enabled: false, risk: "risk" },
  ]}
  selectedPermissionId="amount"
/>
```

Accessibility: permission rows are native buttons with a visible focus ring, and each renders its `label` as text. **`enabled` is currently conveyed only by an icon and a color swatch, both hidden from assistive technology, with no text equivalent** — until that is fixed, state whether a permission is active in `permission.label` itself. Revocation guidance is rendered as text.

### AgenticCheckoutSession

Use case: an agent builds a cart, asks for approval, starts payment, and hands off to merchant fulfillment.

Primary users: AI shopping teams, merchant experience teams, support teams, and UX designers.

Why include it: agentic checkout has multiple actors. The component shows who acted, what is pending, and where the user still has control.

```tsx
<AgenticCheckoutSession
  sessionId="chk_agent_2904"
  merchant="Hardware Relay"
  total="$148.40"
  activeEvent="review"
  events={[
    {
      id: "cart",
      label: "Cart built by agent",
      actor: "agent",
      state: "complete",
      detail: "Agent selects approved vendor items from policy and availability.",
    },
    {
      id: "review",
      label: "User reviews purchase",
      actor: "user",
      state: "active",
      detail: "Human sees merchant, amount, delivery window, and cancellation boundary.",
    },
  ]}
/>
```

Accessibility: event rows are native buttons with a visible focus ring, and each renders both `label` and `state` as text, so checkout ownership does not depend on color. Actor icons are hidden from assistive technology.

### X402PaymentHandshake

Use case: a machine or agent pays for a resource such as an API, dataset, model endpoint, or decentralized service.

Primary users: developer tool builders, protocol teams, API platforms, and web3 infrastructure teams.

Why include it: machine payments introduce protocol state that can be hard to debug. The component makes challenge, signature, submission, and settlement visible without becoming a generic transaction table.

```tsx
<X402PaymentHandshake
  resource="/research/risk-feed.json"
  amount="0.04 USDC"
  chain="Base"
  activeStep="submit"
  steps={[
    {
      id: "challenge",
      label: "Resource requires payment",
      status: "challenge",
      detail: "Server returns payment requirements with accepted network and asset.",
    },
    {
      id: "submit",
      label: "Client retries request",
      status: "submitted",
      detail: "Payment proof is attached to the next resource request.",
    },
  ]}
/>
```

Accessibility: each protocol step renders its `label` and `status` as text, so phase progress is legible without color. The step control is a native button with a visible focus ring.

### AgentReceipt

Use case: an agent completes a bounded purchase and the organization needs a compact record of what happened.

Primary users: finance reviewers, support teams, audit teams, and product teams building agent activity logs.

Why include it: agent purchases need a receipt that explains agency, approval, merchant response, and evidence chain, not just amount and date.

Accessibility: the receipt is static, with no interactive controls. Evidence items render `label` and `status` as text, and totals and metadata are exposed as text metrics. Icons are decorative and hidden from assistive technology.

### DelegatedPaymentTimeline

Use case: a team wants to inspect who held authority at each point in an agent-led payment workflow.

Primary users: operations teams, compliance reviewers, support teams, and AI product designers.

Why include it: delegation is a time-based trust problem. This component makes authority transfer inspectable after the fact.

Accessibility: the timeline is static. Each event renders `actor`, `label`, and `state` as text, so authority transfer is readable in sequence without relying on the visual track.

### CommerceTrustBoundary

Use case: a commerce or protocol team needs to explain where delegated payment risk enters the system.

Primary users: risk teams, security reviewers, protocol designers, and enterprise AI platform owners.

Why include it: agent commerce creates unclear liability edges. This component gives those edges a visual grammar.

Accessibility: the boundary map carries `role="img"` with an `aria-label`, and each zone renders its `label` and `risk` as text alongside the diagram. The component is static — liability edges are conveyed by structure and text, not by color alone.

### ProductFeedReadinessPanel

Use case: a merchant wants to know whether its catalog can be safely interpreted by shopping agents.

Primary users: merchant platform teams, catalog ops, marketplace teams, and agentic commerce integrators.

Why include it: agentic commerce starts before checkout. Products need structured data, availability, policies, identity, and fulfillment clarity.

Accessibility: the readiness meter carries `role="img"` with an `aria-label`. Each checked item renders its `label` and `status` as text, and the overall score is exposed as a text metric, so readiness is never carried by the meter alone.

### MachinePaymentMeter

Use case: an agent pays for APIs, files, model calls, or protocol resources throughout an automated workflow.

Primary users: developer platform teams, AI infrastructure teams, API operators, and finance operations.

Why include it: small machine payments become operational infrastructure. This component tracks spend and settlement health without hiding failures.

Accessibility: the settlement meter carries `role="img"` with an `aria-label`. Usage, cost, failure, and settlement values are rendered as text metrics rather than inside the label, so failures stay visible to assistive technology.

## Motion Guidance

Default to `motion="subtle"`. Use motion to show state and directional flow:

- authorization paths may draw slowly
- active approvals may pulse softly
- spend bars may shimmer only enough to signal liveness
- checkout events may highlight current ownership
- machine-payment handshakes may show a quiet directional pulse

Avoid urgent strobing, jitter, sound, or attention traps. All components accept `motion="off"` and respect the global reduced-motion CSS path.

## Interaction Guidance

The commerce components support lightweight inspection states. They work uncontrolled by default for demos, but expose controlled props for production use:

- `AgentPaymentAuthorization`: `selectedStepId`, `onSelectedStepChange`
- `ScopedSpendControl`: `selectedScopeId`, `onSelectedScopeChange`
- `SharedPaymentTokenCard`: `selectedPermissionId`, `onSelectedPermissionChange`
- `AgenticCheckoutSession`: `selectedEventId`, `onSelectedEventChange`
- `X402PaymentHandshake`: `selectedStepId`, `onSelectedStepChange`

Use these inspection states when a user needs to understand why an agent can spend, who approved a checkout step, what a scoped token permits, or what protocol phase is currently active. Avoid hiding critical payment or risk details behind hover-only interactions.

## Accessibility

These components describe money movement, so a reviewer who cannot see the visual must still be able to tell what an agent is permitted to do, who approved it, and whether it failed.

### Shared Behavior

Every commerce component is wrapped in a shared frame that renders a `<section>` with a visible `<h3>` title. Its decorative badge, and every icon in the family, is hidden from assistive technology. Components that render a diagram or meter carry `role="img"` with an `aria-label` naming what it depicts, and expose the underlying numbers as adjacent text metrics rather than burying them in the label — the value stays readable when the graphic is not.

### Keyboard

The five components with inspection states — `AgentPaymentAuthorization`, `ScopedSpendControl`, `SharedPaymentTokenCard`, `AgenticCheckoutSession`, and `X402PaymentHandshake` — render their selectable rows as native `<button type="button">` elements. They are reachable in document order, activate with Enter and Space, and keep the system's visible `focus-visible` ring. The remaining five components are static and expose no controls.

### Text Over Color

Most components render the state that matters as text: step actors, event states, protocol status, zone risk, and item status all appear as strings next to the visual treatment. Follow that rule when supplying data — put meaning in `label`, `state`, `status`, and `actor` rather than relying on a tone value to carry it.

### Motion

Commerce motion is limited to low-opacity drift on active rows and meters. All of it is disabled under `prefers-reduced-motion: reduce`, and no component depends on animation to communicate authorization state, settlement, or failure. Pass `motion="off"` where a payment surface should stay completely still.

### Known Gaps

These are documented rather than fixed, and they are part of why the family remains experimental. Both are code changes, not documentation changes:

1. **Selection is not exposed to assistive technology.** All five interactive components indicate the selected row with border and background color only. None sets `aria-pressed` or `aria-current`, so a screen reader user can operate the control but cannot tell which step, scope, permission, or event is currently selected. Until this is fixed, do not rely on selection alone to convey anything a reviewer must know.

2. **`SharedPaymentTokenCard` conveys `enabled` by icon and color only.** The active/inactive distinction is drawn with two different icons and a colored swatch, all hidden from assistive technology, with no text equivalent. A screen reader user cannot currently tell which permissions a shared payment token grants. Include the state in `permission.label` as a workaround.

Both gaps violate the system's own rule in `docs/accessibility.md` that state must never be carried by color alone. Closing them is the remaining work before this family can be considered for promotion out of experimental.

The pattern to follow already exists in the system: `SignalBloom` renders its selectable items as native buttons carrying `aria-pressed` and a composed `aria-label` that states severity, state, and value, inside containers with their own labels. Commerce inspection rows should match it rather than invent a second approach.

## Security Notes

These components are visual primitives. They do not validate payment credentials, process transactions, or enforce policy. Use them with real authorization, payment, audit, and fraud systems behind the interface.
