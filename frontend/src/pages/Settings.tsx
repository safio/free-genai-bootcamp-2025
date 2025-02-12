import { Box, Typography, Paper, Button, Select, MenuItem, FormControl, FormLabel, Stack, Alert, CircularProgress } from '@mui/material'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { resetHistory, fullReset, updateTheme, getSettings } from '../api/settings'

export default function Settings() {
  const queryClient = useQueryClient()
  const [resetStatus, setResetStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })

  const updateThemeMutation = useMutation({
    mutationFn: updateTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })

  const resetHistoryMutation = useMutation({
    mutationFn: resetHistory,
    onSuccess: () => {
      setResetStatus({ type: 'success', message: 'Study history has been reset successfully.' })
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['studySessions'] })
      queryClient.invalidateQueries({ queryKey: ['words'] })
    },
    onError: () => {
      setResetStatus({ type: 'error', message: 'Failed to reset history. Please try again.' })
    },
  })

  const fullResetMutation = useMutation({
    mutationFn: fullReset,
    onSuccess: () => {
      setResetStatus({ type: 'success', message: 'All data has been reset to initial state.' })
      // Invalidate all queries
      queryClient.invalidateQueries()
    },
    onError: () => {
      setResetStatus({ type: 'error', message: 'Failed to perform full reset. Please try again.' })
    },
  })

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Settings</Typography>

      {resetStatus && (
        <Alert severity={resetStatus.type} sx={{ mb: 3 }}>
          {resetStatus.message}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <FormControl fullWidth>
          <FormLabel>Theme</FormLabel>
          <Select
            value={settings?.theme || 'system'}
            onChange={(e) => updateThemeMutation.mutate(e.target.value)}
            size="small"
            sx={{ maxWidth: 300 }}
          >
            <MenuItem value="light">Light</MenuItem>
            <MenuItem value="dark">Dark</MenuItem>
            <MenuItem value="system">System Default</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Reset Options</Typography>
        
        <Stack spacing={3}>
          <Box>
            <Button
              variant="contained"
              color="warning"
              onClick={() => resetHistoryMutation.mutate()}
              disabled={resetHistoryMutation.isPending}
              sx={{ mb: 1 }}
            >
              {resetHistoryMutation.isPending ? 'Resetting...' : 'Reset History'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              This will delete all study sessions and word review items, but keep your words and groups.
            </Typography>
          </Box>

          <Box>
            <Button
              variant="contained"
              color="error"
              onClick={() => fullResetMutation.mutate()}
              disabled={fullResetMutation.isPending}
              sx={{ mb: 1 }}
            >
              {fullResetMutation.isPending ? 'Resetting...' : 'Full Reset'}
            </Button>
            <Typography variant="body2" color="text.secondary">
              This will delete all data and restore the initial seed data. This action cannot be undone.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
} 