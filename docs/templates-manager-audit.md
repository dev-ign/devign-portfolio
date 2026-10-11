# Templates Manager case study audit

## Highest-value findings

1. The current page explains many features in separate large sections, but the Manager → shared template → Fundraiser journey is never shown end to end. The portfolio preview selects and assigns a template, then changes its subject and saves; the dedicated story shows a different assignment visual and no recipient copy flow.
2. The UI examples contradict one another. The Figma screen and portfolio preview use “First-Time Donor Thank You,” while the case study visuals use names such as “First-time donor welcome,” “Year-End Stewardship,” and “Annual Giving Master.” Assignment counts and categories also vary.
3. The portfolio preview loops through unrelated states, including editing, after the manager-sharing step. It is already gated by selection and visibility, but it does not settle on a useful final state.
4. Some miniature visuals imitate controls without meaningful behavior. The case study can explain the system more clearly with one guided, accessible reconstruction of the real workflow and smaller supporting decision callouts.
5. The outcome section presents “100 users supported” as a quantified project result without supporting evidence in the repository. Other language implies measured efficiency or research findings that the available material does not verify.
6. The existing Figma screen provides a sound visual vocabulary: a dark app bar, category sidebar, selected template, ownership and assignment details, rich-text editor, and save feedback. These should anchor the reconstructed workflow.

## Direction

- Lead with the product problem and the role/ownership rule.
- Show one consistent illustrative template and manager/fundraiser pair across the portfolio and case study.
- Make the portfolio animation a short manager-sharing sequence with a stable ending.
- Make the dedicated case study a guided, manually explorable sequence through manager sharing, read-only access, duplication, and personal editing.
- Keep the visual identity, but replace repetitive feature sections with concise decision rationale, technical ownership, delivered capabilities, and a qualified outcome.

## Evidence boundary

The repository documents React, MUI, Django REST API integration, and TinyMCE in the candidate's existing narrative. The Figma frames show a current high-fidelity interface. The interactive screens implemented here are portfolio reconstructions, not a live product connection. No project-specific adoption metrics or research results were found in the supplied material.

## Refinement pass 2

The rendered desktop and mobile case study confirmed that the ownership and decision sections repeated the same card treatment. The ownership model now reads as a connected three-stage sequence, while the four decisions alternate editorial text and small interface details. The implementation and outcome sections use ruled content instead of another card grid.

The guided reconstruction now keeps two records after duplication: Dana's read-only shared original and Maya's separately identified, editable personal copy. An illustrative update-available label is associated with the shared original only. The page does not present a refresh action or automatic synchronization behavior because those details are unverified.

The First Draft section demonstrates a single designated “Top Donor” rule linking template configuration to later starting content. The supplied brief establishes the existence of default rules and a uniqueness constraint, but does not establish the precise rule list, uniqueness scope, or historical reassignment interaction. The reconstruction therefore labels the example and uses scope-neutral language.

## Ownership timeline motion

The ownership sequence retains its editorial layout and now uses a measured, scroll-linked line. One ScrollTrigger maps natural page progress to the actual marker centers; the line reaches each marker before its stage becomes active. The path changes to vertical when the stages stack below 768px. Forward, reverse, fast-jump, and reduced-motion states were checked in Chromium. The section does not pin or snap scrolling, and the two decorative arrows were removed.
