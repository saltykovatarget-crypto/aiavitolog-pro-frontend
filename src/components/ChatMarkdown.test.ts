import { describe, expect, it } from 'vitest';

import { normalizeAnswerPresentation, normalizeMarkdown } from './ChatMarkdown';

describe('normalizeMarkdown', () => {
  it('keeps blocks with backticks inside', () => {
    const input = '```\nпример `код`\n```';
    expect(normalizeMarkdown(input)).toBe(input);
  });

  it('keeps blocks with language hints even with extra words', () => {
    const input = '```json pretty\n{"a":1}\n```';
    expect(normalizeMarkdown(input)).toBe(input);
  });

  it('converts single-line blocks without language to inline chips', () => {
    const input = '```\nМосква и МО\n```';
    expect(normalizeMarkdown(input)).toBe('`Москва и МО`');
  });

  it('preserves multiline code blocks', () => {
    const input = '```bash\necho 1\necho 2\n```';
    expect(normalizeMarkdown(input)).toBe(input);
  });

  it('works inside larger text', () => {
    const input = 'до\n```\nМосква\n```\nпосле';
    expect(normalizeMarkdown(input)).toBe('до\n`Москва`\nпосле');
  });

  it('removes standalone dot lines', () => {
    const input = 'строка 1\n.\nстрока 2';
    expect(normalizeMarkdown(input)).toBe('строка 1\n\nстрока 2');
  });
});

describe('normalizeAnswerPresentation', () => {
  it('inserts empty lines before marker lines and sections', () => {
    const input = [
      'Вводный блок',
      '🔹 Первый пункт',
      'Текст про результат',
      'Готово: Список действий',
      'Дальше: Следующие шаги',
    ].join('\n');

    expect(normalizeAnswerPresentation(input)).toBe([
      'Вводный блок',
      '',
      '🔹 Первый пункт',
      'Текст про результат',
      '',
      'Готово: Список действий',
      '',
      'Дальше: Следующие шаги',
    ].join('\n'));
  });

  it('does not alter fenced code blocks', () => {
    const input = [
      'До кода',
      '```',
      '🔹 не трогать',
      'Готово: тоже не трогать',
      '```',
      'После кода',
    ].join('\n');

    expect(normalizeAnswerPresentation(input)).toBe(input);
  });
});
