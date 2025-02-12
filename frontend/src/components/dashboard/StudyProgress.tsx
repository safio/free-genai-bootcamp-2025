import { Box, Typography, LinearProgress, Stack, CircularProgress } from '@mui/material'
import { DashboardStats } from '../../types'

interface Props {
  data: DashboardStats['study_progress']
}

export default function StudyProgress({ data }: Props) {
  const studiedPercentage = (data.total_words_studied / data.total_words) * 100

  return (
    <Box sx={{ bgcolor: 'white', p: 2, borderRadius: 1, boxShadow: 1 }}>
      <Stack spacing={6} alignItems="flex-start">
        <Typography variant="h6">Study Progress</Typography>

        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" fontWeight="medium" mb={2}>Total Words Studied</Typography>
          <Stack direction="row" justifyContent="space-between" mb={2}>
            <Typography variant="body2" color="textSecondary">
              {data.total_words_studied}/{data.total_words} words
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {studiedPercentage.toFixed(1)}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={studiedPercentage} />
        </Box>

        <Box>
          <Typography variant="body2" fontWeight="medium" mb={2} textAlign="center">Mastery</Typography>
          <CircularProgress variant="determinate" value={data.mastery_percentage} size={80} thickness={8} color="success.main">
            <Typography variant="body2">{data.mastery_percentage}%</Typography>
          </CircularProgress>
        </Box>
      </Stack>
    </Box>
  )
} 