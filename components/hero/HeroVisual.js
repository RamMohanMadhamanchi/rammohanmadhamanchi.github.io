"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { ease } from "@/lib/motion";
import { cx } from "@/lib/content";
import { Balloon, Bearing, DrawContext, Gear, LockNut, NodeBox, Shaft } from "./drawings";

/*
 * HERO SEQUENCE
 * 0.0s  grid + construction lines
 * 0.5s  parts are drawn as an exploded technical illustration
 * 2.5s  parts slide into the assembled position
 * 3.9s  the assembly becomes a data system: shaft → pipeline, parts → stages
 * 5.0s  an agent orchestrator takes control of the pipeline
 * 5.3s  copy is revealed (html[data-intro] removed)
 *
 * The three acts mirror Ram's career: mechanical → data engineering → AI.
 *
 * The assembly is representative geometry, not one of Ram's models. Once Ram's
 * CAD assets are added, act one can trace a line export of a real part.
 *
 * The server renders the final state. The intro only runs when the inline
 * gate in app/layout.js set html[data-intro="play"].
 */

const T = 6.2; // visual timeline length, seconds
const REVEAL_AT = 5300; // ms — when the copy starts to appear

const AXIS_Y = 320;
const ORCH = { x: 475, y: 64 };

const PARTS = [
  {
    id: "bearing-l",
    n: 2,
    name: "Bearing",
    Drawing: Bearing,
    exploded: [190, 170],
    assembled: [300, AXIS_Y],
    node: [230, 172],
    balloon: [-44, -86],
    code: "01 · Ingest",
    label: "Source systems",
  },
  {
    id: "gear",
    n: 3,
    name: "Spur gear",
    Drawing: Gear,
    exploded: [470, 470],
    assembled: [470, AXIS_Y],
    node: [470, 474],
    balloon: [70, 118],
    code: "02 · Transform",
    label: "ETL pipelines",
  },
  {
    id: "bearing-r",
    n: 4,
    name: "Bearing",
    Drawing: Bearing,
    exploded: [752, 170],
    assembled: [640, AXIS_Y],
    node: [720, 172],
    balloon: [44, -86],
    code: "03 · Generate",
    label: "SQL agents",
  },
  {
    id: "nut",
    n: 5,
    name: "Lock nut",
    Drawing: LockNut,
    exploded: [905, 460],
    assembled: [772, AXIS_Y],
    node: [852, 474],
    balloon: [34, 70],
    code: "04 · Validate",
    label: "Quality checks",
  },
];

/** Convert [[seconds, value], …] into motion keyframes + times. */
function seq(points) {
  const pts = points[points.length - 1][0] < T ? [...points, [T, points[points.length - 1][1]]] : points;
  return { values: pts.map((p) => p[1]), times: pts.map((p) => Math.min(p[0] / T, 1)) };
}

/**
 * Build animate/transition/initial props.
 * spec: { prop: [introKeyframes, idleValue] }
 */
function build(intro, spec) {
  const animate = {};
  const transition = {};
  const initial = {};
  Object.entries(spec).forEach(([prop, [points, idle]]) => {
    if (intro) {
      const { values, times } = seq(points);
      animate[prop] = values;
      initial[prop] = values[0];
      transition[prop] = { duration: T, times, ease: "easeInOut" };
    } else {
      animate[prop] = idle;
      transition[prop] = { duration: 0.9, ease: ease.mech };
    }
  });
  return { animate, transition, initial: intro ? initial : false };
}

export function HeroVisual({ className }) {
  const [phase, setPhase] = useState("static"); // "static" | "intro"
  const [view, setView] = useState("system"); // "system" | "assembly"
  const timer = useRef(null);

  const finish = useCallback(() => {
    clearTimeout(timer.current);
    try {
      sessionStorage.setItem("intro-played", "1");
    } catch {}
    delete document.documentElement.dataset.intro;
    setPhase("static");
  }, []);

  const start = useCallback(() => {
    document.documentElement.dataset.intro = "play";
    setView("system");
    setPhase("intro");
    clearTimeout(timer.current);
    timer.current = setTimeout(finish, REVEAL_AT);
  }, [finish]);

  // Runs before paint after hydration: switch to the intro if the gate asked for it.
  // Reading this in a lazy useState initializer would make the first client
  // render differ from the server HTML (a hydration mismatch), so it lives here.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (document.documentElement.dataset.intro === "play") start();
    return () => clearTimeout(timer.current);
  }, [start]);

  useEffect(() => {
    if (phase !== "intro") return undefined;
    const onKey = (event) => event.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, finish]);

  const intro = phase === "intro";

  return (
    <div className={cx("relative", className)} data-intro-visual="" data-running={intro ? "" : undefined}>
      <Diagram key={phase} intro={intro} view={view} className="absolute inset-0 size-full" />

      {/* Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-[var(--gutter)] pb-2">
        <div className="pointer-events-auto">
          {intro ? (
            <button
              type="button"
              onClick={finish}
              className="label flex min-h-11 items-center gap-2 border border-line-strong bg-ink px-4 text-paper transition-colors hover:border-signal hover:text-signal"
            >
              Skip intro <span className="text-steel-500">Esc</span>
            </button>
          ) : (
            <ViewToggle view={view} onChange={setView} />
          )}
        </div>
        {!intro ? (
          <button
            type="button"
            onClick={start}
            className="label pointer-events-auto hidden min-h-11 items-center gap-2 px-2 text-steel-500 transition-colors hover:text-paper sm:flex motion-reduce:!hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5">
              <path d="M13 8a5 5 0 1 1-1.6-3.7M13 2v3h-3" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            Replay sequence
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ViewToggle({ view, onChange }) {
  const options = [
    { id: "assembly", label: "Physical" },
    { id: "system", label: "Intelligent" },
  ];
  return (
    <div role="group" aria-label="Diagram view" className="flex items-center border border-line-strong bg-ink">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={view === option.id}
          onClick={() => onChange(option.id)}
          className={cx(
            "label min-h-11 px-4 transition-colors",
            view === option.id ? "bg-paper text-ink" : "text-steel-400 hover:text-paper",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function Diagram({ intro, view, className }) {
  const system = view === "system";
  const svgRef = useRef(null);
  const readout = useRef(null);

  // Live coordinate readout, like a CAD status bar. Written straight to the
  // DOM to avoid re-rendering the diagram on every pointer move.
  const onPointerMove = (event) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!ctm || !readout.current) return;
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
    readout.current.textContent = `X ${p.x.toFixed(1).padStart(6, "0")}  Y ${(640 - p.y).toFixed(1).padStart(6, "0")}`;
  };

  const construction = build(intro, { opacity: [[[0, 0], [0.2, 0], [0.9, 1]], 1] });
  const explosion = build(intro, {
    opacity: [[[0, 0], [1.3, 0], [1.8, 1], [2.5, 1], [3.3, 0]], 0],
  });
  const dims = build(intro, {
    opacity: [[[0, 0], [3.4, 0], [3.7, 1], [4.0, 1], [4.3, 0]], system ? 0 : 1],
  });
  const shaftDrawing = build(intro, {
    opacity: [[[0, 1], [3.9, 1], [4.4, 0]], system ? 0 : 1],
  });
  const bus = build(intro, {
    pathLength: [[[0, 0], [4.0, 0], [4.9, 1]], 1],
    opacity: [[[0, 0], [3.95, 0], [4.0, 1]], system ? 1 : 0],
  });
  const connectors = build(intro, {
    pathLength: [[[0, 0], [4.5, 0], [5.1, 1]], 1],
    opacity: [[[0, 0], [4.45, 0], [4.5, 1]], system ? 1 : 0],
  });
  const flow = build(intro, { opacity: [[[0, 0], [5.0, 0], [5.4, 1]], system ? 1 : 0] });
  const orchestrator = build(intro, {
    opacity: [[[0, 0], [5.0, 0], [5.5, 1]], system ? 1 : 0],
    scale: [[[0, 0.9], [5.0, 0.9], [5.5, 1]], system ? 1 : 0.9],
  });
  // Dashed lines can't use pathLength (it rewrites stroke-dasharray), so they fade in.
  const control = build(intro, {
    opacity: [[[0, 0], [5.3, 0], [5.9, 1]], system ? 1 : 0],
  });
  const ghost = build(intro, { opacity: [[[0, 0], [4.6, 0], [5.4, 0.14]], system ? 0.14 : 0] });

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1000 640"
      className={cx("text-steel-300", className)}
      role="img"
      aria-labelledby="hero-fig-title hero-fig-desc"
      onPointerMove={onPointerMove}
    >
      <title id="hero-fig-title">From a mechanical assembly to a software system</title>
      <desc id="hero-fig-desc">
        A representative shaft assembly with two bearings, a spur gear and a lock nut. The shaft becomes a data
        pipeline and each part becomes a stage: source systems, ETL pipelines, SQL agents and
        quality checks. An agent orchestrator then connects to the pipeline from above.
      </desc>

      {/* Construction geometry */}
      <motion.g {...construction} aria-hidden="true">
        <line x1="40" y1={AXIS_Y} x2="960" y2={AXIS_Y} stroke="var(--color-line-strong)" strokeDasharray="2 6" />
        <line x1="500" y1="40" x2="500" y2="600" stroke="var(--color-line)" strokeDasharray="2 6" />
        <circle cx="500" cy={AXIS_Y} r="6" fill="none" stroke="var(--color-signal)" strokeOpacity="0.6" />
        <text x="44" y="620" fill="var(--color-steel-500)" style={{ font: "500 14px var(--font-mono)", letterSpacing: "0.14em" }}>
          FIG. 01 — REPRESENTATIVE ASSEMBLY → SYSTEM
        </text>
        <text x="956" y="36" textAnchor="end" fill="var(--color-steel-500)" style={{ font: "500 14px var(--font-mono)", letterSpacing: "0.14em" }}>
          SCALE 1:1
        </text>
        <text
          ref={readout}
          x="956"
          y="620"
          textAnchor="end"
          fill="var(--color-steel-500)"
          className="hidden md:block"
          style={{ font: "500 12px var(--font-mono)", letterSpacing: "0.1em", whiteSpace: "pre" }}
        >
          X 0500.0  Y 0320.0
        </text>
      </motion.g>

      {/* Ghost of the assembly that remains behind the final system */}
      <motion.g {...ghost} aria-hidden="true">
        <g transform={`translate(500 ${AXIS_Y})`}>
          <Shaft />
        </g>
        {PARTS.map((part) => (
          <g key={part.id} transform={`translate(${part.assembled[0]} ${part.assembled[1]})`}>
            <part.Drawing />
          </g>
        ))}
      </motion.g>

      {/* Explosion lines: exploded position → assembled position */}
      <motion.g {...explosion} aria-hidden="true">
        {PARTS.map((part) => (
          <line
            key={part.id}
            x1={part.exploded[0]}
            y1={part.exploded[1]}
            x2={part.assembled[0]}
            y2={part.assembled[1]}
            stroke="var(--color-signal)"
            strokeOpacity="0.55"
            strokeDasharray="4 5"
          />
        ))}
      </motion.g>

      {/* Data bus and connectors (the system) */}
      <g aria-hidden="true">
        <motion.path
          d={`M90 ${AXIS_Y}H910`}
          fill="none"
          stroke="var(--color-paper)"
          strokeOpacity="0.7"
          strokeWidth="1.5"
          {...bus}
        />
        <motion.path
          d={PARTS.map((p) => `M${p.node[0]} ${AXIS_Y}V${p.node[1] + (p.node[1] < AXIS_Y ? 32 : -32)}`).join("")}
          fill="none"
          stroke="var(--color-paper)"
          strokeOpacity="0.45"
          {...connectors}
        />
        <motion.g {...flow}>
          <path d={`M90 ${AXIS_Y}H910`} className="flow-line" fill="none" stroke="var(--color-signal)" strokeWidth="3" />
          {PARTS.map((p) => (
            <circle key={p.id} cx={p.node[0]} cy={AXIS_Y} r="4" fill="var(--color-signal)" />
          ))}
          <text x="90" y={AXIS_Y - 12} fill="var(--color-steel-400)" style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.14em" }}>
            DATA PIPELINE
          </text>
        </motion.g>
      </g>

      {/* Shaft drawing (becomes the bus) */}
      <DrawContext.Provider value={{ intro, start: 0.5 }}>
        <motion.g {...shaftDrawing} aria-hidden="true">
          <g transform={`translate(500 ${AXIS_Y})`}>
            <Shaft />
            <g transform="translate(-280 0)">
              <Balloon n={1} label="Shaft" dx={-40} dy={-70} />
            </g>
          </g>
        </motion.g>
      </DrawContext.Provider>

      {/* Parts → components */}
      {PARTS.map((part, i) => (
        <Part key={part.id} part={part} index={i} intro={intro} system={system} />
      ))}

      {/* Agent orchestrator (the third act) */}
      <g aria-hidden="true">
        <motion.path
          d={`M${ORCH.x - 102} ${ORCH.y}H${PARTS[0].node[0]}V${PARTS[0].node[1] - 37}M${ORCH.x + 102} ${ORCH.y}H${PARTS[2].node[0]}V${PARTS[2].node[1] - 37}M${ORCH.x} ${ORCH.y + 37}V${AXIS_Y - 4}`}
          fill="none"
          stroke="var(--color-signal)"
          strokeOpacity="0.7"
          strokeDasharray="5 5"
          {...control}
        />
        <motion.g {...orchestrator}>
          <g transform={`translate(${ORCH.x} ${ORCH.y})`}>
            <NodeBox code="05 · Orchestrate" label="Agent orchestrator" accent />
          </g>
        </motion.g>
      </g>

      {/* Dimensions (assembled state) */}
      <motion.g {...dims} aria-hidden="true" fill="var(--color-steel-400)" stroke="var(--color-steel-400)">
        <path d="M180 560H820M180 548V572M820 548V572" strokeWidth="0.75" />
        <path d="M180 560l10 -4v8zM820 560l-10 -4v8z" stroke="none" />
        <text x="500" y="552" textAnchor="middle" stroke="none" style={{ font: "500 13px var(--font-mono)" }}>
          640.00 ±0.05
        </text>
        <path d="M440 190H500M470 190V160" strokeWidth="0.75" />
        <text x="505" y="194" stroke="none" style={{ font: "500 13px var(--font-mono)" }}>
          ⌀260 PCD
        </text>
      </motion.g>
    </svg>
  );
}

function Part({ part, index, intro, system }) {
  const { Drawing } = part;
  const start = 0.6 + index * 0.25;

  const position = build(intro, {
    x: [
      [[0, part.exploded[0]], [2.5 + index * 0.08, part.exploded[0]], [3.5 + index * 0.08, part.assembled[0]], [3.95, part.assembled[0]], [4.9, part.node[0]]],
      system ? part.node[0] : part.assembled[0],
    ],
    y: [
      [[0, part.exploded[1]], [2.5 + index * 0.08, part.exploded[1]], [3.5 + index * 0.08, part.assembled[1]], [3.95, part.assembled[1]], [4.9, part.node[1]]],
      system ? part.node[1] : part.assembled[1],
    ],
  });
  const drawing = build(intro, {
    opacity: [[[0, 1], [3.9, 1], [4.4, 0]], system ? 0 : 1],
    scale: [[[0, 1], [3.9, 1], [4.6, 0.6]], system ? 0.6 : 1],
  });
  const balloon = build(intro, {
    opacity: [[[0, 0], [start + 0.9, 0], [start + 1.3, 1]], 1],
  });
  const node = build(intro, {
    opacity: [[[0, 0], [4.35, 0], [4.9, 1]], system ? 1 : 0],
    scale: [[[0, 0.85], [4.35, 0.85], [4.9, 1]], system ? 1 : 0.85],
  });

  return (
    <motion.g {...position}>
      <DrawContext.Provider value={{ intro, start }}>
        <motion.g {...drawing} aria-hidden="true">
          <Drawing />
          <motion.g {...balloon}>
            <Balloon n={part.n} label={part.name} dx={part.balloon[0]} dy={part.balloon[1]} />
          </motion.g>
        </motion.g>
      </DrawContext.Provider>
      <motion.g {...node} aria-hidden={!system}>
        <NodeBox code={part.code} label={part.label} />
      </motion.g>
    </motion.g>
  );
}
