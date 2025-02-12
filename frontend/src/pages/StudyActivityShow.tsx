import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { studyActivitiesApi } from '../api/study-activities'
import { studySessionsApi } from '../api/study-sessions'

export default function StudyActivityShow() {
  const { id } = useParams()
  const navigate = useNavigate()

  const { data: activity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['studyActivity', id],
    queryFn: () => studyActivitiesApi.getById(Number(id)),
    enabled: !!id
  })

  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['studyActivitySessions', id],
    queryFn: () => studySessionsApi.getByGroup(Number(id)),
    enabled: !!id
  })

  if (activityLoading || sessionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (activityError || sessionsError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading activity details. Please try again.
      </Alert>
    )
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{activity?.data?.name}</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/study-activities/${id}/launch`)}
        >
          Launch Activity
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="200"
              image={activity?.data?.thumbnail_url}
              alt={activity?.data?.name}
            />
            <CardContent>
              <Typography variant="body1" color="text.secondary">
                {activity?.data?.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Activity Stats</Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Total Sessions</Typography>
                  <Typography variant="h6">{sessions?.data?.pagination?.total_items || 0}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography color="text.secondary">Last Session</Typography>
                  <Typography variant="h6">
                    {sessions?.data?.items?.[0]?.start_time 
                      ? new Date(sessions.data.items[0].start_time).toLocaleDateString()
                      : 'No sessions yet'}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Past Sessions</Typography>
          {sessions?.data?.items?.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No study sessions yet. Start your first session!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Group</TableCell>
                    <TableCell>Start Time</TableCell>
                    <TableCell>End Time</TableCell>
                    <TableCell align="right">Review Items</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions?.data?.items.map((session) => (
                    <TableRow key={session.id}>
                      <TableCell>{session.group.name}</TableCell>
                      <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                      <TableCell>
                        {session.end_time 
                          ? new Date(session.end_time).toLocaleString()
                          : 'In Progress'}
                      </TableCell>
                      <TableCell align="right">{session.review_items.length}</TableCell>
                      <TableCell>
                        <Button
                          variant="text"
                          size="small"
                          onClick={() => navigate(`/study-sessions/${session.id}`)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </Grid>
    </Box>
  )
} 