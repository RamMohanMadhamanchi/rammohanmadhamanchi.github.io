import { contact } from "@/content/beyond";
import { site } from "@/content/site";
import { Text } from "@/components/system/Text";
import { Reveal } from "@/components/system/Reveal";
import { ReferenceBackdrop, ReferenceLabel } from "@/components/system/ReferenceBackdrop";
import { referenceImagery } from "@/content/reference";
import { isPlaceholder, usableHref } from "@/lib/content";

export function Contact() {
  const email = isPlaceholder(site.email) ? null : site.email;
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative overflow-hidden bg-grid section-y">
      <ReferenceBackdrop
        image={referenceImagery.contactBackdrop}
        parallax={-60}
        className="-right-[10%] top-[8%] h-[80%] w-[70%] [--reference-opacity:0.09] md:w-[55%]"
      />
      <div className="container-x relative">
        <p className="label flex items-center gap-3 text-steel-400">
          <span className="text-signal">06</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
          {contact.eyebrow}
        </p>

        <Reveal>
          <h2 id="contact-title" className="display mt-10 max-w-[14ch] text-display-xl">
            {contact.statement}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 border-t border-line pt-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <Text as="p" value={contact.body} className="block text-lg text-steel-300" />
            <p className="label mt-6 text-steel-500">
              Based in <Text value={site.location} />
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            {email ? (
              <a
                href={`mailto:${email}`}
                className="group display flex items-center justify-between gap-4 border-b border-line-strong pb-4 text-[clamp(1.4rem,3vw,2.5rem)] transition-colors hover:border-signal hover:text-signal"
              >
                {email}
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-2">→</span>
              </a>
            ) : (
              <p className="display border-b border-line-strong pb-4 text-[clamp(1.4rem,3vw,2.5rem)]">
                <Text value={site.email} />
              </p>
            )}

            <ul className="mt-6">
              {site.links.map((link) => {
                const href = usableHref(link.href);
                return (
                  <li key={link.label} className="border-b border-line">
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="group flex min-h-14 items-center justify-between gap-4 py-3 transition-colors hover:text-signal"
                      >
                        <span className="text-lg">{link.label}</span>
                        <span aria-hidden="true" className="label text-steel-500 transition-colors group-hover:text-signal">
                          ↗
                        </span>
                      </a>
                    ) : (
                      <div className="flex min-h-14 items-center justify-between gap-4 py-3">
                        <span className="text-lg text-steel-400">{link.label}</span>
                        <Text value={link.href} className="text-sm" />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <ReferenceLabel image={referenceImagery.contactBackdrop} className="mt-16 border-t border-line pt-4" />
      </div>
    </section>
  );
}
