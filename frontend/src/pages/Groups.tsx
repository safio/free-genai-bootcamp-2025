import { Box, Typography, Card, CardContent, Grid, TextField, InputAdornment } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { groupsApi } from '../api/groups'

interface Group {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export default function Groups() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    groupsApi.getAll()
      .then(response => {
        console.log('API Response:', response)
        const groupsData = Array.isArray(response.data) ? response.data : []
        console.log('Processed groups data:', groupsData)
        setGroups(groupsData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch groups:', error.response || error)
        setError(error.response?.data?.detail || 'Failed to load groups')
        setLoading(false)
      })
  }, [])

  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('Current groups state:', groups)
  console.log('Filtered groups:', filteredGroups)

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Groups</Typography>
      
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {groups.length === 0 ? (
        <Typography>No groups found</Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredGroups.map((group) => (
            <Grid item xs={12} sm={6} md={4} key={group.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => navigate(`/groups/${group.id}`)}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {group.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {new Date(group.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  )
} 