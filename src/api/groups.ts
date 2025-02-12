import { Group, Word, StudySession, PaginatedResponse } from '../types'
import { api } from './config'

export const getGroups = async (): Promise<Group[]> => {
  const response = await api.get('/groups')
  return response.data
}

export const getGroup = async (id: string): Promise<Group> => {
  const response = await api.get(`/groups/${id}`)
  return response.data
}

export const getGroupWords = async (
  id: string,
  page = 1
): Promise<PaginatedResponse<Word>> => {
  const response = await api.get(`/groups/${id}/words`, {
    params: { page },
  })
  return response.data
}

export const getGroupSessions = async (
  id: string,
  page = 1
): Promise<PaginatedResponse<StudySession>> => {
  const response = await api.get(`/groups/${id}/study_sessions`, {
    params: { page },
  })
  return response.data
} 