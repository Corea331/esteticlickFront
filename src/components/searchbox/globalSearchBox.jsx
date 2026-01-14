import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { 
  TextInput, 
  Button, 
  Group, 
  Box,
  useMantineTheme
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { Search } from "lucide-react"

const SearchBox = ({
  placeholder = 'Buscar...',
  onSearch,
  onChange,
  searchPath,
  searchParam = 'search',
  className = '',
  autoNavigate = true,
  size = 'md',       // 'xs', 'sm', 'md', 'lg', 'xl' (Mantine sizes)
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const theme = useMantineTheme()
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
  
    if (onChange) {
      onChange(value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if(searchTerm.trim()) {
      const trimmedSearch = searchTerm.trim()

      if(onSearch) {
        onSearch(trimmedSearch)
      }

      if(searchPath && autoNavigate) {
        navigate(`${searchPath}?${searchParam}=${encodeURIComponent(trimmedSearch)}`)
      }

      setSearchTerm('')
    }
  }

  // Estilos del botón
  const buttonStyles = {
    root: {
      background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
      transition: 'var(--transicion-suave)',
      color: 'var(--color-blanco)',
      fontWeight: 600,
      boxShadow: 'var(--sombra-suave)',
      whiteSpace: 'nowrap',
      fontFamily: 'inherit',
      '&:hover:not(:disabled)': {
        background: 'linear-gradient(135deg, var(--color-botones-hover) 0%, #c98778 100%)',
        transform: 'translateY(-2px)',
        boxShadow: 'var(--sombra-media)',
      },
      '&:disabled': {
        background: 'var(--color-texto-claro)',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none',
        opacity: 0.6,
      }
    }
  }

  // Estilos del input
  const inputStyles = {
    input: {
      borderWidth: 2,
      borderColor: 'var(--color-border)',
      transition: 'var(--transicion-suave)',
      backgroundColor: 'var(--color-blanco)',
      fontFamily: 'inherit',
      color: 'var(--color-texto-primario)',
      '&:focus': {
        borderColor: 'var(--color-botones)',
        boxShadow: '0 0 0 0.2rem rgba(232, 169, 156, 0.25)',
      },
      '&::placeholder': {
        color: 'var(--color-texto-claro)',
        opacity: 0.8,
      }
    }
  }

  return (
    <Box 
      className={className} 
      style={{ 
        width: '100%', 
        maxWidth: 500, 
        margin: '0 auto' 
      }}
    >
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Group 
          gap="xs" 
          wrap="nowrap"
          style={{
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
          }}
        >
          <TextInput
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleInputChange}
            size={size}
            style={{ flex: 1 }}
            styles={inputStyles}
          />
          <Button
            type="submit"
            size={size}
            disabled={!searchTerm.trim()}
            leftSection={<Search size={16} />}
            styles={buttonStyles}
            fullWidth={isMobile}
            style={{
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
          >
            Buscar
          </Button>
        </Group>
      </form>
    </Box>
  )
}

export default SearchBox