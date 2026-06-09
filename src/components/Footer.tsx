import React from 'react';
import { MessageCircle, Mail, Send } from 'lucide-react';
import { ReportProblemFab } from './ReportProblemFab';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer-section pt-32 pb-12">
      <div className="container max-w-[1200px] mx-auto px-5">

        {/* Telegram channel CTA — наверху подвала */}
        <a
          href="https://t.me/traffic_agency_formula"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-tg-cta"
        >
          <div className="footer-tg-icon">
            <Send className="w-5 h-5" />
          </div>
          <div className="footer-tg-text">
            <strong>Наш Telegram-канал</strong>
            <span>Реальные кейсы, разборы ниш, апдейты сервиса и обучение по Авито</span>
          </div>
          <span className="footer-tg-action">
            Подписаться →
          </span>
        </a>

        {/* Main 4-column grid */}
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <a
              href="http://aiavitologpro.ru/"
              className="footer-logo"
            >
              <img
                src="/cases/favicon/logo-header.png"
                alt="AI Авитолог PRO"
                className="footer-logo-img"
              />
              <span className="footer-logo-text">
                AI Авитолог
                <span
                  className="footer-logo-badge"
                  style={{ backgroundColor: '#6F42C1' }}
                >
                  PRO
                </span>
              </span>
            </a>
            <p className="footer-tagline">
              ИИ-ассистент для системной работы с рекламой на Авито. 10 шагов от анализа до стабильных заявок.
            </p>
            <div className="footer-socials">
              <a
                href="https://t.me/traffic_agency_formula"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="Наш Telegram-канал"
                title="Наш Telegram-канал"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/valeriia_avitolog"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social"
                aria-label="Telegram автора"
                title="@valeriia_avitolog"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:saltykovatarget@gmail.com"
                className="footer-social"
                aria-label="Email"
                title="saltykovatarget@gmail.com"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Сервис */}
          <div className="footer-col">
            <h4 className="footer-col-title">Сервис</h4>
            <ul className="footer-list">
              <li>
                <button type="button" onClick={() => scrollToSection('how-it-works')}>
                  Как работает
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('tools')}>
                  Инструменты
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('pricing')}>
                  Тарифы
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollToSection('cases')}>
                  Кейсы
                </button>
              </li>
            </ul>
          </div>

          {/* Документы */}
          <div className="footer-col">
            <h4 className="footer-col-title">Документы</h4>
            <ul className="footer-list">
              <li><a href="/policies/privacy-policy">Политика конфиденциальности</a></li>
              <li><a href="/cookies">Политика cookies</a></li>
              <li><a href="/offer">Публичная оферта</a></li>
              <li className="footer-list-fab"><ReportProblemFab variant="link" /></li>
            </ul>
          </div>

          {/* Связь */}
          <div className="footer-col">
            <h4 className="footer-col-title">Связь</h4>
            <ul className="footer-list">
              <li>
                <a
                  href="https://t.me/valeriia_avitolog"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram: @valeriia_avitolog
                </a>
              </li>
              <li>
                <a href="mailto:saltykovatarget@gmail.com">
                  saltykovatarget@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="https://t.me/aiavitologpro"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Отзывы клиентов в Telegram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} AI Авитолог PRO. Все права защищены.
          </p>
          <p className="footer-built-by">
            Сделано Валерией Салтыковой — практикующим авитологом
          </p>
        </div>

      </div>

      <style>{`
        .footer-section {
          background: linear-gradient(180deg, transparent, rgba(111, 66, 193, 0.05));
          position: relative;
        }
        /* Soft divider — мягкая разделительная полоса вместо жёсткого border */
        .footer-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          max-width: 800px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.10), transparent);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          padding-bottom: 2.5rem;
        }
        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem 2rem;
          }
        }
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1.6fr 1fr 1.3fr 1.3fr;
            gap: 3rem 2.5rem;
          }
        }

        /* Brand column */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .footer-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
        }
        .footer-logo:hover { opacity: 0.9; }
        .footer-logo-img {
          width: 36px;
          height: 36px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .footer-logo-text {
          font-weight: 700;
          font-size: 15px;
          color: var(--foreground);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .footer-logo-badge {
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          padding: 3px 7px;
          border-radius: 6px;
          line-height: 1;
          letter-spacing: 0.5px;
        }
        .footer-tagline {
          font-size: 13px;
          line-height: 1.6;
          color: var(--muted-foreground);
          max-width: 360px;
          margin: 0;
        }
        .footer-socials {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .footer-social {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--border);
          background: var(--card);
          display: grid;
          place-items: center;
          color: var(--muted-foreground);
          transition: border-color .15s, color .15s;
        }
        .footer-social:hover {
          border-color: #6F42C1;
          color: #9A7FE0;
        }

        /* List columns */
        .footer-col-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--muted-foreground);
          opacity: 0.8;
          margin: 0 0 1rem;
        }
        .footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }
        .footer-list li {
          font-size: 13px;
          line-height: 1.45;
        }
        .footer-list a,
        .footer-list button {
          color: var(--muted-foreground);
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          font-family: inherit;
          font-size: inherit;
          text-align: left;
          transition: color .15s;
        }
        .footer-list a:hover,
        .footer-list button:hover {
          color: var(--foreground);
        }
        .footer-list-fab {
          margin-top: 4px;
        }

        /* Telegram CTA — теперь сверху подвала, перед 4-кол */
        .footer-tg-cta {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          margin: 0 0 2.5rem;
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.15) 0%, rgba(154, 127, 224, 0.08) 100%);
          border: 1px solid rgba(111, 66, 193, 0.25);
          border-radius: 14px;
          text-decoration: none;
          transition: border-color .15s, transform .15s, background .15s;
        }
        .footer-tg-cta:hover {
          border-color: #6F42C1;
          transform: translateY(-1px);
          background: linear-gradient(135deg, rgba(111, 66, 193, 0.22) 0%, rgba(154, 127, 224, 0.12) 100%);
        }
        .footer-tg-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #6F42C1;
          color: #fff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .footer-tg-text {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .footer-tg-text strong {
          font-size: 14px;
          font-weight: 600;
          color: var(--foreground);
          line-height: 1.3;
        }
        .footer-tg-text span {
          font-size: 12px;
          color: var(--muted-foreground);
          line-height: 1.45;
        }
        .footer-tg-action {
          font-size: 13px;
          font-weight: 600;
          color: #9A7FE0;
          white-space: nowrap;
          flex-shrink: 0;
        }
        @media (max-width: 639px) {
          .footer-tg-cta {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            padding: 16px 18px;
          }
          .footer-tg-action {
            align-self: flex-end;
          }
        }

        /* Bottom bar */
        .footer-bottom {
          padding-top: 2rem;
          border-top: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
          text-align: center;
        }
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
            text-align: left;
          }
        }
        .footer-copyright,
        .footer-built-by {
          font-size: 12px;
          color: var(--muted-foreground);
          opacity: 0.7;
          margin: 0;
        }
      `}</style>
    </footer>
  );
}
