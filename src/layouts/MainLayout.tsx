import { Box, Container, Flex, Link as ChakraLink } from '@chakra-ui/react'
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
    <Box minH="100vh" bg="gray.50">
      <Box bg="white" borderBottom="1px" borderColor="gray.200" position="fixed" width="100%" zIndex={1}>
        <Container maxW="container.xl">
          <Flex as="nav" py={4} gap={6}>
            {NAV_ITEMS.map((item) => (
              <ChakraLink
                key={item.path}
                as={RouterLink}
                to={item.path}
                fontWeight="medium"
                color="gray.600"
                _hover={{ color: 'blue.500' }}
              >
                {item.label}
              </ChakraLink>
            ))}
          </Flex>
        </Container>
      </Box>
      <Box pt="72px">
        <Container maxW="container.xl" py={8}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
} 