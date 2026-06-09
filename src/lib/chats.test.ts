import { afterEach, describe, expect, it, vi } from 'vitest';
import { sendMessageStream } from './chats';
import { ApiError } from './api';

const encoder = new TextEncoder();

afterEach(() => {
  vi.restoreAllMocks();
});

function createStream(chunks: string[], onCancel?: () => void) {
  let index = 0;
  let cancelled = false;
  return {
    getReader() {
      return {
        read: async () => {
          if (cancelled) {
            return { done: true, value: undefined };
          }
          if (index < chunks.length) {
            return { done: false, value: encoder.encode(chunks[index++]!) };
          }
          return { done: true, value: undefined };
        },
        cancel: async () => {
          cancelled = true;
          onCancel?.();
        },
      };
    },
  } as ReadableStream<Uint8Array>;
}

describe('sendMessageStream', () => {
  it('parses multi-line events and ignores ping heartbeats', async () => {
    const deltas: string[] = [];
    const cancel = vi.fn();
    const chunks = [
      ':ping\n\n',
      'data: {"type":"text","delta":"Привет"}\n\n',
      'data: {"type":"text","delta":", мир"}\n' +
        'data: {"type":"text","delta":"!"}\n\n',
      'data: [DONE]\n\n',
    ];

    vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: createStream(chunks, cancel),
      text: async () => '',
      clone: function () {
        return this;
      },
    } as any);

    await sendMessageStream('chat', 'hi', (delta) => deltas.push(delta));

    expect(deltas.join('')).toBe('Привет, мир!');
    expect(cancel).toHaveBeenCalled();
  });

  it('stops delivering deltas after abort', async () => {
    const deltas: string[] = [];
    let nextResolver: ((value: { value?: Uint8Array; done: boolean }) => void) | null = null;
    let cancelled = false;
    let firstRead = true;

    const reader = {
      read: () => {
        if (cancelled) {
          return Promise.resolve({ value: undefined, done: true });
        }
        if (firstRead) {
          firstRead = false;
          return Promise.resolve({
            value: encoder.encode('data: {"type":"text","delta":"один"}\n\n'),
            done: false,
          });
        }
        return new Promise<{ value?: Uint8Array; done: boolean }>((resolve) => {
          nextResolver = resolve;
        });
      },
      cancel: async () => {
        cancelled = true;
        nextResolver?.({ value: undefined, done: true });
      },
    };

    vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: { getReader: () => reader } as ReadableStream<Uint8Array>,
      text: async () => '',
      clone: function () {
        return this;
      },
    } as any);

    const controller = new AbortController();
    const promise = sendMessageStream('chat', 'привет', (delta) => deltas.push(delta), undefined, controller.signal);

    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(deltas).toEqual(['один']);

    controller.abort();

    nextResolver?.({
      value: encoder.encode('data: {"type":"text","delta":"два"}\n\n'),
      done: false,
    });

    await promise;

    expect(deltas).toEqual(['один']);
  });

  it('throws ApiError with response detail when limit is reached', async () => {
    vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
      ok: false,
      status: 429,
      body: null,
      json: async () => ({ detail: { message: 'limit reached', used: 3, limit: 3 } }),
      clone: function () {
        return this;
      },
      text: async () => JSON.stringify({ detail: { message: 'limit reached' } }),
    } as any);

    await expect(sendMessageStream('chat', 'привет', () => {})).rejects.toBeInstanceOf(ApiError);
  });

  it('calls onExport when export event is received', async () => {
    const deltas: string[] = [];
    const onExport = vi.fn();
    const chunks = [
      'data: {"type":"text","delta":"Готово"}\n\n',
      'data: {"type":"export","export":{"id":"123","kind":"docx","file_name":"report.docx","size_bytes":1024,"mime":"application/vnd.openxmlformats-officedocument.wordprocessingml.document","download_url":"/api/exports/123/download"}}\n\n',
      'data: [DONE]\n\n',
    ];

    vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: createStream(chunks),
      text: async () => '',
      clone: function () {
        return this;
      },
    } as any);

    await sendMessageStream('chat', 'hi', (delta) => deltas.push(delta), onExport);

    expect(deltas.join('')).toBe('Готово');
    expect(onExport).toHaveBeenCalledWith({
      id: '123',
      kind: 'docx',
      file_name: 'report.docx',
      size_bytes: 1024,
      mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      download_url: '/api/exports/123/download',
    });
  });

  it('preserves double line breaks inside a single delta', async () => {
    const deltas: string[] = [];
    const chunks = [
      'data: {"type":"text","delta":"Блок 1\\n\\nБлок 2"}\n\n',
      'data: [DONE]\n\n',
    ];

    vi.spyOn(globalThis as any, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      body: createStream(chunks),
      text: async () => '',
      clone: function () {
        return this;
      },
    } as any);

    await sendMessageStream('chat', 'hi', (delta) => deltas.push(delta));

    expect(deltas).toEqual(['Блок 1\n\nБлок 2']);
  });
});
