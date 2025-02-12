import { SimpleGrid, Box, Stat, StatLabel, StatNumber } from '@chakra-ui/react'
import { DashboardStats } from '../../types'

interface Props {
  data: DashboardStats['quick_stats']
}

export default function QuickStats({ data }: Props) {
  return (
    <SimpleGrid columns={4} spacing={4}>
      <StatCard
        label="Success Rate"
        value={`${data.success_rate}%`}
      />
      <StatCard
        label="Study Sessions"
        value={data.total_study_sessions.toString()}
      />
      <StatCard
        label="Active Groups"
        value={data.total_active_groups.toString()}
      />
      <StatCard
        label="Study Streak"
        value={`${data.study_streak_days} days`}
      />
    </SimpleGrid>
  )
}

interface StatCardProps {
  label: string
  value: string
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <Box bg="white" p={6} rounded="lg" shadow="sm">
      <Stat>
        <StatLabel color="gray.600" fontSize="sm">{label}</StatLabel>
        <StatNumber fontSize="2xl" fontWeight="bold">{value}</StatNumber>
      </Stat>
    </Box>
  )
} 