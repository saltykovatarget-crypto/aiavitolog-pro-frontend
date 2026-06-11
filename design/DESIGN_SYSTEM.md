# DESIGN SYSTEM — AI Авитолог PRO

**Версия:** 1.0  
**Дата:** 01.06.2026  
**Назначение:** закон для всего фронтенда. Claude Code и любой 
разработчик читает этот файл перед каждой задачей по UI.

---

## ВАЖНОЕ — ДВЕ ТЕМЫ ИНТЕРФЕЙСА

В проекте используются **две темы**:

### 🌑 ТОЛЬКО ТЁМНАЯ ТЕМА — где?

- **Лендинг** (главная страница aiavitologpro.ru)
- **Страница «Как это работает»**
- **Страница «Кейсы»**
- **Страница «Полезные материалы» (блог)**
- **Страница «Кто стоит за сервисом»**
- **Страница «Партнёрская программа»**
- **Страница «Кому подойдёт»**
- **Страница «Цены и пакеты пополнения»**
- **Все маркетинговые страницы вообще**

Эти страницы — **витрина**. Тёмный фон фиксирует премиум-стиль.

### 🌓 ТЁМНАЯ + СВЕТЛАЯ ТЕМЫ — где?

- **Чат с AI Авитологом**
- **Страница `/wallet`** (баланс и история)
- **Страница `/profile`** (настройки, согласия)
- **Админка**
- **Личный кабинет в целом**

Эти страницы — **рабочая среда**. Юзер находится в них часами. 
Светлая тема даёт глазам отдых.

### Переключатель темы

- В шапке (только для авторизованных юзеров)
- Иконка солнце/луна
- Сохраняется в `localStorage` под ключом `theme`
- При первом входе — определяется по `prefers-color-scheme` системы

---

## ПРАВИЛО №1 — ЦВЕТА

### 🌑 ТЁМНАЯ ТЕМА (default)

#### Бренд

| Класс Tailwind | Hex | Назначение |
|----------------|-----|------------|
| `bg-purple-600` | #7C3AED | Основной фиолетовый бренда |
| `bg-purple-700` | #6D28D9 | Hover для кнопок |
| `text-purple-400` | #9F67FF | Акцентный текст (цена, выделение) |
| `bg-purple-500/10` | rgba | Полупрозрачный фон карточек |
| `border-purple-500/20` | rgba | Границы карточек |

#### Фон

| Класс | Hex | Назначение |
|-------|-----|------------|
| `bg-gray-950` | #0D0D1A | Фон страницы |
| `bg-gray-900` | #1A1A2E | Фон шапки и карточек |
| `bg-gray-800` | #27273D | Поля ввода |

#### Текст

| Класс | Назначение |
|-------|------------|
| `text-white` | Основной текст (95% случаев) |
| `text-gray-300` | Описания, подзаголовки |
| `text-gray-400` | Вторичный текст, подписи |
| `text-gray-500` | Приглушённый текст |

### ☀️ СВЕТЛАЯ ТЕМА

#### Бренд (те же что в тёмной)

| Класс | Hex | Назначение |
|-------|-----|------------|
| `bg-purple-600` | #7C3AED | Основной фиолетовый бренда |
| `bg-purple-700` | #6D28D9 | Hover для кнопок |
| `text-purple-600` | #7C3AED | Акцентный текст (в светлой темнее чем фон) |

#### Фон

| Класс | Hex | Назначение |
|-------|-----|------------|
| `bg-white` | #FFFFFF | Фон страницы |
| `bg-gray-50` | #F9FAFB | Фон шапки и карточек |
| `bg-gray-100` | #F3F4F6 | Поля ввода, выделения |

#### Текст

| Класс | Назначение |
|-------|------------|
| `text-gray-900` | Основной текст |
| `text-gray-700` | Описания, подзаголовки |
| `text-gray-500` | Вторичный текст, подписи |
| `text-gray-400` | Приглушённый текст |

### Спец-цвета (одинаковы в обеих темах)

| Класс | Hex | Только для |
|-------|-----|------------|
| `bg-gold-500` / `text-gold` | #F59E0B | PRO бейдж и только он |
| `text-red-500` | #EF4444 | Ошибки |
| `text-green-500` | #10B981 | Успех, низкий балл, бонус |

### Использование тем в коде

Через Tailwind dark mode (`class` стратегия):

```jsx
<div className="bg-white dark:bg-gray-950 
                text-gray-900 dark:text-white">
  ...
</div>
```

При смене темы — `<html>` получает класс `dark`.

### ЗАПРЕЩЕНО

❌ Hex-цвета прямо в JSX (`style={{color: '#ff0000'}}`)  
❌ Inline-стили вообще  
❌ Цвета вне таблиц выше  
❌ Любые градиенты кроме `bg-gradient-to-br from-purple-600 to-purple-900`

---

## ПРАВИЛО №2 — РАЗМЕРЫ ТЕКСТА

**ВАЖНО — РАЗМЕРЫ УМЕНЬШЕНЫ относительно типовых.**

Текущий сайт был **крупноват**. Уменьшаем шкалу на одну ступень.

### Шкала

| Уровень | Класс Tailwind | Десктоп px | Когда использовать |
|---------|----------------|-----------|-------------------|
| H1 (главный) | `text-3xl md:text-4xl font-bold` | 30 → 36px | Главный заголовок лендинга **только один на страницу** |
| H2 (страница) | `text-2xl md:text-3xl font-bold` | 24 → 30px | Заголовки страниц |
| H3 (секция) | `text-xl md:text-2xl font-semibold` | 20 → 24px | Заголовки секций |
| H4 (блок) | `text-lg md:text-xl font-semibold` | 18 → 20px | Заголовки блоков и карточек |
| H5 (карточка) | `text-base md:text-lg font-semibold` | 16 → 18px | Подзаголовки в карточках |
| Body large | `text-base` | 16px | Описания под главным заголовком |
| Body | `text-sm md:text-base` | 14 → 16px | Основной текст (карточки, абзацы) |
| Body small | `text-sm` | 14px | Второстепенный текст, описания инструментов |
| Caption | `text-xs` | 12px | Подписи, помощь, хинты |

### Шрифт

Все тексты — **Manrope**.

### Цвет акцентного слова в заголовке

```jsx
<h1 className="text-3xl md:text-4xl font-bold 
               text-gray-900 dark:text-white">
  Реклама на Авито 
  <span className="text-purple-600 dark:text-purple-400">
    от 580 ₽
  </span>
</h1>
```

### ЗАПРЕЩЕНО

❌ Размеры не из таблицы (например `text-[17px]`)  
❌ Жирность кроме `font-normal`, `font-semibold`, `font-bold`  
❌ `text-5xl` и крупнее (слишком вычурно для нашего бренда)

---

## ПРАВИЛО №3 — ОТСТУПЫ (всё кратно 4px)

### Внутри элементов

| Что | Значение | Tailwind |
|-----|---------|----------|
| Padding в карточке | 16px | `p-4` |
| Padding в большой карточке | 24px | `p-6` |
| Padding в кнопке | 12px × 24px | `px-6 py-3` |
| Padding в маленькой кнопке | 8px × 16px | `px-4 py-2` |
| Padding в поле ввода | 12px × 16px | `px-4 py-3` |

### Между элементами

| Что | Значение | Tailwind |
|-----|---------|----------|
| Между текстом и плашкой | 16px минимум | `gap-4` |
| Между блоками внутри карточки | 12px | `gap-3` |
| Между карточками | 16-24px | `gap-4` или `gap-6` |
| Между секциями страницы | 48px | `gap-12` или `space-y-12` |
| От края экрана (мобильный) | 16px | `px-4` |
| От края экрана (десктоп) | 24px | `px-6` |

### ЗАПРЕЩЕНО

❌ Любые отступы не кратные 4px  
❌ Произвольные значения типа `p-[17px]`  
❌ Текст без padding в карточке (прилипший к краю)  
❌ Текст вплотную к иконке (нужен `gap-3` минимум)

---

## ПРАВИЛО №4 — КАРТОЧКИ И ПЛАШКИ

### Стандартная карточка

```jsx
<div className="bg-purple-500/10 dark:bg-purple-500/10
                border border-purple-500/20 dark:border-purple-500/20
                rounded-xl p-4">
  {/* содержимое */}
</div>
```

### Карточка-инструмент (как «Парсер конкурентов»)

```jsx
<div className="bg-gray-900 dark:bg-gray-900
                border border-gray-800 dark:border-gray-800
                rounded-xl p-4
                flex flex-col gap-3">
  <div className="flex items-start justify-between">
    {/* Иконка в фиолетовом квадрате слева */}
    <div className="w-12 h-12 rounded-xl bg-purple-600
                    flex items-center justify-center">
      <SearchIcon className="w-6 h-6 text-white" />
    </div>
    {/* Лейбл шага справа */}
    <span className="text-xs font-semibold text-gray-400 uppercase">
      Шаг 1
    </span>
  </div>
  
  <h3 className="text-lg font-semibold mt-3">Парсер конкурентов</h3>
  <p className="text-sm text-gray-400">Описание...</p>
</div>
```

### Бейдж-плашка (как «50 ₽ бонусом»)

```jsx
<div className="bg-green-500/10 border border-green-500/30 
                rounded-full px-4 py-2 
                inline-flex items-center gap-2">
  <span className="w-2 h-2 bg-green-500 rounded-full" />
  <span className="text-sm">🎁 50 ₽ бонусом при регистрации</span>
</div>
```

### ЗАПРЕЩЕНО

❌ Карточка без padding (текст прилипает к краю)  
❌ Карточка без скругления (`rounded-xl` обязательно)  
❌ Лейблы шагов вплотную к краю карточки (минимум 16px отступа)  
❌ Подсветка карточки тонкой линией (только `border-2` для подсветки)

---

## ПРАВИЛО №5 — КНОПКИ

### Главная кнопка (CTA)

```jsx
<button className="bg-purple-600 hover:bg-purple-700 
                   text-white font-semibold
                   px-6 py-3 rounded-xl
                   transition-all duration-200
                   flex items-center justify-center gap-2">
  Начать — 50 ₽ на старт →
</button>
```

### Вторичная кнопка

```jsx
<button className="bg-transparent 
                   hover:bg-gray-100 dark:hover:bg-gray-800
                   border border-gray-300 dark:border-gray-700
                   text-gray-900 dark:text-white 
                   font-semibold
                   px-6 py-3 rounded-xl
                   transition-all duration-200">
  Как это работает
</button>
```

### Маленькая кнопка

```jsx
<button className="bg-purple-600 hover:bg-purple-700
                   text-white text-sm font-semibold
                   px-4 py-2 rounded-lg
                   transition-all duration-200">
  Пополнить
</button>
```

### ЗАПРЕЩЕНО

❌ Кнопки без `transition-all duration-200`  
❌ Кнопки без hover-эффекта  
❌ Разные размеры кнопок одного типа на одной странице  
❌ Текст кнопки без `font-semibold`

---

## ПРАВИЛО №6 — ПОЛЯ ВВОДА

```jsx
<input className="bg-gray-100 dark:bg-gray-900 
                  border border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-white 
                  placeholder-gray-500
                  px-4 py-3 rounded-lg
                  focus:border-purple-500 focus:outline-none
                  transition-all duration-200
                  w-full" />
```

---

## ПРАВИЛО №7 — ИКОНКИ

### Только lucide-react

Никаких других библиотек. Никаких эмодзи в UI-элементах.

### ВАЖНОЕ — Эмодзи vs Иконки

**Где можно эмодзи (✅):**
- В заголовках поста/статьи: «🎁 50 ₽ бонусом»
- В кнопках старта чата: «🎯 Мало заявок», «🚀 С нуля»
- В лейблах-плашках в маркетинговых блоках

**Где НЕЛЬЗЯ эмодзи (❌):**
- **В списках цен инструментов** (был баг — там стояли 💬 🔍 📊)
- В навигационных меню
- В шапке сайта
- В админке
- В кнопках действий

**Решение для списка цен:**

```jsx
{/* НЕПРАВИЛЬНО */}
<div>💬 Ответ AI Авитолога — 5 ₽</div>

{/* ПРАВИЛЬНО */}
<div className="flex items-center gap-3">
  <div className="w-10 h-10 rounded-lg bg-purple-600 
                  flex items-center justify-center">
    <MessageCircleIcon className="w-5 h-5 text-white" />
  </div>
  <span>Ответ AI Авитолога</span>
  <span className="ml-auto font-semibold">5 ₽</span>
</div>
```

### Размеры

| Где | Размер | Класс |
|-----|--------|-------|
| В тексте | 16px | `w-4 h-4` |
| Стандарт | 20px | `w-5 h-5` |
| В кнопках | 24px | `w-6 h-6` |
| Большие | 32px | `w-8 h-8` |

---

## ПРАВИЛО №8 — АНИМАЦИИ

```jsx
className="... transition-all duration-200"
```

Все интерактивные элементы.

### Hover-эффекты

- Кнопки: `hover:bg-...` (более тёмный оттенок)
- Карточки: `hover:bg-gray-100/50 dark:hover:bg-gray-800/50`
- Ссылки: `hover:text-purple-600 dark:hover:text-purple-400`

### ЗАПРЕЩЕНО

❌ Сложная анимация (бабблы, пульсация, тряска)  
❌ `transition-all duration-500` или дольше  
❌ Анимации на загрузке текста

---

## ПРАВИЛО №9 — СТРУКТУРА СТРАНИЦЫ

### Шапка

```jsx
<header className="bg-gray-50 dark:bg-gray-900 
                   border-b border-gray-200 dark:border-gray-800
                   px-4 py-3 sticky top-0 z-50
                   flex items-center justify-between">
  {/* Логотип слева */}
  <div className="flex items-center gap-2">
    <img src="/logo.svg" alt="AI Авитолог" className="h-8" />
    <span className="font-bold">AI Авитолог</span>
    <span className="px-2 py-0.5 rounded-md bg-purple-600 
                     text-white text-xs font-bold">PRO</span>
  </div>
  
  {/* Баланс + кнопка пополнения в центре */}
  <div className="flex items-center gap-2">
    <WalletIcon className="w-5 h-5" />
    <span className="font-semibold">45 ₽</span>
    <button className="w-8 h-8 rounded-full bg-gray-100 
                       dark:bg-gray-800 flex items-center 
                       justify-center">
      <PlusIcon className="w-4 h-4" />
    </button>
  </div>
  
  {/* Аватар справа */}
  <UserAvatar />
</header>
```

### Контейнер контента

```jsx
<main className="max-w-2xl mx-auto px-4 py-8">
  {/* контент */}
</main>
```

Для широких страниц:
```jsx
<main className="max-w-7xl mx-auto px-4 py-8">
```

---

## ПРАВИЛО №10 — RESPONSIVE

Mobile-first. Стили сначала для мобильного, потом для десктопа.

```jsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Заголовок
</h1>
```

### Принципы

✅ На мобильном — один столбец, всё крупно  
✅ На десктопе — больше пространства, столбцы  
✅ Padding страницы: `px-4 md:px-6`  
✅ Кнопка CTA — `w-full md:w-auto`

---

## ПРАВИЛО №11 — ИКОНКА-ЗАГЛУШКА В ШАПКЕ ❌

**КРИТИЧНО:** в текущей версии лендинга **слева от логотипа висит синий квадрат с «?»**.

Это **сломанная иконка** (broken image / placeholder).

### Что должно быть

- Либо **иконка меню-бургер** (`MenuIcon` из lucide-react)
- Либо **сам логотип-пирамида** (когда прогрузится из `/logo.svg`)

### Никогда не оставлять

❌ Заглушки `<img>` без alt и без fallback  
❌ Сломанные ссылки на картинки  
❌ Иконки «?» в синих квадратах

### Решение

```jsx
<img 
  src="/logo.svg" 
  alt="AI Авитолог PRO"
  className="h-8 w-8"
  onError={(e) => { 
    // Fallback на иконку меню если лого не загрузилось
    e.currentTarget.style.display = 'none';
    // Или показать MenuIcon
  }}
/>
```

---

## ПРАВИЛО №12 — ПУСТЫЕ ИЗОБРАЖЕНИЯ ❌

Если изображение **ещё не готово**:

### НИКОГДА

❌ Серый квадрат с иконкой «no image»  
❌ Стандартный placeholder от браузера  
❌ Битая ссылка `<img src="">` 

### ПРАВИЛЬНО

✅ Заглушка с текстом «Скриншот будет добавлен»  
✅ Skeleton-loader (анимация загрузки)  
✅ Цветной градиент-плейсхолдер с инициалами / темой  
✅ Просто **скрыть блок** до готовности данных

```jsx
{imageUrl ? (
  <img src={imageUrl} alt={alt} />
) : (
  <div className="aspect-video rounded-xl 
                  bg-gradient-to-br from-purple-600/20 
                  to-purple-900/20
                  flex items-center justify-center
                  text-sm text-gray-400">
    Скриншот скоро будет добавлен
  </div>
)}
```

---

## ЧЕК-ЛИСТ ПОСЛЕ КАЖДОЙ ЗАДАЧИ

- [ ] Все цвета из таблиц правила №1?
- [ ] Размеры текста по шкале правила №2 (не крупнее)?
- [ ] Все отступы кратны 4px (правило №3)?
- [ ] Шрифт Manrope везде?
- [ ] Карточки имеют padding минимум 16px?
- [ ] Текст не прилегает к краю карточек?
- [ ] Кнопки в одном стиле (правило №5)?
- [ ] Поля ввода в одном стиле?
- [ ] Иконки только из lucide-react (не эмодзи в UI)?
- [ ] Hover-эффекты на всех интерактивных элементах?
- [ ] Работает на мобильном (320-768px)?
- [ ] Нет inline-стилей и hex-цветов в JSX?
- [ ] Нет заглушек «?» вместо иконок?
- [ ] Нет битых картинок?
- [ ] Если страница из списка «двух тем» — работают обе?

---

## ПРИОРИТЕТ ПРАВИЛ

Если что-то противоречит — приоритет у DESIGN_SYSTEM.md.

Это касается:
- Существующего кода (рефакторим под систему)
- Запросов «сделать как у конкурента»
- Любых исключений «один раз можно»

Исключений НЕТ.
