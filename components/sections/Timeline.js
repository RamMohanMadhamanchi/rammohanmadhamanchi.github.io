"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { timeline } from "@/content/timeline";
import { getProject } from "@/content/projects";
import { SectionHeading } from "@/components/system/SectionHeading";
import { Text } from "@/components/system/Text";

const KIND = { education: "Education", role: "Role", training: "Training" };
const PHASE = { mechanical: "Mechanical", software: "Software", data: "Data", ai: "AI" };

// Scroll progress at which the drawing reaches each stage.
const AT = { pipeline: [0.3, 0.48], agents: [0.66, 0.84] };

export function Timeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section id="timeline" aria-labelledby="timeline-title" className="section-y relative">
      <div className="container-x">
        <SectionHeading
          id="timeline-title"
          index="04"
          eyebrow="Career timeline"
          title="The drawing changes. The discipline doesn't."
          lede="Scroll the timeline and the drawing evolves with it — from a mechanical part, to a data pipeline, to an orchestrated system of agents."
        />

        <div ref={ref} className="mt-20 grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              <EvolvingDrawing progress={progress} />
            </div>
          </div>

          <ol className="relative lg:col-span-6 lg:col-start-7">
            <span aria-hidden="true" className="absolute bottom-0 left-[11px] top-0 w-px bg-line-strong" />
            <motion.span
              aria-hidden="true"
              className="absolute left-[11px] top-0 w-px origin-top bg-signal"
              style={{ scaleY: progress, height: "100%" }}
            />
            {timeline.map((entry, i) => (
              <Entry key={i} entry={entry} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Entry({ entry }) {
  const project = entry.project ? getProject(entry.project) : null;
  return (
    <motion.li
      initial={{ opacity: 0, x: 16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "0px 0px -20% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative pb-16 pl-14 last:pb-0"
    >
      <Marker phase={entry.phase} />
      <p className="label flex flex-wrap items-center gap-x-3 gap-y-1 text-steel-400">
        <Text value={entry.period} className="text-paper" />
        <span aria-hidden="true" className="h-px w-4 bg-line-strong" />
        {KIND[entry.kind]}
        <span className={entry.phase === "ai" ? "text-signal" : "text-steel-500"}>· {PHASE[entry.phase]}</span>
      </p>
      <h3 className="display mt-3 text-[clamp(1.5rem,2.6vw,2.25rem)] leading-tight">
        <Text value={entry.title} />
      </h3>
      <p className="mt-1 text-steel-300">{entry.org}</p>
      <p className="mt-4 max-w-lg leading-relaxed text-steel-300">{entry.body}</p>
      {entry.points.length ? (
        <ul className="mt-4 max-w-lg space-y-1.5">
          {entry.points.map((point) => (
            <li key={point} className="flex gap-3 text-sm text-steel-400">
              <span aria-hidden="true" className="mt-2 size-1 shrink-0 bg-signal" />
              {point}
            </li>
          ))}
        </ul>
      ) : null}
      {project ? (
        <Link
          href={`/projects/${project.slug}/`}
          className="label mt-5 inline-flex items-center gap-2 text-signal hover:text-signal-bright"
        >
          Case study {project.index} · {project.title} <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </motion.li>
  );
}

/** Marker shape follows the phase: drawing target → window → pipeline → system node. */
function Marker({ phase }) {
  return (
    <span aria-hidden="true" className="absolute left-0 top-0.5 grid size-6 place-items-center bg-ink">
      <svg viewBox="0 0 24 24" className="size-6" fill="none" strokeWidth="1.25">
        {phase === "mechanical" ? (
          <>
            <circle cx="12" cy="12" r="7" stroke="var(--color-steel-300)" />
            <path d="M12 2v20M2 12h20" stroke="var(--color-signal)" strokeDasharray="3 2" />
          </>
        ) : phase === "software" ? (
          <>
            <rect x="4" y="5" width="16" height="14" stroke="var(--color-steel-200)" fill="var(--color-ink)" />
            <path d="M4 9h16" stroke="var(--color-steel-200)" />
            <path d="M9 13l-2 2 2 2M15 13l2 2-2 2" stroke="var(--color-signal)" />
          </>
        ) : phase === "data" ? (
          <>
            <path d="M5 7v10c0 1.7 3 3 7 3s7-1.3 7-3V7" stroke="var(--color-steel-200)" />
            <ellipse cx="12" cy="7" rx="7" ry="3" stroke="var(--color-signal)" fill="var(--color-ink)" />
          </>
        ) : (
          <>
            <rect x="4" y="4" width="16" height="16" stroke="var(--color-signal)" fill="var(--color-signal-wash)" />
            <circle cx="12" cy="12" r="2.5" fill="var(--color-signal)" />
          </>
        )}
      </svg>
    </span>
  );
}

// ─── Evolving drawing: part → pipeline → agents ───────────────────

const C = { x: 200, y: 220 };
const HOLES = Array.from({ length: 6 }, (_, i) => {
  const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
  // Rounded so server and browser render identical attributes.
  return { x: +(C.x + Math.cos(a) * 88).toFixed(2), y: +(C.y + Math.sin(a) * 88).toFixed(2) };
});
// Serpentine pipeline stages.
const STAGES = [
  { x: 70, y: 140 },
  { x: 200, y: 140 },
  { x: 330, y: 140 },
  { x: 330, y: 300 },
  { x: 200, y: 300 },
  { x: 70, y: 300 },
];
// Agents around an orchestrator — the bolt circle returns.
const AGENTS = [
  { x: 200, y: 80 },
  { x: 320, y: 160 },
  { x: 320, y: 290 },
  { x: 200, y: 370 },
  { x: 80, y: 290 },
  { x: 80, y: 160 },
];

function gearPath() {
  const pts = [];
  const n = 28;
  for (let i = 0; i < n * 2; i += 1) {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 150 : 138;
    pts.push(`${(C.x + Math.cos(a) * r).toFixed(1)},${(C.y + Math.sin(a) * r).toFixed(1)}`);
  }
  return `M${pts.join("L")}Z`;
}
const GEAR = gearPath();
const mono = (size) => ({ font: `500 ${size}px var(--font-mono)`, letterSpacing: "0.12em" });

function EvolvingDrawing({ progress }) {
  const mechDraw = useTransform(progress, [0, 0.22], [0.3, 1]);
  const mechOpacity = useTransform(progress, [AT.pipeline[0], AT.pipeline[1]], [1, 0.06]);
  const pipeOpacity = useTransform(progress, [0.34, 0.5, AT.agents[0], AT.agents[0] + 0.1], [0, 1, 1, 0]);
  const agentOpacity = useTransform(progress, [AT.agents[0] + 0.04, AT.agents[1]], [0, 1]);
  const agentDraw = useTransform(progress, [0.72, 0.95], [0, 1]);

  const labels = [
    useTransform(progress, [AT.pipeline[0], AT.pipeline[0] + 0.08], [1, 0]),
    useTransform(progress, [AT.pipeline[0] + 0.08, AT.pipeline[1], AT.agents[0], AT.agents[0] + 0.08], [0, 1, 1, 0]),
    useTransform(progress, [AT.agents[0] + 0.08, AT.agents[1]], [0, 1]),
  ];

  return (
    <figure className="border border-line bg-graphite-900">
      <div className="label flex justify-between border-b border-line px-4 py-3 text-steel-500">
        <span>Fig. — Evolution</span>
        <span className="relative">
          <motion.span style={{ opacity: labels[0] }}>Part drawing</motion.span>
          <motion.span className="absolute right-0 top-0 whitespace-nowrap" style={{ opacity: labels[1] }}>
            Data pipeline
          </motion.span>
          <motion.span className="absolute right-0 top-0 whitespace-nowrap text-signal" style={{ opacity: labels[2] }}>
            Agent orchestration
          </motion.span>
        </span>
      </div>
      <svg viewBox="0 0 400 460" className="block w-full bg-grid" aria-hidden="true">
        {/* 1 · Mechanical drawing */}
        <motion.g style={{ opacity: mechOpacity }} fill="none" stroke="var(--color-steel-300)" strokeWidth="1.2">
          <motion.path d={GEAR} style={{ pathLength: mechDraw }} />
          <motion.circle cx={C.x} cy={C.y} r="40" style={{ pathLength: mechDraw }} />
          <circle cx={C.x} cy={C.y} r="88" strokeDasharray="10 4 2 4" stroke="var(--color-signal)" strokeWidth="0.8" />
          <path d={`M${C.x} 50V390M30 ${C.y}H370`} stroke="var(--color-signal)" strokeWidth="0.6" strokeDasharray="14 4 2 4" />
          <g stroke="var(--color-steel-400)" strokeWidth="0.8">
            <path d="M50 420H350M50 410V428M350 410V428" />
            <text x="200" y="414" textAnchor="middle" fill="var(--color-steel-400)" stroke="none" style={mono(11)}>
              ⌀300 OD · 28T
            </text>
          </g>
        </motion.g>

        {/* 2 · Data pipeline */}
        <motion.g style={{ opacity: pipeOpacity }} fill="none">
          <path d="M70 140H330V300H70" stroke="var(--color-graphite-600)" strokeWidth="10" />
          <path d="M70 140H330V300H70" stroke="var(--color-signal)" strokeWidth="3" className="flow-line" />
          {STAGES.map((s, i) => (
            <rect key={i} x={s.x - 30} y={s.y - 22} width="60" height="44" fill="var(--color-graphite-800)" stroke="var(--color-steel-400)" />
          ))}
          <path d="M40 60v36c0 5 13 9 30 9s30-4 30-9V60" stroke="var(--color-steel-300)" />
          <ellipse cx="70" cy="60" rx="30" ry="9" stroke="var(--color-steel-300)" fill="var(--color-graphite-900)" />
          <path d="M70 105V118" stroke="var(--color-steel-300)" />
          <text x="200" y="400" textAnchor="middle" fill="var(--color-steel-400)" style={mono(11)}>
            EXTRACT · TRANSFORM · VALIDATE
          </text>
        </motion.g>

        {/* 3 · Agent orchestration */}
        <motion.g style={{ opacity: agentOpacity }} fill="none" stroke="var(--color-paper)" strokeOpacity="0.5">
          {AGENTS.map((a, i) => (
            <motion.path key={i} d={`M${C.x} ${C.y}L${a.x} ${a.y}`} strokeDasharray="4 4" style={{ pathLength: agentDraw }} />
          ))}
          {AGENTS.map((a, i) => (
            <rect key={i} x={a.x - 40} y={a.y - 24} width="80" height="48" fill="var(--color-graphite-800)" />
          ))}
          <rect x={C.x - 62} y={C.y - 28} width="124" height="56" stroke="var(--color-signal)" strokeOpacity="1" fill="var(--color-graphite-900)" />
          <text x={C.x} y={C.y + 4} textAnchor="middle" fill="var(--color-signal)" stroke="none" style={mono(10)}>
            ORCHESTRATOR
          </text>
        </motion.g>

        {/* The six points that travel through all three drawings */}
        {HOLES.map((h, i) => (
          <MorphDot key={i} a={h} b={STAGES[i]} c={AGENTS[i]} progress={progress} draw={mechDraw} />
        ))}
      </svg>
    </figure>
  );
}

function MorphDot({ a, b, c, progress, draw }) {
  const keys = [AT.pipeline[0], AT.pipeline[1], AT.agents[0], AT.agents[1]];
  const cx = useTransform(progress, keys, [a.x, b.x, b.x, c.x]);
  const cy = useTransform(progress, keys, [a.y, b.y, b.y, c.y]);
  const r = useTransform(progress, keys, [11, 6, 6, 5]);
  const fill = useTransform(progress, [AT.pipeline[0], AT.pipeline[1]], ["rgba(0,0,0,0)", "rgb(98,180,135)"]);
  return <motion.circle cx={cx} cy={cy} r={r} style={{ opacity: draw, fill }} stroke="var(--color-signal)" strokeWidth="1.2" />;
}
