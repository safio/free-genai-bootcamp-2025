import { Box, Container, AppBar, Toolbar, Button, Stack } from '@mui/material'
import { Link as RouterLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/' },
  { label: 'Study Activities', path: '/study-activities' },
  { label: 'Words', path: '/words' },
  { label: 'Groups', path: '/groups' },
  { label: 'Study Sessions', path: '/study-sessions' },
  { label: 'Settings', path: '/settings' },
]

export default function MainLayout() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="fixed" color="default" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Stack direction="row" spacing={2}>
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  color="inherit"
                  sx={{
                    '&.active': {
                      color: 'primary.main',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ pt: '64px' }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
} 