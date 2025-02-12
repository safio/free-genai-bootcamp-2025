import { StudyActivity, StudySession, PaginatedResponse } from '../types'
import { api } from './config'

export const getStudyActivities = async (): Promise<StudyActivity[]> => {
  const response = await api.get('/study_activities')
  return response.data
}

export const getStudyActivity = async (id: string): Promise<StudyActivity> => {
  const response = await api.get(`/study_activities/${id}`)
  return response.data
}

export const getStudyActivitySessions = async (
  id: string,
  page = 1
): Promise<PaginatedResponse<StudySession>> => {
  const response = await api.get(`/study_activities/${id}/study_sessions`, {
    params: { page },
  })
  return response.data
}

export const launchStudyActivity = async (id: string, groupId: number): Promise<StudySession> => {
  const response = await api.post(`/study_activities/${id}/launch`, {
    group_id: groupId,
  })
  return response.data
} 