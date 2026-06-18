import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CardMenu } from './CardMenu'

interface ColumnConfig {
  key: string
  label?: string
  render?: (value: any, row: any) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface ListViewCardProps {
  title: string
  data: Record<string, any>[]
  columns?: ColumnConfig[]
  autoGenerateColumns?: boolean
  cardId?: string
  module?: 'central-dashboard' | 'procurement' | 'accounting' | 'hris'
  customMenu?: React.ReactNode
  maxHeight?: string
  striped?: boolean
  hoverable?: boolean
  pagination?: boolean
  itemsPerPage?: number
}

export function ListViewCard({
  title,
  data = [],
  columns,
  autoGenerateColumns = true,
  cardId,
  module,
  customMenu,
  maxHeight = '400px',
  striped = true,
  hoverable = true,
  pagination = false,
  itemsPerPage = 10,
}: ListViewCardProps) {
  const showMenu = customMenu || (cardId && module)
  const [currentPage, setCurrentPage] = useState(1)

  // Auto-generate columns from data if not provided
  const finalColumns: ColumnConfig[] = columns || (
    autoGenerateColumns && data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          key,
          label: formatColumnLabel(key),
          align: 'left' as const,
        }))
      : []
  )

  // Pagination logic
  const totalPages = pagination ? Math.ceil(data.length / itemsPerPage) : 1
  const startIndex = pagination ? (currentPage - 1) * itemsPerPage : 0
  const endIndex = pagination ? startIndex + itemsPerPage : data.length
  const paginatedData = pagination ? data.slice(startIndex, endIndex) : data

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  // Format column labels from camelCase/snake_case to Title Case
  function formatColumnLabel(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1') // camelCase to spaces
      .replace(/_/g, ' ') // snake_case to spaces
      .replace(/^./, (str) => str.toUpperCase()) // capitalize first letter
      .trim()
  }

  // Get cell alignment class
  function getAlignClass(align?: 'left' | 'center' | 'right'): string {
    switch (align) {
      case 'center':
        return 'text-center'
      case 'right':
        return 'text-right'
      default:
        return 'text-left'
    }
  }

  // Render cell content
  function renderCell(column: ColumnConfig, row: Record<string, any>): React.ReactNode {
    const value = row[column.key]
    
    if (column.render) {
      return column.render(value, row)
    }

    // Handle null/undefined
    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>
    }

    // Handle boolean
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {value ? 'Yes' : 'No'}
        </span>
      )
    }

    // Handle arrays
    if (Array.isArray(value)) {
      return value.join(', ')
    }

    // Handle objects
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    // Default: convert to string
    return String(value)
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md w-full">
      {/* Header with title and menu */}
      <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
        <h3 className="flex-1 min-w-0 text-base font-semibold text-gray-900 line-clamp-2">
          {title}
        </h3>
        {showMenu && (
          <div className="flex-shrink-0 -mt-1">
            {customMenu || (
              <CardMenu
                cardId={cardId!}
                cardType="tile"
                cardData={{ title, data, columns }}
              />
            )}
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="px-5 pb-4">
        <div 
          className="overflow-auto border border-gray-200 rounded-lg"
          style={{ maxHeight }}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {finalColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`px-4 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider ${getAlignClass(column.align)}`}
                    style={{ width: column.width }}
                  >
                    {column.label || column.key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td 
                    colSpan={finalColumns.length} 
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className={`
                      ${striped && rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      ${hoverable ? 'hover:bg-gray-100 transition-colors' : ''}
                    `}
                  >
                    {finalColumns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3 text-sm text-gray-900 ${getAlignClass(column.align)}`}
                      >
                        {renderCell(column, row)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination or row count */}
        {data.length > 0 && (
          <div className="mt-3">
            {pagination ? (
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Showing {startIndex + 1} - {Math.min(endIndex, data.length)} of {data.length} rows
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 px-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage = 
                        page === 1 || 
                        page === totalPages || 
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      
                      // Show ellipsis
                      const showEllipsisBefore = page === currentPage - 2 && currentPage > 3
                      const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2
                      
                      if (showEllipsisBefore || showEllipsisAfter) {
                        return (
                          <span key={page} className="px-2 text-gray-400 text-xs">
                            ...
                          </span>
                        )
                      }
                      
                      if (!showPage) return null
                      
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[28px] h-7 px-2 text-xs font-medium rounded-md transition-colors ${
                            currentPage === page
                              ? 'bg-primary text-white'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-xs text-gray-500 text-right">
                Showing {data.length} {data.length === 1 ? 'row' : 'rows'}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
