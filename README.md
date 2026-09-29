# Engineered to Evolve

Portfolio site — *from physical systems to intelligent systems*. Next.js (App Router, JavaScript), Tailwind CSS v4, Motion, and hand-built SVG. Exported as a static site for GitHub Pages.

```bash
npm run dev     # http://localhost:3000
npm run build   # static export to ./out
```

## Editing content

All personal content lives in `content/`. Any value wrapped in `[square brackets]` is a **placeholder**: it renders in a dashed "unfilled" style and is never linked. Replace it and it renders normally.

| File | What it holds |
| --- | --- |
| `content/site.js` | Name, role, intro, email, links, navigation |
| `content/identity.js` | The three career phases (physical → data → intelligent systems) |
| `content/projects.js` | Case studies (`/projects/[slug]/`): contributions, how it works, documented results with sources, system diagrams |
| `content/capabilities.js` | Evidence map: each technology × where it was documented as used |
| `content/timeline.js` | Education, roles, milestones (`phase` drives the visual) |
| `content/beyond.js` | Portrait, interests, personal projects, philosophy, contact statement |

Only add results and metrics you can stand behind.

## Adding engineering assets (CAD renders, drawings)

The mechanical case study (`excavator-prototype-engineering` in `content/projects.js`) has a `media` block with empty slots. Until files are added, each slot renders as a labeled frame, never as stand-in imagery.

1. Put exported files in `public/work/mechanical/`. Use WebP or PNG at about 1600–2400 px wide. Only use material cleared for public sharing, since client work may be confidential.
2. Set `src` (e.g. `/work/mechanical/assembly-render.webp`), plus `width`, `height`, `alt` and `caption`.
3. Optionally add callouts: `annotations: [{ x: 42, y: 30, label: "Boom pivot", note: "…" }]`, where `x` and `y` are percentages of the image.
4. For the drawing vs. render slider, set `media.compare.drawing` and `media.compare.render` to two images with **identical framing**.

Once `media.primary.src` is set, that render automatically replaces the line illustration on the project card and at the top of the case study.

**3D viewer.** The rotatable exploded assembly is currently a demonstration model drawn in SVG. When a `.glb` export of one of Ram's models is available, set `media.model` and add a React Three Fiber viewer (`three`, `@react-three/fiber`, `@react-three/drei`). Those packages are deliberately not installed until a real model justifies them. The hero's first act can then trace a line export of the same part.

## Structure

```
app/                 routes, metadata, sitemap/robots, /og.png
components/
  system/            design-system primitives (Text, SectionHeading, ActionLink, Reveal)
  layout/            Header, Footer
  hero/              intro sequence (HeroVisual) + technical drawings
  sections/          homepage sections
  projects/          project illustrations
  interactive/       ExplodedAssembly, SystemDiagram, BlueprintCompare, Workbench, Cursor
content/             structured personal content
lib/                 motion tokens, 3D projection math, content helpers
```

Design tokens (color, type, spacing, motion) are defined in `app/globals.css` under `@theme`; JS motion curves mirror them in `lib/motion.js`.

## Motion and accessibility

- The hero intro plays once per session, only on a direct visit to `/`. It can be skipped with the button or <kbd>Esc</kbd>, and never plays under `prefers-reduced-motion`.
- Every interactive diagram works by keyboard and touch, with visible controls for each pointer gesture.
- The context cursor only appears for fine pointers with motion allowed, and never replaces the native cursor.

## Deploying

`.github/workflows/deploy.yml` builds and publishes `out/` on every push to `main`. In the repository settings, set **Pages → Source** to **GitHub Actions**.
