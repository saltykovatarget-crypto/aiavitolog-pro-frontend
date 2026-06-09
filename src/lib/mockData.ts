import type { UserProfile } from '../types/user';

export const MOCK_USER: UserProfile = {
  id: 'demo-user',
  plan: 'free',
  plan_until: null,
  is_premium: false,
  daily_questions_used: 0,
  daily_questions_limit: 50,
  daily_questions_resets_at: null,
  telegram_id: 999000111,
  telegram_username: 'demo_lera',
  full_name: 'Демо Лера',
  username: 'demo_lera',
  photo_url: null,
};

export const MOCK_BALANCE_KOPECKS = 4500;

export const MOCK_TRANSACTIONS = [
  { id: 1, type: 'spend', amount_kopecks: -500, balance_after_kopecks: 4500, description: 'Ответ AI Авитолога', created_at: '2026-05-27T10:30:00' },
  { id: 2, type: 'spend', amount_kopecks: -500, balance_after_kopecks: 5000, description: 'Ответ AI Авитолога', created_at: '2026-05-27T10:25:00' },
  { id: 3, type: 'spend', amount_kopecks: -19000, balance_after_kopecks: 5500, description: 'Парсер ниши', created_at: '2026-05-27T10:00:00' },
  { id: 4, type: 'topup_package_100', amount_kopecks: 50000, balance_after_kopecks: 24500, description: 'Пакет 100 запросов', created_at: '2026-05-27T09:30:00', package_type: 'package_100' },
  { id: 5, type: 'bonus_signup', amount_kopecks: 5000, balance_after_kopecks: 5000, description: 'Стартовый бонус', created_at: '2026-05-26T15:00:00' },
];

export const MOCK_CHATS = [
  {
    id: 'chat-welcome',
    title: 'Старт работы',
    created_at: '2026-06-08T10:00:00Z',
    updated_at: '2026-06-09T08:00:00Z',
  },
];

export const MOCK_MESSAGES: Record<string, any[]> = {
  'chat-welcome': [
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Привет! Я AI Авитолог. Чем помочь — анализом ниши, запуском с нуля или просто разобраться?',
      created_at: '2026-06-08T10:00:00Z',
    },
  ],
};

export const MOCK_AI_REPLIES = {
  niche: 'Запускаю парсер по нише. Через 1-2 минуты пришлю отчёт с топ-200 объявлениями, ценами и инсайтами. Парсер стоит 190 ₽ — спишется с баланса.',
  start: 'Окей, запускаем с нуля. Начну с пары вопросов: что продаёшь, в каком городе, и есть ли уже опыт? От этого зависит стратегия первых шагов.',
  default: 'Понял. Расскажи подробнее — что именно происходит сейчас? Какие объявления, какие результаты, что хотим улучшить.',
};

export function pickMockReply(userMessage: string): string {
  const m = userMessage.toLowerCase();
  if (/ниш|конкурент|парсер|анализ/.test(m)) return MOCK_AI_REPLIES.niche;
  if (/с нуля|запустить|новый|начать/.test(m)) return MOCK_AI_REPLIES.start;
  return MOCK_AI_REPLIES.default;
}

export const MOCK_PARSER_REPORT = {
  niche: 'юрист Москва',
  total_ads: 200,
  competitors: 47,
  avg_price: 3400,
  leader_share: 18,
  leader_name: 'Юр.Бюро Москва',
  top_ads: [
    { id: '1', title: 'Юридические услуги · все вопросы · опыт 15 лет', price: 3500, photo: null, views: 1240 },
    { id: '2', title: 'Юрист по разводам и алиментам · бесплатная консультация', price: 4200, photo: null, views: 980 },
    { id: '3', title: 'Адвокат по уголовным делам · защита 24/7', price: 5000, photo: null, views: 850 },
    { id: '4', title: 'Юрист по недвижимости · сопровождение сделок', price: 3000, photo: null, views: 720 },
    { id: '5', title: 'Трудовые споры · защита прав работника', price: 2800, photo: null, views: 640 },
  ],
  insights: [
    'У 4 из 5 лидеров — фото с плашкой "Бесплатная консультация" или ценой. Попробуй добавить такую же.',
    'Средняя цена в нише 3400 ₽, лидеры держат 3000–5000 ₽. Цена ниже 2500 — сигнал "дёшево = плохо" для юр-ниши.',
    'У всех топ-5 в заголовке есть конкретика (тип услуги или гарантия). Размытые заголовки ("Юридические услуги") в топе не встречаются.',
  ],
};

export const MOCK_POSITION_RESULTS = [
  { id: '12345678', title: 'Ворота гаражные распашные', position: 3, city: 'Москва' },
  { id: '87654321', title: 'Ворота секционные автоматические', position: 7, city: 'Москва' },
  { id: '11122233', title: 'Калитки металлические под ключ', position: 12, city: 'Москва' },
];

export const MOCK_TOPUP_ORDER = {
  order_id: 'demo-order-' + Date.now(),
  success_url: '/billing/success',
  payment_url: '/billing/success',
};

export const MOCK_TOCHKA_CONFIRM = {
  status: 'paid',
  balance_kopecks: MOCK_BALANCE_KOPECKS + 150000,
};
