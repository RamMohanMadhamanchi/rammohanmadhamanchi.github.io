"use client";

import { useRef, useState } from "react";
import { cx } from "@/lib/content";
import { ExplodedAssembly } from "./ExplodedAssembly";
import { SystemDiagram } from "./SystemDiagram";
import { getProject } from "@/content/projects";

// The intelligent-system tab shows Ram's documented multi-agent SQL pipeline.
const AGENT_SYSTEM = getProject("autonomous-sql-generation").system;

const TABS = [
  { id: "physical", label: "Physical system", index: "A" },
  { id: "software", label: "Intelligent system", index: "B" },
];

/** Tabbed viewport switching between the assembly and the architecture. */
export function Workbench() {
  const [tab, setTab] = useState("physical");
  const refs = useRef({});

  const onKeyDown = (event) => {
    const i = TABS.findIndex((t) => t.id === tab);
    const dir = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    event.preventDefault();
    const next = TABS[(i + dir + TABS.length) % TABS.length];
    setTab(next.id);
    refs.current[next.id]?.focus();
  };

  return (
    <div className="border border-paper-ink/20 bg-ink text-paper">
      <div role="tablist" aria-label="Workbench" className="flex border-b border-line" onKeyDown={onKeyDown}>
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => (refs.current[t.id] = el)}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
            className={cx(
              "label relative flex min-h-14 flex-1 items-center gap-3 px-4 text-left transition-colors sm:flex-none sm:px-6",
              tab === t.id ? "bg-graphite-900 text-paper" : "text-steel-400 hover:text-paper",
            )}
          >
            <span className={tab === t.id ? "text-signal" : "text-steel-500"}>{t.index}</span>
            {t.label}
            {tab === t.id ? <span className="absolute inset-x-0 top-0 h-0.5 bg-signal" aria-hidden="true" /> : null}
          </button>
        ))}
      </div>
      {TABS.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={tab !== t.id}
        >
          {t.id === "physical" ? <ExplodedAssembly /> : <SystemDiagram system={AGENT_SYSTEM} />}
        </div>
      ))}
    </div>
  );
}
