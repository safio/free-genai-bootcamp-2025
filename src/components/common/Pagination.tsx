import { HStack, Button, Text } from '@chakra-ui/react'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show at most 5 page numbers, with ellipsis if needed
  const getVisiblePages = () => {
    if (totalPages <= 5) return pages

    if (currentPage <= 3) {
      return [...pages.slice(0, 5), '...', totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 5)]
    }

    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ]
  }

  return (
    <HStack spacing={2} justify="center" py={4}>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
      >
        Previous
      </Button>

      {getVisiblePages().map((page, index) =>
        page === '...' ? (
          <Text key={`ellipsis-${index}`} color="gray.500">
            ...
          </Text>
        ) : (
          <Button
            key={page}
            size="sm"
            variant={currentPage === page ? 'solid' : 'outline'}
            colorScheme={currentPage === page ? 'blue' : 'gray'}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </Button>
        )
      )}

      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
      >
        Next
      </Button>
    </HStack>
  )
} 