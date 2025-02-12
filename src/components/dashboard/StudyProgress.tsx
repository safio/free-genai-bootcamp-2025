import { Box, Heading, Text, VStack, HStack, Progress, CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { DashboardStats } from '../../types'

interface Props {
  data: DashboardStats['study_progress']
}

export default function StudyProgress({ data }: Props) {
  const studiedPercentage = (data.total_words_studied / data.total_words) * 100

  return (
    <Box bg="white" p={6} rounded="lg" shadow="sm">
      <VStack align="stretch" spacing={6}>
        <Heading size="md">Study Progress</Heading>

        <HStack spacing={8} align="start">
          <Box flex={1}>
            <Text fontSize="sm" fontWeight="medium" mb={2}>
              Total Words Studied
            </Text>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" color="gray.600">
                {data.total_words_studied}/{data.total_words} words
              </Text>
              <Text fontSize="sm" color="gray.600">
                {studiedPercentage.toFixed(1)}%
              </Text>
            </HStack>
            <Progress value={studiedPercentage} size="sm" colorScheme="blue" rounded="full" />
          </Box>

          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={2} textAlign="center">
              Mastery
            </Text>
            <CircularProgress value={data.mastery_percentage} size="80px" thickness="8px" color="green.400">
              <CircularProgressLabel>{data.mastery_percentage}%</CircularProgressLabel>
            </CircularProgress>
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
} 