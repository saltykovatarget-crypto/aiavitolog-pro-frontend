import { ApiError } from './api';

export type GuestChat = { id: string; title: string };

export async function getOrCreateGuestChat(): Promise<GuestChat> {
  throw new ApiError('Гостевой режим отключён', 404, { detail: 'Not found' });
}

export async function sendGuestMessageStream(
  _chatId: string,
  _content: string,
  _onChunk: unknown,
): Promise<void> {
  throw new ApiError('Гостевой режим отключён', 404, { detail: 'Not found' });
}
