"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cx } from "@/lib/content";
import { Text } from "@/components/system/Text";

/**
 * Faint, decorative reference image behind a section: inverted into light
 * linework on graphite, masked at the edges, with gentle scroll parallax
 * (off under reduced motion). Hidden from assistive tech — the visible
 * <ReferenceLabel> says what it is.
 */
export function ReferenceBackdrop({ image, parallax = 80, className, imageClassName }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, parallax]);
  if (!image?.enabled) return null;
  return (
    <motion.div
      aria-hidden="true"
      className={cx("pointer-events-none absolute select-none", className)}
      style={{ y: reduce ? 0 : y }}
    >
      <Image
        src={image.src}
        alt=""
        width={image.width}
        height={image.height}
        sizes="(min-width: 768px) 60vw, 100vw"
        className={cx("reference-backdrop h-full w-full object-contain", imageClassName)}
      />
    </motion.div>
  );
}

/** The visible disclosure that accompanies every reference image. */
export function ReferenceLabel({ image, className }) {
  if (!image?.enabled) return null;
  return (
    <p className={cx("label text-steel-500", className)}>
      Backdrop · {image.description} — reference illustration, not Ram&apos;s work ·{" "}
      <Text value={image.credit} />
    </p>
  );
}
