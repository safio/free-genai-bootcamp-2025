import { VStack, Heading, Box, Text, HStack, Tag, TagLabel, Stat, StatLabel, StatNumber, SimpleGrid } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getWord } from '../api/words'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'

export default function WordShow() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: word, isLoading, error } = useQuery({
    queryKey: ['word', id],
    queryFn: () => getWord(id!),
  })

  if (isLoading) {
    return <LoadingState message="Loading word details..." />
  }

  if (error || !word) {
    return (
      <ErrorState
        message="Error loading word details"
        queryKey={['word', id]}
      />
    )
  }

  const totalAttempts = word.correct_count + word.wrong_count
  const successRate = totalAttempts > 0
    ? ((word.correct_count / totalAttempts) * 100).toFixed(1)
    : 0

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">{word.french}</Heading>

      <SimpleGrid columns={2} spacing={8}>
        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Translation</Heading>
            <Text fontSize="xl" color="gray.700">
              {word.english}
            </Text>
          </VStack>
        </Box>

        <Box bg="white" p={6} rounded="lg" shadow="sm">
          <VStack align="stretch" spacing={6}>
            <Heading size="md">Statistics</Heading>
            <SimpleGrid columns={3} spacing={4}>
              <Stat>
                <StatLabel>Success Rate</StatLabel>
                <StatNumber>{successRate}%</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Correct</StatLabel>
                <StatNumber color="green.500">
                  {word.correct_count}
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Wrong</StatLabel>
                <StatNumber color="red.500">
                  {word.wrong_count}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </VStack>
        </Box>
      </SimpleGrid>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack align="stretch" spacing={6}>
          <Heading size="md">Word Groups</Heading>
          <HStack spacing={2} wrap="wrap">
            {word.groups.map((group) => (
              <Tag
                key={group.id}
                size="lg"
                borderRadius="full"
                variant="subtle"
                colorScheme="blue"
                cursor="pointer"
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                <TagLabel>{group.name}</TagLabel>
              </Tag>
            ))}
            {word.groups.length === 0 && (
              <Text color="gray.500">
                This word is not part of any group yet.
              </Text>
            )}
          </HStack>
        </VStack>
      </Box>
    </VStack>
  )
} 