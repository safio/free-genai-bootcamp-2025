import { Box, Typography, LinearProgress, Stack } from '@mui/material'
import { DashboardStats } from '../../types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  data: DashboardStats['last_study_session']
}

export default function LastStudySession({ data }: Props) {
  const total = data.correct_count + data.wrong_count
  const correctPercentage = (data.correct_count / total) * 100

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, boxShadow: 1 }}>
      <Stack spacing={2} alignItems="flex-start">
        <Typography variant="h6">Last Study Session</Typography>
        <Typography variant="body2" color="textSecondary">
          {data.activity_name} - {data.group_name}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {formatDistanceToNow(new Date(data.timestamp))} ago
        </Typography>
        <Box sx={{ width: '100%' }}>
          <Typography variant="body2" fontWeight="medium">Progress</Typography>
          <Typography variant="body2" color="textSecondary">
            {data.correct_count}/{total} correct
          </Typography>
          <LinearProgress variant="determinate" value={correctPercentage} />
        </Box>
      </Stack>
    </Box>
  )
} 