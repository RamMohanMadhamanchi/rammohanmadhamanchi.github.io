"use client";

import { motion } from "motion/react";
import { reveal } from "@/lib/motion";

/**
 * Fades content up as it enters the viewport. Under reduced motion the
 * root MotionConfig (reducedMotion="user") drops the translate and keeps
 * only a short opacity change.
 */
export function Reveal({ as = "div", delay = 0, children, ...rest }) {
  const Component = motion[as];
  return (
    <Component {...reveal} transition={{ ...reveal.transition, delay }} {...rest}>
      {children}
    </Component>
  );
}
