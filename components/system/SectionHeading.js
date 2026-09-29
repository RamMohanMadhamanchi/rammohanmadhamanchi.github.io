import { cx } from "@/lib/content";

/**
 * Section header styled as a drawing title block:
 * sheet index · section name, then a display heading and optional lede.
 */
export function SectionHeading({ index, eyebrow, title, lede, tone = "dark", id, className }) {
  const onPaper = tone === "paper";
  return (
    <header className={cx("grid gap-8 md:grid-cols-12 md:gap-6", className)}>
      <div className="md:col-span-3">
        <div
          className={cx(
            "label flex items-center gap-3 border-t pt-3",
            onPaper ? "border-paper-ink/25 text-paper-muted" : "border-line-strong text-steel-400",
          )}
        >
          <span className={onPaper ? "text-signal-deep" : "text-signal"}>{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-current opacity-40" />
          <span>{eyebrow}</span>
        </div>
      </div>
      <div className="md:col-span-9">
        <h2 id={id} className="display text-display max-w-[16ch]">
          {title}
        </h2>
        {lede ? (
          <p
            className={cx(
              "mt-6 max-w-2xl text-lg leading-relaxed md:text-xl",
              onPaper ? "text-paper-muted" : "text-steel-300",
            )}
          >
            {lede}
          </p>
        ) : null}
      </div>
    </header>
  );
}
