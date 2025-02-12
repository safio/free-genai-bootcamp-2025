import { Box, Button, IconButton } from '@mui/material'
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material'

interface Props {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const halfVisible = Math.floor(maxVisiblePages / 2)

    let start = Math.max(1, currentPage - halfVisible)
    let end = Math.min(totalPages, start + maxVisiblePages - 1)

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1)
    }

    // Always show first page
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Always show last page
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...')
      pages.push(totalPages)
    }

    return pages
  }

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <IconButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        size="small"
      >
        <KeyboardArrowLeft />
      </IconButton>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <Button
            key={page}
            variant={currentPage === page ? 'contained' : 'outlined'}
            size="small"
            onClick={() => onPageChange(page)}
            sx={{ minWidth: '40px' }}
          >
            {page}
          </Button>
        ) : (
          <Box key={`ellipsis-${index}`} sx={{ px: 1 }}>...</Box>
        )
      ))}

      <IconButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        size="small"
      >
        <KeyboardArrowRight />
      </IconButton>
    </Box>
  )
} 