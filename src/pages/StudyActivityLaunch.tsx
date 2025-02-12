import { VStack, Heading, Box, FormControl, FormLabel, Select, Button } from '@chakra-ui/react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudyActivity, launchStudyActivity } from '../api/study-activities'
import { useState } from 'react'

// We'll need to add this API function later
import { getGroups } from '../api/groups'

export default function StudyActivityLaunch() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['studyActivity', id],
    queryFn: () => getStudyActivity(id!),
  })

  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: getGroups,
  })

  const launchMutation = useMutation({
    mutationFn: () => launchStudyActivity(id!, parseInt(selectedGroupId)),
    onSuccess: (data) => {
      // Open the study activity in a new tab
      window.open(`/study/${data.id}`, '_blank')
      // Navigate to the session details in the current tab
      navigate(`/study-sessions/${data.id}`)
    },
  })

  if (activityLoading || groupsLoading) {
    return <div>Loading...</div>
  }

  if (!activity || !groups) {
    return <div>Activity not found</div>
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Launch {activity.name}</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm" maxW="xl">
        <VStack spacing={6} align="stretch">
          <FormControl isRequired>
            <FormLabel>Select Word Group</FormLabel>
            <Select
              placeholder="Choose a group"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
            >
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name} ({group.word_count} words)
                </option>
              ))}
            </Select>
          </FormControl>

          <Button
            colorScheme="blue"
            size="lg"
            isLoading={launchMutation.isPending}
            isDisabled={!selectedGroupId}
            onClick={() => launchMutation.mutate()}
          >
            Launch Now
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
} 