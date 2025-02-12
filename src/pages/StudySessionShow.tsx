import { VStack, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, Button, SimpleGrid, Stat, StatLabel, StatNumber, Text, HStack } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getStudySession, getStudySessionWords } from '../api/study-sessions'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import Pagination from '../components/common/Pagination'
import { format } from 'date-fns'

export default function StudySessionShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['studySession', id],
    queryFn: () => getStudySession(id!),
  })

  const { data: words, isLoading: wordsLoading } = useQuery({
    queryKey: ['studySessionWords', id, page],
    queryFn: () => getStudySessionWords(id!, page),
  })

  if (sessionLoading || wordsLoading) {
    return <LoadingState message="Loading session details..." />
  }

  if (!session || !words) {
    return (
      <ErrorState
        message="Error loading session details"
        queryKey={['studySession', id]}
      />
    )
  }

  const correctCount = words.items.filter((item) => item.is_correct).length
  const wrongCount = words.items.filter((item) => !item.is_correct).length
  const successRate = ((correctCount / words.items.length) * 100).toFixed(1)

  return (
    <VStack spacing={8} align="stretch">
      <HStack justify="space-between">
        <Heading size="lg">Study Session #{session.id}</Heading>
        <Button
          variant="outline"
          onClick={() => navigate(`/study-activities/${session.activity_name}`)}
        >
          View Activity
        </Button>
      </HStack>

      <SimpleGrid columns={2} spacing={8}>
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Session Details</Heading>
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text color="gray.600" fontSize="sm">Activity</Text>
                <Text fontWeight="medium">{session.activity_name}</Text>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">Group</Text>
                <Text fontWeight="medium">{session.group_name}</Text>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">Start Time</Text>
                <Text>{format(new Date(session.start_time), 'PPp')}</Text>
              </Box>
              <Box>
                <Text color="gray.600" fontSize="sm">End Time</Text>
                <Text>
                  {session.end_time
                    ? format(new Date(session.end_time), 'PPp')
                    : 'In Progress'}
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Performance</Heading>
            <SimpleGrid columns={3} spacing={4}>
              <Stat>
                <StatLabel>Success Rate</StatLabel>
                <StatNumber>{successRate}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Correct</StatLabel>
                <StatNumber color="green.500">{correctCount}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Wrong</StatLabel>
                <StatNumber color="red.500">{wrongCount}</StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={6} align="stretch">
          <Heading size="md">Review Items</Heading>

          <Table>
            <Thead>
              <Tr>
                <Th>French</Th>
                <Th>English</Th>
                <Th>Result</Th>
                <Th>Time</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {words.items.map((item) => (
                <Tr key={item.id}>
                  <Td fontWeight="medium">{item.word.french}</Td>
                  <Td>{item.word.english}</Td>
                  <Td>
                    <Text
                      color={item.is_correct ? 'green.500' : 'red.500'}
                      fontWeight="medium"
                    >
                      {item.is_correct ? 'Correct' : 'Wrong'}
                    </Text>
                  </Td>
                  <Td>{format(new Date(item.timestamp), 'PPp')}</Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/words/${item.word_id}`)}
                    >
                      View Word
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={words.total_pages}
            onPageChange={setPage}
          />
        </VStack>
      </Box>
    </VStack>
  )
} 