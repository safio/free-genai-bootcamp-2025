import { DashboardStats } from '../types'
import { api } from './config'

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const [lastSessionRes, progressRes, statsRes] = await Promise.all([
    api.get('/dashboard/last_study_session'),
    api.get('/dashboard/study_progress'),
    api.get('/dashboard/quick_stats'),
  ])

  return {
    last_study_session: lastSessionRes.data,
    study_progress: progressRes.data,
    quick_stats: statsRes.data,
  }
} 