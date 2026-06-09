import React from "react";
import { sanitizeUrl } from "@/lib/safe";

/**
 * Renders a user-supplied URL as an <a>. If the URL is unsafe (e.g.
 * javascript:alert(1), data:text/html..., blob:..., file:...), the
 * component renders the children as plain text instead of as a link, so
 * the attacker payload never becomes clickable JS.
 *
 * Use this in admin panels, support ticket detail views, GPT-output
 * post-processing — anywhere a URL field can come from a user.
 */
export interface SafeLinkProps {
  href: string | null | undefined;
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Allow ``mailto:`` / ``tel:`` in addition to http(s). */
  allowMailto?: boolean;
  /**
   * When the href is unsafe and we fall back to plain text, render this
   * notice next to the children (useful in admin tooling to make the
   * rejection visible).
   */
  unsafeBadge?: React.ReactNode;
}

export function SafeLink({
  href,
  children,
  className,
  title,
  allowMailto = false,
  unsafeBadge,
}: SafeLinkProps): React.ReactElement {
  const safe = sanitizeUrl(href, { allowMailto });
  if (!safe) {
    return (
      <span className={className} title={title}>
        {children}
        {unsafeBadge ? <> {unsafeBadge}</> : null}
      </span>
    );
  }
  return (
    <a
      href={safe}
      className={className}
      title={title}
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      {children}
    </a>
  );
}
