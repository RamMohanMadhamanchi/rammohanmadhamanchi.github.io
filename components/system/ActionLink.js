import Link from "next/link";
import { cx } from "@/lib/content";

const variants = {
  primary:
    "bg-signal text-ink hover:bg-signal-bright border-signal hover:border-signal-bright",
  outline:
    "border-line-strong text-paper hover:border-paper hover:bg-paper hover:text-ink",
  paper:
    "border-paper-ink/30 text-paper-ink hover:border-paper-ink hover:bg-paper-ink hover:text-paper",
};

/**
 * Primary call-to-action. Square-cornered with a leading index tick,
 * like a callout on a drawing. Internal hrefs use next/link.
 */
export function ActionLink({ href, children, variant = "primary", external, className, ...rest }) {
  const classes = cx(
    "group label inline-flex min-h-12 items-center gap-3 border px-5 py-3 !text-[0.75rem] transition-colors duration-200 ease-out-precise",
    variants[variant],
    className,
  );
  const arrow = (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5 transition-transform duration-300 ease-out-precise group-hover:translate-x-1"
    >
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );

  if (external) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {children}
      {arrow}
    </Link>
  );
}
