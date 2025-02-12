import { api } from './config';

export interface Word {
  id: number;
  french: string;
  english: string;
  parts: Record<string, any> | null;
  correct_count: number;
  wrong_count: number;
  created_at: string;
  updated_at: string;
}

export const wordsApi = {
  getAll: () => api.get<Word[]>('/words'),
  getById: (id: number) => api.get<Word>(`/words/${id}`),
  create: (data: Omit<Word, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Word>('/words', data),
  update: (id: number, data: Partial<Word>) => 
    api.put<Word>(`/words/${id}`, data),
  delete: (id: number) => api.delete(`/words/${id}`),
  getByGroup: (groupId: number) => 
    api.get<Word[]>(`/groups/${groupId}/words`),
}; 