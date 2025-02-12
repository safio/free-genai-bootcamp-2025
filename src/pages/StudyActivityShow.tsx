import { VStack, Heading, Text, Button, Image, Box, Table, Thead, Tbody, Tr, Th, Td, HStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudyActivity, getStudyActivitySessions } from '../api/study-activities'
import { format } from 'date-fns'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import Pagination from '../components/common/Pagination'
import { useState } from 'react'

export default function StudyActivityShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['studyActivity', id],
    queryFn: () => getStudyActivity(id!),
  })

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ['studyActivitySessions', id, page],
    queryFn: () => getStudyActivitySessions(id!, page),
  })

  if (activityLoading || sessionsLoading) {
    return <LoadingState message="Loading activity details..." />
  }

  if (!activity || !sessionsData) {
    return (
      <ErrorState
        message="Error loading activity details"
        queryKey={['studyActivity', id]}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">{activity.name}</Heading>
        <Button
          colorScheme="blue"
          onClick={() => navigate(`/study-activities/${id}/launch`)}
        >
          Launch Activity
        </Button>
      </HStack>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={6} align="stretch">
          <Image
            src={activity.thumbnail_url}
            alt={activity.name}
            height="300px"
            objectFit="cover"
            rounded="md"
          />
          
          <Text color="gray.700">{activity.description}</Text>
        </VStack>
      </Box>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={4} align="stretch">
          <Heading size="md">Past Study Sessions</Heading>

          <Table>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Group</Th>
                <Th>Start Time</Th>
                <Th>End Time</Th>
                <Th>Review Items</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {sessionsData.items.map((session) => (
                <Tr key={session.id}>
                  <Td>{session.id}</Td>
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
            totalPages={sessionsData.total_pages}
            onPageChange={setPage}
          />
        </VStack>
      </Box>
    </VStack>
  )
} 