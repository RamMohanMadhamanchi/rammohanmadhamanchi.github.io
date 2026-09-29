import Link from "next/link";
import { notFound } from "next/navigation";
import { eras, getAdjacentProjects, getProject, projects } from "@/content/projects";
import { site } from "@/content/site";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { ProjectVisual } from "@/components/projects/ProjectVisual";
import { EngineeringMedia } from "@/components/projects/EngineeringMedia";
import { ExplodedAssembly } from "@/components/interactive/ExplodedAssembly";
import { SystemDiagram } from "@/components/interactive/SystemDiagram";
import { BlueprintCompare } from "@/components/interactive/BlueprintCompare";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}/` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.summary,
      url: `/projects/${slug}/`,
      images: ["/og.png"],
    },
  };
}

const EXHIBITS = {
  media: {
    caption: "CAD renders, engineering drawings and views from the work, with callouts on the details that matter.",
    render: (project) => <EngineeringMedia media={project.media} />,
  },
  system: {
    caption: "Explore the system — select a component, or trace a flow through it.",
    render: (project) => (
      <div className="border border-line">
        <SystemDiagram system={project.system} />
      </div>
    ),
  },
  exploded: {
    caption:
      "A generic excavator, drawn to show how the machine is put together — not the L&T prototype or any specific machine. Rotate it, explode it and inspect each part. Once a .glb export of one of Ram's models is added, a 3D viewer of the real model can take its place.",
    render: () => (
      <div className="border border-line">
        <ExplodedAssembly />
      </div>
    ),
  },
  blueprint: {
    caption: "From drawing to model: the same part as a technical drawing and as a CAD render.",
    render: (project) => <BlueprintCompare pair={project.media?.compare} tone="dark" />,
  },
};

export default async function CaseStudy({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { previous, next } = getAdjacentProjects(slug);
  const exhibits = project.exhibits.filter(
    (id) => EXHIBITS[id] && (id !== "system" || project.system) && (id !== "media" || project.media),
  );

  const sections = [
    { id: "context", label: "Context" },
    { id: "contribution", label: "Contribution" },
    { id: "how", label: "How it works" },
    { id: "results", label: "Results" },
    ...(exhibits.length ? [{ id: "exhibit", label: "Exhibit" }] : []),
  ];
  const n = (id) => `${project.index}.${sections.findIndex((s) => s.id === id) + 1}`;

  return (
    <article className="pt-[var(--header-h)]">
      {/* Header */}
      <header className="container-x pb-12 pt-12 md:pt-20">
        <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2 text-steel-500">
          <Link href="/#work" className="text-steel-300 hover:text-signal">
            ← Selected work
          </Link>
          <span aria-hidden="true">/</span>
          <span>{eras[project.era].label}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Project {project.index}</span>
        </nav>

        <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-2">
            <span className="display text-7xl leading-none text-signal md:text-8xl">{project.index}</span>
          </div>
          <div className="md:col-span-10">
            <p className="label text-steel-400">{project.subtitle}</p>
            <h1 className="display mt-4 max-w-[18ch] text-display">{project.title}</h1>
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-steel-200">{project.summary}</p>
          </div>
        </div>
      </header>

      {/* Title block */}
      <dl className="container-x grid grid-cols-2 gap-px md:grid-cols-4">
        {[
          ["Organisation", project.org],
          ["Period", project.period],
          ["Role", project.role],
        ].map(([label, value]) => (
          <div key={label} className="border-t border-line-strong py-4 pr-4">
            <dt className="label text-steel-500">{label}</dt>
            <dd className="mt-2">
              <Text value={value} />
            </dd>
          </div>
        ))}
        <div className="col-span-2 border-t border-line-strong py-4 md:col-span-1">
          <dt className="label text-steel-500">Stack</dt>
          <dd className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
            {project.stack.map((tech) => (
              <Text key={tech} value={tech} />
            ))}
          </dd>
        </div>
      </dl>

      {/* Figure */}
      <div className="container-x mt-10">
        <div className="relative overflow-hidden border border-line bg-graphite-900 bg-grid text-steel-200">
          <ProjectVisual project={project} className="mx-auto max-w-4xl p-6 md:p-12" sizes="100vw" priority />
          <span className="label absolute left-4 top-4 bg-ink/70 px-1 text-steel-500">
            Fig. {project.index}.0 · {project.media?.primary?.src ? project.media.primary.kind : "Illustration"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="container-x section-y grid gap-12 lg:grid-cols-12 lg:gap-6">
        <aside className="hidden lg:col-span-3 lg:block">
          <nav aria-label="Case study sections" className="sticky top-[calc(var(--header-h)+2rem)]">
            <p className="label text-steel-500">Contents</p>
            <ol className="mt-4 space-y-1 border-l border-line">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="label -ml-px flex gap-3 border-l border-transparent py-2 pl-4 text-steel-400 hover:border-signal hover:text-paper"
                  >
                    <span className="text-steel-500">{n(s.id)}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0 space-y-24 lg:col-span-8 lg:col-start-5">
          <Block id="context" n={n("context")} title="Context">
            <p className="text-xl leading-relaxed text-steel-200">{project.context}</p>
          </Block>

          <Block id="contribution" n={n("contribution")} title="Contribution">
            <ul className="border-t border-line">
              {project.contributions.map((item, i) => (
                <li key={i} className="flex gap-6 border-b border-line py-4">
                  <span className="label pt-1.5 text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <Text value={item} className="text-lg" />
                </li>
              ))}
            </ul>
          </Block>

          <Block id="how" n={n("how")} title="How it works" note="Descriptive — an explanation of the system, not a reported result.">
            <ol className="grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-3">
              {project.howItWorks.map((step, i) => (
                <li key={step.title} className="bg-ink p-5">
                  <p className="label text-steel-500">Step {String(i + 1).padStart(2, "0")}</p>
                  <h3 className="display mt-3 text-xl">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-300">{step.body}</p>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="results" n={n("results")} title="Documented results">
            {project.results.length ? (
              <>
                <dl className="grid gap-px border border-line bg-line sm:grid-cols-2">
                  {project.results.map((r) => (
                    <div key={r.label} className="flex flex-col bg-ink p-6">
                      <dt className="sr-only">{r.label}</dt>
                      <dd className="display text-5xl text-paper md:text-6xl">{r.value}</dd>
                      <dd className="mt-3 text-steel-300">{r.label}</dd>
                      <dd className="label mt-auto pt-5 text-steel-500">Source · {r.source}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-4 text-sm text-steel-500">
                  Figures as reported on my résumé, each kept with the description it was reported against.
                </p>
              </>
            ) : (
              <p className="border border-dashed border-line-strong p-5 text-steel-400">
                No quantified results are documented for this project. It&apos;s included as evidence of
                my engineering foundation.
              </p>
            )}
          </Block>

          {exhibits.length ? (
            <Block id="exhibit" n={n("exhibit")} title="Exhibit">
              <div className="space-y-14">
                {exhibits.map((id) => (
                  <div key={id}>
                    <p className="mb-5 max-w-2xl text-steel-300">{EXHIBITS[id].caption}</p>
                    {EXHIBITS[id].render(project)}
                  </div>
                ))}
              </div>
            </Block>
          ) : null}
        </div>
      </div>

      {/* Project navigation */}
      <nav aria-label="More projects" className="border-t border-line">
        <div className="container-x grid md:grid-cols-2">
          <Link href={`/projects/${previous.slug}/`} className="group border-b border-line py-10 md:border-b-0 md:border-r md:pr-10">
            <span className="label text-steel-500">← Previous · {previous.index}</span>
            <span className="display mt-3 block text-3xl transition-colors group-hover:text-signal">{previous.title}</span>
          </Link>
          <Link href={`/projects/${next.slug}/`} className="group py-10 text-right md:pl-10" data-cursor="Next case study">
            <span className="label text-steel-500">Next · {next.index} →</span>
            <span className="display mt-3 block text-3xl transition-colors group-hover:text-signal">{next.title}</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}

function Block({ id, n, title, note, children }) {
  return (
    <Reveal as="section" id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28">
      <div className="label flex items-center gap-3 text-steel-500">
        <span className="text-signal">{n}</span>
        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
      </div>
      <h2 id={`${id}-h`} className="display mt-3 text-display-sm">
        {title}
      </h2>
      {note ? <p className="label mt-3 text-steel-500">{note}</p> : null}
      <div className="mt-8">{children}</div>
    </Reveal>
  );
}
