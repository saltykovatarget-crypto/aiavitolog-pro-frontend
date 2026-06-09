import React from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Schema } from "hast-util-sanitize";
import { SAFE_MARKDOWN_SCHEMA } from "@/lib/safe";
import { sanitizeUrl } from "@/lib/safe";

/**
 * Strict, audit-friendly Markdown renderer for ALL user/LLM/admin-side
 * markdown content. Always pipes through ``rehype-sanitize`` with the
 * narrow allow-list from ``SAFE_MARKDOWN_SCHEMA`` (no raw HTML, no img,
 * no iframe, no script, no on* attributes). Links are additionally re-
 * validated by ``sanitizeUrl`` so a ``javascript:`` href can't slip
 * through a future schema-loosening regression.
 *
 * For the in-app *chat* renderer keep using ``ChatMarkdown`` which has
 * project-specific quirks (tag pills, inline normalisation). Use
 * ``SafeMarkdown`` in admin panels, support ticket detail, or any other
 * place that just needs "safely show some markdown".
 */
export interface SafeMarkdownProps {
  content: string | null | undefined;
  className?: string;
}

export function SafeMarkdown({ content, className }: SafeMarkdownProps): React.ReactElement | null {
  const text = (content ?? "").toString();
  if (!text.trim()) return null;
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeSanitize, SAFE_MARKDOWN_SCHEMA as unknown as Schema]]}
        components={{
          a: ({ node, href, children, ...props }) => {
            const safe = sanitizeUrl(typeof href === "string" ? href : null);
            if (!safe) {
              // Drop the link, keep its visible text so user content is preserved.
              return <span {...(props as React.HTMLAttributes<HTMLSpanElement>)}>{children}</span>;
            }
            return (
              <a
                {...props}
                href={safe}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                {children}
              </a>
            );
          },
          // Defence in depth: even though the sanitize schema does not list
          // <img>, if a future schema change adds it accidentally we still
          // refuse to render any inline image with a non-http(s) src.
          img: ({ src, alt }) => {
            const safe = typeof src === "string" ? sanitizeUrl(src) : null;
            if (!safe) return null;
            return <img src={safe} alt={typeof alt === "string" ? alt : ""} loading="lazy" />;
          },
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}
