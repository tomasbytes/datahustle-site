---
name: DataHustle
description: Intelligence & Innovation partner. A business system under expert review, drawn in black hairlines on off-white paper, with one blue mark where the intervention goes.
colors:
  black: "#000000"
  paper: "#f7f7f7"
  intervention-blue: "#3335ff"
  ink-2: "#4a4a4a"
  rule: "rgb(0 0 0 / 0.14)"
  contour: "rgb(0 0 0 / 0.3)"
  night-note: "#b9b9b9"
  night-body: "#cfcfcf"
typography:
  display:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.35rem + 3.9vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  numeral:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(4.5rem, 2rem + 8vw, 10rem)"
    fontWeight: 700
    lineHeight: 0.82
    letterSpacing: "-0.045em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 1.95rem + 0.8vw, 2.625rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.3125
    letterSpacing: "normal"
  label:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.3333
    letterSpacing: "0.01em"
  data:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
    fontFeature: "tnum"
  math:
    fontFamily: "KaTeX Main, Cambria Math, STIX Two Math, Times New Roman, serif"
    fontSize: "0.875rem"
    fontWeight: 400
    letterSpacing: "0"
rounded:
  none: "0px"
spacing:
  gutter: "clamp(1.25rem, 0.6rem + 2.6vw, 4rem)"
  gap: "clamp(1rem, 0.7rem + 0.8vw, 1.5rem)"
  section: "clamp(4.5rem, 3rem + 6vw, 9rem)"
  frame-top: "1.25rem"
  row: "1.5rem"
  max: "90rem"
components:
  link-arrow:
    textColor: "{colors.black}"
    typography: "{typography.body}"
  link-arrow-hover:
    textColor: "{colors.intervention-blue}"
  button-primary:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "0 1.4rem"
    height: "3rem"
  button-primary-hover:
    backgroundColor: "{colors.intervention-blue}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0 1rem"
    height: "2.25rem"
  button-ghost-hover:
    backgroundColor: "{colors.intervention-blue}"
    textColor: "{colors.paper}"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0"
  textarea-field:
    backgroundColor: "transparent"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  header-bar:
    backgroundColor: "{colors.paper}"
    height: "4.5rem"
  instrument-readout:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    typography: "{typography.data}"
    rounded: "{rounded.none}"
    padding: "0.25rem 0.375rem"
  instrument-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    padding: "0.625rem 0 0"
  method-section:
    backgroundColor: "{colors.black}"
    textColor: "{colors.paper}"
  thread-point:
    backgroundColor: "{colors.black}"
    size: "11px"
  thread-point-lit:
    backgroundColor: "{colors.paper}"
  thread-point-current:
    backgroundColor: "{colors.intervention-blue}"
  thread-end:
    backgroundColor: "{colors.intervention-blue}"
    size: "12px"
  consent-box:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
    width: "min(17.5rem, calc(100vw - 2rem))"
---

# Design System: DataHustle

## Overview

**Creative North Star: "The Redlined Proof"**

The site reads as a business system under expert review. Off-white paper, black type and hairline rules on a strict 12-column grid do all the structural work; nothing is filled, lifted or rounded. Growth is treated as an optimization problem, and the only colour on the page is the reviewer's mark: a small blue square at the point of intervention. The signature is a live instrument: a contour map of a real curved-valley function, on which a gradient descent (Cauchy, 1847) runs once on load, answers the pointer with measured readouts, and lifts into a 3D wireframe as the visitor scrolls. From its minimum a single thread carries the descent down the page margin, through the method's iterations, to the blue square that closes the page.

Density is calm and editorial, with a varied section rhythm: a full-width statement, a ruled 2×2 field of disciplines, one full-bleed black section for the method, a ruled logo index, three-column findings, and title-left frames for people and articles. Every section still opens on a black rule. Lists are ruled rows or ruled cells, never cards. Mathematics appears as working notation and computed diagrams (the instrument, the service and finding figures, `k = n` iteration indices), never as decoration for its own sake. This follows PRODUCT.md's binding brand commitments: authoritative, precise, restrained, with mathematical and geometric logic; strict grid; no shadows; emphasis by SemiBold weight only, never colour.

The system refuses the agency default: hero slogan over a stock image, service cards, logo carousels, gradient CTAs, eyebrow labels above headings.

**Key Characteristics:**
- Off-white paper, black type, hairline rules; one accent colour used as markup, not decoration.
- Strict 12-column grid; every section opens on a 1px black rule, with the layout inside varied by content.
- Brand type scale of four steps, plus the hero display, the method numerals, a mono data face for measured values and a maths face for notation.
- Zero radius, zero fills, zero elevation, one inverted section. Structure comes from rules and alignment.
- A live hero instrument and one page thread as the motion signature; figures draw in once on reveal; hover responses stay quiet and bounce-free.
- Squares mark markers and optima; dots mark data and iterates. Blue is reserved for the minimum, the optimum and the current point.

## Colors

A near-monochrome paper-and-ink palette with a single saturated blue that marks intervention and interaction.

### Primary
- **Intervention Blue** (#3335ff): the brand blue, used only as markup and interaction. Permitted uses, and nothing else: the minimum square at the end of every descent run in the hero instrument; the optimum square on the response-curve figure and the chosen point on the Pareto figure; the current thread point in the method; the 12px square that ends the thread on the close; the minimum square of the contact "request received" descent strip; the hover colour of arrow links, service titles, Pulse titles and prose links; the solid and ghost button hover fill; the 2px focus ring; text selection background; the input caret and input focus underline; the 6px square marker before a field error message; and the start of the footer gradient band.

### Neutral
- **Black** (#000000): all type on paper, the section-frame top rule, the method section's full-bleed ground, form field strokes, the solid button, descent paths and iterate dots, figure lines, list-marker squares, the instrument readout's border.
- **Paper** (#f7f7f7): the page background, the sticky header, the instrument panel and readout backing, the consent box, type on the method section, the thread stroke, lit thread points, the text on solid buttons and selections, and the end stop of the footer gradient.
- **Graphite** (#4a4a4a, token `ink-2`): secondary text on paper only (questions, captions, dates, founder titles, helper notes). 8.6:1 on paper.
- **Hairline Rule** (rgb(0 0 0 / 0.14), token `rule`): structural dividers inside a section: the services field, client index cells, chart captions, Pulse rows, the header's bottom edge, portrait frames, footer legal rule.
- **Contour** (rgb(0 0 0 / 0.3)): level-set lines in the instrument and its no-JS fallback, and the baseline of the descent strip.
- **Night Note** (#b9b9b9, token `night-note`): secondary text on the black method section (the section note and the `k = n` indices). It replaces Graphite there.
- **Night Body** (#cfcfcf, token `night-body`): step body text on the black method section, a half-step brighter than the notes.

Figures and the instrument draw tints of the current ink rather than new colours: axes at 0.35 opacity, secondary curves and the "before" series at 0.4, network edges at 0.12, the wireframe mesh at up to 0.13, the crosshair at 0.35.

### Gradient
- **Depth-to-Clarity Band**: `linear-gradient(90deg, #3335ff, #f7f7f7)`, 12px (0.75rem) tall, full width, at the very foot of every page below the footer. It is the only gradient on the site.

### Named Rules
**The Reviewer's Pen Rule.** Blue is markup, not paint. A blue element is a minimum, an optimum or the current point (as a square or a dot), a response to pointer or keyboard (hover, focus, selection, caret), or an error marker. Otherwise it does not exist.

**The One Band Rule.** The gradient appears once per page, as the footer band. Never as a fill, a button, a heading treatment or a section background.

**The Weight-Not-Hue Rule.** Emphasis is SemiBold (600). Colour never carries emphasis; blue appears on hover because the element is interactive, not because it is important.

## Typography

**Display / Body Font:** Schibsted Grotesk (with Helvetica Neue, Arial, sans-serif), self-hosted variable file, weights 400–700. It stands in for the brand face Alfabet, whose demo files are not licensed for web (PRODUCT.md).
**Data Font:** Geist Mono (with ui-monospace, SFMono-Regular, Menlo, monospace), self-hosted at 400, tabular figures, zero tracking. Used only for measured values.
**Math Font:** KaTeX Main (roman) and KaTeX Math (italic), with Cambria Math, STIX Two Math, Times New Roman as fallbacks. Used only for mathematical notation.

**Character:** A tight, confident grotesk set with negative tracking at large sizes, a plain instrument mono that appears only where a number is being read off, and a textbook maths serif that appears only where there is an actual formula or variable.

### Hierarchy
- **Display** (700, clamp 40→72px, 1.02, −0.03em): the homepage hero headline only, set as two balanced lines.
- **Numeral** (700, clamp(4.5rem, 2rem + 8vw, 10rem), 0.82, −0.045em, tabular): the two-digit step numbers (01–04) in the black method section only.
- **Headline** (700, 42px with a 36px floor on phones, 1.1, −0.02em): every section heading (`.h`), the position statement and the "Request received" state. The brand's Heading step.
- **Title** (600, 22px, 1.2, −0.01em): subheadings (`.sub`): service names, step names, finding sectors, founder names, post titles, the position lead.
- **Body** (400, 16px / 21px): all running text, nav, links and buttons (buttons set at 600, line-height 1). Measure capped at 30rem for leads, 28–38ch for column text, 36em for position columns, 60ch for post descriptions.
- **Label / Notes** (400, 12px / 16px, +0.01em): margin notes, captions, dates, dt labels (Challenge / Intervention / Outcome), the instrument hint (at 600), helper text, field errors (at 600), footer legal line.
- **Data** (Geist Mono 400, 12px / 1.35, tabular): the instrument's cursor readout (`x`, `y`, `f`), and the live counter (`k`, `f(x_k)`) beside the map. Variables inside the counter stay in KaTeX Math italic.
- **Math** (400, 14px): notation only: the hero formula (14px), `k = n` indices on the contact page (14px). Variables in KaTeX Math italic; subscripts at 0.7em with zero line-height.

Surface-specific sizes outside the scale are recorded as they ship, not as rules to extend: inner-page titles (PageHead) at clamp 40→64px, 700, 1.04; Pulse article titles at clamp 32→42px with a 20px standfirst and 17px / 1.55 article prose; the consent box at 14px / 1.35; figure axis labels (Before / After) at 10px in a 320-unit viewBox.

### Named Rules
**The Four Steps Rule.** Outside the hero and the method numerals, text uses the brand's four steps (42 / 22 / 16 / 12). The 72px display belongs to the homepage hero alone; the 72→160px numerals belong to the method section alone.

**The Measured Value Rule.** Geist Mono sets numbers that are being measured live: coordinates, function values, iteration counts. Never words, headings, labels or static figures.

**The Notation Rule.** The maths face appears only on real notation: a formula, an iteration index, a variable. Never on words.

## Layout

A strict 12-column grid (`repeat(12, minmax(0, 1fr))`) inside a centred wrapper of 90rem (1440px) maximum, with fluid side gutters of clamp 20→64px and column gaps of clamp 16→24px.

**Section frame.** Sections are separated by fluid vertical space (clamp 72→144px); each opens with a full-width 1px black top rule across the grid and 20px (1.25rem) under it. What sits inside the frame varies with the content:
- **Position:** the statement in Headline across columns 1–9, then three columns: the lead (Title) in 1–4, two body columns in 5–8 and 9–12.
- **Services:** heading in 1–8 with "All services" right-aligned in 9–12, then a ruled 2×2 field across all 12 columns: hairline top, hairline under each cell, a hairline between the two columns. Each cell sets its figure and its text side by side (5fr : 6fr).
- **Method:** full-bleed black (see Elevation & Depth). Heading in 1–6, note in 9–12 aligned to the heading's baseline, then four steps of three columns each, stepping down by `i × clamp(1.5rem, 4.5vw, 4.5rem)` into a descending staircase.
- **Clients:** an 8-cell ruled index (4 × 2 at 16:9): the heading is the first cell, the seven logos fill the rest. Black top rule, hairline cell edges, no outer right edge.
- **Findings:** heading and a muted note on one line, then three equal columns (gap × 2), each a figure, sector, and Challenge / Intervention / Outcome list.
- **People and Pulse:** the classic frame, heading in columns 1–4, body in 5–12.
- **Close:** the thread's blue end square in columns 1–4, heading, lead and arrow link in 5–12.

**First viewport.** Hero text in columns 1–6 (display headline, 16px lead capped at 30rem, arrow link, 1.75rem apart), the instrument in columns 7–12 as a square stage capped at `100svh − 12rem`, with its panel under it. On desktop (above 60rem, motion allowed, JS on) the hero is 175svh tall minus the header and its content is sticky under the 72px header, so it holds while the map tilts and settles. Below 60rem the instrument stacks under the text, capped at 36rem wide and centred, and nothing pins.

**Thread.** An absolutely positioned SVG over the whole page (z 5). It runs in the left margin, at the centre of the gutter, and its route is ruled: horizontal and vertical segments only.

**Header and footer.** The header is a sticky 72px bar on the same 12 columns (wordmark 1–3, nav 7–10, contact link 11–12), with a hairline bottom edge; below 60rem it becomes static and wraps the nav onto its own line. The footer opens with a black top rule and uses columns 1–3 / 5–7 / 9–10 / 11–12, then a hairline legal line, then the gradient band.

**Breakpoints.** 60rem (960px): stacked hero with no pin, single-column position and services field, method steps 2 × 2 with a 1.25rem stagger, clients 2 columns with the heading cell full width and the last logo full width, single-column findings, static header. 40rem (640px): service figure above its text (max 20rem), method steps single column with no stagger, clients at 3:2, single-column founders and posts.

### Named Rules
**The Open-On-A-Rule Rule.** Every section opens on a 1px black rule across the grid. The layout under it may vary, but it stays on the 12 columns; nothing is centred and nothing floats free of the grid.

**The Left-Third Rule.** Text-led sections (people, articles, the close) keep the heading in columns 1–4 and the content in 5–12. A new section varies from it only when its content has a shape of its own (a field, an index, a sequence).

**The One Thread Rule.** The page has one thread: a single 1.25px paper line in difference blend, in the margin, with square turns (R = 0). It starts at the instrument's minimum, steps through the method points and ends on the close's blue square. It never runs through content, never curves and is never doubled.

## Elevation & Depth

The system is flat. There are no shadows, no blurs and no tonal surface layers. Depth is conveyed by the hierarchy of lines: a black rule starts a section, a hairline divides within it. There is one inversion: the method section is a full-bleed black sheet with paper type, the only filled surface on the page. Overlaps are few and deliberate: the sticky header; the pinned hero content (z 6) above the thread (z 5), so the thread passes under the instrument's paper-backed panel; the method's thread points (z 7) above the thread; and the fixed consent box (z 40). Each sits on solid paper or black with a rule for an edge. The instrument's 3D view is drawn depth, not interface depth: lines projected in perspective, never shading. The only `box-shadow` values in the build are zero-blur strokes on form fields that thicken a border by 1px on focus or error; they are line weight, not elevation.

### Named Rules
**The Paper Rule.** Everything sits on one sheet. A surface is never lifted, filled or tinted to separate it; draw a rule instead.

**The One Inversion Rule.** The method section is the only surface that changes ground, black edge to edge. It carries paper type, Night Note and Night Body greys, and no second accent. No other section inverts.

**The Honest Instrument Rule.** The instrument shows only what the function computes: real contours, real runs, real readouts. Its depth is projection, not styling: when it tilts, lines rise to their level heights and a faint wireframe appears; no fills, no shading, no lighting.

## Shapes

Every corner is square (0px radius), set explicitly on buttons and fields. Form language is linear: 1px black rules, 1px hairlines, 1px contours, a 1.5px descent path, a 1.25px thread with square turns, 1–1.5px figure lines and 1.5px drawn arrows with square caps. Squares are markers and optima: 5px list markers, the 6px blue error marker, the 12px blue minimum in the instrument, 10-unit blue optimum squares in the figures, and the 12px blue square that ends the thread. Dots are data: 3px-radius iterate dots on the descent path, scatter points and frontier points in the figures, network nodes, and the 11px step points on the thread (1px paper ring, black until lit). The logo's interrupted H is the only interruption motif, and it stays inside the logo.

## Components

### Text link with drawn arrow
Senior and quiet: the only call to action on a page is a text link, not a button.
- **Style:** SemiBold 16px, black, 1px underline offset 0.3em under the text only, followed by a 0.9em drawn arrow (16-unit viewBox, 1.5px square-capped stroke) 0.5em away.
- **Hover (fine pointers only):** colour shifts to Intervention Blue over 180ms (standard ease); the arrow advances 4px over 220ms (ease-out). No bounce, no scale.
- **Focus:** global 2px blue outline, 3px offset.
- **Variant, service cell:** the whole cell of the services field is the link; on hover its 22px title and its 1.1rem arrow turn blue and the arrow advances 4px. Pulse rows do the same without the arrow.

### Underline link (nav and utility)
- **Style:** regular weight, no visible decoration at rest; a 1px underline in the current colour sits ready at 0 width.
- **Hover:** the underline draws in from the left to full width over 240ms (ease-out). Colour does not change.
- **Current page:** underline held at full width (`aria-current="page"`).
- Used for the header and footer nav, the services table of contents, the email address, "Cookie settings" and the article back link.

### Buttons
Reserved for form submission and the consent choice. Never used as a page CTA.
- **Shape:** square corners (0px), 1px border matching the fill.
- **Primary (solid):** black fill, paper text, SemiBold 16px with line-height 1, 48px minimum height, 1.4rem side padding. The submit button carries a drawn arrow at 16px.
- **Ghost:** transparent fill, black text and 1px black border. In the consent box it is 36px high, 1rem side padding, 14px text, and the two buttons share the width equally.
- **Hover (fine pointers only):** fill and border become Intervention Blue, text paper, over 180ms; the submit arrow advances 3px over 220ms.
- **Active:** scales to 0.98 over 140ms (ease-out).
- **Disabled / loading:** 60% opacity, progress cursor; the submit label reads "Sending…".

### Inputs / Fields
- **Style:** labels above in SemiBold 16px. Single-line inputs are a transparent field with only a 1px black bottom rule, 10px vertical padding, regular 16px / 1.4 text, blue caret. The textarea is a full 1px black box, 12px padding, 8rem minimum height, vertical resize only. Helper text sits below in 12px Graphite.
- **Focus:** the rule turns Intervention Blue and thickens to 2px (bottom rule for inputs, all sides for the textarea) over 180ms; no outline glow.
- **Error:** validated on blur and re-checked on input. The field stays black but its rule thickens (inputs: bottom rule to 3px; textarea: box to 2px); the message appears below in 12px SemiBold black, led by a 6px blue square. The first invalid field receives focus on submit.
- **Form error (network):** a 1px black box with 1rem padding, role alert, offering the email address as a fallback.
- **Success:** the form is replaced by a panel that receives focus: a descent strip ending in the blue square, a 42px "Request received." headline, a lead and an arrow link home.

### Navigation
- **Header:** sticky paper bar, 72px, hairline bottom edge. Wordmark (outlined Alfabet SVG, 1.35rem tall) at left, three underline links in the middle, the arrow link "Request a session" at right. Below 60rem the header is static, the wordmark shrinks to 1.15rem, the contact link to 15px and the nav wraps to a full-width row.
- **Footer:** black top rule, wordmark, a one-line description in Graphite, nav and email as underline links, a hairline-ruled 12px legal line with "Cookie settings", then the gradient band.

### Consent box
- **Style:** a compact box fixed bottom-left, 1rem from the edges (respecting safe areas), at most 17.5rem wide, 0.75rem padding, paper background, 1px black border on all sides. One line of 14px copy ("Cookies." in SemiBold, then "Analytics cookies load only if you accept.") above two equal outlined ghost buttons, Accept and Reject, in a two-column grid with a 0.5rem gap.
- **Entry:** fades in and rises 8px over 240ms (ease-out) via `@starting-style`; with reduced motion it only fades (200ms).
- Reopened from the footer's "Cookie settings", which moves focus to the first button.

### Hero instrument (signature)
A live contour map of `f(x, y) = A·(y − B·x²)² + C·(x − X0)² + D·(y − Y0)²` (A 3.2, B 0.55, C 0.9, X0 0.55, D 0.05, Y0 0.15), a curved valley, drawn on one canvas that redraws only on change. Build time computes 13 contour levels (geometric, 0.04 × 1.72^k) and the default run; the same geometry renders as an SVG fallback without JS.
- **Map:** contours as 1px lines at Contour opacity; the descent path as a 1.5px black line; black iterate dots (3px radius) on every n/20-th iterate so strides read long, then short; a 12px blue square at the minimum once the run arrives.
- **Crosshair and readout:** on a fine pointer over the flat map, a 1px crosshair at 0.35 black spans the stage, and a readout follows the cursor 14px away (flipping at the edges): Geist Mono 12px / 1.35, paper backing, 1px black border, 0.25rem 0.375rem padding, two lines, `x` and `y` to three decimals, then `f` to four.
- **Click to descend:** a click on the flat map starts a new run from that point (clamped 15–85% from each edge). The hint below reads "Pick a starting point." and changes to "Descending from your point."; the counter shows `k` and `f(x_k)` live in Geist Mono (12px). Iterations appear at a steady pace over `clamp(400 + n × 9ms, 1600, 4200)`; the shrinking steps are the geometry's own.
- **Autorun:** the default run plays once by itself, 300ms after 35% of the stage is in view.
- **Scroll tilt:** as the visitor scrolls, the map lifts into 3D: each contour rises to its own level height, and a 16 × 16 wireframe mesh (each line sampled 40 times) fades in at up to 0.13 opacity with the tilt. Lines only: no fills, no shading. Constants: lift 0.44 map widths, pitch 0.98 rad (about 56°), yaw −0.3 rad, camera distance 2.6 map widths, the view shrinking by 0.14 and dropping by 0.07 at full tilt so the raised rim stays in frame. Tilt follows `sin(π·p)` through smoothstep, so it rises and settles back to flat: on desktop `p` is progress through the hero's pin; below 60rem it follows the stage's position in the viewport. Crosshair and clicks work only while the map is flat (tilt below 0.04).
- **Panel:** below the stage, on a paper backing that sits above the thread (z 6), a 1px black top rule and 0.625rem of space, then the hint (12px SemiBold) at left, the counter at right, and a full-width line with the formula x_{k+1} = x_k − η∇f(x_k) in the maths face and "Gradient descent. Cauchy, 1847." in 12px Graphite.
- **Reduced motion:** the default run shows complete and still; no pin and no tilt.

### The thread
One line that continues the descent down the page.
- **Style:** a single 1.25px stroke in paper with `mix-blend-mode: difference`, so it reads black on paper and paper on the black method section. Square turns (R = 0); every segment is horizontal or vertical.
- **Route:** from the instrument's minimum (below 60rem, from under the panel) to the hero's bottom at the margin, then into each method step point in turn, then back to the margin at the method's foot, and down to the close's 12px blue square.
- **Draw:** the line extends to 72% of the viewport height as the visitor scrolls. It waits, undrawn, while the hero is pinned. Step points it has passed light up in paper; the last lit point is current, turning blue with a blue ring and scaling to 1.25 (300ms).
- **Reduced motion:** drawn in full, every point lit, the last one current. Without JS the thread is hidden.

### Service and finding figures
Small computed diagrams in lines, on a 320 × 200 viewBox with 18-unit padding, drawn in the current ink. Axes at 0.35 opacity; lead lines at 1.5px; secondary lines at 1.25px and 0.4 opacity.
- **Regression** (measurement): 34 scatter points that settle from a random drift, then a fitted least-squares line.
- **Neural network** (AI & data): a 3-5-5-2 network; faint edges at 0.12, stronger live edges and hollow nodes that fill layer by layer.
- **Response curves** (performance media): three diminishing-returns curves, a tangent where marginal return equals cost, a dotted guide down, and the blue optimum square.
- **Pareto frontier** (strategy): hollow candidates, the non-dominated frontier as a line with dots, and the chosen point in blue.
- **Finding charts:** 24 periods, "Before" at 0.4 opacity, "After" at 1.5px, a dashed cut between them with Before / After labels at 10px, and a hairline-ruled caption (series name, "24 months", and "Illustrative data" in Graphite).
- **Reveal:** each figure plays once when 35% of it is in view (bottom margin −8%). Lines draw in over 900ms ease-out. Regression points settle over 700ms, 18ms apart, then the fit draws at 900ms over 800ms. Response curves draw 160ms apart over 1000ms, the tangent at 700ms over 400ms. Pareto candidates fade over 400ms, 20ms apart; the frontier draws at 500ms over 900ms and its points fade at 700 + 90ms each. Network edges activate 380ms per layer over 520ms, nodes fill at the same beat. Finding "Before" draws over 700ms, "After" at 650ms over 900ms. The blue square fades in last (300ms, at 1000ms; 1150ms on the Pareto figure).
- **Reduced motion or no JS:** figures show complete, nodes filled.

### Method section
- **Style:** full-bleed black, paper type; padding clamp 64→128px above, clamp 32→56px below. The note in 12px Night Note. Each step: a thread point at its top-left corner, `k = n` in 12px Geist Mono in Night Note above it, the two-digit numeral, the step name in Title, the body in Night Body at 28ch, 1.5rem clear of the thread's vertical.
- **Staircase:** four steps across the grid, each set lower than the last.

### Client index
- **Style:** heading cell plus seven logo cells, hairline edges. Logos are sized by optical area (5000px², at most 165px wide, 3.5rem tall), centred, at 0.42 opacity, rising to 1 over 220ms on hover (fine pointers).

### Descent strip
A 120 × 24 miniature (baseline at Contour opacity, six black dots converging, blue square at the end) heads the contact success panel. It no longer appears on the homepage, where the thread's end square closes the page.

### Iteration markers
Process steps on the contact page are indexed as iterations, `k = 1`, `k = 2`…, in the maths face at 14px with an italic k. Service deliverables and article bullets use a 5px black square, 1rem hanging indent.

## Do's and Don'ts

### Do:
- **Do** open every section on a 1px black top rule across the 12 columns, with fluid section spacing between them.
- **Do** keep text-led sections on the left-third frame (heading 1–4, body 5–12) and vary the layout only when content has its own shape: a statement and columns, a ruled field, an index, a staircase.
- **Do** separate items with hairline rules (rgb(0 0 0 / 0.14)) and ruled rows or ruled cells.
- **Do** use Intervention Blue (#3335ff) only for minimum, optimum and current-point squares and dots, and for interaction: hover, focus, selection, caret and field focus, plus the error marker.
- **Do** use Geist Mono only for measured values: the readout's x, y, f and the live k and f(x_k).
- **Do** keep the thread single: one 1.25px paper line in difference blend, square turns, stepping through the method points and ending on the close's blue square.
- **Do** keep the instrument honest: every contour, run and readout is computed from the real function; the 3D view is lines only.
- **Do** make the page's call to action an arrow text link; keep buttons for form submission and consent.
- **Do** keep text to the brand steps: 42px Bold / 1.1 headings, 22px SemiBold / 1.2 subheadings, 16px / 21px body, 12px / 16px notes. The 40→72px display is for the homepage hero only; the 72→160px numerals are for the method only.
- **Do** emphasise with SemiBold (600) weight.
- **Do** keep hover responses to colour shifts, underline draw-ins, a 3–4px arrow advance and the logo opacity lift, at 180–240ms on the standard or ease-out curves, gated to fine pointers.
- **Do** honour `prefers-reduced-motion` by showing every finished state: no pin and no tilt, the thread drawn in full, figures complete, the default run complete, smooth scroll off, the consent box fading only.
- **Do** keep maths motifs real: a computed instrument, true formulas, iteration indices, figures built from actual models.

### Don't:
- **Don't** use cards, filled panels or tinted surfaces to group content. The black method section is the one inversion.
- **Don't** use shadows, glows or blur for depth; a box-shadow may only thicken a field stroke.
- **Don't** round corners. Radius is 0 everywhere; circles are reserved for data points, iterates and thread points.
- **Don't** use colour for emphasis, including blue text for "important" words or grey for emphasis.
- **Don't** use blue for a line, a fill, a series or a label; it only marks a point or answers interaction.
- **Don't** set words, labels or static numbers in Geist Mono.
- **Don't** add a second thread, curved turns, or a thread that runs through content rather than the margin and the step points.
- **Don't** shade, fill or colour the instrument's 3D surface.
- **Don't** place eyebrows, kickers or small labels above headings; the section rule and heading carry the hierarchy.
- **Don't** use the gradient anywhere but the footer band.
- **Don't** add motion beyond the set: the instrument's autorun, runs and tilt, the thread, the figures' one-time draw-in, and the hover responses. No parallax, no looping motion, no easing with overshoot or bounce.
- **Don't** add decorative icons, illustrations or glyph icons; the drawn arrow, the square markers and computed figures are the whole vocabulary.
- **Don't** add a second blue mark in the first viewport; the instrument's minimum square is the only one on screen there.
