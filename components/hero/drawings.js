"use client";

import { createContext, useContext } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";

/**
 * Technical-drawing primitives for the hero assembly. Every part is drawn
 * in local coordinates centred on (0, 0) so it can be translated as a unit.
 *
 * Inside an intro sequence, <Stroke> draws itself in with pathLength,
 * starting at the time given by the surrounding DrawContext.
 */
export const DrawContext = createContext({ intro: false, start: 0 });

export function Stroke({ as = "path", ...props }) {
  const { intro, start } = useContext(DrawContext);
  const Element = motion[as];
  if (!intro) return <Element {...props} />;
  // pathLength drives stroke-dasharray, so dashed lines fade in instead.
  if (props.strokeDasharray) {
    return (
      <Element
        {...props}
        initial={{ opacity: 0 }}
        animate={{ opacity: props.opacity ?? 1 }}
        transition={{ duration: 0.8, delay: start + 0.4, ease: ease.out }}
      />
    );
  }
  return (
    <Element
      {...props}
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.1, delay: start, ease: ease.mech }}
    />
  );
}

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.25 };
const thin = { ...line, strokeWidth: 0.75, opacity: 0.6 };
const hidden = { ...thin, strokeDasharray: "6 4" };
const center = { ...thin, strokeDasharray: "18 4 3 4", stroke: "var(--color-signal)", opacity: 0.7 };
const solid = { fill: "var(--color-ink)" };

export function Shaft() {
  return (
    <g>
      <Stroke
        as="polygon"
        {...line}
        {...solid}
        points="-312,-16 312,-16 320,-8 320,8 312,16 -312,16 -320,8 -320,-8"
      />
      <Stroke d="M-250 -16V16M250 -16V16" {...thin} />
      <Stroke as="rect" x="-40" y="-16" width="80" height="7" {...thin} />
      <Stroke d="M-350 0H350" {...center} />
    </g>
  );
}

export function Bearing() {
  return (
    <g>
      <Stroke as="rect" x="-22" y="-58" width="44" height="116" {...line} {...solid} />
      <Stroke d="M-22 -30H22M-22 30H22M-22 -16H22M-22 16H22" {...thin} />
      <Stroke as="circle" cx="0" cy="-44" r="9" {...line} />
      <Stroke as="circle" cx="0" cy="44" r="9" {...line} />
      <Stroke d="M-6 -50L6 -38M6 -50L-6 -38M-6 38L6 50M6 38L-6 50" {...thin} />
    </g>
  );
}

export function Gear() {
  // Tooth band drawn as alternating lines along the face width.
  const teeth = [];
  for (let x = -24; x <= 24; x += 8) teeth.push(`M${x} -130V-100M${x} 100V130`);
  return (
    <g>
      <Stroke as="rect" x="-28" y="-130" width="56" height="260" {...line} {...solid} />
      <Stroke d="M-28 -100H28M-28 100H28" {...line} />
      <Stroke d={teeth.join("")} {...thin} />
      <Stroke d="M-40 -115H40M-40 115H40" {...center} />
      <Stroke as="rect" x="-42" y="-38" width="84" height="76" {...line} {...solid} />
      <Stroke d="M-42 -16H42M-42 16H42" {...hidden} />
      <Stroke d="M-8 -24H8V-16" {...thin} />
    </g>
  );
}

export function LockNut() {
  return (
    <g>
      <Stroke
        as="polygon"
        {...line}
        {...solid}
        points="-15,-28 -9,-34 9,-34 15,-28 15,28 9,34 -9,34 -15,28"
      />
      <Stroke d="M-15 -16H15M-15 16H15M-15 -10H15M-15 10H15" {...thin} />
    </g>
  );
}

/** Numbered balloon callout with a leader line to the part. */
export function Balloon({ n, label, dx, dy }) {
  return (
    <g>
      <line x1="0" y1="0" x2={dx} y2={dy} stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <circle cx="0" cy="0" r="2" fill="currentColor" />
      <circle cx={dx} cy={dy} r="13" fill="var(--color-ink)" stroke="var(--color-signal)" strokeWidth="1" />
      <text
        x={dx}
        y={dy + 4.5}
        textAnchor="middle"
        fill="var(--color-signal)"
        style={{ font: "500 15px var(--font-mono)" }}
      >
        {n}
      </text>
      <text
        x={dx + (dx >= 0 ? 22 : -22)}
        y={dy + 4.5}
        textAnchor={dx >= 0 ? "start" : "end"}
        fill="currentColor"
        style={{ font: "500 14px var(--font-mono)", letterSpacing: "0.12em" }}
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
}

/** Software component box — what each part becomes. */
export function NodeBox({ code, label, w = 204, h = 74, accent = false }) {
  const x = -w / 2;
  const y = -h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={accent ? "var(--color-graphite-800)" : "var(--color-graphite-900)"}
        stroke={accent ? "var(--color-signal)" : "var(--color-paper)"}
        strokeOpacity={accent ? 1 : 0.55}
      />
      {/* corner ticks */}
      <path
        d={`M${x - 5} ${y + 10}V${y - 5}H${x + 10}M${-x + 5} ${-y - 10}V${-y + 5}H${-x - 10}`}
        fill="none"
        stroke="var(--color-signal)"
        strokeWidth="1.25"
      />
      <text
        x={x + 14}
        y={y + 28}
        fill="var(--color-signal)"
        style={{ font: "500 13px var(--font-mono)", letterSpacing: "0.14em" }}
      >
        {code.toUpperCase()}
      </text>
      <text x={x + 14} y={y + 56} fill="var(--color-paper)" style={{ font: "600 20px var(--font-sans)" }}>
        {label}
      </text>
    </g>
  );
}
