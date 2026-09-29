import { AnnotatedFigure } from "@/components/interactive/AnnotatedFigure";

/**
 * Case-study gallery for real engineering assets: one large primary view
 * (typically a CAD render) followed by drawings and other views.
 */
export function EngineeringMedia({ media }) {
  if (!media) return null;
  const filled = [media.primary, ...media.views].filter((a) => a?.src).length;
  return (
    <div className="space-y-8">
      {filled === 0 ? (
        <p className="border border-dashed border-signal/50 p-4 text-sm text-steel-300">
          <span className="label mr-3 text-signal">Pending</span>
          Ram&apos;s CAD renders and drawings will appear here. Until they&apos;re added, the frames
          below mark where each one goes — no stand-in imagery is used.
        </p>
      ) : null}
      <AnnotatedFigure asset={media.primary} priority />
      <div className="grid gap-8 md:grid-cols-2">
        {media.views.map((asset, i) => (
          <AnnotatedFigure key={i} asset={asset} className={i === 0 ? "md:col-span-2" : undefined} />
        ))}
      </div>
    </div>
  );
}
