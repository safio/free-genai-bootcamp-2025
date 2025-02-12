import { Box, Typography, Card, CardContent, FormControl, FormLabel, Select, MenuItem, Button, CircularProgress, Alert, Paper } from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { studyActivitiesApi } from '../api/study-activities'
import { groupsApi } from '../api/groups'
import { studySessionsApi } from '../api/study-sessions'
import { useState } from 'react'

interface QuizWord {
  id: number;
  french: string;
  english: string;
}

export default function StudyActivityLaunch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedGroupId, setSelectedGroupId] = useState<string>('')
  const [currentSession, setCurrentSession] = useState<number | null>(null)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isQuizStarted, setIsQuizStarted] = useState(false)

  const { data: activity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['studyActivity', id],
    queryFn: () => studyActivitiesApi.getById(Number(id)),
    enabled: !!id
  })

  const { data: groups, isLoading: groupsLoading, error: groupsError } = useQuery({
    queryKey: ['groups'],
    queryFn: () => groupsApi.getAll()
  })

  const { data: sessionWords, isLoading: wordsLoading } = useQuery({
    queryKey: ['sessionWords', currentSession],
    queryFn: () => studySessionsApi.getSessionWords(currentSession!, {
      reviewed_only: false,
      skip: 0,
      limit: 100
    }),
    enabled: !!currentSession
  })

  const launchMutation = useMutation({
    mutationFn: () => studySessionsApi.create(Number(id), Number(selectedGroupId)),
    onSuccess: (response) => {
      setCurrentSession(response.data.id)
      setIsQuizStarted(true)
    }
  })

  const reviewMutation = useMutation({
    mutationFn: ({ wordId, isCorrect }: { wordId: number; isCorrect: boolean }) =>
      studySessionsApi.createReview(currentSession!, wordId, isCorrect)
  })

  const handleAnswer = (isCorrect: boolean) => {
    if (!sessionWords?.data?.items[currentWordIndex]) return;

    reviewMutation.mutate({
      wordId: sessionWords.data.items[currentWordIndex].id,
      isCorrect
    }, {
      onSuccess: () => {
        if (currentWordIndex < (sessionWords?.data?.items.length || 0) - 1) {
          setCurrentWordIndex(prev => prev + 1)
          setShowAnswer(false)
        } else {
          // End session when all words are reviewed
          if (currentSession) {
            studySessionsApi.endSession(currentSession)
              .then(() => navigate(`/study-sessions/${currentSession}`))
          }
        }
      }
    })
  }

  if (activityLoading || groupsLoading || (isQuizStarted && wordsLoading)) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  if (activityError || groupsError) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading launch data. Please try again.
      </Alert>
    )
  }

  if (isQuizStarted && sessionWords?.data?.items) {
    const currentWord = sessionWords.data.items[currentWordIndex]
    
    return (
      <Box>
        <Typography variant="h4" gutterBottom>Study Session</Typography>
        <Typography variant="subtitle1" gutterBottom>
          Word {currentWordIndex + 1} of {sessionWords.data.items.length}
        </Typography>

        <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Typography variant="h3" align="center" gutterBottom>
              {currentWord.french}
            </Typography>

            {showAnswer ? (
              <>
                <Typography variant="h4" align="center" color="text.secondary" gutterBottom>
                  {currentWord.english}
                </Typography>
                <Box display="flex" justifyContent="center" gap={2} mt={4}>
                  <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={() => handleAnswer(true)}
                  >
                    Correct
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={() => handleAnswer(false)}
                  >
                    Incorrect
                  </Button>
                </Box>
              </>
            ) : (
              <Box display="flex" justifyContent="center" mt={4}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowAnswer(true)}
                >
                  Show Answer
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Launch {activity?.data?.name}</Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
        <CardContent>
          <Box component="form" onSubmit={(e) => {
            e.preventDefault()
            launchMutation.mutate()
          }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <FormLabel>Select Word Group</FormLabel>
              <Select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                required
              >
                {groups?.data?.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {launchMutation.error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Failed to launch activity. Please try again.
              </Alert>
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={!selectedGroupId || launchMutation.isPending}
            >
              {launchMutation.isPending ? 'Launching...' : 'Launch Now'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
} 