import { api, ApiError } from '@/lib/api';
import { isDemoMode } from '@/lib/demoMode';
import { pickMockReply } from '@/lib/mockData';
/* Чаты: API-утилиты */

export interface Chat {
  id: string;
  title: string;
  created_at?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at?: string;
  images?: string[];
  exports?: Array<{
    id: string;
    kind: 'docx' | 'xlsx';
    file_name: string;
    mime: string;
    size_bytes: number;
    download_url: string;
  }>;
}

// Реальный ответ бэкенда: { "items": [...] }
interface MessageListResponse {
  items: Message[];
}

export type UploadedChatImage = {
  key: string;
  url: string;
  mime: string;
  name: string;
  size_bytes: number;
};

export async function listChats(): Promise<Chat[]> {
  return api.get('/api/workspaces');
}

export async function createChat(title?: string): Promise<Chat> {
  return api.post('/api/workspaces', { title: title ?? 'Новый чат' });
}

export async function getMessages(chatId: string): Promise<Message[]> {
  const res = await api.get<MessageListResponse | Message[]>(`/api/workspaces/${chatId}/turns`);

  // На всякий случай поддерживаем оба варианта: массив или объект с items
  if (Array.isArray(res)) {
    return res;
  }
  if (res && typeof res === 'object' && Array.isArray((res as MessageListResponse).items)) {
    return (res as MessageListResponse).items;
  }
  console.error('Unexpected messages response shape', res);
  return [];
}

export async function uploadChatImage(
  chatId: string,
  file: File,
  currentCount?: number,
): Promise<UploadedChatImage> {
  const formData = new FormData();
  formData.append('file', file);

  const query = typeof currentCount === 'number' ? `?current_count=${currentCount}` : '';
  const response = await fetch(`/api/workspaces/${encodeURIComponent(chatId)}/images${query}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    let message = 'Не удалось загрузить изображение. Попробуйте позже.';
    try {
      const data = await response.json();
      if (data?.detail) {
        message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch {}
    throw new Error(message);
  }

  return (await response.json()) as UploadedChatImage;
}

export async function sendMessageStream(
  chatId: string,
  content: string,
  onDelta: (delta: string) => void,
  onExport?: (exp: { id: string; kind: 'docx' | 'xlsx'; file_name: string; size_bytes: number; mime: string; download_url?: string }) => void,
  signal?: AbortSignal,
  options?: { docs_only?: boolean; image_keys?: string[] },
): Promise<void> {
  if (isDemoMode()) {
    const reply = pickMockReply(content);
    const words = reply.split(/(\s+)/);
    for (const w of words) {
      if (signal?.aborted) return;
      onDelta(w);
      await new Promise(r => setTimeout(r, 35));
    }
    return;
  }
  const response = await fetch(`/api/workspaces/${chatId}/turns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      docs_only: options?.docs_only ?? false,
      image_keys: options?.image_keys ?? [],
    }),
    credentials: 'include',
    signal,
  });

  if (!response.ok || !response.body) {
    let data: unknown = null;
    try {
      data = await response.clone().json();
    } catch {
      try {
        data = await response.text();
      } catch {
        data = null;
      }
    }
    throw new ApiError('LLM stream failed', response.status, data);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let debugRawResponse = '';

  const cancelReader = async () => {
    try {
      await reader.cancel();
    } catch {
      /* ignore */
    }
  };

  const handleAbort = () => {
    void cancelReader();
  };

  if (signal) {
    if (signal.aborted) {
      await cancelReader();
      return;
    }
    signal.addEventListener('abort', handleAbort, { once: true });
  }

  const flushBuffer = async (): Promise<boolean> => {
    let idx: number;
    while ((idx = buffer.indexOf('\n\n')) >= 0) {
      const rawEvent = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);

      if (!rawEvent) continue;

      const lines = rawEvent.split('\n');
      const dataLines: string[] = [];
      for (const line of lines) {
        if (!line) continue;
        if (line.startsWith(':')) {
          // comment / ping line
          continue;
        }
        if (line.startsWith('data:')) {
          dataLines.push(line.slice(5).trimStart());
        }
      }

      if (dataLines.length === 0) continue;

      for (const raw of dataLines) {
        const normalized = raw.trim();
        if (!normalized) {
          continue;
        }

        if (normalized === '[DONE]') {
          await cancelReader();
          return true;
        }

        try {
          const evt = JSON.parse(normalized);
          if (evt.type === 'text' && evt.delta) {
            const delta = evt.delta as string;
            debugRawResponse += delta;
            onDelta(delta);
          } else if (evt.type === 'export' && evt.export?.id) {
            onExport?.(evt.export);
          } else if (evt.type === 'error') {
            await cancelReader();
            throw new Error(evt.message || 'LLM stream error');
          }
        } catch {
          // ignore malformed chunks — возможны разрывы события на прокси
        }
      }
    }
    return false;
  };

  try {
    while (true) {
      if (signal?.aborted) {
        await cancelReader();
        return;
      }
      const { value, done } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        break;
      }
      buffer += decoder.decode(value, { stream: true });

      if (await flushBuffer()) return;
    }

    if (await flushBuffer()) return;
  } finally {
    if (import.meta.env.DEV === true) {
      console.debug('[chat raw response]', debugRawResponse);
    }
    if (signal) {
      signal.removeEventListener('abort', handleAbort);
    }
  }
}

// Не обязательно для заглушки; если на бэке есть PATCH — используйте.
export async function renameChat(chatId: string, title: string): Promise<Chat> {
  try {
    return await api.patch(`/api/workspaces/${chatId}`, { title });
  } catch (e: any) {
    const status = e?.status ?? e?.response?.status;
    if (status === 405) {
      return await api.put(`/api/workspaces/${chatId}`, { title });
    }
    throw e;
  }
}

export async function deleteChat(chatId: string): Promise<void> {
  await api.delete(`/api/workspaces/${chatId}`);
}

// БОЛЬШЕ НИКАКОГО авто-создания чатов на инициализации.
// Просто возвращаем то, что есть на сервере.
export async function ensureChatsLoaded(_opts?: { userId?: string | null }): Promise<Chat[]> {
  try {
    return await listChats();
  } catch {
    return [];
  }
}
