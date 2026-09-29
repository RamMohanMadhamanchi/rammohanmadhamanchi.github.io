/** A content value is a placeholder when it is wrapped in [square brackets]. */
export function isPlaceholder(value) {
  return typeof value === "string" && /^\[[\s\S]*\]$/.test(value.trim());
}

/** Strip the brackets for display inside a placeholder slot. */
export function slotText(value) {
  return isPlaceholder(value) ? value.trim().slice(1, -1) : value;
}

/** Only real values become links. */
export function usableHref(href) {
  return href && !isPlaceholder(href) ? href : null;
}

export function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}
