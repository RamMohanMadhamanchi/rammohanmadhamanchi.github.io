/** Motion tokens — mirror of the easing variables in app/globals.css. */

export const ease = {
  mech: [0.65, 0, 0.35, 1],
  out: [0.22, 1, 0.36, 1],
};

export const duration = {
  fast: 0.18,
  base: 0.36,
  slow: 0.7,
  draw: 1.2,
};

/** Standard reveal used by sections as they enter the viewport. */
export const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -12% 0px" },
  transition: { duration: duration.slow, ease: ease.out },
};
