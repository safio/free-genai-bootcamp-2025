import { api } from './config'

export const resetHistory = async (): Promise<void> => {
  await api.post('/reset_history')
}

export const fullReset = async (): Promise<void> => {
  await api.post('/full_reset')
}

export const updateTheme = async (theme: string): Promise<void> => {
  await api.post('/settings/theme', { theme })
}

export const getSettings = async (): Promise<{ theme: string }> => {
  const response = await api.get('/settings')
  return response.data
} 