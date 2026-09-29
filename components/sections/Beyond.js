import Image from "next/image";
import { beyond } from "@/content/beyond";
import { SectionHeading } from "@/components/system/SectionHeading";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { usableHref } from "@/lib/content";

export function Beyond() {
  return (
    <section
      id="beyond"
      aria-labelledby="beyond-title"
      className="section-y bg-paper text-paper-ink [--slot-color:var(--color-paper-muted)] [--slot-line:var(--color-signal-deep)]"
    >
      <div className="container-x">
        <SectionHeading id="beyond-title" index="05" eyebrow="Beyond engineering" title={beyond.heading} tone="paper" />

        <div className="mt-20 grid gap-14 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-5">
            <Portrait portrait={beyond.portrait} />
          </Reveal>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <Text as="p" value={beyond.intro} className="block text-xl leading-relaxed" />
            </Reveal>

            <Reveal className="mt-12">
              <h3 className="label text-paper-muted">Interests</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {beyond.interests.map((item, i) => (
                  <li key={i} className="border border-paper-ink/25 px-4 py-2">
                    <Text value={item} />
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-12">
              <h3 className="label text-paper-muted">Personal projects</h3>
              <ul className="mt-4 divide-y divide-line-paper border-y border-line-paper">
                {beyond.personalProjects.map((project, i) => {
                  const href = usableHref(project.href);
                  const title = <Text value={project.title} className="text-lg font-medium" />;
                  return (
                    <li key={i} className="py-5">
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-signal-deep">
                          {title} <span aria-hidden="true">↗</span>
                        </a>
                      ) : (
                        title
                      )}
                      <Text as="p" value={project.body} className="mt-1 block text-paper-muted" />
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>

        {/* Working philosophy */}
        <div className="mt-24">
          <h3 className="label text-paper-muted">Working philosophy</h3>
          <ol className="mt-6 grid gap-px border border-line-paper bg-line-paper md:grid-cols-3">
            {beyond.philosophy.map((item, i) => (
              <Reveal as="li" key={i} delay={i * 0.08} className="bg-paper p-6 md:p-8">
                <span className="display text-4xl text-signal-deep">{String(i + 1).padStart(2, "0")}</span>
                <Text as="p" value={item.title} className="display mt-6 block text-2xl leading-tight" />
                <Text as="p" value={item.body} className="mt-3 block text-paper-muted" />
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Portrait({ portrait }) {
  return (
    <figure className="relative">
      {/* crop marks */}
      <span aria-hidden="true" className="absolute -left-3 -top-3 size-6 border-l border-t border-paper-ink/60" />
      <span aria-hidden="true" className="absolute -right-3 -top-3 size-6 border-r border-t border-paper-ink/60" />
      <span aria-hidden="true" className="absolute -bottom-3 -left-3 size-6 border-b border-l border-paper-ink/60" />
      <span aria-hidden="true" className="absolute -bottom-3 -right-3 size-6 border-b border-r border-paper-ink/60" />

      <div className="relative aspect-[4/5] overflow-hidden bg-paper-300">
        {portrait.src ? (
          <Image
            src={portrait.src}
            alt={portrait.alt}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover grayscale-[35%]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center bg-grid bg-grid-paper">
            <svg viewBox="0 0 200 250" className="w-1/2 text-paper-ink/35" aria-hidden="true">
              <circle cx="100" cy="90" r="42" fill="none" stroke="currentColor" strokeDasharray="4 4" />
              <path d="M30 240c6-48 36-76 70-76s64 28 70 76" fill="none" stroke="currentColor" strokeDasharray="4 4" />
              <path d="M100 20V240M20 90H180" stroke="var(--color-signal-deep)" strokeWidth="0.6" strokeDasharray="10 3 2 3" />
            </svg>
            <p className="label absolute bottom-4 left-4 right-4 text-paper-muted">
              Portrait — set <code className="normal-case">beyond.portrait.src</code>
            </p>
          </div>
        )}
      </div>
      <figcaption className="label mt-5 flex justify-between text-paper-muted">
        <span>Fig. — Portrait</span>
        <span>Scale 1:1</span>
      </figcaption>
    </figure>
  );
}
