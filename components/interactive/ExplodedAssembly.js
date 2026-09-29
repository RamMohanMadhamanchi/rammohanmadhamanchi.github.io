"use client";

import { useId, useMemo, useRef, useState } from "react";
import { projectPlate, projectTube, rotate, toPoints } from "@/lib/projection";
import { cx } from "@/lib/content";

/**
 * Interactive exploded view of a hydraulic excavator: undercarriage, upper
 * structure and the front attachment (boom, stick, bucket, linkage,
 * hydraulic cylinders and joint pins).
 * A generic demonstration model — not the L&T prototype or any specific machine.
 *
 * Pointer: drag to rotate, click a part to select it.
 * Keyboard: focus the viewport, arrows rotate, + / − explode, Esc clears.
 * Every action also has a visible button or slider.
 *
 * Geometry is built from two primitives (lib/projection.js):
 *   plates — a [z, y] side profile extruded across x (boom, cab, tracks…)
 *   tubes  — cylinders between two 3D points (pins, rollers, hydraulic rams)
 * World axes: x across the machine, y up, z forward. Each part explodes along
 * its own [dx, dy, dz] vector; pins slide out sideways from their joints.
 */

// ─── Geometry helpers ──────────────────────────────────────────────

/** A thick bar along a polyline of [z, y] points, with rounded pin bosses at each end. */
function bar(points, half, capSegments = 6) {
  const norm = ([a, b]) => {
    const l = Math.hypot(a, b) || 1;
    return [a / l, b / l];
  };
  const segNormal = (p, q) => {
    const [dz, dy] = norm([q[0] - p[0], q[1] - p[1]]);
    return [-dy, dz];
  };
  const left = [];
  const right = [];
  points.forEach((p, i) => {
    let n;
    if (i === 0) n = segNormal(p, points[1]);
    else if (i === points.length - 1) n = segNormal(points[i - 1], p);
    else {
      const n1 = segNormal(points[i - 1], p);
      const n2 = segNormal(p, points[i + 1]);
      const m = norm([n1[0] + n2[0], n1[1] + n2[1]]);
      const scale = 1 / Math.max(0.35, m[0] * n1[0] + m[1] * n1[1]);
      n = [m[0] * scale, m[1] * scale];
    }
    left.push([p[0] + n[0] * half, p[1] + n[1] * half]);
    right.push([p[0] - n[0] * half, p[1] - n[1] * half]);
  });
  const arc = (c, from, sweep) => {
    const out = [];
    for (let k = 1; k < capSegments; k += 1) {
      const t = from + (sweep * k) / capSegments;
      out.push([c[0] + Math.cos(t) * half, c[1] + Math.sin(t) * half]);
    }
    return out;
  };
  // Round each end: sweep half a turn from one edge to the other, around the outside.
  const angleFrom = (c, p) => Math.atan2(p[1] - c[1], p[0] - c[0]);
  const first = points[0];
  const last = points[points.length - 1];
  const endCap = arc(last, angleFrom(last, left[left.length - 1]), -Math.PI);
  const startCap = arc(first, angleFrom(first, right[0]), -Math.PI);
  return [...left, ...endCap, ...right.reverse(), ...startCap];
}

/** A rounded track frame (stadium) from z0 to z1 around height yc. */
function stadium(z0, z1, yc, r, seg = 8) {
  const pts = [];
  for (let k = 0; k <= seg; k += 1) {
    const t = -Math.PI / 2 + (Math.PI * k) / seg;
    pts.push([z1 - r + Math.cos(t) * r, yc + Math.sin(t) * r]);
  }
  for (let k = 0; k <= seg; k += 1) {
    const t = Math.PI / 2 + (Math.PI * k) / seg;
    pts.push([z0 + r + Math.cos(t) * r, yc + Math.sin(t) * r]);
  }
  return pts;
}

/** A hydraulic cylinder from a to b ([z, y]) at lateral position x: barrel then rod. */
const ram = (a, b, x, barrel, rod, split = 0.56) => {
  const m = [a[0] + (b[0] - a[0]) * split, a[1] + (b[1] - a[1]) * split];
  return [
    { tube: [[x, a[1], a[0]], [x, m[1], m[0]]], r: barrel },
    { tube: [[x, m[1], m[0]], [x, b[1], b[0]]], r: rod, tone: "bright" },
  ];
};

/** Rollers / sprockets across a track at lateral span [x0, x1]. */
const wheels = (x0, x1, list) => list.map(([z, y, r]) => ({ tube: [[x0, y, z], [x1, y, z]], r, tone: "dark" }));

// ─── Joint positions ([z, y]) ──────────────────────────────────────

const J = {
  boomFoot: [30, -28],
  boomKnee: [95, 78],
  boomTip: [170, 45],
  stickTail: [159, 73],
  bucketPivot: [212, -62],
  boomRamBase: [40, -44],
  boomRamEnd: [84, 44],
  stickRamBase: [102, 92],
  bucketRamBase: [190, 28],
  link: [217, -42],
  linkToStick: [207, -48],
  linkToBucket: [229, -56],
};

// Scene centre, so the machine sits in the middle of the viewport.
const CENTER = { y: -8, z: 62 };

const GROUPS = {
  attachment: "Front attachment",
  upper: "Upper structure",
  under: "Undercarriage",
};

const PARTS = [
  // ─── Front attachment ───
  {
    id: "bucket",
    group: "attachment",
    name: "Bucket",
    fn: "Digs and carries material. Replaceable teeth on the lip take the wear.",
    interface: "Pinned to the stick tip and driven through the bucket linkage.",
    explode: [0, 40, 88],
    anchor: [224, -84],
    shapes: [
      {
        profile: [
          [207, -56], [224, -54], [240, -70], [245, -92], [238, -108], [231, -110], [229, -118],
          [225, -111], [220, -119], [216, -112], [211, -119], [208, -111], [200, -103], [199, -80],
        ],
        x: [-15, 15],
      },
    ],
  },
  {
    id: "stick",
    group: "attachment",
    name: "Stick (arm)",
    fn: "Extends the reach and sets the digging depth.",
    interface: "Pinned to the boom tip; carries the bucket and bucket cylinder.",
    explode: [0, 72, 60],
    anchor: [190, -8],
    shapes: [{ profile: bar([J.stickTail, J.boomTip, J.bucketPivot], 6.5), x: [-6, 6] }],
  },
  {
    id: "boom",
    group: "attachment",
    name: "Boom",
    fn: "The main lifting arm. Its bent shape clears the machine while lifting high.",
    interface: "Pinned to the upper structure at the foot; raised by the boom cylinders.",
    explode: [0, 62, 18],
    anchor: [95, 78],
    shapes: [{ profile: bar([J.boomFoot, J.boomKnee, J.boomTip], 8.5), x: [-8, 8] }],
  },
  {
    id: "linkage",
    group: "attachment",
    name: "Bucket linkage",
    fn: "Converts the bucket cylinder's stroke into a wide bucket rotation.",
    interface: "Joins the bucket cylinder, stick and bucket.",
    explode: [0, 50, 84],
    anchor: J.link,
    shapes: [{ profile: bar([J.linkToStick, J.link, J.linkToBucket], 3.5), x: [-10, 10] }],
  },
  {
    id: "boom-rams",
    group: "attachment",
    name: "Boom cylinders",
    fn: "A pair of hydraulic cylinders that raise and lower the boom.",
    interface: "Pinned between the upper structure and the underside of the boom.",
    explode: [0, 42, 4],
    anchor: [62, 0],
    shapes: [...ram(J.boomRamBase, J.boomRamEnd, -13, 5.2, 2.6), ...ram(J.boomRamBase, J.boomRamEnd, 13, 5.2, 2.6)],
  },
  {
    id: "stick-ram",
    group: "attachment",
    name: "Stick cylinder",
    fn: "Pulls the stick in and pushes it out to control reach.",
    interface: "Pinned between the top of the boom and the stick tail.",
    explode: [0, 108, 40],
    anchor: [130, 82],
    shapes: ram(J.stickRamBase, J.stickTail, 0, 5, 2.5),
  },
  {
    id: "bucket-ram",
    group: "attachment",
    name: "Bucket cylinder",
    fn: "Curls and opens the bucket through the linkage.",
    interface: "Pinned between the stick and the bucket linkage.",
    explode: [0, 72, 74],
    anchor: [203, -6],
    shapes: ram(J.bucketRamBase, J.link, 0, 4.2, 2.1),
  },
  {
    id: "pins",
    group: "attachment",
    name: "Joint pins",
    fn: "Hardened pins that every joint in the front attachment pivots on.",
    interface: "Run in bushings; each pin slides out sideways for service.",
    explode: null, // follows the part at each joint, plus a sideways pull
    anchor: J.boomTip,
    shapes: [
      ["boom", J.boomFoot],
      ["boom-rams", J.boomRamBase],
      ["boom-rams", J.boomRamEnd],
      ["stick-ram", J.stickRamBase],
      ["stick", J.boomTip],
      ["stick-ram", J.stickTail],
      ["bucket-ram", J.bucketRamBase],
      ["linkage", J.link],
      ["bucket", J.bucketPivot],
      ["bucket", J.linkToBucket],
    ].map(([follow, [z, y]]) => ({ tube: [[-12, y, z], [12, y, z]], r: 3, follow, tone: "bright" })),
  },
  // ─── Upper structure ───
  {
    id: "cab",
    group: "upper",
    name: "Cab",
    fn: "The operator's station, with all-round glazing for visibility.",
    interface: "Mounted on the upper structure beside the boom foot.",
    explode: [-52, 50, 0],
    anchor: [26, 0],
    shapes: [
      {
        profile: [[8, -32], [46, -32], [46, 4], [36, 26], [8, 26]],
        x: [-38, -8],
        details: [[[13, -12], [40, -12], [40, 3], [32, 20], [13, 20]]],
      },
    ],
  },
  {
    id: "house",
    group: "upper",
    name: "Upper structure",
    fn: "Carries the engine, hydraulics, cab and front attachment, and swings on the slew ring.",
    interface: "Bolted to the slew ring; the boom and boom cylinders pin to its front.",
    explode: [0, 32, 0],
    anchor: [-30, -42],
    shapes: [
      {
        profile: [[-95, -60], [48, -60], [48, -32], [12, -32], [6, -24], [-95, -24]],
        x: [-38, 38],
        details: [[[-82, -52], [-40, -52], [-40, -44], [-82, -44]]],
      },
    ],
  },
  {
    id: "counterweight",
    group: "upper",
    name: "Counterweight",
    fn: "Balances the load on the bucket so the machine doesn't tip forward.",
    interface: "Bolted to the rear of the upper structure.",
    explode: [0, 34, -55],
    anchor: [-110, -38],
    shapes: [{ profile: [[-122, -56], [-95, -56], [-95, -20], [-114, -20], [-124, -34]], x: [-38, 38] }],
  },
  {
    id: "slew",
    group: "upper",
    name: "Slew ring",
    fn: "A large bearing that lets the whole upper structure swing through 360°.",
    interface: "Between the upper structure and the undercarriage.",
    explode: [0, 12, 0],
    anchor: [-20, -64],
    shapes: [{ tube: [[0, -66, -20], [0, -60, -20]], r: 36 }],
  },
  // ─── Undercarriage ───
  {
    id: "track-l",
    group: "under",
    name: "Track — left",
    fn: "Spreads the machine's weight and drives it over rough ground.",
    interface: "Frame welded to the car body; driven by the rear sprocket.",
    explode: [-46, -14, 0],
    anchor: [-20, -84],
    shapes: [
      { profile: stadium(-108, 66, -84, 16), x: [-62, -42] },
      ...wheels(-64, -40, [[-92, -84, 12], [50, -84, 12], [-58, -95, 5], [-28, -95, 5], [2, -95, 5], [32, -95, 5]]),
    ],
  },
  {
    id: "track-r",
    group: "under",
    name: "Track — right",
    fn: "Spreads the machine's weight and drives it over rough ground.",
    interface: "Frame welded to the car body; driven by the rear sprocket.",
    explode: [46, -14, 0],
    anchor: [-20, -84],
    shapes: [
      { profile: stadium(-108, 66, -84, 16), x: [42, 62] },
      ...wheels(40, 64, [[-92, -84, 12], [50, -84, 12], [-58, -95, 5], [-28, -95, 5], [2, -95, 5], [32, -95, 5]]),
    ],
  },
];

const byId = Object.fromEntries(PARTS.map((p) => [p.id, p]));
const PIN_PULL = [-70, 0, 0];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
// Server (Node) and browser math can differ in the last floating-point digit,
// which React reports as a hydration mismatch — so round before rendering.
const n2 = (v) => v.toFixed(2);
const pt = ([x, y]) => `${n2(x)} ${n2(y)}`;
const DEFAULT = { yaw: 62, pitch: 14, explode: 0.45 };

/** World offset of a shape at the current explode amount. */
function offsetOf(part, shape, e) {
  const base = part.explode ?? byId[shape.follow].explode;
  const pull = part.explode ? [0, 0, 0] : PIN_PULL;
  return [(base[0] + pull[0]) * e, (base[1] + pull[1]) * e - CENTER.y, (base[2] + pull[2]) * e - CENTER.z];
}

const TONES = {
  dark: "rgb(30 34 34)",
  bright: "rgb(150 158 154)",
};

export function ExplodedAssembly({ className }) {
  const [yaw, setYaw] = useState(DEFAULT.yaw);
  const [pitch, setPitch] = useState(DEFAULT.pitch);
  const [explode, setExplode] = useState(DEFAULT.explode);
  const [selected, setSelected] = useState("boom");
  const drag = useRef(null);
  const ids = useId();

  const items = useMemo(() => {
    // Sort mainly by how near each part's side-to-side layer is to the viewer,
    // then by overall depth — robust for large overlapping plates.
    const layer = (x) => rotate([x, 0, 0], yaw, pitch)[2];
    const list = [];
    PARTS.forEach((part) => {
      part.shapes.forEach((shape, si) => {
        const [dx, dy, dz] = offsetOf(part, shape, explode);
        if (shape.profile) {
          const geo = projectPlate(shape.profile, shape.x[0], shape.x[1], [dx, dy, dz], yaw, pitch);
          list.push({
            key: `${part.id}-${si}`,
            kind: "plate",
            part,
            shape,
            geo,
            sort: layer((shape.x[0] + shape.x[1]) / 2 + dx) + geo.depth * 0.02,
          });
        } else {
          const [p0, p1] = shape.tube.map(([x, y, z]) => [x + dx, y + dy, z + dz]);
          const geo = projectTube(p0, p1, shape.r, yaw, pitch);
          const nearX = layer(p0[0]) > layer(p1[0]) ? p0[0] : p1[0];
          list.push({ key: `${part.id}-${si}`, kind: "tube", part, shape, geo, sort: layer(nearX) + geo.depth * 0.02 });
        }
      });
    });
    return list.sort((a, b) => a.sort - b.sort);
  }, [yaw, pitch, explode]);

  const active = PARTS.find((p) => p.id === selected);
  const anchor = useMemo(() => {
    if (!active) return null;
    const [dx, dy, dz] = offsetOf(active, active.shapes[0], explode);
    const p = rotate([dx, active.anchor[1] + dy, active.anchor[0] + dz], yaw, pitch);
    return { x: p[0], y: -p[1] };
  }, [active, explode, yaw, pitch]);

  const rotateBy = (dy, dp) => {
    setYaw((v) => ((v + dy + 540) % 360) - 180);
    setPitch((v) => clamp(v + dp, -80, 80));
  };

  const onPointerDown = (event) => {
    drag.current = { x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) drag.current.moved = true;
    drag.current.x = event.clientX;
    drag.current.y = event.clientY;
    rotateBy(dx * 0.5, -dy * 0.4);
  };
  const onPointerUp = (event) => {
    const wasDrag = drag.current?.moved;
    drag.current = null;
    if (!wasDrag) {
      const target = event.target.closest?.("[data-part]");
      if (target) setSelected(target.getAttribute("data-part"));
    }
  };

  const onKeyDown = (event) => {
    const map = {
      ArrowLeft: () => rotateBy(-6, 0),
      ArrowRight: () => rotateBy(6, 0),
      ArrowUp: () => rotateBy(0, 6),
      ArrowDown: () => rotateBy(0, -6),
      "+": () => setExplode((v) => clamp(v + 0.1, 0, 1)),
      "=": () => setExplode((v) => clamp(v + 0.1, 0, 1)),
      "-": () => setExplode((v) => clamp(v - 0.1, 0, 1)),
      Escape: () => setSelected(null),
    };
    if (map[event.key]) {
      event.preventDefault();
      map[event.key]();
    }
  };

  const labelSide = anchor && anchor.x > 0 ? -1 : 1;
  const grey = (shade, isSel) =>
    isSel
      ? `rgb(${Math.round(40 + 60 * shade)} ${Math.round(90 + 90 * shade)} ${Math.round(66 + 60 * shade)})`
      : `rgb(${Math.round(34 + 70 * shade)} ${Math.round(38 + 72 * shade)} ${Math.round(38 + 70 * shade)})`;

  return (
    <div className={cx("grid gap-px bg-line lg:grid-cols-[1fr_20rem]", className)}>
      <div className="relative bg-graphite-900">
        <div className="label flex flex-wrap items-baseline justify-between gap-x-4 border-b border-line px-4 py-3 text-steel-500">
          <span>Fig. — Exploded hydraulic excavator</span>
          <span className="font-sans text-xs normal-case tracking-normal text-steel-500">
            Generic demonstration model
          </span>
        </div>

        <svg
          viewBox="-250 -180 500 360"
          className="block aspect-[4/3] w-full cursor-grab touch-none select-none active:cursor-grabbing sm:aspect-[16/10]"
          role="application"
          aria-roledescription="3D viewport"
          aria-label="Exploded hydraulic excavator. Use arrow keys to rotate, plus and minus to explode, and the part list to select parts."
          aria-describedby={`${ids}-status`}
          tabIndex={0}
          data-cursor="Drag to rotate"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (drag.current = null)}
          onKeyDown={onKeyDown}
        >
          {/* ground line */}
          <g aria-hidden="true" opacity="0.5">
            {[-160, -80, 0, 80, 160].map((x) => (
              <line key={x} x1={x} y1="-175" x2={x} y2="175" stroke="var(--color-line)" />
            ))}
          </g>

          {items.map(({ key, kind, part, shape, geo }) => {
            const isSel = part.id === selected;
            const stroke = isSel ? "var(--color-signal)" : "var(--color-steel-300)";
            const common = {
              "data-part": part.id,
              stroke,
              strokeWidth: isSel ? 1.1 : 0.8,
              strokeLinejoin: "round",
            };

            if (kind === "plate") {
              return (
                <g key={key} {...common}>
                  {geo.sides.map((side, i) => (
                    <polygon key={i} points={toPoints(side.pts)} fill={grey(side.shade * 0.8, isSel)} />
                  ))}
                  <polygon points={toPoints(geo.cap)} fill={grey(geo.capShade, isSel)} />
                  {shape.details?.map((d, i) => (
                    <polygon key={`d${i}`} points={toPoints(geo.onCap(d))} fill="var(--color-ink)" strokeOpacity="0.6" />
                  ))}
                </g>
              );
            }

            const front = geo.frontIsB ? geo.B : geo.A;
            const back = geo.frontIsB ? geo.A : geo.B;
            const ell = (c) => ({
              cx: n2(c.x),
              cy: n2(c.y),
              rx: n2(geo.minor),
              ry: n2(geo.r),
              transform: `rotate(${n2(geo.angle)} ${n2(c.x)} ${n2(c.y)})`,
            });
            const body = isSel ? grey(0.6, true) : TONES[shape.tone] ?? grey(geo.shade, false);
            return (
              <g key={key} {...common}>
                <ellipse {...ell(back)} fill={body} />
                <polygon points={toPoints(geo.outline)} fill={body} strokeWidth="0" />
                <path
                  d={`M${pt(geo.outline[0])}L${pt(geo.outline[1])}M${pt(geo.outline[2])}L${pt(geo.outline[3])}`}
                  fill="none"
                />
                <ellipse {...ell(front)} fill={isSel ? grey(0.8, true) : grey(0.75, false)} />
              </g>
            );
          })}

          {/* Annotation leader */}
          {active && anchor ? (
            <g aria-hidden="true" pointerEvents="none">
              <circle cx={n2(anchor.x)} cy={n2(anchor.y)} r="3.5" fill="var(--color-signal)" />
              <path
                d={`M${n2(anchor.x)} ${n2(anchor.y)}L${n2(anchor.x + labelSide * 30)} ${-150}H${labelSide * 230}`}
                fill="none"
                stroke="var(--color-signal)"
                strokeWidth="0.8"
              />
              <text
                x={labelSide * 230}
                y={-156}
                textAnchor={labelSide > 0 ? "end" : "start"}
                fill="var(--color-paper)"
                style={{ font: "500 10px var(--font-mono)", letterSpacing: "0.12em" }}
              >
                {active.name.toUpperCase()}
              </text>
            </g>
          ) : null}
        </svg>

        <p id={`${ids}-status`} className="sr-only" aria-live="polite">
          {active ? `Selected: ${active.name}.` : "No part selected."} Explode {Math.round(explode * 100)} percent.
        </p>

        {/* Viewport toolbar */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line px-4 py-3">
          <label className="label flex items-center gap-3 text-steel-400">
            Explode
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explode}
              onChange={(e) => setExplode(Number(e.target.value))}
              className="w-28 accent-[var(--color-signal)] sm:w-40"
            />
            <span className="w-9 tabular-nums text-paper">{Math.round(explode * 100)}%</span>
          </label>
          <div className="flex items-center gap-1" role="group" aria-label="Rotate">
            <ToolButton label="Rotate left" onClick={() => rotateBy(-15, 0)}>
              <path d="M11 4a5 5 0 1 0 1.5 5M11 1v3h3" />
            </ToolButton>
            <ToolButton label="Rotate right" onClick={() => rotateBy(15, 0)}>
              <path d="M5 4a5 5 0 1 1-1.5 5M5 1v3H2" />
            </ToolButton>
            <ToolButton
              label="Reset view"
              onClick={() => {
                setYaw(DEFAULT.yaw);
                setPitch(DEFAULT.pitch);
                setExplode(DEFAULT.explode);
              }}
            >
              <path d="M8 2v12M2 8h12" />
            </ToolButton>
          </div>
          <span className="label ml-auto tabular-nums text-steel-500">
            Yaw {Math.round(yaw)}° · Pitch {Math.round(pitch)}°
            <span className="hidden md:inline"> · Drag · Arrows · + / −</span>
          </span>
        </div>
      </div>

      {/* Parts list + annotation panel */}
      <div className="flex flex-col bg-graphite-900">
        <div className="label border-b border-line px-4 py-3 text-steel-500">Bill of materials</div>
        <ul className="border-b border-line">
          {PARTS.map((part, i) => (
            <li key={part.id}>
              {i === 0 || PARTS[i - 1].group !== part.group ? (
                <p className="label border-t border-line px-4 pb-1 pt-3 text-steel-500 first:border-t-0">
                  {GROUPS[part.group]}
                </p>
              ) : null}
              <button
                type="button"
                aria-pressed={selected === part.id}
                onClick={() => setSelected(part.id)}
                className={cx(
                  "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors",
                  selected === part.id ? "bg-signal-wash text-paper" : "text-steel-300 hover:bg-graphite-800",
                )}
              >
                <span className={cx("label w-5", selected === part.id ? "text-signal" : "text-steel-500")}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {part.name}
              </button>
            </li>
          ))}
        </ul>
        <div className="order-first border-b border-line p-4 lg:order-none lg:flex-1 lg:border-b-0" aria-live="polite">
          {active ? (
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="label text-signal">Function</dt>
                <dd className="mt-1 text-steel-200">{active.fn}</dd>
              </div>
              <div>
                <dt className="label text-steel-500">Interface</dt>
                <dd className="mt-1 text-steel-300">{active.interface}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-steel-400">Select a part to see its role in the assembly.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ToolButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center border border-transparent text-steel-300 transition-colors hover:border-line-strong hover:text-paper"
    >
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.3">
        {children}
      </svg>
    </button>
  );
}
