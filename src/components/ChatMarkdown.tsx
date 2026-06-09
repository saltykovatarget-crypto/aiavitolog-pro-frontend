import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import type { Schema } from 'hast-util-sanitize';
import rehypeSanitize from 'rehype-sanitize';
import { sanitizeUrl } from '@/lib/safe';

export type ChatMarkdownProps = {
  content: string;
};

function normalizeChatMarkdown(input: string): string {
  let s = (input ?? '');
  s = s.replace(/\r\n/g, '\n');

  // ВАЖНО: не трогаем fenced code blocks ```...```
  const parts = s.split(/(```[\s\S]*?```)/g);

  // 1) `word` \n , \n `word2`  =>  `word`, `word2`
  // (между словами остаются backticks, склеиваем именно "разделитель")
  const fix = (chunk: string) => {
    let t = chunk;
    // Поддержим разные варианты запятой, которые иногда прилетают от модели
    // ,  ，  、  и т.п.
    const PUNC = '[,，、.;:!?]';

    // A) Если модель прислала варианты как "код-блоки по отступам":
    //     предприниматель
    //     маркетолог
    // превращаем такие строки в inline `теги` (но только если их реально несколько)
    // ВАЖНО: ловим любые пробельные символы КРОМЕ перевода строки (включая NBSP)
    const TAG_LINE = /^[^\S\n]{2,}([A-Za-zА-Яа-яЁё0-9][A-Za-zА-Яа-яЁё0-9_-]{1,31})\s*$/gm;
    const tagCount = (t.match(TAG_LINE) || []).length;
    if (tagCount >= 2) t = t.replace(TAG_LINE, '`$1`');

    // 0) `маркетолог,` -> `маркетолог`,
    // (только если внутри один токен без пробелов)
    t = t.replace(new RegExp('`([^`\\s]{1,64})(' + PUNC + ')`', 'g'), '`$1`$2');

    // 1) Склеиваем "код + (пустые строки) + знак + (пустые строки) + следующий код"
    // `a`
    //
    // ,
    //
    // `b`  ->  `a`, `b`
    t = t.replace(new RegExp('`([^`\\n]+?)`\\s*\\n+\\s*(' + PUNC + ')\\s*\\n+\\s*`', 'g'), '`$1`$2 `');

    // 1.1) Если знак уже “оторвался” в отдельный абзац — склеим обратно:
    // `a`
    //
    // ,
    //
    //   -> `a`,  (и дальше уже спокойно прилепится следующий `b`)
    t = t.replace(new RegExp('`([^`\\n]+?)`\\s*\\n+\\s*(' + PUNC + ')\\s*\\n+', 'g'), '`$1`$2 ');

    // 2) Если варианты (теги) стоят каждый с новой строки/абзаца — склеим в одну строку через запятую:
    // `a`
    // `b`
    // `c`  ->  `a`, `b`, `c`
    t = t.replace(new RegExp('(`[^`\\n]+`)(?!\\s*' + PUNC + ')\\s*\\n+\\s*(?=`)', 'g'), '$1, ');

    // 3) Убираем строки где только знак/точка (артефакт)
    t = t.replace(new RegExp('^\\s*' + PUNC + '\\s*$', 'gm'), '');
    t = t.replace(/^\s*\.\s*$/gm, '');

    // 4) Подчистим лишние пустые строки
    t = t.replace(/\n{3,}/g, '\n\n');
    return t;
  };

  s = parts
    .map((p) => (p.trimStart().startsWith('```') ? p : fix(p)))
    .join('');

  return s.trim();
}

const ANSWER_MARKERS = ['🔹', '📌', '⚠️', '📈', '💰', '⚙️', '📸', '🚀', '❓', '✅'] as const;

const isMarkerLine = (line: string): boolean => {
  const trimmed = line.trimStart();
  return ANSWER_MARKERS.some((marker) => trimmed.startsWith(marker));
};

const isSpecialSectionLine = (line: string): boolean => {
  const trimmed = line.trimStart();
  return trimmed.startsWith('Готово:') || trimmed.startsWith('Дальше:') || isMarkerLine(trimmed);
};

export function normalizeAnswerPresentation(input: string): string {
  let s = (input ?? '').replace(/\r\n/g, '\n');
  const parts = s.split(/(```[\s\S]*?```)/g);

  s = parts
    .map((part) => {
      if (part.trimStart().startsWith('```')) return part;

      const lines = part.split('\n');
      const out: string[] = [];

      for (const line of lines) {
        if (isSpecialSectionLine(line) && out.length > 0 && out[out.length - 1].trim() !== '') {
          out.push('');
        }
        out.push(line);
      }

      return out.join('\n').replace(/\n{3,}/g, '\n\n');
    })
    .join('');

  return s.replace(/\n{3,}/g, '\n\n').trim();
}

const mergeClassNames = (base: string, extra?: string) =>
  [base, extra].filter(Boolean).join(' ').trim();

function childrenToText(children: React.ReactNode): string {
  return React.Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (Array.isArray(child)) return childrenToText(child);
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return childrenToText(child.props.children);
      }
      return '';
    })
    .join('');
}

const preserveBlockLangs = new Set([
  'bash',
  'shell',
  'sh',
  'json',
  'javascript',
  'js',
  'typescript',
  'ts',
  'tsx',
  'jsx',
  'python',
  'py',
  'html',
  'xml',
  'yaml',
  'yml',
  'sql',
  'http',
  'mermaid',
  'plantuml',
]);

export function normalizeMarkdown(content: string): string {
  const fenceRegex = /^```([^\n]*)\n([\s\S]*?)\n```$/gm;

  let out = content.replace(fenceRegex, (match, lang = '', body = '') => {
    // если внутри реально много строк — оставляем блоком
    if (body.includes('\n') || body.includes('\r')) return match;

    const trimmed = body.trim();
    const language = lang.trim().toLowerCase().split(/\s+/)[0];

    // пусто — убрать
    if (!trimmed) return '';

    // слишком длинное — оставить блоком
    if (trimmed.length > 160) return match;

    // есть backticks — оставить блоком
    if (trimmed.includes('`')) return match;

    // если указан язык из списка — оставить блоком
    if (language && preserveBlockLangs.has(language)) return match;

    // превращаем в inline chip
    return `\`${trimmed}\``;
  });

  out = out.replace(/^\s*\.\s*$/gm, '');

  return out;
}

const schema: Schema = {
  tagNames: [
    'a',
    'blockquote',
    'br',
    'code',
    'del',
    'em',
    'h1',
    'h2',
    'h3',
    'hr',
    'li',
    'ol',
    'p',
    'pre',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'u',
    'ul',
  ],
  attributes: {
    a: ['href', 'title', 'target', 'rel'],
    code: ['class', 'className'],
    pre: ['class', 'className'],
    td: ['align'],
    th: ['align'],
  },
  protocols: {
    href: ['http', 'https', 'mailto', 'tel'],
  },
};

export function ChatMarkdown({ content }: ChatMarkdownProps) {
  const normalizedContent = React.useMemo(
    () => normalizeAnswerPresentation(normalizeChatMarkdown(normalizeMarkdown(content))),
    [content],
  );

  return (
    <div className="cm-root">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[[rehypeSanitize, schema]]}
        components={{
          h1: ({ node, className, ...props }) => (
            <h1 className={mergeClassNames('cm-h1', className)} {...props} />
          ),
          h2: ({ node, className, ...props }) => (
            <h2 className={mergeClassNames('cm-h2', className)} {...props} />
          ),
          h3: ({ node, className, ...props }) => (
            <h3 className={mergeClassNames('cm-h3', className)} {...props} />
          ),
          p: ({ node, className, children, ...props }) => {
            // если абзац состоит только из "," или "." и т.п. — не рендерим
            const raw = childrenToText(children);
            const trimmed = raw.replace(/\u00A0/g, ' ').trim(); // NBSP -> space
            if (trimmed && /^[,，、.;:!?]+$/.test(trimmed)) {
              return null;
            }

            const classes = ['cm-p'];
            if (trimmed.startsWith('Готово:')) classes.push('cm-summary-block');
            if (trimmed.startsWith('Дальше:')) classes.push('cm-next-block');
            if (isMarkerLine(trimmed)) classes.push('cm-marker-line');

            return (
              <p className={mergeClassNames(classes.join(' '), className)} {...props}>
                {children}
              </p>
            );
          },
          ul: ({ node, className, ...props }) => (
            <ul className={mergeClassNames('cm-ul', className)} {...props} />
          ),
          ol: ({ node, className, ...props }) => (
            <ol className={mergeClassNames('cm-ol', className)} {...props} />
          ),
          li: ({ node, className, children, ...props }) => {
            const raw = childrenToText(children);
            const trimmed = raw.replace(/\u00A0/g, ' ').trim();
            if (trimmed && /^[,，、.;:!?]+$/.test(trimmed)) return null;
            return (
              <li className={mergeClassNames('cm-li', className)} {...props}>
                {children}
              </li>
            );
          },
          blockquote: ({ node, className, ...props }) => (
            <blockquote className={mergeClassNames('cm-callout', className)} {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const raw = childrenToText(children);
            const text = raw.trim();

            // Если это блочный code без языка и в нём один короткий токен — показываем как "pill",
            // а не как огромный code-block на всю ширину.
            const hasLang = Boolean(className && /language-/.test(className));
            const isPuncOnly = text.length > 0 && /^[,，、.;:!?]+$/.test(text);
            if (!inline && !hasLang && isPuncOnly) return null;

            const isOneLine = !text.includes('\n');
            const isShortBlock = isOneLine && text.length > 0 && text.length <= 48;
            const isSingleToken = text.length > 0 && !/\s/.test(text) && text.length <= 32;

            // Блочный "коротыш" без языка: рендерим как inline-chip, чтобы не было плашки во всю ширину
            if (!inline && !hasLang && isShortBlock) {
              const cls = isSingleToken ? 'cm-inline-code-pill' : 'cm-inline-code';
              return (
                <code className={mergeClassNames(cls, className)} {...props}>
                  {text}
                </code>
              );
            }

            const isInline = inline && !className;
            const isSingleTokenInline =
              text.length > 0 && !/\s/.test(text) && text.length <= 32;

            if (isInline && isSingleTokenInline) {
              return (
                <code className={mergeClassNames('cm-inline-code-pill', className)} {...props}>
                  {text}
                </code>
              );
            }

            if (inline) {
              return (
                <code className={mergeClassNames('cm-inline-code', className)} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <pre className="cm-code-block compact">
                <code className={mergeClassNames('compact', className)} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
          hr: ({ node, className, ...props }) => (
            <hr className={mergeClassNames('cm-hr', className)} {...props} />
          ),
          a: ({ node, className, href, children, ...props }) => {
            const safeHref = sanitizeUrl(typeof href === 'string' ? href : null, { allowMailto: true });
            if (!safeHref) {
              return <span className={className}>{children}</span>;
            }
            return (
              <a
                {...props}
                href={safeHref}
                className={mergeClassNames('cm-a', className)}
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {children}
              </a>
            );
          },
          img: ({ node, className, src, alt, ...props }) => {
            const safeSrc = sanitizeUrl(typeof src === 'string' ? src : null);
            if (!safeSrc) return null;
            return (
              <a
                href={safeSrc}
                target="_blank"
                rel="noreferrer noopener nofollow"
                className="block"
              >
                <img
                  {...props}
                  src={safeSrc}
                  alt={typeof alt === 'string' ? alt : ''}
                  className={mergeClassNames(
                    'mt-2 w-full max-w-[520px] max-h-[240px] object-contain rounded-xl border bg-muted',
                    className,
                  )}
                  loading="lazy"
                  decoding="async"
                />
              </a>
            );
          },
          table: ({ node, className, ...props }) => (
            <div className="cm-table-wrap">
              <table className={mergeClassNames('cm-table', className)} {...props} />
            </div>
          ),
          thead: ({ node, className, ...props }) => (
            <thead className={mergeClassNames('cm-thead', className)} {...props} />
          ),
          tbody: ({ node, className, ...props }) => (
            <tbody className={mergeClassNames('cm-tbody', className)} {...props} />
          ),
          th: ({ node, className, ...props }) => (
            <th className={mergeClassNames('cm-th', className)} {...props} />
          ),
          td: ({ node, className, ...props }) => (
            <td className={mergeClassNames('cm-td', className)} {...props} />
          ),
          input: ({ node, className, ...props }) => {
            if (props.type === 'checkbox') {
              const checked = Boolean((props as any).checked);

              return (
                <input
                  type="checkbox"
                  checked={checked}
                  className={mergeClassNames('cm-task-checkbox', className)}
                  disabled
                  readOnly
                  tabIndex={-1}
                />
              );
            }
            return <input {...props} className={className} />;
          },
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
