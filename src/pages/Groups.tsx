import { VStack, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getGroups } from '../api/groups'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'

export default function Groups() {
  const navigate = useNavigate()
  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  })

  if (isLoading) {
    return <LoadingState message="Loading groups..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Error loading groups"
        queryKey={['groups']}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Word Groups</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Table>
          <Thead>
            <Tr>
              <Th>Group Name</Th>
              <Th isNumeric>Words</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {groups.map((group) => (
              <Tr key={group.id}>
                <Td fontWeight="medium">{group.name}</Td>
                <Td isNumeric>{group.word_count}</Td>
                <Td>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => navigate(`/groups/${group.id}`)}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  )
} 