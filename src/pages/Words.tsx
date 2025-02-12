import { VStack, Heading, Box, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputLeftElement, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { getWords, searchWords } from '../api/words'
import LoadingState from '../components/common/LoadingState'
import ErrorState from '../components/common/ErrorState'
import Pagination from '../components/common/Pagination'
import { SearchIcon } from '@chakra-ui/icons'

export default function Words() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data, isLoading, error } = useQuery({
    queryKey: ['words', page, debouncedQuery],
    queryFn: () => debouncedQuery ? searchWords(debouncedQuery, page) : getWords(page),
  })

  if (isLoading) {
    return <LoadingState message="Loading words..." />
  }

  if (error) {
    return (
      <ErrorState
        message="Error loading words"
        queryKey={['words', page, debouncedQuery]}
      />
    )
  }

  return (
    <VStack spacing={8} align="stretch">
      <Heading size="lg">Words</Heading>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <VStack spacing={6} align="stretch">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Table>
            <Thead>
              <Tr>
                <Th>French</Th>
                <Th>English</Th>
                <Th isNumeric>Correct</Th>
                <Th isNumeric>Wrong</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data.items.map((word) => (
                <Tr key={word.id}>
                  <Td fontWeight="medium">{word.french}</Td>
                  <Td>{word.english}</Td>
                  <Td isNumeric color="green.500">
                    {word.correct_count}
                  </Td>
                  <Td isNumeric color="red.500">
                    {word.wrong_count}
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/words/${word.id}`)}
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={data.total_pages}
            onPageChange={setPage}
          />
        </VStack>
      </Box>
    </VStack>
  )
} 