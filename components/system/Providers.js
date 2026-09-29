"use client";

import { MotionConfig } from "motion/react";

export function Providers({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
