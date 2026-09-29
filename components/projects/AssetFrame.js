import { cx, slotText } from "@/lib/content";

/**
 * Drafting-style frame shown where a real engineering asset belongs but
 * hasn't been added yet. It never shows stand-in imagery, so nothing can be
 * mistaken for Ram's actual work.
 */
export function AssetFrame({ kind, caption, width = 16, height = 9, className }) {
  return (
    <figure className={cx("relative", className)}>
      <div
        className="relative grid place-items-center overflow-hidden border border-dashed border-line-strong bg-graphite-900 bg-grid"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {/* crop marks */}
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((pos) => (
          <span key={pos} aria-hidden="true" className={cx("absolute size-4 border-signal/60", pos)} />
        ))}
        <svg viewBox="0 0 120 80" aria-hidden="true" className="w-24 text-steel-500 md:w-32">
          <path d="M10 70L40 30l20 24 14-16 36 32z" fill="none" stroke="currentColor" strokeDasharray="3 3" />
          <circle cx="86" cy="20" r="8" fill="none" stroke="currentColor" strokeDasharray="3 3" />
        </svg>
        <p className="label absolute left-5 top-5 text-signal">{kind} · Asset slot</p>
        <p className="label absolute bottom-5 left-5 right-5 text-steel-500">
          Add the file in <code className="normal-case">content/projects.js → media</code>
        </p>
      </div>
      {caption ? (
        <figcaption className="mt-3 text-sm italic text-steel-400">{slotText(caption)}</figcaption>
      ) : null}
    </figure>
  );
}
