import { Center, Icon, Text, VStack, Button } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'

interface Props {
  message?: string
  queryKey?: string[]
}

export default function ErrorState({
  message = 'Something went wrong',
  queryKey,
}: Props) {
  const queryClient = useQueryClient()

  const handleRetry = () => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey })
    }
  }

  return (
    <Center py={12}>
      <VStack spacing={4}>
        <Icon viewBox="0 0 24 24" boxSize={12} color="red.500">
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"
          />
        </Icon>
        <Text color="gray.600" textAlign="center">{message}</Text>
        {queryKey && (
          <Button
            colorScheme="blue"
            variant="outline"
            size="sm"
            onClick={handleRetry}
          >
            Try Again
          </Button>
        )}
      </VStack>
    </Center>
  )
} 