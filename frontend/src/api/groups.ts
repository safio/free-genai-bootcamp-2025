import { api } from './config';
import { Word } from './words';
import { PaginatedResponse } from './study-sessions';

export interface Group {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const groupsApi = {
  getAll: () => api.get<Group[]>('/groups'),
  getById: (id: number) => api.get<Group>(`/groups/${id}`),
  create: (data: Omit<Group, 'id' | 'created_at' | 'updated_at'>) => 
    api.post<Group>('/groups', data),
  update: (id: number, data: Partial<Group>) => 
    api.put<Group>(`/groups/${id}`, data),
  delete: (id: number) => api.delete(`/groups/${id}`),
  getWords: (id: number, page: number = 1, per_page: number = 10) =>
    api.get<PaginatedResponse<Word>>(`/groups/${id}/words`, { 
      params: { page, per_page } 
    }),
}; 