import { Grid, Box, Typography, Stack } from '@mui/material'
import { DashboardStats } from '../../types'

interface Props {
  data: DashboardStats['quick_stats']
}

export default function QuickStats({ data }: Props) {
  return (
    <Grid container spacing={2}>
      <StatCard label="Success Rate" value={`${data.success_rate}%`} />
      <StatCard label="Study Sessions" value={data.total_study_sessions.toString()} />
      <StatCard label="Active Groups" value={data.total_active_groups.toString()} />
      <StatCard label="Study Streak" value={`${data.study_streak_days} days`} />
    </Grid>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, boxShadow: 1 }}>
        <Typography variant="body2" color="textSecondary">{label}</Typography>
        <Typography variant="h5" fontWeight="bold">{value}</Typography>
      </Box>
    </Grid>
  )
} 