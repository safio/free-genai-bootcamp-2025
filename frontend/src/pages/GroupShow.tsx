import { Box, Typography, Tabs, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { groupsApi } from '../api/groups'
import { studySessionsApi } from '../api/study-sessions'
import Pagination from '../components/common/Pagination'

export default function GroupShow() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(0)
  const [page, setPage] = useState(1)

  const { data: group, isLoading: groupLoading, error: groupError } = useQuery({
    queryKey: ['group', id],
    queryFn: () => groupsApi.getById(Number(id)),
    enabled: !!id
  })

  const { data: words, isLoading: wordsLoading, error: wordsError } = useQuery({
    queryKey: ['groupWords', id, page],
    queryFn: () => groupsApi.getWords(Number(id), page),
    enabled: !!id
  })

  const { data: sessions, isLoading: sessionsLoading, error: sessionsError } = useQuery({
    queryKey: ['groupSessions', id],
    queryFn: () => studySessionsApi.getByGroup(Number(id)),
    enabled: !!id
  })

  if (groupLoading || wordsLoading || sessionsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (groupError || wordsError || sessionsError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading group details. Please try again.
      </Alert>
    )
  }

  if (!group?.data) return null

  return (
    <Box>
      <Typography variant="h4" gutterBottom>{group.data.name}</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label={`Words (${words?.data?.pagination?.total_items || 0})`} />
          <Tab label="Study Sessions" />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>French</TableCell>
                  <TableCell>English</TableCell>
                  <TableCell align="right">Correct</TableCell>
                  <TableCell align="right">Wrong</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {words?.data?.items.map((word) => (
                  <TableRow key={word.id}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                      {word.french}
                    </TableCell>
                    <TableCell>{word.english}</TableCell>
                    <TableCell align="right" sx={{ color: 'success.main' }}>
                      {word.correct_count}
                    </TableCell>
                    <TableCell align="right" sx={{ color: 'error.main' }}>
                      {word.wrong_count}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="text"
                        size="small"
                        onClick={() => navigate(`/words/${word.id}`)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {words?.data?.pagination?.total_pages > 1 && (
            <Box mt={3} display="flex" justifyContent="center">
              <Pagination
                currentPage={page}
                totalPages={words.data.pagination.total_pages}
                onPageChange={setPage}
              />
            </Box>
          )}
        </>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Activity</TableCell>
                <TableCell>Start Time</TableCell>
                <TableCell>End Time</TableCell>
                <TableCell align="right">Review Items</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions?.data?.items.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>{session.activity.name}</TableCell>
                  <TableCell>{new Date(session.start_time).toLocaleString()}</TableCell>
                  <TableCell>
                    {session.end_time 
                      ? new Date(session.end_time).toLocaleString() 
                      : 'In Progress'}
                  </TableCell>
                  <TableCell align="right">{session.review_items.length}</TableCell>
                  <TableCell align="right">
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
    </Box>
  )
} 