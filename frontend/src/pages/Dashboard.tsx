import { Box, Typography, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()

  return (
    <Box>
      <Grid container justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/study-activities')}
        >
          Start Studying
        </Button>
      </Grid>

      <Typography>Welcome to your language learning dashboard!</Typography>
    </Box>
  )
} 