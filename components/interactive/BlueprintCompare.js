"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cx, slotText } from "@/lib/content";

/**
 * A technical drawing and a CAD render of the same part, compared with a
 * slider. Pass `pair` ({ drawing, render, width, height, caption }) with two
 * identically framed images of Ram's real work; without it, a clearly
 * labelled demonstration part (a flanged hub drawn in SVG) is shown.
 * A native range input drives the split, so it works with drag, touch,
 * arrow keys and screen readers.
 */

const HOLES = [0, 45, 90, 135, 180, 225, 315].map((deg) => {
  const t = (deg * Math.PI) / 180;
  // Rounded so server and browser render identical attributes.
  return { x: +(400 + 172 * Math.cos(t)).toFixed(2), y: +(262 + 68 * Math.sin(t)).toFixed(2) };
});

function Geometry({ mode, ids }) {
  const drawing = mode === "drawing";
  const ink = "var(--color-paper-ink)";
  const s = drawing
    ? { fill: "var(--color-paper)", stroke: ink, strokeWidth: 1.4 }
    : { stroke: "rgb(255 255 255 / 0.12)", strokeWidth: 1 };
  const g = (name) => (drawing ? s.fill : `url(#${ids}-${name})`);

  return (
    <g>
      {!drawing ? <ellipse cx="400" cy="318" rx="250" ry="70" fill={`url(#${ids}-shadow)`} /> : null}
      {/* flange side band */}
      <path d="M180 262V292A220 88 0 0 0 620 292V262" fill={g("band")} stroke={s.stroke} strokeWidth={s.strokeWidth} />
      {/* flange top face */}
      <ellipse cx="400" cy="262" rx="220" ry="88" fill={g("face")} stroke={s.stroke} strokeWidth={s.strokeWidth} />
      {/* bolt holes */}
      {HOLES.map((h, i) => (
        <ellipse
          key={i}
          cx={h.x}
          cy={h.y}
          rx="15"
          ry="6"
          fill={drawing ? s.fill : "var(--color-ink)"}
          stroke={s.stroke}
          strokeWidth={s.strokeWidth}
        />
      ))}
      {/* hub */}
      <path d="M310 190V262A90 36 0 0 0 490 262V190" fill={g("hub")} stroke={s.stroke} strokeWidth={s.strokeWidth} />
      <ellipse cx="400" cy="190" rx="90" ry="36" fill={g("hubtop")} stroke={s.stroke} strokeWidth={s.strokeWidth} />
      <ellipse cx="400" cy="190" rx="46" ry="18" fill={drawing ? s.fill : `url(#${ids}-bore)`} stroke={s.stroke} strokeWidth={s.strokeWidth} />
      {!drawing ? (
        <path d="M330 176A90 36 0 0 1 400 154" fill="none" stroke="rgb(255 255 255 / 0.5)" strokeWidth="2" strokeLinecap="round" />
      ) : null}
    </g>
  );
}

function DrawingAnnotations() {
  const ink = "var(--color-paper-ink)";
  const t = { fill: ink, style: { font: "500 12px var(--font-mono)", letterSpacing: "0.06em" } };
  return (
    <g stroke={ink} fill="none" strokeWidth="0.8">
      {/* centre lines */}
      <path d="M400 110V360M160 262H640" strokeDasharray="16 4 3 4" stroke="var(--color-signal-deep)" />
      {/* hidden bore */}
      <path d="M354 190V262M446 190V262" strokeDasharray="6 4" />
      {/* overall diameter */}
      <path d="M180 392H620M180 300V400M620 300V400" />
      <path d="M180 392l10 -4v8zM620 392l-10 -4v8z" fill={ink} stroke="none" />
      <text x="400" y="385" textAnchor="middle" stroke="none" {...t}>⌀ 440.0</text>
      {/* hub diameter */}
      <path d="M310 128H490M310 120V188M490 120V188" />
      <path d="M310 128l10 -4v8zM490 128l-10 -4v8z" fill={ink} stroke="none" />
      <text x="400" y="121" textAnchor="middle" stroke="none" {...t}>⌀ 180.0</text>
      {/* leader to bolt hole */}
      <path d="M572 262L660 206H720" />
      <text x="664" y="200" stroke="none" {...t}>8× ⌀14 THRU</text>
      <text x="664" y="218" stroke="none" {...t}>EQ SP ON ⌀344</text>
    </g>
  );
}

export function BlueprintCompare({ pair, className, tone = "paper" }) {
  const [split, setSplit] = useState(52);
  const ids = useId().replace(/:/g, "");
  const real = Boolean(pair?.drawing && pair?.render);

  return (
    <figure className={cx("relative", className)}>
      <div
        className="relative overflow-hidden border border-line-paper bg-graphite-900"
        style={{ aspectRatio: real ? `${pair.width} / ${pair.height}` : "16 / 9" }}
        data-cursor="Drag to compare"
      >
        {real ? (
          <>
            <Image src={pair.render} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
              <Image src={pair.drawing} alt="" fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
            </div>
          </>
        ) : (
          <DemoLayers ids={ids} split={split} />
        )}

        <span className="label pointer-events-none absolute left-4 top-4 bg-paper/80 px-1 text-paper-muted">Drawing</span>
        <span className="label pointer-events-none absolute right-4 top-4 bg-ink/70 px-1 text-steel-300">CAD render</span>

        <input
          type="range"
          min="0"
          max="100"
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label={`Compare drawing and render${real ? ` of ${slotText(pair.caption)}` : " of a demonstration part"}. Left shows the technical drawing, right shows the render.`}
          aria-valuetext={`${split}% drawing`}
          className="peer absolute inset-0 z-10 size-full cursor-ew-resize opacity-0"
        />

        {/* Handle */}
        <div
          className="pointer-events-none absolute inset-y-0 z-0 w-px bg-signal peer-focus-visible:w-0.5"
          style={{ left: `${split}%` }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center border border-signal bg-ink text-signal">
            <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 4L1 8l4 4M11 4l4 4-4 4" />
            </svg>
          </span>
        </div>
      </div>
      <figcaption className={cx("label mt-3 flex justify-between", tone === "paper" ? "text-paper-muted" : "text-steel-400")}>
        <span>
          {real
            ? `Fig. — ${slotText(pair.caption)}, drawing vs. render`
            : "Fig. — Demonstration part (not one of Ram's models), drawing vs. render"}
        </span>
        <span className="hidden sm:inline">Drag or use arrow keys</span>
      </figcaption>
    </figure>
  );
}

function DemoLayers({ ids, split }) {
  return (
    <>
      {/* Render layer (full) */}
      <svg viewBox="0 0 800 450" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id={`${ids}-face`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#8d9591" />
            <stop offset="0.55" stopColor="#5b625f" />
            <stop offset="1" stopColor="#3a403e" />
          </linearGradient>
          <linearGradient id={`${ids}-band`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2b302f" />
            <stop offset="0.35" stopColor="#6c7470" />
            <stop offset="0.6" stopColor="#3b4140" />
            <stop offset="1" stopColor="#1f2322" />
          </linearGradient>
          <linearGradient id={`${ids}-hub`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#2c3130" />
            <stop offset="0.3" stopColor="#a3aaa6" />
            <stop offset="0.5" stopColor="#6b7370" />
            <stop offset="1" stopColor="#252a29" />
          </linearGradient>
          <linearGradient id={`${ids}-hubtop`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#b8beba" />
            <stop offset="1" stopColor="#6a716e" />
          </linearGradient>
          <radialGradient id={`${ids}-bore`} cx="0.5" cy="0.3" r="0.7">
            <stop offset="0" stopColor="#050606" />
            <stop offset="1" stopColor="#262b2a" />
          </radialGradient>
          <radialGradient id={`${ids}-shadow`}>
            <stop offset="0" stopColor="#000" stopOpacity="0.7" />
            <stop offset="1" stopColor="#000" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${ids}-spot`} cx="0.5" cy="0.35" r="0.6">
            <stop offset="0" stopColor="#62b487" stopOpacity="0.1" />
            <stop offset="1" stopColor="#62b487" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="800" height="450" fill={`url(#${ids}-spot)`} />
        <Geometry mode="render" ids={ids} />
      </svg>

      {/* Drawing layer (clipped) */}
      <div
        className="absolute inset-0 bg-paper bg-grid bg-grid-paper"
        style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 800 450" className="size-full">
          <Geometry mode="drawing" ids={ids} />
          <DrawingAnnotations />
        </svg>
      </div>
    </>
  );
}
