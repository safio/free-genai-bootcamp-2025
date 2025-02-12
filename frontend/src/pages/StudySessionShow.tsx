import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, CircularProgress, Alert } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { studySessionsApi, type StudySession, type WordReview } from '../api/study-sessions'
import { useState } from 'react'
import Pagination from '../components/common/Pagination'

export default function StudySessionShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: sessionResponse, isLoading: sessionLoading, error: sessionError } = useQuery({
    queryKey: ['studySession', id],
    queryFn: () => studySessionsApi.getById(Number(id)),
  })

  const { data: reviewsResponse, isLoading: reviewsLoading, error: reviewsError } = useQuery({
    queryKey: ['studySessionReviews', id, page],
    queryFn: () => studySessionsApi.getReviews(Number(id), page),
    enabled: !!id,
  })

  if (sessionLoading || reviewsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (sessionError || reviewsError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading study session details. Please try again.
      </Alert>
    )
  }

  if (!sessionResponse?.data || !reviewsResponse?.data) return null

  const session = sessionResponse.data
  const reviews = reviewsResponse.data.items
  const pagination = reviewsResponse.data.pagination
  const correctCount = reviews.filter(review => review.is_correct).length
  const successRate = reviews.length > 0 ? ((correctCount / reviews.length) * 100).toFixed(1) : '0.0'

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Study Session #{id}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Session Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography color="textSecondary" variant="body2">Activity</Typography>
                <Typography>{session.activity?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" variant="body2">Group</Typography>
                <Typography>{session.group?.name || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" variant="body2">Start Time</Typography>
                <Typography>{new Date(session.start_time).toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography color="textSecondary" variant="body2">End Time</Typography>
                <Typography>
                  {session.end_time
                    ? new Date(session.end_time).toLocaleString()
                    : 'In Progress'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Performance</Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography color="textSecondary" variant="body2">Success Rate</Typography>
                <Typography variant="h6">{successRate}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography color="textSecondary" variant="body2">Correct</Typography>
                <Typography variant="h6" color="success.main">{correctCount}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography color="textSecondary" variant="body2">Wrong</Typography>
                <Typography variant="h6" color="error.main">
                  {reviews.length - correctCount}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Review Items</Typography>
            {reviews.length === 0 ? (
              <Typography align="center" color="textSecondary">
                No review items yet.
              </Typography>
            ) : (
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>French</TableCell>
                        <TableCell>English</TableCell>
                        <TableCell>Result</TableCell>
                        <TableCell>Time</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reviews.map((review) => (
                        <TableRow key={review.id}>
                          <TableCell>{review.word.french}</TableCell>
                          <TableCell>{review.word.english}</TableCell>
                          <TableCell>
                            <Typography
                              color={review.is_correct ? 'success.main' : 'error.main'}
                            >
                              {review.is_correct ? 'Correct' : 'Wrong'}
                            </Typography>
                          </TableCell>
                          <TableCell>{new Date(review.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {pagination.total_pages > 1 && (
                  <Box mt={3} display="flex" justifyContent="center">
                    <Pagination
                      currentPage={page}
                      totalPages={pagination.total_pages}
                      onPageChange={setPage}
                    />
                  </Box>
                )}
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
} 