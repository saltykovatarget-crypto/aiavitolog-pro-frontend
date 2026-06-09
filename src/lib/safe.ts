/**
 * Frontend mirror of the backend's `app/core/sanitize.py` policy.
 *
 * Goal:
 *   Defence-in-depth. Backend already sanitizes on write, but we don't want
 *   a future render path (e.g. a new admin panel, a future markdown engine,
 *   or an old already-stored payload) to ever execute user-supplied script.
 *
 * Scope:
 *   - sanitizeUserText: collapse whitespace, strip control chars, strip any
 *     residual HTML tags. Use for short labels (chat.title, full_name).
 *   - sanitizeUrl: scheme allow-list (http/https, optionally mailto/tel),
 *     blocks javascript: / data:text/html / vbscript: / file: / blob: / jar:.
 *   - SANITIZE_MARKDOWN_SCHEMA: rehype-sanitize allow-list used by
 *     SafeMarkdown. Kept in sync with the existing ChatMarkdown schema.
 *
 * NOTE: React already escapes `{value}` interpolations, so wrapping a string
 * in <SafeText>{value}</SafeText> is mostly about (a) policy clarity in the
 * call site and (b) stripping leftover dangerous bytes in pathological data.
 * It is NOT a substitute for backend sanitization.
 */

const CONTROL_CHARS_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g;
const PROTOCOL_RELATIVE_URL_RE = /(^|[^:])\/\/[^\s<>()]+/g;
const ANY_TAG_RE = /<[^>]{1,200}>/g;
const SCRIPT_BLOCK_RE =
  /<\s*(script|style|svg|iframe|object|embed|noscript|template)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi;
const EVENT_ATTR_RE = /\son[a-z]+\s*[=:]/gi;
const DANGEROUS_SCHEME_RE =
  /(?:\b(?:javascript|vbscript|file|blob|jar)\s*:|\bdata\s*:\s*(?:text\/html|application\/xhtml))/gi;

const SAFE_URL_SCHEMES = new Set(["http", "https"]);
const SAFE_URL_SCHEMES_WITH_MAIL = new Set(["http", "https", "mailto", "tel"]);

/** Strip residual HTML / control chars from a single-line user field. */
export function sanitizeUserText(value: string | null | undefined, maxLen = 200): string {
  if (!value) return "";
  let s = String(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  s = s.replace(SCRIPT_BLOCK_RE, "");
  s = s.replace(ANY_TAG_RE, "");
  s = s.replace(EVENT_ATTR_RE, " ");
  s = s.replace(DANGEROUS_SCHEME_RE, "");
  s = s.replace(PROTOCOL_RELATIVE_URL_RE, "$1");
  s = s.replace(CONTROL_CHARS_RE, "");
  s = s.replace(/[ \t\f\v]+/g, " ").replace(/\s+/g, " ").trim();
  return s.slice(0, maxLen);
}

/**
 * URL safety: returns the cleaned URL or null. By default only http/https are
 * accepted. Use `allowMailto` for footer / contact links.
 */
export function sanitizeUrl(
  value: string | null | undefined,
  opts: { allowMailto?: boolean; maxLen?: number } = {},
): string | null {
  if (!value) return null;
  const allow = opts.allowMailto ? SAFE_URL_SCHEMES_WITH_MAIL : SAFE_URL_SCHEMES;
  const maxLen = opts.maxLen ?? 2048;
  // Strip control chars BEFORE parsing — but DO NOT strip the dangerous
  // scheme prefix here, otherwise `blob:https://evil.com` would slip
  // through after `blob:` is removed.
  const raw = String(value).replace(CONTROL_CHARS_RE, "").trim();
  if (!raw) return null;

  // Relative URL (single leading slash): keep.
  if (raw.startsWith("/") && !raw.startsWith("//")) {
    return raw.slice(0, maxLen);
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  const scheme = parsed.protocol.replace(/:$/, "").toLowerCase();
  if (!allow.has(scheme)) return null;
  // For mailto / tel we don't reconstruct, since URL() loses some shape.
  if (scheme === "mailto" || scheme === "tel") {
    return raw.slice(0, maxLen);
  }
  return parsed.toString().slice(0, maxLen);
}

/**
 * rehype-sanitize schema used by SafeMarkdown. Kept narrow on purpose:
 * paragraphs, lists, emphasis, code, headings, blockquote, tables and links.
 * No images (we render <img> separately in ChatMarkdown for chat-specific
 * media); no iframes/forms/scripts; href limited to http/https/mailto/tel.
 */
export const SAFE_MARKDOWN_SCHEMA = {
  tagNames: [
    "a",
    "blockquote",
    "br",
    "code",
    "del",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "hr",
    "li",
    "ol",
    "p",
    "pre",
    "strong",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul",
  ],
  attributes: {
    a: ["href", "title", "target", "rel"],
    code: ["class", "className"],
    pre: ["class", "className"],
    td: ["align"],
    th: ["align"],
  },
  protocols: {
    href: ["http", "https", "mailto", "tel"],
  },
} as const;
