import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { RevealItem } from './landing/Reveal';

interface Article {
  slug: string;
  category: string;
  categoryKey: 'promo' | 'analytics' | 'copy';
  title: string;
  excerpt: string;
  readMinutes: number;
  publishedAt: string;
}

// TODO: заменить на реальные статьи из CMS / блога
const PLACEHOLDER_ARTICLES: Article[] = [
  {
    slug: 'kak-uvelichit-prosmotry-na-avito',
    category: 'Продвижение',
    categoryKey: 'promo',
    title: 'Как увеличить просмотры объявлений на Авито в 2026 году',
    excerpt: 'Разбираем алгоритм ранжирования и стратегии VAS-продвижения, которые реально работают.',
    readMinutes: 7,
    publishedAt: '20 мая',
  },
  {
    slug: 'analiz-konkurentov-avito',
    category: 'Аналитика',
    categoryKey: 'analytics',
    title: 'Анализ конкурентов на Авито: что смотреть и какие выводы делать',
    excerpt: 'Пошаговый чек-лист: фото, заголовки, цены, VAS — как найти слабые места конкурентов в нише.',
    readMinutes: 10,
    publishedAt: '12 мая',
  },
  {
    slug: 'utp-i-zagolovki-avito',
    category: 'Тексты',
    categoryKey: 'copy',
    title: 'УТП и заголовки на Авито: формула которая поднимает CTR в 2 раза',
    excerpt: 'Разбираем 50 заголовков из топа выдачи и выводим работающую структуру для услуг и товаров.',
    readMinutes: 6,
    publishedAt: '5 мая',
  },
];

export function ArticlesPreview() {
  return (
    <section className="articles-section py-16 md:py-24" id="articles">
      <div className="container max-w-[1200px] mx-auto px-5">

        <div className="articles-header">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight m-0 text-foreground">
              Полезные материалы
            </h2>
            <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground max-w-2xl">
              Разборы стратегий, кейсы клиентов, обновления методологии и сервиса.
            </p>
          </div>
          <a href="/blog" className="articles-all-link">
            Все статьи <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="articles-grid">
          {PLACEHOLDER_ARTICLES.map((article, idx) => (
            <RevealItem key={article.slug} index={idx} staggerDelay={0.12}>
            <a
              href={`/blog/${article.slug}`}
              className="article-card"
            >
              <div className={`article-cover article-cover--${article.categoryKey}`}>
                <span className="article-category">{article.category}</span>
                <span className="article-read-chip">
                  <Clock className="w-3 h-3" />
                  {article.readMinutes} мин
                </span>
              </div>
              <div className="article-body">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-meta">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{article.readMinutes} мин чтения</span>
                  <span className="article-meta-dot">·</span>
                  <span>{article.publishedAt}</span>
                </div>
              </div>
            </a>
            </RevealItem>
          ))}
        </div>

      </div>

      <style>{`
        .articles-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 28px;
        }
        @media (min-width: 768px) {
          .articles-header {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            gap: 24px;
            margin-bottom: 36px;
          }
        }

        .articles-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 600;
          color: #9A7FE0;
          text-decoration: none;
          padding-bottom: 4px;
          border-bottom: 1px solid transparent;
          transition: border-color .15s;
        }
        .articles-all-link:hover {
          border-color: #9A7FE0;
        }

        .articles-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }
        @media (min-width: 768px) {
          .articles-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
        }

        .article-card {
          display: flex;
          flex-direction: column;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          text-decoration: none;
          transition: border-color .15s, transform .15s, box-shadow .15s;
        }
        .article-card:hover {
          border-color: rgba(111, 66, 193, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
        }

        .article-cover {
          aspect-ratio: 16 / 9;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 16px 18px;
          border-bottom: 1px solid var(--border);
          overflow: hidden;
          /* Subtle dot grid overlay on all */
          background-image: radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: 18px 18px;
        }
        /* Category-specific gradient mesh */
        .article-cover--promo {
          background-color: #1A1326;
          background-image:
            radial-gradient(at 78% 22%, rgba(217, 70, 239, 0.32), transparent 55%),
            radial-gradient(at 20% 85%, rgba(111, 66, 193, 0.35), transparent 60%),
            radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: auto, auto, 18px 18px;
        }
        .article-cover--analytics {
          background-color: #121826;
          background-image:
            radial-gradient(at 78% 22%, rgba(56, 189, 248, 0.28), transparent 55%),
            radial-gradient(at 20% 85%, rgba(111, 66, 193, 0.32), transparent 60%),
            radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: auto, auto, 18px 18px;
        }
        .article-cover--copy {
          background-color: #121A1F;
          background-image:
            radial-gradient(at 78% 22%, rgba(52, 211, 153, 0.25), transparent 55%),
            radial-gradient(at 20% 85%, rgba(111, 66, 193, 0.32), transparent 60%),
            radial-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px);
          background-size: auto, auto, 18px 18px;
        }
        .article-category {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #FFFFFF;
          background: rgba(0, 0, 0, 0.45);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          padding: 6px 11px;
          border-radius: 999px;
          position: relative;
          z-index: 1;
        }
        .article-read-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.10);
          padding: 5px 10px;
          border-radius: 999px;
          position: relative;
          z-index: 1;
        }

        .article-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }
        .article-title {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.3;
          color: var(--foreground);
          margin: 0;
        }
        @media (min-width: 768px) {
          .article-title { font-size: 20px; }
        }
        .article-excerpt {
          font-size: 14px;
          line-height: 1.6;
          color: var(--muted-foreground);
          margin: 0;
          flex: 1;
        }
        @media (min-width: 768px) {
          .article-excerpt { font-size: 15px; }
        }
        .article-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--muted-foreground);
          opacity: 0.75;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        .article-meta-dot {
          opacity: 0.5;
        }
      `}</style>
    </section>
  );
}
