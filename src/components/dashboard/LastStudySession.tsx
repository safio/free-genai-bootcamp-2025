import { Box, Heading, Text, VStack, HStack, Progress } from '@chakra-ui/react'
import { DashboardStats } from '../../types'
import { formatDistanceToNow } from 'date-fns'

interface Props {
  data: DashboardStats['last_study_session']
}

export default function LastStudySession({ data }: Props) {
  const total = data.correct_count + data.wrong_count
  const correctPercentage = (data.correct_count / total) * 100

  return (
    <Box bg="white" p={6} rounded="lg" shadow="sm">
      <VStack align="stretch" spacing={4}>
        <Heading size="md">Last Study Session</Heading>
        
        <VStack align="stretch" spacing={2}>
          <Text fontSize="sm" color="gray.600">
            {data.activity_name} - {data.group_name}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {formatDistanceToNow(new Date(data.timestamp))} ago
          </Text>
        </VStack>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              Progress
            </Text>
            <Text fontSize="sm" color="gray.600">
              {data.correct_count}/{total} correct
            </Text>
          </HStack>
          <Progress value={correctPercentage} size="sm" colorScheme="green" rounded="full" />
        </Box>
      </VStack>
    </Box>
  )
} 