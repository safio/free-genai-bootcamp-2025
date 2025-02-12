export interface Word {
  id: number;
  french: string;
  english: string;
  correct_count: number;
  wrong_count: number;
}

export interface Group {
  id: number;
  name: string;
  word_count: number;
}

export interface StudyActivity {
  id: number;
  name: string;
  description: string;
  thumbnail_url: string;
}

export interface StudySession {
  id: number;
  activity_name: string;
  group_name: string;
  start_time: string;
  end_time: string | null;
  review_items_count: number;
}

export interface DashboardStats {
  last_study_session: {
    activity_name: string;
    group_name: string;
    correct_count: number;
    wrong_count: number;
    timestamp: string;
  };
  study_progress: {
    total_words_studied: number;
    total_words: number;
    mastery_percentage: number;
  };
  quick_stats: {
    success_rate: number;
    total_study_sessions: number;
    total_active_groups: number;
    study_streak_days: number;
  };
}

export interface WordReviewItem {
  id: number;
  word_id: number;
  session_id: number;
  is_correct: boolean;
  timestamp: string;
  word: Word;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
} 