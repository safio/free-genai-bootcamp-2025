import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress, Alert } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { studyActivitiesApi } from '../api/study-activities'

export default function StudyActivities() {
  const navigate = useNavigate()
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['studyActivities'],
    queryFn: () => studyActivitiesApi.getAll()
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading study activities. Please try again.
      </Alert>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Study Activities</Typography>
      <Typography gutterBottom>Choose an activity to start studying</Typography>

      <Grid container spacing={3}>
        {activities?.data?.map((activity) => (
          <Grid item xs={12} sm={6} md={4} key={activity.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={activity.thumbnail_url}
                alt={activity.name}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {activity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {activity.description}
                </Typography>
                <Box display="flex" gap={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/study-activities/${activity.id}/launch`)}
                  >
                    Launch
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/study-activities/${activity.id}`)}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
} 