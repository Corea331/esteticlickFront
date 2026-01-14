import { useState, useMemo } from "react"
import { 
  Table, 
  Pagination, 
  Group, 
  Box, 
  ActionIcon,
  Loader,
  Text,
  Badge,
  Anchor,
  Stack,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown,
  Star,
  Link as LinkIcon,
  Check,
  X
} from "lucide-react"
import SearchBox from "../searchbox/globalSearchBox"

const GenericTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = 'No hay datos disponibles.',
  searchable = false,
  sortable = true,
  pagination = false,
  itemsPerPage = 10,
  className = '',
  onRowClick,
  actions = null,
}) => {
  const [tableState, setTableState] = useState({
    sortField: '',
    sortDirection: 'asc',
    currentPage: 1,
    searchTerm: '',
  })

  const { sortField, sortDirection, currentPage, searchTerm } = tableState
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isSmallMobile = useMediaQuery('(max-width: 480px)')

  const updateTableState = (updates) => {
    setTableState(prev => ({ ...prev, ...updates }))
  }

  // Filtrar datos
  const filteredData = useMemo(() => {
    if (!searchable || !searchTerm) return data

    return data.filter(item =>
      columns.some(column =>
        String(item[column.key] || '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    )
  }, [data, searchTerm, searchable, columns])

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortable || !sortField) return filteredData

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [filteredData, sortField, sortDirection, sortable])

  // Paginación
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData

    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedData.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedData, currentPage, itemsPerPage, pagination])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSort = (field) => {
    if (!sortable) return

    if (sortField === field) {
      updateTableState({
        sortDirection: sortDirection === 'asc' ? 'desc' : 'asc'
      })
    } else {
      updateTableState({
        sortField: field,
        sortDirection: 'asc'
      })
    }
  }

  const handlePageChange = (newPage) => {
    updateTableState({ currentPage: newPage })
  }

  const handleSearch = (term) => {
    updateTableState({
      searchTerm: term,
      currentPage: 1
    })
  }

  const renderSortIcon = (field) => {
    if (!sortable || sortField !== field) {
      return <ChevronsUpDown size={14} />
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={14} /> 
      : <ChevronDown size={14} />
  }

  const renderCellContent = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item)
    }

    const value = item[column.key]

    switch (column.type) {
      case 'rating':
        if (typeof value === 'number') {
          const filledStars = Math.round(value)
          return (
            <Stack gap={2}>
              <Text fw={600}>{value.toFixed(1)}</Text>
              <Group gap={2}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    size={14}
                    fill={i < filledStars ? '#FFD700' : 'none'}
                    color="#FFD700"
                  />
                ))}
              </Group>
            </Stack>
          )
        }
        break

      case 'price':
        if (typeof value === 'number') {
          return `$${value.toFixed(2)}`
        }
        break

      case 'boolean':
        return value ? (
          <Group gap="xs">
            <Check size={16} color="green" />
            <Text size="sm">Sí</Text>
          </Group>
        ) : (
          <Group gap="xs">
            <X size={16} color="red" />
            <Text size="sm">No</Text>
          </Group>
        )

      case 'date':
        if (value) {
          return new Date(value).toLocaleDateString()
        }
        break

      case 'array':
        if (Array.isArray(value)) {
          return (
            <Group gap={4} wrap="wrap">
              {value.slice(0, 3).map((item, index) => (
                <Badge
                  key={index}
                  size="sm"
                  variant="light"
                  style={{
                    backgroundColor: 'var(--color-fondo)',
                    color: 'var(--color-texto-secundario)',
                  }}
                >
                  {item.name || item}
                </Badge>
              ))}
              {value.length > 3 && (
                <Text size="xs" c="dimmed">
                  +{value.length - 3} más
                </Text>
              )}
            </Group>
          )
        }
        break

      case 'link':
        if (value) {
          return (
            <Anchor
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-botones)',
                textDecoration: 'none',
                padding: '0.25rem 0.5rem',
                border: '1px solid var(--color-botones)',
                borderRadius: '4px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.9rem',
                '&:hover': {
                  backgroundColor: 'var(--color-botones)',
                  color: 'var(--color-blanco)',
                }
              }}
            >
              <LinkIcon size={14} />
              {column.linkText || 'Visitar'}
            </Anchor>
          )
        }
        break

      default:
        return value || 'N/A'
    }

    return value || 'N/A'
  }

  const visibleColumns = useMemo(() => {
    return columns.filter((column, index) => {
      if (isSmallMobile) {
        return index < 3 && column.showOnMobile !== false
      }
      if (isMobile) {
        return index < 4 && column.showOnMobile !== false
      }
      return true
    })
  }, [columns, isMobile, isSmallMobile])

  if (loading) {
    return (
      <Box
        style={{
          textAlign: 'center',
          padding: '3rem',
          color: 'var(--color-texto-secundario)',
        }}
      >
        <Loader size="lg" />
        <Text mt="md">Cargando datos...</Text>
      </Box>
    )
  }

  return (
    <Box 
      className={className}
      style={{
        backgroundColor: 'var(--color-blanco)',
        borderRadius: 'var(--border-radius)',
        boxShadow: 'var(--sombra-suave)',
        overflow: 'hidden',
        marginBottom: '2rem',
      }}
    >
      {/* Barra de búsqueda */}
      {(searchable || actions) && (
        <Group 
          justify="space-between" 
          align="center" 
          p="md"
          style={{
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {searchable && (
            <Box style={{ flex: 1, minWidth: isMobile ? '100%' : 300 }}>
              <SearchBox
                placeholder="Buscar..."
                onChange={handleSearch}
                size="sm"
                className="compact"
                autoNavigate={false}
              />
            </Box>
          )}
          {actions && (
            <Group gap="xs" wrap="wrap">
              {actions}
            </Group>
          )}
        </Group>
      )}

      {/* Info */}
      <Box
        p="md"
        style={{
          backgroundColor: 'var(--color-fondo)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <Text size="sm" c="dimmed">
          Mostrando {paginatedData.length} de {filteredData.length} registros
          {searchTerm && ` para "${searchTerm}"`}
        </Text>
      </Box>

      {/* Tabla */}
      <Box style={{ overflowX: 'auto' }}>
        <Table 
          striped
          highlightOnHover={!!onRowClick}
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <Table.Thead>
            <Table.Tr
              style={{
                backgroundColor: 'var(--color-fondo)',
                position: 'sticky',
                top: 0,
              }}
            >
              {visibleColumns.map((column) => (
                <Table.Th
                  key={column.key}
                  onClick={() => column.sortable !== false && handleSort(column.key)}
                  style={{
                    borderBottom: '2px solid var(--color-border)',
                    cursor: column.sortable !== false ? 'pointer' : 'default',
                    padding: '1rem',
                    backgroundColor: sortField === column.key ? 'var(--color-lavanda)' : undefined,
                    transition: 'var(--transicion-suave)',
                    '&:hover': column.sortable !== false ? {
                      backgroundColor: 'var(--color-beige)',
                    } : {},
                  }}
                >
                  <Group justify="space-between" gap="xs">
                    <Text fw={600} size="sm">
                      {column.title}
                    </Text>
                    {column.sortable !== false && sortable && (
                      <ActionIcon
                        variant="subtle"
                        size="xs"
                      >
                        {renderSortIcon(column.key)}
                      </ActionIcon>
                    )}
                  </Group>
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <Table.Tr
                  key={item.id || index}
                  onClick={() => onRowClick && onRowClick(item)}
                  style={{
                    cursor: onRowClick ? 'pointer' : 'default',
                    transition: 'var(--transicion-suave)',
                    '&:hover': onRowClick ? {
                      backgroundColor: 'var(--color-fondo)',
                    } : {},
                  }}
                >
                  {visibleColumns.map((column) => (
                    <Table.Td 
                      key={column.key}
                      style={{
                        padding: '1rem',
                        borderBottom: '1px solid var(--color-border)',
                        verticalAlign: 'top',
                      }}
                    >
                      {renderCellContent(item, column)}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td 
                  colSpan={visibleColumns.length}
                  style={{ 
                    textAlign: 'center', 
                    padding: '2rem',
                    color: 'var(--color-texto-claro)',
                    fontStyle: 'italic',
                  }}
                >
                  {emptyMessage}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Box>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <Group 
          justify="center" 
          p="md"
          style={{
            borderTop: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-fondo)',
          }}
        >
          <Pagination
            value={currentPage}
            onChange={handlePageChange}
            total={totalPages}
            size={isMobile ? 'sm' : 'md'}
            withEdges={!isMobile}
          />
        </Group>
      )}
    </Box>
  )
}

export default GenericTable