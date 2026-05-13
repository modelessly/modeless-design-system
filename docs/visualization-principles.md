# Visualization Principles

These principles guide Modeless data visualization components.

## 1. Explain The System

A Modeless visualization should help users understand a system, not just display a metric.

Good:

- where an agent branched
- why a claim is risky
- which contract permission can change state
- where trust leaves the product boundary

Weak:

- unlabeled glowing nodes
- generic line charts with no provenance
- scores without dimensions

## 2. Make Risk Inspectable

Risk should have:

- label
- location
- severity
- dependency or cause
- review state where possible

## 3. Show Actors

Differentiate:

- user
- AI
- human reviewer
- system automation
- wallet
- contract
- protocol
- external dependency

## 4. Show Flow And State

Use flow for movement and state machines for lifecycle. Do not confuse the two.

Flow answers:

- where did this come from?
- where is it going?
- what path did it take?

State answers:

- what is it now?
- what was it before?
- what can it become?
- who can change it?

## 5. Show Confidence As A Surface

Avoid a single confidence score when decisions depend on multiple dimensions.

Prefer:

- evidence strength
- freshness
- source reliability
- model certainty
- human review status
- business risk

## 6. Preserve Text

Every visualization should include enough text for:

- screen readers
- quick scanning
- screenshots
- reduced-motion mode
- users who cannot interpret color or motion

## 7. Keep Motion Honest

Motion must represent:

- state
- activity
- time
- flow
- attention

Motion must not imply live data unless the component is actually bound to live data.
