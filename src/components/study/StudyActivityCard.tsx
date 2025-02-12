import { Box, Image, VStack, Heading, Text, Button, HStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { StudyActivity } from '../../types'

interface Props {
  activity: StudyActivity
}

export default function StudyActivityCard({ activity }: Props) {
  const navigate = useNavigate()

  return (
    <Box
      bg="white"
      rounded="lg"
      shadow="sm"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
    >
      <Image
        src={activity.thumbnail_url}
        alt={activity.name}
        objectFit="cover"
        height="200px"
        width="100%"
      />
      
      <VStack p={6} align="stretch" spacing={4}>
        <Heading size="md">{activity.name}</Heading>
        <Text color="gray.600" noOfLines={2}>
          {activity.description}
        </Text>
        
        <HStack>
          <Button
            colorScheme="blue"
            flex={1}
            onClick={() => navigate(`/study-activities/${activity.id}/launch`)}
          >
            Launch
          </Button>
          <Button
            variant="outline"
            flex={1}
            onClick={() => navigate(`/study-activities/${activity.id}`)}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
} 