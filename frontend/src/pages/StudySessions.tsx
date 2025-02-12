import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { studySessionsApi, type StudySession } from '../api/study-sessions'
import { useState } from 'react'
import Pagination from '../components/common/Pagination'

export default function StudySessions() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['studySessions', page],
    queryFn: () => studySessionsApi.getAllSync(page),
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
        Error loading study sessions. Please try again.
      </Alert>
    )
  }

  const sessions = response?.data?.items || []
  const pagination = response?.data?.pagination

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Study Sessions</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            studySessionsApi.createSync(1, 1)
              .then(() => window.location.reload())
              .catch(err => console.error('Failed to create session:', err))
          }}
        >
          Start New Session
        </Button>
      </Box>

      {sessions.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography align="center">
            No study sessions yet. Start your first session!
          </Typography>
        </Paper>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Activity</TableCell>
                  <TableCell>Group</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                  <TableCell align="right">Review Items</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell>{session.id}</TableCell>
                    <TableCell>{session.activity?.name || 'N/A'}</TableCell>
                    <TableCell>{session.group?.name || 'N/A'}</TableCell>
                    <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                    <TableCell>
                      {session.end_time
                        ? new Date(session.end_time).toLocaleString()
                        : 'In Progress'}
                    </TableCell>
                    <TableCell align="right">{session.review_items?.length || 0}</TableCell>
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

          {pagination && pagination.total_pages > 1 && (
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
    </Box>
  )
} 