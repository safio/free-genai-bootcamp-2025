import { api } from './config';
import { StudyActivity } from './study-sessions';
import { PaginatedResponse } from './study-sessions';

export const studyActivitiesApi = {
  getAll: () => 
    api.get<StudyActivity[]>('/study-activities'),
  
  getById: (id: number) => 
    api.get<StudyActivity>(`/study-activities/${id}`),
  
  create: (data: { name: string; description: string; thumbnail_url: string }) => 
    api.post<StudyActivity>('/study-activities', data),
  
  update: (id: number, data: { name: string; description: string; thumbnail_url: string }) => 
    api.put<StudyActivity>(`/study-activities/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/study-activities/${id}`),
}; 