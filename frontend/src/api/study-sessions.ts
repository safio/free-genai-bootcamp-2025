import { api } from './config'

export interface StudyActivity {
  id: number;
  name: string;
  description: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export interface Group {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  words: Word[];
}

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

export interface WordReview {
  id: number;
  word_id: number;
  session_id: number;
  is_correct: boolean;
  timestamp: string;
  created_at: string;
  word: Word;
}

export interface StudySession {
  id: number;
  activity_id: number;
  group_id: number;
  start_time: string;
  end_time: string | null;
  created_at: string;
  activity: StudyActivity;
  group: Group;
  review_items: WordReview[];
}

export interface PaginationParams {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationParams;
}

export const studySessionsApi = {
  // Async endpoints
  getAll: (skip: number = 0, limit: number = 100) => 
    api.get<PaginatedResponse<StudySession>>('/study-sessions', { params: { skip, limit } }),

  create: (activity_id: number, group_id: number) =>
    api.post<StudySession>('/study-sessions', null, { params: { activity_id, group_id } }),

  getById: (id: number) =>
    api.get<StudySession>(`/study-sessions/${id}`),

  // Sync endpoints
  getAllSync: (page: number = 1, per_page: number = 10) =>
    api.get<PaginatedResponse<StudySession>>('/study-sessions/study_sessions', { params: { page, per_page } }),

  createSync: (activity_id: number, group_id: number) =>
    api.post<StudySession>('/study-sessions/study_sessions', null, { params: { activity_id, group_id } }),

  // Reviews
  createReview: (session_id: number, word_id: number, is_correct: boolean) =>
    api.post<WordReview>('/study-sessions/review-items', null, { params: { session_id, word_id, is_correct } }),

  getReviews: (session_id: number, page: number = 1, per_page: number = 10) =>
    api.get<PaginatedResponse<WordReview>>(`/study-sessions/${session_id}/review-items`, { 
      params: { page, per_page } 
    }),

  // Session management
  endSession: (session_id: number) =>
    api.put('/study-sessions/end', null, { params: { session_id } }),

  // Progress and stats
  getProgress: (session_id: number) =>
    api.get('/study-sessions/progress', { params: { session_id } }),

  getDashboardStats: () =>
    api.get<{
      success_rate: number;
      total_study_sessions: number;
      total_active_groups: number;
      study_streak_days: number;
    }>('/study-sessions/dashboard/stats'),

  getSessionWords: (
    session_id: number, 
    { reviewed_only = false, correct_only = null, skip = 0, limit = 100 } = {}
  ) =>
    api.get<PaginatedResponse<Word>>('/study-sessions/words', { 
      params: { session_id, reviewed_only, correct_only, skip, limit } 
    }),

  getRecentSessions: (days: number = 7, skip: number = 0, limit: number = 100) =>
    api.get<PaginatedResponse<StudySession>>('/study-sessions/recent', { 
      params: { days, skip, limit } 
    }),

  getByGroup: (group_id: number, page: number = 1, per_page: number = 10) =>
    api.get<PaginatedResponse<StudySession>>('/study-sessions', { 
      params: { group_id, page, per_page } 
    }),
}; 