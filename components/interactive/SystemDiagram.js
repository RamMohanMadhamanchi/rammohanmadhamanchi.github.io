"use client";

import { useId, useState } from "react";
import { cx } from "@/lib/content";

/**
 * Explorable system diagram driven entirely by data (see `system` in
 * content/projects.js). Select a component — click, tap, or Tab + Enter —
 * to see its role and connections, or trace a flow through the system.
 *
 * node.kind: "process" (default) | "input" | "output" | "model" | "control"
 * edge.kind: "data" (default) | "control" | "observe"
 * edge.route: "h" (default, exits sideways) | "v" (exits top/bottom)
 */

const W = 164;
const H = 64;
const WIDTH = 960;

const wOf = (n) => n.w || W;

function route(a, b, mode) {
  if (mode === "v") {
    const down = b.y > a.y;
    const sy = a.y + (down ? H / 2 : -H / 2);
    const ey = b.y + (down ? -H / 2 : H / 2);
    const my = (sy + ey) / 2;
    const d = Math.abs(a.x - b.x) < 1 ? `M${a.x} ${sy}V${ey}` : `M${a.x} ${sy}V${my}H${b.x}V${ey}`;
    return { d, lx: b.x + 6, ly: my - 6 };
  }
  const dir = b.x >= a.x ? 1 : -1;
  const sx = a.x + (dir * wOf(a)) / 2;
  const ex = b.x - (dir * wOf(b)) / 2;
  if (Math.abs(a.y - b.y) < 1) return { d: `M${sx} ${a.y}H${ex}`, lx: (sx + ex) / 2, ly: a.y - 10 };
  const mx = (sx + ex) / 2;
  return { d: `M${sx} ${a.y}H${mx}V${b.y}H${ex}`, lx: mx + 6, ly: (a.y + b.y) / 2 };
}

const NODE_STYLE = {
  process: { fill: "var(--color-graphite-800)", stroke: "var(--color-graphite-500)", dash: undefined },
  input: { fill: "var(--color-graphite-900)", stroke: "var(--color-steel-500)", dash: "4 4" },
  output: { fill: "var(--color-graphite-900)", stroke: "var(--color-steel-300)", dash: undefined },
  model: { fill: "var(--color-signal-wash)", stroke: "var(--color-signal)", dash: undefined },
  control: { fill: "var(--color-graphite-900)", stroke: "var(--color-signal)", dash: "6 3" },
};

export function SystemDiagram({ system, className }) {
  const { nodes, edges, flows = [], height = 400, title, note } = system;
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const [node, setNode] = useState(system.initial ?? nodes[0].id);
  const [flow, setFlow] = useState(null);
  const ids = useId().replace(/:/g, "");

  const activeFlow = flows.find((f) => f.id === flow);
  const litEdges = new Set(
    activeFlow ? activeFlow.edges : edges.filter((e) => e.from === node || e.to === node).map((e) => e.id),
  );
  const litNodes = new Set(
    edges
      .filter((e) => litEdges.has(e.id))
      .flatMap((e) => [e.from, e.to])
      .concat(!activeFlow && node ? [node] : []),
  );

  const active = byId[node];
  const inputs = edges.filter((e) => e.to === node).map((e) => byId[e.from].label);
  const outputs = edges.filter((e) => e.from === node).map((e) => byId[e.to].label);

  const select = (id) => {
    setFlow(null);
    setNode(id);
  };

  return (
    <div className={cx("@container", className)}>
      <div className="grid gap-px bg-line @4xl:grid-cols-[1fr_19rem]">
      <div className="relative min-w-0 bg-graphite-900">
        <div className="label absolute left-4 top-4 z-10 text-steel-500">
          Fig. — {title}
          {note ? (
            <span className="mt-1 block max-w-xs font-sans text-xs normal-case tracking-normal text-steel-500">
              {note}
            </span>
          ) : null}
        </div>

        <div className="overflow-x-auto pt-14">
          <svg
            viewBox={`0 0 ${WIDTH} ${height}`}
            className="block w-full min-w-[42rem]"
            role="group"
            aria-labelledby={`${ids}-t`}
          >
            <title id={`${ids}-t`}>{`${title}: components and flows`}</title>
            <defs>
              <marker id={`${ids}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0 0L8 4L0 8z" fill="var(--color-steel-300)" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const lit = litEdges.has(edge.id);
              const r = route(byId[edge.from], byId[edge.to], edge.route);
              const dashed = edge.kind === "control" || edge.kind === "observe";
              return (
                <g key={edge.id} aria-hidden="true">
                  <path
                    d={r.d}
                    fill="none"
                    stroke={lit ? "var(--color-paper)" : "var(--color-graphite-500)"}
                    strokeWidth={lit ? 1.5 : 1}
                    strokeDasharray={dashed ? "5 5" : undefined}
                    markerEnd={edge.kind === "observe" ? undefined : `url(#${ids}-arrow)`}
                    className="transition-[stroke] duration-300"
                  />
                  {lit ? (
                    <path d={r.d} fill="none" stroke="var(--color-signal)" strokeWidth="3" className="flow-line" />
                  ) : null}
                  {edge.label ? (
                    <text
                      x={r.lx}
                      y={r.ly}
                      textAnchor={Math.abs(byId[edge.from].y - byId[edge.to].y) < 1 ? "middle" : "start"}
                      fill={lit ? "var(--color-signal)" : "var(--color-steel-500)"}
                      style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.1em" }}
                    >
                      {edge.label.toUpperCase()}
                    </text>
                  ) : null}
                </g>
              );
            })}

            {nodes.map((n) => {
              const isActive = n.id === node && !activeFlow;
              const lit = litNodes.has(n.id);
              const s = NODE_STYLE[n.kind || "process"];
              return (
                <g
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isActive}
                  aria-label={`${n.label}${n.sub ? `, ${n.sub}` : ""}. ${n.detail ?? ""}`}
                  data-cursor="Inspect"
                  onClick={() => select(n.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      select(n.id);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>rect:first-child]:stroke-signal [&:focus-visible>rect:first-child]:[stroke-width:2.5]"
                  style={{ opacity: lit ? 1 : 0.45, transition: "opacity 300ms" }}
                >
                  <rect
                    x={n.x - wOf(n) / 2}
                    y={n.y - H / 2}
                    width={wOf(n)}
                    height={H}
                    fill={isActive ? "var(--color-paper)" : s.fill}
                    stroke={isActive ? "var(--color-paper)" : s.stroke}
                    strokeDasharray={isActive ? undefined : s.dash}
                  />
                  {n.sub ? (
                    <text
                      x={n.x - wOf(n) / 2 + 12}
                      y={n.y - 8}
                      fill={isActive ? "var(--color-signal-deep)" : "var(--color-signal)"}
                      style={{ font: "500 10px var(--font-mono)", letterSpacing: "0.06em" }}
                    >
                      {n.sub.toUpperCase()}
                    </text>
                  ) : null}
                  <text
                    x={n.x - wOf(n) / 2 + 12}
                    y={n.y + 14}
                    fill={isActive ? "var(--color-ink)" : "var(--color-paper)"}
                    style={{ font: "600 14px var(--font-sans)" }}
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {flows.length ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-line px-4 py-3">
            <span className="label mr-2 text-steel-500">Trace</span>
            {flows.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={flow === f.id}
                onClick={() => setFlow((v) => (v === f.id ? null : f.id))}
                className={cx(
                  "label min-h-10 border px-3 transition-colors",
                  flow === f.id
                    ? "border-signal bg-signal text-ink"
                    : "border-line-strong text-steel-300 hover:border-paper hover:text-paper",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="bg-graphite-900 p-5" aria-live="polite">
        {activeFlow ? (
          <>
            <p className="label text-signal">Flow</p>
            <h4 className="display mt-2 text-2xl">{activeFlow.label}</h4>
            <p className="mt-3 text-sm text-steel-300">{activeFlow.note}</p>
            <ol className="mt-5 space-y-2 text-sm">
              {activeFlow.edges.map((id, i) => {
                const e = edges.find((x) => x.id === id);
                return (
                  <li key={id} className="flex gap-3 text-steel-300">
                    <span className="label w-5 text-steel-500">{i + 1}</span>
                    {byId[e.from].label} → {byId[e.to].label}
                  </li>
                );
              })}
            </ol>
          </>
        ) : active ? (
          <>
            <p className="label text-signal">{active.sub || "Component"}</p>
            <h4 className="display mt-2 text-2xl">{active.label}</h4>
            {active.detail ? (
              <>
                <p className="label mt-5 text-steel-500">Purpose</p>
                <p className="mt-1 text-sm text-steel-200">{active.detail}</p>
              </>
            ) : null}
            <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
              <div>
                <dt className="label text-steel-500">Receives from</dt>
                <dd className="mt-1 text-steel-200">{inputs.join(", ") || "—"}</dd>
              </div>
              <div>
                <dt className="label text-steel-500">Connects to</dt>
                <dd className="mt-1 text-steel-200">{outputs.join(", ") || "—"}</dd>
              </div>
            </dl>
          </>
        ) : null}
      </div>
      </div>
    </div>
  );
}
