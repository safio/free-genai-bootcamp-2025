import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import StudyActivities from './pages/StudyActivities'
import StudyActivityShow from './pages/StudyActivityShow'
import StudyActivityLaunch from './pages/StudyActivityLaunch'
import Words from './pages/Words'
import WordShow from './pages/WordShow'
import Groups from './pages/Groups'
import GroupShow from './pages/GroupShow'
import StudySessions from './pages/StudySessions'
import StudySessionShow from './pages/StudySessionShow'
import Settings from './pages/Settings'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/study-activities',
        element: <StudyActivities />,
      },
      {
        path: '/study-activities/:id',
        element: <StudyActivityShow />,
      },
      {
        path: '/study-activities/:id/launch',
        element: <StudyActivityLaunch />,
      },
      {
        path: '/words',
        element: <Words />,
      },
      {
        path: '/words/:id',
        element: <WordShow />,
      },
      {
        path: '/groups',
        element: <Groups />,
      },
      {
        path: '/groups/:id',
        element: <GroupShow />,
      },
      {
        path: '/study-sessions',
        element: <StudySessions />,
      },
      {
        path: '/study-sessions/:id',
        element: <StudySessionShow />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App 