import Link from "next/link";
import { eras, projects } from "@/content/projects";
import { SectionHeading } from "@/components/system/SectionHeading";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { cx } from "@/lib/content";

const CHAPTERS = ["intelligent", "data", "physical"];

export function Work() {
  return (
    <section id="work" aria-labelledby="work-title" className="section-y">
      <div className="container-x">
        <SectionHeading
          id="work-title"
          index="02"
          eyebrow="Selected projects"
          title="Systems that had to hold up in production."
          lede="Multi-agent AI and healthcare data engineering today, grounded in mechanical prototype work. Each project opens into a case study."
        />

        {CHAPTERS.map((era) => {
          const list = projects.filter((p) => p.era === era);
          if (!list.length) return null;
          const featured = list.filter((p) => p.tier === "principal");
          const rest = list.filter((p) => p.tier !== "principal");
          return (
            <div key={era} className="mt-24">
              <ChapterHeader era={era} count={list.length} />
              {featured.length ? (
                <ol className="mt-8 space-y-6 md:space-y-10">
                  {featured.map((project, i) => (
                    <li key={project.slug}>
                      <Reveal>
                        <ProjectRow project={project} flip={i % 2 === 1} />
                      </Reveal>
                    </li>
                  ))}
                </ol>
              ) : null}
              {rest.length ? (
                <ul className="mt-6 grid gap-6 md:grid-cols-2">
                  {rest.map((project, i) => (
                    <li key={project.slug}>
                      <Reveal delay={i * 0.06} className="h-full">
                        <FoundationCard project={project} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ChapterHeader({ era, count }) {
  const { label, code } = eras[era];
  return (
    <div className="label flex items-center gap-4 text-steel-400">
      <span className="border border-signal px-2 py-1 text-signal">{code}</span>
      <span className="text-paper">{label}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-line-strong" />
      <span className="text-steel-500">{String(count).padStart(2, "0")}</span>
    </div>
  );
}

function ProjectRow({ project, flip }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      data-cursor="Open case study"
      className="group grid overflow-hidden border border-line bg-graphite-900 transition-colors duration-300 hover:border-line-strong focus-visible:border-signal md:grid-cols-12"
    >
      <div
        className={cx(
          "relative overflow-hidden border-line bg-grid text-steel-300 transition-colors duration-500 card-on:text-paper md:col-span-7",
          flip ? "md:order-2 md:border-l" : "border-b md:border-b-0 md:border-r",
        )}
      >
        <ProjectVisual project={project} className="p-6 md:p-10" />
        <span className="label absolute left-4 top-4 text-steel-500">Fig. {project.index}</span>
      </div>

      <div className="flex flex-col p-6 md:col-span-5 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="display text-6xl leading-none text-graphite-500 transition-colors duration-500 card-on:text-signal md:text-7xl">
            {project.index}
          </span>
          <span className="label pt-1 text-right text-steel-500">{project.org}</span>
        </div>

        <h3 className="display mt-8 text-[clamp(1.8rem,3vw,2.6rem)] leading-[0.95]">{project.title}</h3>
        <p className="label mt-3 text-signal">{project.subtitle}</p>
        <p className="mt-4 leading-relaxed text-steel-300">{project.summary}</p>

        {project.results.length ? (
          <div className="mt-8 border-t border-line pt-5">
            <p className="label text-steel-500">Documented results</p>
            <dl className="mt-3 grid grid-cols-2 gap-4">
              {project.results.slice(0, 2).map((r) => (
                <div key={r.label}>
                  <dt className="sr-only">{r.label}</dt>
                  <dd className="display text-3xl text-paper">{r.value}</dd>
                  <dd className="mt-1 text-xs leading-snug text-steel-400">{r.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <ul className="mt-6 flex flex-wrap gap-1.5" aria-label="Stack">
          {project.stack.map((tech) => (
            <li key={tech} className="label border border-line px-2 py-1 text-steel-400">
              <Text value={tech} />
            </li>
          ))}
        </ul>

        <span className="label mt-auto flex items-center gap-3 pt-10 text-paper">
          Read case study
          <span aria-hidden="true" className="h-px w-8 bg-current transition-all duration-500 card-on:w-16 card-on:bg-signal" />
        </span>
      </div>
    </Link>
  );
}

function FoundationCard({ project }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      data-cursor="Open case study"
      className="group flex h-full flex-col border border-line bg-graphite-900 transition-colors duration-300 hover:border-line-strong focus-visible:border-signal"
    >
      <div className="relative overflow-hidden border-b border-line bg-grid text-steel-300 transition-colors duration-500 card-on:text-paper">
        <ProjectVisual project={project} className="p-4" sizes="(min-width: 768px) 45vw, 100vw" />
        <span className="label absolute left-3 top-3 text-steel-500">Fig. {project.index}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="label text-steel-500">
          <Text value={project.org} /> · <Text value={project.period} />
        </p>
        <h3 className="display mt-3 text-2xl leading-tight">{project.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-steel-300">{project.summary}</p>
        <span className="label mt-auto flex items-center gap-3 pt-8 text-paper">
          Case study
          <span aria-hidden="true" className="h-px w-6 bg-current transition-all duration-500 card-on:w-12 card-on:bg-signal" />
        </span>
      </div>
    </Link>
  );
}
