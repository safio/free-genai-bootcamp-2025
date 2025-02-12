import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { studySessionsApi, type StudySession } from '../api/study-sessions'

export default function StudySessions() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    studySessionsApi.getAllSync()
      .then(response => {
        console.log('API Response:', response)
        setSessions(response.data.items)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch study sessions:', error.response || error)
        setError(error.response?.data?.detail || 'Failed to load study sessions')
        setLoading(false)
      })
  }, [])

  const startNewSession = () => {
    studySessionsApi.createSync(1, 1) // TODO: Let user select activity and group
      .then(response => {
        console.log('New session created:', response)
        // Refresh the list
        window.location.reload()
      })
      .catch(error => {
        console.error('Failed to create session:', error)
        setError('Failed to create new session')
      })
  }

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Study Sessions</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={startNewSession}
        >
          Start New Session
        </Button>
      </Box>

      {sessions.length === 0 ? (
        <Card>
          <CardContent>
            <Typography align="center">
              No study sessions yet. Start your first session!
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {sessions.map((session) => (
            <Grid item xs={12} sm={6} md={4} key={session.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {session.activity.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Group: {session.group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status: {session.end_time ? 'Completed' : 'In Progress'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Started: {new Date(session.start_time).toLocaleString()}
                  </Typography>
                  {session.end_time && (
                    <Typography variant="body2" color="text.secondary">
                      Ended: {new Date(session.end_time).toLocaleString()}
                    </Typography>
                  )}
                  <Box mt={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => navigate(`/study/${session.id}`)}
                    >
                      {session.end_time ? 'View Results' : 'Continue'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
} 