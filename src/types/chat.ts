export type Author = 'user' | 'assistant';
export type MessageState = 'base' | 'streaming' | 'error';

export interface Message {
  id: string;
  author: Author;
  text: string;        // финальный текст (для base/error)
  state: MessageState; // base | streaming | error
  createdAt: number;
  files?: FilePinData[]; // прикрепленные файлы в сообщении
  hasUploadingDocument?: boolean; // признак, что запрос включал загруженный документ
}

export interface ChatDocument {
  id: string;
  index: number;
  file_name: string;
  status: string;
  created_at: string;
}

// Re-export FilePinData from FilePin component
export type { FilePinData } from '../components/FilePin';
