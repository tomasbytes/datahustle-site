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
typography:
  display:
    fontFamily: "Schibsted Grotesk, Helvetica Neue, Arial, sans-serif"
    fontSize: "clamp(2.5rem, 1.35rem + 3.9vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
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
  math:
    fontFamily: "KaTeX Main, Cambria Math, STIX Two Math, Times New Roman, serif"
    fontSize: "0.9375rem"
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
    padding: "0 1.4rem"
    height: "2.5rem"
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
  consent-bar:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.black}"
---

# Design System: DataHustle

## Overview

**Creative North Star: "The Redlined Proof"**

The site reads as a business system under expert review. Off-white paper, black type and hairline rules on a strict 12-column grid do all the structural work; nothing is filled, lifted or rounded. Growth is treated as an optimization problem, and the only colour on the page is the reviewer's mark: a small blue square at the point of intervention. The signature is a real gradient-descent drawing (Cauchy, 1847), computed at build time from a curved valley function, whose path draws in once and ends in that blue square.

Density is calm and editorial. Sections open with a full-width black rule and set their heading in the left third, their content in the right two thirds. Lists are ruled rows, never cards. Mathematics appears as notation and diagram, used sparingly (the hero drawing, the `k = 1…n` iteration markers, the closing descent strip), never as decoration for its own sake. This follows PRODUCT.md's binding brand commitments: authoritative, precise, restrained, with mathematical and geometric logic; strict grid; no shadows and no decorative effects; emphasis by SemiBold weight only, never colour.

The system refuses the agency default: hero slogan over a stock image, service cards, logo carousels, gradient CTAs, eyebrow labels above headings.

**Key Characteristics:**
- Off-white paper, black type, hairline rules; one accent colour used as markup, not decoration.
- Strict 12-column grid; section frame of black top rule, heading in columns 1–4, body in 5–12.
- Four-step brand type scale plus one hero display size and a maths face for notation.
- Zero radius, zero fills, zero elevation. Structure comes from rules and alignment.
- One motion signature (the descent path drawing in) and quiet, bounce-free hover responses.
- Small black squares as list and step markers; the blue square is reserved for the minimum.

## Colors

A near-monochrome paper-and-ink palette with a single saturated blue that marks intervention and interaction.

### Primary
- **Intervention Blue** (#3335ff): the brand blue, used only as markup and interaction. Permitted uses, and nothing else: the minimum square at the end of the descent path (hero) and at the end of the closing and "request received" descent strips; the hover colour of arrow links, service-row titles, Pulse titles and prose links; the solid and ghost button hover fill; the 2px focus ring; text selection background; the input caret and input focus underline; the 6px square marker before a field error message; and the start of the footer gradient band.

### Neutral
- **Black** (#000000): all type, the section-frame top rule, form field strokes, the solid button, the descent path and its step marks, list-marker squares.
- **Paper** (#f7f7f7): the page background, the sticky header, the consent bar, the text on solid buttons and selections, and the end stop of the footer gradient.
- **Graphite** (#4a4a4a, token `ink-2`): secondary text only (questions, captions, dates, founder titles, helper notes). 8.6:1 on paper.
- **Hairline Rule** (rgb(0 0 0 / 0.14), token `rule`): structural dividers inside a section: row separators, the client index cells, the header's bottom edge, portrait frames, footer legal rule.
- **Contour** (rgb(0 0 0 / 0.3)): level-set lines in the descent drawing and the baseline of the descent strips.

### Gradient
- **Depth-to-Clarity Band**: `linear-gradient(90deg, #3335ff, #f7f7f7)`, 12px (0.75rem) tall, full width, at the very foot of every page below the footer. It is the only gradient on the site.

### Named Rules
**The Reviewer's Pen Rule.** Blue is markup, not paint. If a blue element is not marking an intervention point, responding to the pointer or keyboard, or flagging an error, it does not exist.

**The One Band Rule.** The gradient appears once per page, as the footer band. Never as a fill, a button, a heading treatment or a section background.

**The Weight-Not-Hue Rule.** Emphasis is SemiBold (600). Colour never carries emphasis; blue appears on hover because the element is interactive, not because it is important.

## Typography

**Display / Body Font:** Schibsted Grotesk (with Helvetica Neue, Arial, sans-serif), self-hosted variable file, weights 400–700. It stands in for the brand face Alfabet, whose demo files are not licensed for web (PRODUCT.md).
**Math Font:** KaTeX Main (roman) and KaTeX Math (italic), with Cambria Math, STIX Two Math, Times New Roman as fallbacks. Used only for mathematical notation.

**Character:** A tight, confident grotesk set with negative tracking at large sizes, paired with a textbook maths serif that appears only where there is an actual formula or index.

### Hierarchy
- **Display** (700, clamp 40→72px, 1.02, −0.03em): the homepage hero headline only, set as two balanced lines. Reaches 72px at about 1290px viewport width.
- **Headline** (700, 42px with a 36px floor on phones, 1.1, −0.02em): every section heading (`.h`) and the "Request received" state. The brand's Heading step.
- **Title** (600, 22px, 1.2, −0.01em): subheadings (`.sub`): service names, step names, finding sectors, founder names, post titles, position statement. Structures without competing with headlines.
- **Body** (400, 16px / 21px): all running text, nav, links and buttons (buttons set at 600, line-height 1). Measure capped at 30rem for leads, 26–38ch for column text, 60ch for post descriptions.
- **Label / Notes** (400, 12px / 16px, +0.01em): margin notes, captions, dates, dt labels (Challenge / Intervention / Outcome), helper text, field errors (at 600), footer legal line.
- **Math** (400, 15px for the hero formula; 14px for `k = n` step indices): notation only. Variables in KaTeX Math italic; subscripts at 0.7em with zero line-height.

Two surface-specific sizes exist outside the scale and are recorded as they ship, not as rules to extend: inner-page titles (PageHead) at clamp 40→64px, 700, 1.04; Pulse article titles at clamp 32→42px with a 20px standfirst and 17px / 1.55 article prose.

### Named Rules
**The Four Steps Rule.** Outside the hero, text uses the brand's four steps (42 / 22 / 16 / 12). The 72px display belongs to the homepage hero alone.

**The Notation Rule.** The maths face appears only on real notation: a formula, an iteration index, a variable. Never on words.

## Layout

A strict 12-column grid (`repeat(12, minmax(0, 1fr))`) inside a centred wrapper of 90rem (1440px) maximum, with fluid side gutters of clamp 20→64px and column gaps of clamp 16→24px.

**Section frame.** Each section is separated by fluid vertical space (clamp 72→144px), then a full-width 1px black top rule across the grid, with 20px (1.25rem) of space under it. The heading sits in columns 1–4 (with a gap's worth of right padding), the body in columns 5–12. Below 60rem both span the full width and the heading gains 2.5rem below it.

**First viewport.** Hero text in columns 1–6 (display headline, 16px lead capped at 30rem, arrow link, 1.75rem apart), the descent drawing as a square in columns 7–12. The row fills the viewport minus the 72px header. Below 60rem the drawing stacks under the text, capped at 36rem wide and centred.

**Internal structure.** Content inside a section is ruled rows separated by hairline rules (services, findings, Pulse posts), a ruled cell index (clients: 4 columns at 16:9, 2 columns at 3:2 on tablet and phone), or plain columns (method steps 4 → 2 → 1; founders 2 → 1; position text 2 → 1). Row padding is 1.5rem top, 1.75rem bottom.

**Header and footer.** The header is a sticky 72px bar on the same 12 columns (wordmark 1–3, nav 7–10, contact link 11–12), with a hairline bottom edge; below 60rem it becomes static and wraps the nav onto its own line. The footer opens with a black top rule and uses columns 1–3 / 5–7 / 9–10 / 11–12, then a hairline legal line, then the gradient band.

**Breakpoints.** 60rem (960px): single-column section frame, stacked hero, static header. 40rem (640px): single-column rows, steps, findings, founders and posts.

### Named Rules
**The Left-Third Rule.** A section's heading lives in columns 1–4 and its content in 5–12. New sections take the same frame rather than inventing a centred or full-bleed layout.

## Elevation & Depth

The system is entirely flat. There are no shadows, no tonal surface layers, no blurs and no overlaps beyond the sticky header and fixed consent bar, both of which sit on solid paper with a rule for an edge. Depth is conveyed only by the hierarchy of lines: a black rule starts a section, a hairline divides within it. The only `box-shadow` values in the build are zero-blur, zero-offset-spread strokes on form fields used to thicken a border by 1px on focus or error; they are line weight, not elevation.

### Named Rules
**The Paper Rule.** Everything sits on one sheet. A surface is never lifted, filled or tinted to separate it; draw a rule instead.

## Shapes

Every corner is square (0px radius), set explicitly on buttons and fields. Form language is linear: 1px black rules, 1px hairlines, 1px-stroke contours, a 1.5px descent path and 1.5px drawn arrows with square caps. Recurring geometry is the small solid square: 5px list markers, 7px step markers, the 6px blue error marker, and the 18px (in a 1000-unit drawing) blue minimum square. Round marks appear in exactly one place: the 4.5-unit black dots that mark each iterate along a descent path. The logo's interrupted H is the only interruption motif, and it stays inside the logo.

## Components

### Text link with drawn arrow
Senior and quiet: the only call to action on a page is a text link, not a button.
- **Style:** SemiBold 16px, black, 1px underline offset 0.3em under the text only, followed by a 0.9em drawn arrow (16-unit viewBox, 1.5px square-capped stroke) 0.5em away.
- **Hover (fine pointers only):** colour shifts to Intervention Blue over 180ms (standard ease); the arrow advances 4px over 220ms (ease-out). No bounce, no scale.
- **Focus:** global 2px blue outline, 3px offset.
- **Variant, service row:** an entire ruled row is the link; on hover its 22px title and its 20px arrow turn blue and the arrow advances 4px. Pulse rows do the same without the arrow.

### Underline link (nav and utility)
- **Style:** regular weight, no visible decoration at rest; a 1px underline in the current colour sits ready at 0 width.
- **Hover:** the underline draws in from the left to full width over 240ms (ease-out). Colour does not change.
- **Current page:** underline held at full width (`aria-current="page"`).
- Used for the header and footer nav, the services table of contents, the email address, "Cookie settings" and the article back link.

### Buttons
Reserved for form submission and the consent choice. Never used as a page CTA.
- **Shape:** square corners (0px), 1px border matching the fill.
- **Primary (solid):** black fill, paper text, SemiBold 16px with line-height 1, 48px minimum height, 1.4rem side padding. The submit button carries a drawn arrow at 16px.
- **Ghost:** transparent fill, black text and 1px black border; 40px high and at least 6.5rem wide in the consent bar.
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

### Consent bar
- **Style:** fixed to the bottom edge, paper background, 1px black top rule, the body copy on the left ("Cookies." in SemiBold) and two equal ghost buttons (Accept, Reject) on the right. Below 40rem it stacks and the buttons share the width.
- **Entry:** slides up from 100% and fades in over 240ms (ease-out) via `@starting-style`; with reduced motion it only fades (200ms).
- Reopened from the footer's "Cookie settings", which moves focus to the first button.

### Descent drawing (signature)
The hero figure is a square SVG (1000-unit viewBox) built at build time from `f(x, y) = A·(y − B·x²)² + C·(x − X0)² + D·(y − Y0)²`, a curved valley. It shows 13 contour level sets (geometric thresholds 0.04 × 1.72^k) as 1px lines at Contour opacity, the true steepest-descent path from a start near the top-left edge as a 1.5px black line, about 22 black iterate dots (long strides on the slope, bunching near the minimum), a blue square at the minimum, a 1px leader line down to a margin note, and the note itself: the formula x_{k+1} = x_k − η∇f(x_k) in the maths face above "Gradient descent. Cauchy, 1847." in 12px Graphite, on a paper backing.
- **Draw-in:** after a 400ms delay the path draws over 3200ms on `cubic-bezier(0.3, 0, 0.2, 1)`. Each dot fades and scales in from 0.6 over 260ms at the exact moment the line reaches it (the curve is inverted at build time to time each mark). The blue square scales in from 0.8 over 420ms, 80ms after the path completes; the leader and caption fade in over 400ms, 200ms after that. It runs once.
- **Waits for visibility:** if the figure's top is below 60% of the viewport on load (phones, where it sits under the text), the animation is paused until 40% of the figure is in view. Without IntersectionObserver or JS it simply plays on load.
- **Reduced motion:** everything renders in its final state with no animation.
- **Descent strip:** a 120×24 miniature (baseline at Contour opacity, six black dots converging, blue square at the end) closes the homepage (columns 1–4, hidden below 60rem) and heads the contact success panel.

### Iteration markers
Method and process steps are indexed as iterations, `k = 1`, `k = 2`…, in the maths face at 14px with an italic k, led by a 7px black square. Service deliverables and article bullets use a 5px black square, 1rem hanging indent.

## Do's and Don'ts

### Do:
- **Do** build every section on the frame: 1px black top rule, heading in columns 1–4, body in 5–12, fluid section spacing between frames.
- **Do** separate items with hairline rules (rgb(0 0 0 / 0.14)) and ruled rows or ruled cells.
- **Do** use Intervention Blue (#3335ff) only for the minimum square, link and button hover, focus ring, selection, caret and field focus, and the error marker.
- **Do** make the page's call to action an arrow text link; keep buttons for form submission and consent.
- **Do** keep text to the brand steps: 42px Bold / 1.1 headings, 22px SemiBold / 1.2 subheadings, 16px / 21px body, 12px / 16px notes. The 40→72px display is for the homepage hero only.
- **Do** emphasise with SemiBold (600) weight.
- **Do** keep hover responses to colour shifts, underline draw-ins and a 3–4px arrow advance, at 180–240ms on the standard or ease-out curves, gated to fine pointers.
- **Do** honour `prefers-reduced-motion`: the descent drawing renders complete, smooth scroll turns off, the consent bar only fades.
- **Do** keep maths motifs real and sparse: a computed drawing, a true formula, iteration indices, the descent strip as a closing divider.

### Don't:
- **Don't** use cards, filled panels or tinted surfaces to group content.
- **Don't** use shadows, glows or blur for depth; a box-shadow may only thicken a field stroke.
- **Don't** round corners. Radius is 0 everywhere.
- **Don't** use colour for emphasis, including blue text for "important" words or grey for emphasis.
- **Don't** place eyebrows, kickers or small labels above headings; the section rule and heading carry the hierarchy.
- **Don't** use the gradient anywhere but the footer band.
- **Don't** add a second animated signature, scroll-triggered reveals, parallax or any easing with overshoot or bounce.
- **Don't** add decorative icons, illustrations or glyph icons; the drawn arrow and the square markers are the whole vocabulary.
- **Don't** add a second blue mark in the first viewport; the minimum square is the only one on screen there.
