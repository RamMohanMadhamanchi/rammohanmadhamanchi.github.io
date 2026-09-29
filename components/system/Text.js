import { cx, isPlaceholder, slotText } from "@/lib/content";

/**
 * Renders a content value. Placeholder values ("[like this]") render as a
 * dashed, italic slot with a screen-reader hint so unfilled content is
 * obvious and never mistaken for a real claim.
 */
export function Text({ value, as: Tag = "span", className, slotClassName }) {
  if (value == null) return null;
  if (isPlaceholder(value)) {
    return (
      <Tag className={cx(className, "placeholder-slot", slotClassName)} data-placeholder="">
        <span className="sr-only">Placeholder: </span>
        {slotText(value)}
      </Tag>
    );
  }
  return <Tag className={className}>{value}</Tag>;
}
