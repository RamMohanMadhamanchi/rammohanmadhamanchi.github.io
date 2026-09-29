import Link from "next/link";
import { capabilityGroups, contexts, usage } from "@/content/capabilities";
import { getProject } from "@/content/projects";
import { SectionHeading } from "@/components/system/SectionHeading";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { cx } from "@/lib/content";

export function Capabilities() {
  return (
    <section
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="section-y bg-paper text-paper-ink [--slot-color:var(--color-paper-muted)] [--slot-line:var(--color-signal-deep)]"
    >
      <div className="container-x">
        <SectionHeading
          id="capabilities-title"
          index="03"
          eyebrow="Engineering capabilities"
          title="An evidence map, not a skills cloud."
          lede="Every technology is placed where it was actually used — in production, in a role, in training or on a project. No self-rated proficiency bars."
          tone="paper"
        />

        <Legend className="mt-16 md:hidden" />

        {/* Desktop: matrix. The legend and column headings stay pinned below
            the site header while scrolling through the rows. */}
        <Reveal className="mt-16 hidden md:block">
          <table className="w-full border-collapse text-left">
            <caption className="sr-only">
              Technologies by the context where each was used, with linked case studies
            </caption>
            <thead className="sticky top-[var(--header-h)] z-10 bg-paper shadow-[0_2px_0_var(--color-paper-ink)]">
              <tr>
                <td colSpan={contexts.length + 2} className="pb-4 pt-5">
                  <Legend />
                </td>
              </tr>
              <tr className="label text-paper-muted [&>th]:shadow-[inset_0_2px_0_var(--color-paper-ink)]">
                <th scope="col" className="w-[30%] py-3 pr-4 font-normal">Technology</th>
                {contexts.map((c) => (
                  <th key={c.id} scope="col" className="px-2 py-3 text-center font-normal" title={c.note}>
                    <span className="block text-paper-ink">{c.short}</span>
                    <span className="block text-[0.625rem]">{c.period || "—"}</span>
                  </th>
                ))}
                <th scope="col" className="w-[22%] py-3 pl-4 font-normal">Case studies</th>
              </tr>
            </thead>
            {capabilityGroups.map((group) => (
              <tbody key={group.code} className="group/cap">
                <tr>
                  <th scope="rowgroup" colSpan={contexts.length + 2} className="pb-3 pt-10 text-left font-normal">
                    <span className="flex items-baseline gap-4">
                      <span className="label text-signal-deep">{group.code}</span>
                      <span className="display text-2xl">{group.title}</span>
                      <span className="hidden text-sm text-paper-muted lg:inline">{group.description}</span>
                    </span>
                  </th>
                </tr>
                {group.items.map((item) => (
                  <tr key={item.name} className="border-t border-line-paper transition-colors hover:bg-paper-100">
                    <th scope="row" className="py-3 pr-4 font-normal">
                      <Text value={item.name} />
                    </th>
                    {contexts.map((c) => (
                      <td key={c.id} className="px-2 py-3 text-center">
                        <Mark type={item.uses[c.id]} context={c.label} />
                      </td>
                    ))}
                    <td className="py-3 pl-4">
                      <ProjectRefs slugs={item.projects} />
                    </td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </Reveal>

        {/* Mobile: grouped list */}
        <div className="mt-8 space-y-10 md:hidden">
          {capabilityGroups.map((group) => (
            <div key={group.code}>
              <p className="label text-signal-deep">{group.code}</p>
              <h3 className="display mt-1 text-2xl">{group.title}</h3>
              <ul className="mt-4 border-t border-line-paper">
                {group.items.map((item) => (
                  <li key={item.name} className="border-b border-line-paper py-3">
                    <Text value={item.name} className="font-medium" />
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(item.uses).map(([ctx, type]) => (
                        <span key={ctx} className="label flex items-center gap-2 text-paper-muted">
                          <Mark type={type} />
                          {contexts.find((c) => c.id === ctx)?.short}
                        </span>
                      ))}
                    </div>
                    {item.projects.length ? (
                      <div className="mt-2">
                        <ProjectRefs slugs={item.projects} />
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Legend({ className }) {
  return (
    <ul className={cx("flex flex-wrap gap-x-8 gap-y-3", className)} aria-label="Legend">
      {Object.entries(usage).map(([type, { label }]) => (
        <li key={type} className="label flex items-center gap-2 text-paper-muted">
          <Mark type={type} />
          {label}
        </li>
      ))}
    </ul>
  );
}

/** Glyph for how a technology was used in a context. */
function Mark({ type, context }) {
  if (!type) return <span aria-hidden="true" className="text-paper-ink/15">·</span>;
  const label = context ? `${usage[type].label} at ${context}` : usage[type].label;
  const shape = {
    production: <rect x="1" y="1" width="12" height="12" fill="var(--color-signal-deep)" />,
    work: <rect x="1" y="1" width="12" height="12" fill="var(--color-paper-ink)" />,
    training: (
      <>
        <rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="var(--color-paper-ink)" />
        <path d="M1.5 12.5L12.5 1.5V12.5Z" fill="var(--color-paper-ink)" />
      </>
    ),
    project: <rect x="1.5" y="1.5" width="11" height="11" fill="none" stroke="var(--color-paper-ink)" strokeWidth="1.2" />,
  }[type];
  return (
    <svg viewBox="0 0 14 14" className="inline-block size-3.5 align-middle" role="img" aria-label={label}>
      <title>{label}</title>
      {shape}
    </svg>
  );
}

function ProjectRefs({ slugs }) {
  if (!slugs.length) return <span className="label text-paper-ink/30">—</span>;
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-1">
      {slugs.map((slug) => {
        const project = getProject(slug);
        if (!project) return null;
        return (
          <Link
            key={slug}
            href={`/projects/${slug}/`}
            title={project.title}
            className="label text-paper-muted underline-offset-4 hover:text-signal-deep hover:underline"
          >
            <span className="text-signal-deep">{project.index}</span> {project.title.split(" ").slice(0, 2).join(" ")}
          </Link>
        );
      })}
    </span>
  );
}
