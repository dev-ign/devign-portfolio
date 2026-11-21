# Donor Directory — interview guide and implementation report

Prepared for the Vector Solutions final panel on December 2, 2026: John Langford, Virginia Pollock, and Austin Smith.

## What changed and why

The case study now leads with fundraisers’ need for control alongside Raise’s AI recommendations. It explains the customer discovery approach, representative questions, three research themes, and the decisions those themes informed. The existing page structure, purple palette, typography, spacing, demos, imagery, and drawer comparison remain the foundation.

Two sections were added: research and design priorities. Selection now precedes the drawer, supporting a walkthrough from finding people to acting on records to understanding an individual donor. The closing section separates qualitative recollections, a product-manager usage update, and future measurement ideas. No presenter mode, timers, libraries, new product features, or production integrations were added.

## A conversational 18-minute walkthrough

Use these points as cues. Pause when the panel wants to explore a decision; the existing section menu lets you resume anywhere without resetting the interactive directories. The animated drawer is an illustration; demonstrate the actual drawer in either interactive directory above it.

### 1. Donor Directory — 30 seconds

- **What the panel should understand:** This was product design and UX engineering work on Gravyty / Raise, reconstructed with fictional data for the portfolio.
- **Say:** “I designed and helped build a way for fundraisers to find donors and take action using their own judgment, alongside the AI recommendations.”
- **Show:** Project metadata and the existing overview image. Briefly acknowledge the proprietary-assets disclosure.
- **Transition:** “First Draft already helped with outreach. The gap was what happened when someone wanted to choose the donor themselves.”

### 2. Recommendations weren’t enough — 90 seconds

- **What the panel should understand:** AI recommendations served a real need, but didn’t cover known-donor lookup or organization-specific fundraising criteria.
- **Say:** “Sometimes a gift officer already knew whom they wanted to contact. Other times, they wanted to explore a group based on their own goals.”
- **Show:** The product context and central design question. There is no invented before-screen.
- **Transition:** “To understand that gap, I started with how people were actually working.”

### 3. I wanted to understand the workflow before designing the interface — 2 minutes

- **What the panel should understand:** Discovery and usability sessions, workflow walkthroughs, notes, and open questions informed the direction. Perspectives included champion users, fundraisers, gift officers, managers, and support.
- **Say:** “I wanted to understand what someone needed to accomplish before asking them to react to a screen. A useful question was what information they needed before engaging a donor.”
- **Show:** Representative remembered questions and the three themes: control, action, and a connected experience. These are a synthesis, not interview transcripts.
- **Transition:** “That changed how I framed the work: the directory needed to support useful action as well as finding information.”

### 4. Turning what I learned into design priorities — 1 minute

- **What the panel should understand:** The research connected directly to search, navigation, contextual information, actions, bulk work, and preserved state.
- **Say:** “I used those needs to evaluate the design: can someone find a donor, understand the situation, and continue without starting over?”
- **Show:** The need-to-decision pairs and Discover → Narrow → Inspect → Return → Act. Decision links lead to the relevant demos.
- **Transition:** “Here’s how that starts when someone knows a name—or only knows the kind of donor they’re looking for.”

### 5. Finding the right donor, faster — 3 minutes

- **What the panel should understand:** Known-person lookup and exploratory discovery need different controls. Hierarchy, active filters, result counts, and navigation make the dataset understandable.
- **Say:** “Search finds a person; filters narrow a population; sorting helps decide whom to inspect first. The table puts identity and useful fundraising context where people can scan them.”
- **Demonstrate:** Search for `Martinez` (three matches), apply **High engagement** (two matches), then remove the filter and clear the search. Change sort and move to another page. Optionally enter a nonexistent name and use **Clear search and filters**.
- **Transition:** “After finding the right set of people, the next question was how to avoid repeating the same work for each record.”

### 6. Reducing repetitive work — 3 minutes

- **What the panel should understand:** Selection makes bulk actions relevant without cluttering the resting directory. Scope must be visible before an action.
- **Say:** “The count tells me how many records I’m acting on. I wanted the selected state and the available action to be understandable together.”
- **Demonstrate:** In the selected-state demo, clear the three initial selections, select one or two donors, and export CSV. Show the count and clear selection. If asked, select across pages: select all applies to the visible page, while export includes every selected record in the local sample.
- **Transition:** “Bulk work helps with a group. For an individual donor, I needed to bring the relationship context closer to the next action.”

### 7. From a record to a relationship / Working alongside AI — 3 minutes

- **What the panel should understand:** A drawer trades space for faster inspection and retention of directory context. It suits focused tasks; a separate page offers more room for deeper work.
- **Say:** “I chose a tighter canvas so someone could inspect a donor and return to the same results. The goal wasn’t to replace the AI; it was to let fundraisers decide when and how to use it.”
- **Demonstrate:** In the interactive directory above, search `Martinez`, apply **High engagement**, open Sofia Martinez, and explore **Overview**, **History**, and **Details**. Return to Overview and choose **Request First Draft**. Point out that it is simulated. Close with Escape and show the preserved search, filter, and row focus. Use the existing Pause/Replay controls only if useful to discuss the illustrative sequence.
- **Transition:** “Making that pattern work consistently meant thinking about component states, data constraints, and keyboard behavior during implementation.”

### 8. Built for scale, designed for everyone — 1 minute

- **What the panel should understand:** Large datasets and accessibility were practical design constraints. The production approach and the small local demo have different data architectures.
- **Say:** “We needed to work with a large dataset without loading it all at once. Pagination and virtualization were part of the production approach; this reconstruction demonstrates the interaction with 30 local records.”
- **Show:** Existing reusable pattern cards and the distinction between specified production states and demonstrated local states.
- **Transition:** “My engineering role helped me carry those decisions into the components and check the behavior with the team.”

### 9. From design decisions to reusable components — 1 minute

- **What the panel should understand:** UX ownership continued through React / Material UI implementation, consistent states, collaboration, and design QA.
- **Say:** “The drawer wasn’t finished when the layout looked right. Keyboard tabs, closing it, and returning focus to the donor were part of the experience.”
- **Show:** The existing design-to-implementation image. If asked, open the interactive drawer with Enter, use arrow keys between tabs, then Escape to return focus.
- **Transition:** “The signals after introduction were encouraging, and I’m careful to separate those from what I can actually quantify.”

### 10. What I heard, and what I’d measure today / Helping people do meaningful work — 2 minutes

- **What the panel should understand:** Outcomes are credible but limited. Today’s evaluation plan is distinct from historical results.
- **Say:** “Customers responded positively to search and filtering, asked for more capabilities, and my PM shared data showing First Draft requests from the directory. I don’t have a verified adoption rate or efficiency comparison.”
- **Show:** Three outcome signals, followed by future measures: donor-location time, search/filter completion, First Draft completion, repeated record navigation, action success/errors, and qualitative clarity/control feedback.
- **Close:** “Research clarified the need for control alongside AI. That shaped what I prioritized, why I chose the interaction patterns, and how I carried them through implementation.”

## Research and factual integrity

| Topic | Evidence available | How the page handles it |
| --- | --- | --- |
| Research approach and participants | The supplied project recollections | Describes workflow walkthroughs and open questions in first person; no sample size, transcripts, dates, quotes, personas, or invented artifacts. |
| Representative questions | Recalled examples in the brief | Explicitly labels these as representative remembered questions, not a standardized script. |
| Switching between CRM, Gravyty, and other tools | Users described friction | Uses “described”; does not claim direct observation or measured switching reduction. |
| Notes and reminders | Needs raised in discovery | Labels them as research needs; does not imply they are built in the reconstruction or confirm they shipped. |
| Configurable columns | No confirming evidence in this repository or brief | Omits the shipped-feature claim and adds no configuration system. |
| Original implementation | Existing case-study copy supports React, Material UI, DataGrid Pro, server-side retrieval, pagination, virtualization, and design QA | Retains that context, explicitly distinguishing production architecture from the local sample. No performance benchmarks or new API behavior are claimed. |
| Team composition | Existing portfolio metadata says sole designer, PM, four engineers | Preserved, not independently verified against internal records. |
| Outcomes | Recollections of positive feedback, requests for more features, and a PM-shared usage update | Presented qualitatively. Original analytics, dates, denominators, and comparisons are unavailable; no rates or causal improvement claims. |
| Approximately 30% fewer support tickets | Broader MyRaise work, not directory-specific evidence | Not attributed to Donor Directory and omitted from this page. |
| Approximately 50+ design-system components | Older copy referred to a broader system | Removed the count to keep attention on reusable behavior and avoid implying a directory-specific result. |
| Destructive-action safeguards | No confirmation of historical confirmation/recovery behavior | Discusses these as retrospective questions for future usability work, not shipped behavior. |
| Accessibility | Existing design/QA narrative plus local behavior checks | Describes concrete keyboard/focus behavior; avoids an unverified blanket WCAG conformance claim. This work is not a full screen-reader or conformance audit. |
| Production assets and donor data | Proprietary; reconstructed assets already present | Keeps existing reconstructed visuals and fictional data, with one visible disclosure. No internal assets or customer records were retrieved. |

## Design and engineering

- Reused `SectionTitle`, `LiveDirectoryDemo`, `WorkflowModel`, `PortfolioAsset`, the section navigation, existing imagery, and the current typography/color/spacing utilities.
- Preserved `DirectoryDemo`, `DirectoryTable`, and `DonorDetailDrawer` logic and state management. There are still two interactive directories and one illustrative drawer sequence.
- Added data-driven research and priorities sections using existing border, comparison, grid, and callout patterns. No new visual treatments or dependencies. A pre-existing mobile navigation overlap was fixed by limiting desktop centering to larger screens and reusing the existing mobile menu alignment.
- Preserved existing section IDs and added `research` and `design-priorities`, so old links still resolve.
- Updated the Donor Directory SEO description and its stale route-test expectations. Updated the existing browser QA script’s outcome-navigation label.
- Added an integration check that navigation through the story preserves the user’s working search.

### Verification

The reconstructed demos have no production API dependency: input → local state → fictional records → rendered result or CSV download. The First Draft request only updates local feedback.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed across the application. |
| Focused ESLint | Passed for both changed TSX components, the narrative data module, and the route test. |
| Relevant Jest suites | 29 tests passed in four suites: route/story/navigation, directory interactions, visual inventory, and page metadata. The original route test failed before this work because its copy and imagery expectations were stale; those expectations now match the current page. |
| `npm run build` | Passed; generated all four route-specific static entry documents. |
| Existing responsive browser QA against production build | Passed at 1440, 1024, 768, and 390 pixels: search, filtering, selection, CSV download, drawer, preserved context, focus return, section navigation, and full-screen mobile drawer. No horizontal overflow or page errors. |
| Extended Chromium checks | Passed normal motion at 1440/390 and production reduced motion at 1440/390/360/320. Verified sorting, pagination, no-results recovery, keyboard opening/closing, drawer tab arrows/Home/End, simulated First Draft, exact CSV contents, clear selection, preserved search/filter state, menu keyboard activation, and animation controls. |
| WebKit checks against production build | Passed at 1440/390 with reduced motion, including the same extended interactions and viewport/menu bounds. |
| Mobile navigation regression | The pre-existing overlap was reproduced, corrected, and checked again. Pinned controls remain separate and the menu stays inside the viewport. |
| Visual review | Reviewed public/local baselines and final desktop/mobile research, priorities, outcome, and drawer captures. Existing colors, typography, spacing, and reconstructed product interfaces remain recognizable. |
| `git diff --check` and scope review | Passed. Demo implementation, package files, source images, and unrelated page content are unchanged. |

Browser reports and captures are available locally in `/tmp/donor-directory-interview-qa/` and `/tmp/donor-directory-responsive-qa.json`. The extended browser script is `/tmp/donor-directory-interview-qa.mjs`; run it from the repository directory. The production preview is `http://127.0.0.1:4173/case-studies/donor-directory/` while the local server remains running.

No remaining functional issue was found in these scoped checks. The existing toolchain emits a notice about stale Browserslist data. Keyboard, focus, responsiveness, and reduced-motion checks passed; this was not a full assistive-technology/conformance audit or an empirical rehearsal of spoken presentation time.

### Files changed

| File | Purpose |
| --- | --- |
| `src/data/donorDirectoryCaseStudy.ts` | Conversational narrative, research synthesis, decision mappings, tradeoffs, outcome boundaries, and future measures. |
| `src/components/case-studies/DonorDirectoryCaseStudy.tsx` | Existing-pattern section composition, navigation order, rationale near demos, and outcome/reflection presentation. |
| `src/components/case-studies/CaseStudySectionNavigation.tsx` | Applies the existing mobile popover alignment to the pinned Donor Directory menu. |
| `src/index.css` | Restricts Donor Directory’s centered pinned navigation override to larger screens, restoring the existing mobile position. |
| `src/data/donorDirectorySeo.json` | Search/social description aligned with research and user control alongside AI. |
| `src/pages/CaseStudyDetailPage.test.jsx` | Corrects stale Donor Directory expectations and verifies navigation retains demo state. Template Manager assertions remain unchanged. |
| `scripts/qa-donor-directory-refinement.mjs` | Keeps the existing responsive interaction check aligned with the outcome menu label. |
| `.gitignore` | Adds a specific exception so this guide is included in the working changes. |
| `docs/donor-directory-interview-guide.md` | This presentation guide, factual integrity review, implementation report, and verification record. |

All changes are local to the existing working branch. No commit, push, or deployment was performed.
