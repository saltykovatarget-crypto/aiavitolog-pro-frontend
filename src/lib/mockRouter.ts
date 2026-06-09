import { ApiError } from './api';
import * as M from './mockData';

const chatsStore = new Map<string, any>(M.MOCK_CHATS.map(c => [c.id, { ...c }]));
const messagesStore = new Map<string, any[]>(
  Object.entries(M.MOCK_MESSAGES).map(([k, v]) => [k, [...v]])
);
let balanceKopecks = M.MOCK_BALANCE_KOPECKS;
const transactionsStore: any[] = [...M.MOCK_TRANSACTIONS];

function ok<T>(data: T): T {
  return data;
}

function notMocked(method: string, url: string): never {
  console.warn('[Demo Mode] endpoint not mocked:', method, url);
  throw new ApiError('Demo mode: endpoint not mocked', 501, { method, url });
}

function matchWorkspaceTurns(url: string): string | null {
  const m = url.match(/^\/api\/workspaces\/([^/]+)\/turns\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

function matchWorkspaceId(url: string): string | null {
  const m = url.match(/^\/api\/workspaces\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

export async function mockRouter<T>(url: string, method: string, body?: any): Promise<T> {
  const path = url.split('?')[0];
  const m = method.toUpperCase();

  // session
  if (path === '/api/session/me' && m === 'GET') return ok(M.MOCK_USER) as T;
  if (path === '/api/session/login' && m === 'POST') return ok(M.MOCK_USER) as T;
  if (path === '/api/session/logout' && m === 'DELETE') return ok({ ok: true }) as T;

  // account
  if (path === '/api/account' && m === 'GET') return ok(M.MOCK_USER) as T;
  if (path === '/api/account/documents' && m === 'GET') return ok([]) as T;

  // workspaces
  if (path === '/api/workspaces' && m === 'GET') {
    return ok(Array.from(chatsStore.values())) as T;
  }
  if (path === '/api/workspaces' && m === 'POST') {
    const id = 'chat-' + Math.random().toString(36).slice(2, 9);
    const chat = {
      id,
      title: (body && body.title) || 'Новый чат',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    chatsStore.set(id, chat);
    messagesStore.set(id, []);
    return ok(chat) as T;
  }

  const wsId = matchWorkspaceId(path);
  if (wsId) {
    if (m === 'PATCH' || m === 'PUT') {
      const existing = chatsStore.get(wsId);
      if (!existing) throw new ApiError('Not found', 404, null);
      const updated = { ...existing, ...(body || {}), updated_at: new Date().toISOString() };
      chatsStore.set(wsId, updated);
      return ok(updated) as T;
    }
    if (m === 'DELETE') {
      chatsStore.delete(wsId);
      messagesStore.delete(wsId);
      return ok({ ok: true }) as T;
    }
  }

  const turnsId = matchWorkspaceTurns(path);
  if (turnsId) {
    if (m === 'GET') {
      const items = messagesStore.get(turnsId) ?? [];
      return ok({ items }) as T;
    }
    // POST is the streaming endpoint — handled inside chats.ts demo branch directly,
    // but if called via request() we return a stub.
    if (m === 'POST') {
      return ok({ ok: true }) as T;
    }
  }

  // wallet
  if (path === '/api/wallet/balance' && m === 'GET') {
    return ok({ balance_kopecks: balanceKopecks }) as T;
  }
  if (path === '/api/wallet/transactions' && m === 'GET') {
    return ok(transactionsStore) as T;
  }

  // access / billing
  if (path === '/api/access/orders' && m === 'POST') {
    return ok({
      order_id: 'demo-order-' + Date.now(),
      success_url: '/billing/success',
      payment_url: '/billing/success',
    }) as T;
  }
  if (path === '/api/access/tochka/confirm' && m === 'POST') {
    balanceKopecks += 150000;
    transactionsStore.unshift({
      id: transactionsStore.length + 1,
      type: 'topup_package_100',
      amount_kopecks: 150000,
      balance_after_kopecks: balanceKopecks,
      description: 'Пакет 300 запросов',
      created_at: new Date().toISOString(),
      package_type: 'package_300',
    });
    return ok({ status: 'paid', balance_kopecks: balanceKopecks }) as T;
  }

  // support
  if (path === '/api/support/tickets' && m === 'POST') {
    return ok({ id: 'demo-ticket-' + Date.now(), status: 'open' }) as T;
  }

  return notMocked(method, url);
}
