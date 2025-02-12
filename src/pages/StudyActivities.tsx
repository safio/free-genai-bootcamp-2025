import { VStack, SimpleGrid, Heading } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getStudyActivities } from '../api/study-activities'
import StudyActivityCard from '../components/study/StudyActivityCard'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'

export default function StudyActivities() {
  const { data: activities, isLoading, error } = useQuery({
    queryKey: ['studyActivities'],
    queryFn: getStudyActivities,
  })

  if (isLoading) {
    return <LoadingState message="Loading study activities..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Error loading study activities"
        queryKey={['studyActivities']}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Study Activities</Heading>

      <SimpleGrid columns={3} spacing={6}>
        {activities.map((activity) => (
          <StudyActivityCard key={activity.id} activity={activity} />
        ))}
      </SimpleGrid>
    </VStack>
  )
} 