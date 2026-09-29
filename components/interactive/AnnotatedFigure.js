"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { cx } from "@/lib/content";
import { AssetFrame } from "@/components/projects/AssetFrame";
import { Text } from "@/components/system/Text";

/**
 * A real render, drawing or photo with numbered callouts, like balloons on
 * an engineering drawing. Callouts are buttons (click, tap, Tab + Enter)
 * and are mirrored in a list below the image. Falls back to an empty asset
 * frame when no file has been added.
 *
 * asset: { src, width, height, alt, caption, kind, annotations: [{ x, y, label, note }] }
 * x / y are percentages of the image.
 */
export function AnnotatedFigure({ asset, priority = false, className }) {
  const [active, setActive] = useState(null);
  const ids = useId();

  if (!asset?.src) {
    return (
      <AssetFrame
        kind={asset?.kind ?? "Asset"}
        caption={asset?.caption}
        width={asset?.width}
        height={asset?.height}
        className={className}
      />
    );
  }

  const notes = asset.annotations ?? [];
  const current = active != null ? notes[active] : null;

  return (
    <figure className={className}>
      <div className="relative overflow-hidden border border-line bg-graphite-900">
        <Image
          src={asset.src}
          alt={asset.alt}
          width={asset.width}
          height={asset.height}
          priority={priority}
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="block h-auto w-full"
        />
        {notes.map((note, i) => (
          <button
            key={i}
            type="button"
            aria-pressed={active === i}
            aria-describedby={`${ids}-note`}
            onClick={() => setActive((v) => (v === i ? null : i))}
            className="group absolute grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: `${note.x}%`, top: `${note.y}%` }}
          >
            <span className="sr-only">{note.label}</span>
            <span
              aria-hidden="true"
              className={cx(
                "label grid size-7 place-items-center rounded-full border transition-colors",
                active === i
                  ? "border-signal bg-signal text-ink"
                  : "border-signal bg-ink/85 text-signal group-hover:bg-signal group-hover:text-ink",
              )}
            >
              {i + 1}
            </span>
          </button>
        ))}
        <span className="label absolute left-3 top-3 bg-ink/80 px-2 py-1 text-steel-300">{asset.kind}</span>
      </div>

      {notes.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1.2fr]">
          <ol className="space-y-1">
            {notes.map((note, i) => (
              <li key={i}>
                <button
                  type="button"
                  aria-pressed={active === i}
                  onClick={() => setActive((v) => (v === i ? null : i))}
                  className={cx(
                    "flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
                    active === i ? "bg-signal-wash text-paper" : "text-steel-300 hover:bg-graphite-800",
                  )}
                >
                  <span className="label w-5 text-signal">{i + 1}</span>
                  {note.label}
                </button>
              </li>
            ))}
          </ol>
          <p id={`${ids}-note`} aria-live="polite" className="text-sm leading-relaxed text-steel-300">
            {current ? current.note : "Select a callout to read about that part of the design."}
          </p>
        </div>
      ) : null}

      {asset.caption ? (
        <figcaption className="mt-3 text-sm text-steel-400">
          <Text value={asset.caption} />
        </figcaption>
      ) : null}
    </figure>
  );
}
