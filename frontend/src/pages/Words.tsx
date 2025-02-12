import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, InputAdornment, TextField } from '@mui/material'
import { Search as SearchIcon } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { wordsApi, Word } from '../api/words'

interface WordResponse {
  french: string;
  english: string;
  id: number;
  correct_count: number;
  wrong_count: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  items: WordResponse[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}

export default function Words() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [words, setWords] = useState<WordResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    wordsApi.getAll()
      .then(response => {
        console.log('API Response:', response)
        const wordsData = response.data?.items || []
        console.log('Processed words data:', wordsData)
        setWords(wordsData)
        setLoading(false)
      })
      .catch(error => {
        console.error('Failed to fetch words:', error.response || error)
        setError(error.response?.data?.detail || 'Failed to load words')
        setLoading(false)
      })
  }, [])

  // Filter words based on search query
  const filteredWords = words.filter(word => 
    word.french?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    word.english?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  console.log('Current words state:', words)
  console.log('Filtered words:', filteredWords)

  if (loading) {
    return <Typography>Loading...</Typography>
  }

  if (error) {
    return <Typography color="error">{error}</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Words</Typography>
      
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search words..."
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

      {words.length === 0 ? (
        <Typography>No words found</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>French</TableCell>
                <TableCell>English</TableCell>
                <TableCell align="right">Correct</TableCell>
                <TableCell align="right">Wrong</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWords.map((word) => (
                <TableRow key={word.id}>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 'medium' }}>
                    {word.french}
                  </TableCell>
                  <TableCell>{word.english}</TableCell>
                  <TableCell align="right" sx={{ color: 'success.main' }}>
                    {word.correct_count}
                  </TableCell>
                  <TableCell align="right" sx={{ color: 'error.main' }}>
                    {word.wrong_count}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => navigate(`/words/${word.id}`)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
} 