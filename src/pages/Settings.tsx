import { VStack, Heading, Box, Button, Text, useToast, Select, FormControl, FormLabel } from '@chakra-ui/react'
import { useMutation } from '@tanstack/react-query'
import { api } from '../api/config'
import { useState } from 'react'

export default function Settings() {
  const toast = useToast()
  const [theme, setTheme] = useState('system')

  const resetHistoryMutation = useMutation({
    mutationFn: async () => {
      await api.post('/reset_history')
    },
    onSuccess: () => {
      toast({
        title: 'History Reset',
        description: 'Your study history has been reset successfully.',
        status: 'success',
        duration: 5000,
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to reset history. Please try again.',
        status: 'error',
        duration: 5000,
      })
    },
  })

  const fullResetMutation = useMutation({
    mutationFn: async () => {
      await api.post('/full_reset')
    },
    onSuccess: () => {
      toast({
        title: 'Full Reset Complete',
        description: 'All data has been reset to initial state.',
        status: 'success',
        duration: 5000,
      })
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to perform full reset. Please try again.',
        status: 'error',
        duration: 5000,
      })
    },
  })

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Settings</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack align="stretch" spacing={8}>
          <FormControl>
            <FormLabel>Theme</FormLabel>
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              maxW="xs"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </Select>
          </FormControl>

          <VStack align="stretch" spacing={4}>
            <Heading size="md">Reset Options</Heading>
            
            <Box>
              <Button
                colorScheme="orange"
                isLoading={resetHistoryMutation.isPending}
                onClick={() => resetHistoryMutation.mutate()}
                mb={2}
              >
                Reset History
              </Button>
              <Text fontSize="sm" color="gray.600">
                This will delete all study sessions and word review items, but keep your words and groups.
              </Text>
            </Box>

            <Box>
              <Button
                colorScheme="red"
                isLoading={fullResetMutation.isPending}
                onClick={() => fullResetMutation.mutate()}
                mb={2}
              >
                Full Reset
              </Button>
              <Text fontSize="sm" color="gray.600">
                This will delete all data and restore the initial seed data. This action cannot be undone.
              </Text>
            </Box>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  )
} 