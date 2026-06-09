import { api, ApiError } from './api';

export interface UserDocumentItem {
  id: string;
  index: number;
  file_name: string;
  status: string;
  created_at: string;
}

export interface UserDocumentsGroup {
  chat_id: string;
  chat_title: string;
  documents: UserDocumentItem[];
}

export async function fetchMyDocuments(): Promise<UserDocumentsGroup[]> {
  return api.get<UserDocumentsGroup[]>('/api/account/documents');
}

export { ApiError };
