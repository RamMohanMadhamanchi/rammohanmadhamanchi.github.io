import { site } from "@/content/site";
import { ActionLink } from "@/components/system/ActionLink";
import { Text } from "@/components/system/Text";
import { ReferenceBackdrop, ReferenceLabel } from "@/components/system/ReferenceBackdrop";
import { referenceImagery } from "@/content/reference";
import { HeroVisual } from "./HeroVisual";

const delay = (ms) => ({ "--intro-delay": `${ms}ms` });

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative flex min-h-dvh flex-col overflow-hidden bg-grid pt-[var(--header-h)]"
    >
      {/* Reference backdrop — atmosphere only, labelled below */}
      <ReferenceBackdrop
        image={referenceImagery.heroBackdrop}
        parallax={120}
        className="reference-sweep inset-x-0 top-[var(--header-h)] h-[70svh] md:left-[12%] md:right-[-6%]"
      />

      {/* Figure area */}
      <HeroVisual className="min-h-[42svh] flex-1" />

      {/* Title block */}
      <div className="container-x relative pb-10 pt-6 md:pb-14">
        <p
          data-intro-hide="rise"
          style={delay(0)}
          className="label mb-5 flex items-center gap-3 text-steel-400"
        >
          <span className="text-signal">Sheet 00</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          Engineered to evolve
        </p>

        <h1
          id="hero-title"
          data-intro-hide="rise"
          style={delay(80)}
          className="display text-[clamp(2.5rem,6.3vw,7.5rem)] leading-[0.9]"
        >
          {site.name}
        </h1>

        <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-12 md:gap-6">
          <div data-intro-hide="rise" style={delay(220)} className="md:col-span-6">
            <p className="label text-steel-500">Current designation</p>
            <p className="mt-2 text-lg font-medium text-paper md:text-xl">
              <Text value={site.currentTitle} />
            </p>
            <p className="mt-1 text-steel-400">
              {site.currentOrg} · <Text value={site.location} />
            </p>
            <ol aria-label="Career path" className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-2">
              {site.path.map((step, i) => (
                <li key={step} className="label flex items-center gap-2 text-steel-400">
                  {i > 0 ? (
                    <span aria-hidden="true" className="text-signal">
                      →
                    </span>
                  ) : null}
                  <span className={i === site.path.length - 1 ? "text-paper" : undefined}>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <p data-intro-hide="rise" style={delay(360)} className="max-w-xl text-lg leading-relaxed text-steel-200">
              {site.intro}
            </p>
            <div data-intro-hide="rise" style={delay(500)} className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="#work">View selected work</ActionLink>
              <ActionLink href="#timeline" variant="outline">
                Career timeline
              </ActionLink>
            </div>
          </div>
        </div>
        <ReferenceLabel
          image={referenceImagery.heroBackdrop}
          className="mt-10 border-t border-line pt-4"
        />
      </div>
    </section>
  );
}
