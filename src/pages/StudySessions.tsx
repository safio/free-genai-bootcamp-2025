import { VStack, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getStudySessions } from '../api/study-sessions'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import Pagination from '../components/common/Pagination'
import { format } from 'date-fns'

export default function StudySessions() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['studySessions', page],
    queryFn: () => getStudySessions(page),
  })

  if (isLoading) {
    return <LoadingState message="Loading study sessions..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Error loading study sessions"
        queryKey={['studySessions', page]}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Study Sessions</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={6} align="stretch">
          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Activity</Th>
                <Th>Group</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
                <Th>Review Items</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.items.map((session) => (
                <Tr key={session.id}>
                  <Td>{session.id}</Td>
                  <Td>{session.activity_name}</Td>
                  <Td>{session.group_name}</Td>
                  <Td>{format(new Date(session.start_time), 'PPp')}</Td>
                  <Td>
                    {session.end_time
                      ? format(new Date(session.end_time), 'PPp')
                      : 'In Progress'}
                  </Td>
                  <Td>{session.review_items_count}</Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/study-sessions/${session.id}`)}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </VStack>
      </Box>
    </VStack>
  )
} 