import { VStack, Button, Heading, Flex } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getDashboardStats } from '../api/dashboard'
import LastStudySession from '../components/dashboard/LastStudySession'
import StudyProgress from '../components/dashboard/StudyProgress'
import QuickStats from '../components/dashboard/QuickStats'

export default function Dashboard() {
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error loading dashboard data</div>
  }

  return (
    <VStack spacing={8} align="stretch">
      <Flex justify="space-between" align="center">
        <Heading size="lg">Dashboard</Heading>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => navigate('/study-activities')}
        >
          Start Studying
        </Button>
      </Flex>

      <QuickStats data={data.quick_stats} />

      <Flex gap={8}>
        <LastStudySession data={data.last_study_session} />
        <StudyProgress data={data.study_progress} />
      </Flex>
    </VStack>
  )
} 