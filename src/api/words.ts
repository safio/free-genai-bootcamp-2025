import { Word, PaginatedResponse } from '../types'
import { api } from './config'

export const getWords = async (page = 1): Promise<PaginatedResponse<Word>> => {
  const response = await api.get('/words', {
    params: { page },
  })
  return response.data
}

export const getWord = async (id: string): Promise<Word & { groups: { id: number; name: string }[] }> => {
  const response = await api.get(`/words/${id}`)
  return response.data
}

export const searchWords = async (query: string, page = 1): Promise<PaginatedResponse<Word>> => {
  const response = await api.get('/words/search', {
    params: { query, page },
  })
  return response.data
} 