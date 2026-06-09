import type { ChatDocument } from '@/types/chat';
import { isDemoMode } from './demoMode';
import { mockRouter } from './mockRouter';

export type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(url: string, { method = 'GET', body, headers = {}, signal }: ApiRequestOptions = {}): Promise<T> {
  if (isDemoMode() && url.startsWith('/api/')) {
    await new Promise(r => setTimeout(r, 150));
    return mockRouter<T>(url, method, body);
  }
  const init: RequestInit = {
    method,
    credentials: 'include',
    headers: {
      ...(body != null ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    signal,
  };

  if (body != null) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const response = await fetch(url, init);

  let data: unknown = null;
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.toLowerCase().includes('application/json')) {
    try {
      data = await response.json();
    } catch (error) {
      console.error('Failed to parse JSON response', error);
    }
  } else {
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : text;
    } catch {
      // ignore non-json bodies
    }
  }

  if (!response.ok) {
    throw new ApiError('Request failed', response.status, data);
  }

  return data as T;
}

export const api = {
  get<T = unknown>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return request<T>(url, { ...options, method: 'GET' });
  },
  post<T = unknown>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return request<T>(url, { ...options, method: 'POST', body });
  },
  put<T = unknown>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return request<T>(url, { ...options, method: 'PUT', body });
  },
  patch<T = unknown>(url: string, body?: unknown, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return request<T>(url, { ...options, method: 'PATCH', body });
  },
  delete<T = unknown>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>) {
    return request<T>(url, { ...options, method: 'DELETE' });
  },
};

/**
 * Загрузка документа для конкретного чата.
 * Использует эндпоинт POST /api/workspaces/{chatId}/documents (multipart/form-data).
 */
export async function uploadChatDocument(
  chatId: string,
  file: File,
  title?: string
): Promise<ChatDocument> {
  const formData = new FormData();
  formData.append('file', file);
  if (title) {
    formData.append('title', title);
  }

  const response = await fetch(`/api/workspaces/${encodeURIComponent(chatId)}/documents`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    // Попробуем вытащить текст ошибки с бэка
    let message = 'Не удалось загрузить документ. Попробуйте позже.';
    try {
      const data = await response.json();
      if (data?.detail) {
        message = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
      }
    } catch {
      // игнорируем, оставляем дефолтное сообщение
    }
    throw new Error(message);
  }

  const data = (await response.json()) as ChatDocument;
  return data;
}
