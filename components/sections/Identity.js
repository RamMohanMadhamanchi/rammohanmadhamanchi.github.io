import { identity } from "@/content/identity";
import { education } from "@/content/site";
import { getProject } from "@/content/projects";
import { SectionHeading } from "@/components/system/SectionHeading";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { BlueprintCompare } from "@/components/interactive/BlueprintCompare";
import { Workbench } from "@/components/interactive/Workbench";

// Ram's real drawing/render pair, once added to the mechanical case study.
const COMPARE = getProject("excavator-prototype-engineering")?.media?.compare;

export function Identity() {
  return (
    <section
      id="identity"
      aria-labelledby="identity-title"
      className="section-y bg-paper text-paper-ink [--slot-color:var(--color-paper-muted)] [--slot-line:var(--color-signal-deep)]"
    >
      <div className="container-x">
        <SectionHeading
          id="identity-title"
          index="01"
          eyebrow="Professional identity"
          title={identity.heading}
          lede={identity.lede}
          tone="paper"
        />

        {/* Physical → Software → Data → Intelligent */}
        <ol className="mt-20 grid gap-px border border-line-paper bg-line-paper md:grid-cols-2 xl:grid-cols-4">
          {identity.phases.map((phase, i) => (
            <Phase key={phase.id} phase={phase} n={i + 1} last={i === identity.phases.length - 1} />
          ))}
        </ol>

        {/* The turn + parallels */}
        <div className="mt-20 grid gap-14 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-5">
            <p className="label text-signal-deep">{identity.transition.title}</p>
            <p className="mt-4 text-xl leading-relaxed">{identity.transition.fact}</p>
            <Text as="p" value={identity.transition.why} className="mt-4 block leading-relaxed" />
            <p className="label mt-8 border-t border-line-paper pt-4 text-paper-muted">
              Foundation · {education.degree} · {education.institution} · {education.period} ·{" "}
              {education.grade}
            </p>
          </Reveal>

          <Reveal className="md:col-span-6 md:col-start-7" delay={0.1}>
            <table className="w-full border-collapse text-left">
              <caption className="label mb-4 text-left text-paper-muted">
                What carried over — conceptual parallels
              </caption>
              <thead>
                <tr className="label border-b border-paper-ink/30 text-paper-muted">
                  <th scope="col" className="py-3 pr-4 font-normal">Mechanical</th>
                  <th scope="col" className="w-8 py-3" aria-hidden="true" />
                  <th scope="col" className="py-3 font-normal">Data & AI</th>
                </tr>
              </thead>
              <tbody>
                {identity.parallels.map((row) => (
                  <tr key={row.physical} className="group border-b border-line-paper">
                    <td className="py-4 pr-4 text-lg">{row.physical}</td>
                    <td className="py-4 text-signal-deep" aria-hidden="true">
                      <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </td>
                    <td className="py-4 text-lg font-medium">{row.digital}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
        </div>

        {/* Blueprint → render */}
        <Reveal className="mt-24">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="display text-display-sm max-w-[20ch]">Where it started: the drawing.</h3>
            <p className="max-w-md text-paper-muted">
              Mechanical design is the discipline of making intent unambiguous — the same idea has
              to survive the move from drawing to model to manufactured part.
            </p>
          </div>
          <BlueprintCompare pair={COMPARE} />
        </Reveal>
      </div>

      {/* Workbench: both systems, explorable */}
      <div className="container-x mt-24">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h3 className="display text-display-sm max-w-[20ch]">Two systems on the bench.</h3>
            <p className="max-w-md text-paper-muted">
              A mechanical assembly and my multi-agent SQL pipeline answer the same question:
              how do the parts fit, and what flows between them?
            </p>
          </div>
        </Reveal>
        <Workbench />
      </div>
    </section>
  );
}

function Phase({ phase, n, last }) {
  return (
    <Reveal as="li" delay={n * 0.06} className="relative flex flex-col bg-paper p-6 md:p-8">
      <div className="label flex items-center justify-between text-paper-muted">
        <span>
          <span className="text-signal-deep">{String(n).padStart(2, "0")}</span> · {phase.stage}
        </span>
        <Text value={phase.period} />
      </div>
      <PhaseGlyph id={phase.id} />
      <h3 className="display mt-6 text-[clamp(1.6rem,2.2vw,2.1rem)] leading-none">{phase.title}</h3>
      <p className="label mt-3 text-paper-muted">{phase.where}</p>
      <p className="mt-5 leading-relaxed">{phase.summary}</p>
      <p className="mt-5 border-l-2 border-signal-deep pl-3 text-sm font-medium italic">{phase.principle}</p>
      <ul className="mt-6 space-y-2 border-t border-line-paper pt-5">
        {phase.work.map((item) => (
          <li key={item} className="flex gap-3 text-sm">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-signal-deep" />
            {item}
          </li>
        ))}
      </ul>
      <Text as="p" value={phase.story} className="mt-6 block text-sm leading-relaxed" />
      {!last ? (
        <span
          aria-hidden="true"
          className="absolute -right-3 top-1/2 z-10 hidden size-6 -translate-y-1/2 place-items-center border border-signal-deep bg-paper text-xs text-signal-deep xl:grid"
        >
          →
        </span>
      ) : null}
    </Reveal>
  );
}

/** Small drawing that marks each phase: part → interface → pipeline → agents. */
function PhaseGlyph({ id }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.2 };
  return (
    <svg viewBox="0 0 160 60" aria-hidden="true" className="mt-6 h-12 w-auto text-paper-ink/70">
      {id === "physical" ? (
        <>
          <circle cx="30" cy="30" r="22" {...s} />
          <circle cx="30" cy="30" r="8" {...s} />
          <path d="M2 30h56M30 2v56" stroke="var(--color-signal-deep)" strokeWidth="0.8" strokeDasharray="6 2 2 2" />
          <path d="M70 30h80M70 22v16M150 22v16" {...s} strokeWidth="0.8" />
        </>
      ) : id === "software" ? (
        <>
          <rect x="4" y="6" width="72" height="48" {...s} />
          <path d="M4 16h72" {...s} />
          <circle cx="11" cy="11" r="1.5" fill="currentColor" />
          <circle cx="17" cy="11" r="1.5" fill="currentColor" />
          <path d="M14 28h24M14 36h40M14 44h18" {...s} strokeWidth="0.8" />
          <path d="M92 22l-8 8 8 8M112 22l8 8-8 8M106 18l-8 24" {...s} stroke="var(--color-signal-deep)" />
        </>
      ) : id === "data" ? (
        <>
          <path d="M8 16v28c0 4 8 6 16 6s16-2 16-6V16" {...s} />
          <ellipse cx="24" cy="16" rx="16" ry="5" {...s} />
          <path d="M40 30h40M100 30h40" {...s} />
          <rect x="80" y="18" width="20" height="24" {...s} />
          <rect x="140" y="18" width="16" height="24" {...s} />
          <path d="M40 30h116" stroke="var(--color-signal-deep)" strokeWidth="2" strokeDasharray="2 10" />
        </>
      ) : (
        <>
          <rect x="62" y="2" width="36" height="16" {...s} stroke="var(--color-signal-deep)" />
          <path d="M80 18v10M20 28h120M20 28v12M80 28v12M140 28v12" {...s} strokeDasharray="3 3" />
          <rect x="4" y="40" width="32" height="16" {...s} />
          <rect x="64" y="40" width="32" height="16" {...s} />
          <rect x="124" y="40" width="32" height="16" {...s} />
        </>
      )}
    </svg>
  );
}
