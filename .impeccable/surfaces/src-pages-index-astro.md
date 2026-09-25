---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Homepage

## Scope and mode
Homepage (`src/pages/index.astro`). Mode: Persuade, in a credibility register. Visitors are senior decision-makers checking the firm after a referral or before a pitch. The single action is "Request a strategy session", which goes to /contact. It appears quietly, never repeated as a pushy CTA.

## Sequence
Header → first viewport → 01 Position → 02 What we do (4 disciplines, linking to /services) → 03 How we work (Measure, Model, Intervene, Review) → 04 Selected clients (7 monochrome logos, Adecco first) → 05 Findings (3 anonymized case studies, [TO CONFIRM] placeholders) → 06 Founders (no photos; frames reserved) → 07 Pulse (latest 2; hidden when there are none) → close → footer with the gradient band.

## Decisions pinned by the user
- Hero headline: "Growth is an optimization problem. We find the path." At 64–72px on desktop, scaling down on mobile. All other headings stay at 42px.
- Hero drawing: gradient descent (Cauchy, 1847). Pure hairline contours, a descent path that curves visibly, and the final point as the only blue mark on screen. The path draws in once on load. Margin note: x_{k+1} = x_k − η∇f(x_k), "Cauchy, 1847", in 12px notes style.
- Other maths motifs only sparingly, as section dividers.
- Hover: subtle, precise micro-interactions with no bounce.

## Direction contract
THESIS: The page is a business system under expert review. Growth is treated as an optimization problem and DataHustle marks the point of intervention. It refuses the agency default of a hero slogan, service cards, a logo carousel and a gradient CTA.
OWN-WORLD: Off-white #F7F7F7 paper, black #000 type and hairline rules on a strict 12-column grid. Section labels, indices and margin notes use the 12px notes style. Brand blue #3335FF is used only as intervention markup (a square marker or bracket) and as link hover. There are no fills, shadows, radii or cards: structure comes from rules and alignment. The logo gap in the H is the only interruption motif.
STORY: The visitor understands that DataHustle thinks mathematically about a business, and sees the four disciplines, the method, the clients, the founders' credentials and findings. They come to believe the firm is senior and precise, and they request a strategy session.
FIRST VIEWPORT: Header rule at the top. Columns 1–6: the hero headline at 64–72px Bold, a 16px intro, and the text link "Request a strategy session →". Columns 7–12: a full-height contour field of about 12 black hairline level sets. The descent path (black steps) curves from the top edge to the minimum and ends in the blue square. A margin note with the formula and "Cauchy, 1847" sits near the lower right. On mobile the drawing sits below the text as a square.
FORM: Redline (grounded list position 6 of 7), fused with the user-pinned gradient descent signature. Seed key 57dd86bf (degraded roll). Code-led build (no image generation available).
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open
Founders' titles and focus lines, real case studies, and "How we work" wording are all [TO CONFIRM]. A privacy page is needed before launch.
