import { Box, Typography, Grid, Paper, Chip } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function WordShow() {
  const { id } = useParams()

  // Placeholder data - will be replaced with API call
  const word = {
    french: 'Bonjour',
    english: 'Hello',
    correct_count: 5,
    wrong_count: 1,
    groups: [
      { id: 1, name: 'Greetings' },
      { id: 2, name: 'Basics' }
    ]
  }

  const totalAttempts = word.correct_count + word.wrong_count
  const successRate = totalAttempts > 0
    ? ((word.correct_count / totalAttempts) * 100).toFixed(1)
    : '0'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{word.french}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Translation</Typography>
            <Typography variant="h5" color="text.secondary">
              {word.english}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Statistics</Typography>
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Success Rate</Typography>
                <Typography variant="h6">{successRate}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Correct</Typography>
                <Typography variant="h6" color="success.main">
                  {word.correct_count}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="body2" color="text.secondary">Wrong</Typography>
                <Typography variant="h6" color="error.main">
                  {word.wrong_count}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Word Groups</Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {word.groups.map((group) => (
                <Chip
                  key={group.id}
                  label={group.name}
                  color="primary"
                  variant="outlined"
                  clickable
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 