import { VStack, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, Button, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getGroup, getGroupWords, getGroupSessions } from '../api/groups'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import Pagination from '../components/common/Pagination'
import { format } from 'date-fns'

export default function GroupShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [wordsPage, setWordsPage] = useState(1)
  const [sessionsPage, setSessionsPage] = useState(1)

  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroup(id!),
  })

  const { data: words, isLoading: wordsLoading } = useQuery({
    queryKey: ['groupWords', id, wordsPage],
    queryFn: () => getGroupWords(id!, wordsPage),
  })

  const { data: sessions, isLoading: sessionsLoading } = useQuery({
    queryKey: ['groupSessions', id, sessionsPage],
    queryFn: () => getGroupSessions(id!, sessionsPage),
  })

  if (groupLoading || wordsLoading || sessionsLoading) {
    return <LoadingState message="Loading group details..." />
  }

  if (!group || !words || !sessions) {
    return (
      <ErrorState
        message="Error loading group details"
        queryKey={['group', id]}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">{group.name}</Heading>

      <Tabs>
        <TabList>
          <Tab>Words ({group.word_count})</Tab>
          <Tab>Study Sessions</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <Box bg="white" p={6} rounded="lg" shadow="sm">
              <VStack spacing={6} align="stretch">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>French</Th>
                      <Th>English</Th>
                      <Th isNumeric>Correct</Th>
                      <Th isNumeric>Wrong</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {words.items.map((word) => (
                      <Tr key={word.id}>
                        <Td fontWeight="medium">{word.french}</Td>
                        <Td>{word.english}</Td>
                        <Td isNumeric color="green.500">
                          {word.correct_count}
                        </Td>
                        <Td isNumeric color="red.500">
                          {word.wrong_count}
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/words/${word.id}`)}
                          >
                            View
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <Pagination
                  currentPage={wordsPage}
                  totalPages={words.total_pages}
                  onPageChange={setWordsPage}
                />
              </VStack>
            </Box>
          </TabPanel>

          <TabPanel px={0}>
            <Box bg="white" p={6} rounded="lg" shadow="sm">
              <VStack spacing={6} align="stretch">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>ID</Th>
                      <Th>Activity</Th>
                      <Th>Start Time</Th>
                      <Th>End Time</Th>
                      <Th>Review Items</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sessions.items.map((session) => (
                      <Tr key={session.id}>
                        <Td>{session.id}</Td>
                        <Td>{session.activity_name}</Td>
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
                  currentPage={sessionsPage}
                  totalPages={sessions.total_pages}
                  onPageChange={setSessionsPage}
                />
              </VStack>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
} 