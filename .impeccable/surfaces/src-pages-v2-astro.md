---
version: 1
slug: "src-pages-v2-astro"
primary_target: "src/pages/v2.astro"
related_targets: []
---

# Homepage v2: The Descent

## Scope and mode
/v2, a bolder alternative to the homepage (v1 stays at /). Mode: Persuade, in an experience-led register. It is noindex while it is compared.

## Decisions pinned by the user
- Concept: the site is a gradient descent. The visitor starts in brand blue (complexity) and scrolls down to off-white (clarity), following the brand gradient.
- First screen: full-bleed #3335FF. A live WebGL loss landscape (off-white wireframe, slowly breathing). Thousands of particles flow down the real gradient field; the cursor pushes them aside and a click drops a burst. A huge off-white headline. A monospace readout of k, f(x) and |∇f|. A custom crosshair cursor with coordinates across the site.
- Scrollytelling: the camera descends toward the global minimum while the background moves blue → off-white.
- The H interruption is the transition device: a blue vertical cut slicing between sections.
- Service toys: signal/noise slider; neural net with hover flow; 3-channel budget allocator with the optimum in blue; draggable Pareto frontier that snaps.
- How we work: horizontal scroll, k = 1…4 as steps down a path.
- Clients: a constellation that forms a grid on arrival.
- Findings: before/after charts drawn in, marked [TO CONFIRM].
- Contact: a numbered brief. Each completed field moves a point down a descent curve; on submit it reaches the minimum and turns blue.
- Colours: only black, off-white, brand blue and the blue→off-white gradient. No shadows, glows or glass. Precise motion with no bounce.

## Direction contract
THESIS: The page performs gradient descent on the visitor: from the blue complexity of a live loss landscape down to the off-white clarity where the offer and the form live. It refuses the agency default of a static hero with sections underneath.
OWN-WORLD: Brand blue field, off-white hairline wireframe and particle strokes, Schibsted Grotesk display, Geist Mono for measured values, KaTeX maths for notation. The only interpolated colours come from the blue→off-white gradient; there are no fills beyond it. The H cut (a blue vertical bar through a gap in the rule) is the sole transition device.
STORY: Complexity (blue, the terrain) → the problem statement → the descent → clarity (off-white) → proof toys → method → clients → findings → the brief form reaching its minimum.
FIRST VIEWPORT: Full-bleed blue. The terrain fills the viewport behind everything, with particles flowing. The headline sits bottom-left at 64–120px in off-white. The readout is top-right under the header, in mono. The CTA is a text link under the headline. The crosshair follows the pointer.
FORM: The Descent (user-authored concept, extending the Redline world with the gradient signature). Seed key 57dd86bf (degraded roll). Code-led build.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
