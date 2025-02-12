import { StudySession, WordReviewItem, PaginatedResponse } from '../types'
import { api } from './config'

export const getStudySessions = async (page = 1): Promise<PaginatedResponse<StudySession>> => {
  const response = await api.get('/study_sessions', {
    params: { page },
  })
  return response.data
}

export const getStudySession = async (id: string): Promise<StudySession> => {
  const response = await api.get(`/study_sessions/${id}`)
  return response.data
}

export const getStudySessionWords = async (
  id: string,
  page = 1
): Promise<PaginatedResponse<WordReviewItem>> => {
  const response = await api.get(`/study_sessions/${id}/words`, {
    params: { page },
  })
  return response.data
} 