import React from "react";
import { sanitizeUserText } from "@/lib/safe";

/**
 * Renders a user-controlled string as plain text. React already escapes
 * `{value}` so this is mostly a *policy* component: every place that prints
 * `user.full_name`, `chat.title`, support `subject`, `filename` etc. should
 * read as <SafeText value={...}/> so it's auditable.
 *
 * The component also strips any residual HTML/control bytes — useful if the
 * value somehow bypassed the backend sanitizer (e.g. it was already in DB
 * from before the patch).
 */
export interface SafeTextProps {
  value: string | null | undefined;
  /** Max characters to render. Default 200. */
  maxLen?: number;
  /** Optional fallback when value is empty after sanitisation. */
  fallback?: React.ReactNode;
  /** Optional className passthrough. */
  className?: string;
  /** Inline title attribute (e.g. for truncation tooltips). */
  title?: string;
  /** Render inside a <span> by default; pass "div" for block layout. */
  as?: "span" | "div";
}

export function SafeText({
  value,
  maxLen = 200,
  fallback = null,
  className,
  title,
  as = "span",
}: SafeTextProps): React.ReactElement | null {
  const clean = sanitizeUserText(value, maxLen);
  if (!clean) {
    if (fallback === null || fallback === undefined) return null;
    return as === "div" ? (
      <div className={className} title={title}>
        {fallback}
      </div>
    ) : (
      <span className={className} title={title}>
        {fallback}
      </span>
    );
  }
  return as === "div" ? (
    <div className={className} title={title}>
      {clean}
    </div>
  ) : (
    <span className={className} title={title}>
      {clean}
    </span>
  );
}
