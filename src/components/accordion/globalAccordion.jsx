import { 
  Box, 
  Group, 
  Text, 
  Badge,
  Collapse,
  useMantineTheme
} from "@mantine/core"
import { ChevronDown, ChevronUp } from "lucide-react"

const Accordion = ({
  items = [],
  openItems = [], // IDs de items abiertos
  onToggle,       // Función cuando se hace clic
  className = '',
  multiple = false, // Permitir múltiples abiertos
}) => {
  const theme = useMantineTheme()

  const handleToggle = (itemId) => {
    if (!onToggle) return

    if (multiple) {
      const newOpenItems = openItems.includes(itemId)
        ? openItems.filter(id => id !== itemId)
        : [...openItems, itemId]
      onToggle(newOpenItems)
    } else {
      const newOpenItems = openItems.includes(itemId) ? [] : [itemId]
      onToggle(newOpenItems)
    }
  }

  const isOpen = (itemId) => openItems.includes(itemId)

  if (items.length === 0) {
    return (
      <Box
        style={{
          padding: '3rem',
          textAlign: 'center',
          color: 'var(--color-texto-claro)',
          backgroundColor: 'var(--color-fondo)',
          borderRadius: 'var(--border-radius)',
          border: '2px dashed rgba(136, 161, 138, 0.3)',
        }}
      >
        <Text>No hay elementos para mostrar</Text>
      </Box>
    )
  }

  return (
    <Box 
      className={className}
      style={{
        borderRadius: 'var(--border-radius)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-blanco)',
        boxShadow: 'var(--sombra-suave)',
        transition: 'var(--transicion-suave)',
        '&:hover': {
          boxShadow: 'var(--sombra-media)',
        }
      }}
    >
      {items.map((item, index) => {
        const itemId = item.id || `accordion-${index}`
        const hasContent = item.hasContent !== false
        const open = isOpen(itemId)
        
        return (
          <Box
            key={itemId}
            style={{
              borderBottom: index < items.length - 1 ? '1px solid var(--color-border)' : 'none',
              backgroundColor: !hasContent ? 'var(--color-fondo)' : 'var(--color-blanco)',
              transition: 'var(--transicion-suave)',
              '&:hover': hasContent ? {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
              } : {},
            }}
          >
            {/* Header */}
            <Box
              onClick={() => hasContent && handleToggle(itemId)}
              style={{
                padding: '1.25rem 1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                cursor: hasContent ? 'pointer' : 'default',
                transition: 'var(--transicion-suave)',
                backgroundColor: hasContent && open ? 'var(--color-fondo)' : 'transparent',
                '&:hover': hasContent ? {
                  backgroundColor: 'var(--color-fondo)',
                } : {},
              }}
            >
              <Box style={{ flex: 1 }}>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Box>
                    {item.title && (
                      <Text fw={600} size="lg" style={{ color: 'var(--color-texto-primario)' }}>
                        {item.title}
                      </Text>
                    )}
                    {item.subtitle && (
                      <Text size="sm" c="dimmed" mt={4}>
                        {item.subtitle}
                      </Text>
                    )}
                  </Box>
                  
                  <Group gap="md" wrap="nowrap">
                    {/* Badge de estado */}
                    {item.badge && (
                      <Badge
                        size="sm"
                        variant="light"
                        color={
                          item.badge.type === 'success' ? 'var(--color-botones)' :
                          item.badge.type === 'warning' ? 'var(--color-header)' : 'gray'
                        }
                        style={{
                          backgroundColor: item.badge.type === 'success' 
                            ? 'rgba(232, 169, 156, 0.15)' 
                            : item.badge.type === 'warning'
                            ? 'rgba(136, 161, 138, 0.15)'
                            : undefined,
                        }}
                      >
                        {item.badge.text}
                      </Badge>
                    )}
                    
                    {/* Indicador (solo si tiene contenido) */}
                    {hasContent && (
                      <Box style={{ color: 'var(--color-texto-claro)', transition: 'var(--transicion-suave)' }}>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </Box>
                    )}
                  </Group>
                </Group>
              </Box>
            </Box>
            
            {/* Contenido */}
            {(!hasContent || open) && (
              <Collapse in={true}>
                <Box
                  style={{
                    padding: hasContent ? '1.5rem' : 0,
                    borderTop: hasContent ? '1px solid var(--color-border)' : 'none',
                    backgroundColor: hasContent ? 'var(--color-blanco)' : 'transparent',
                    animation: 'fadeIn 0.3s ease-out',
                  }}
                >
                  {item.content || (
                    <Box
                      style={{
                        textAlign: 'center',
                        padding: '2rem',
                        color: 'var(--color-texto-claro)',
                        fontStyle: 'italic',
                        backgroundColor: 'rgba(136, 161, 138, 0.05)',
                        borderRadius: 'var(--border-radius)',
                      }}
                    >
                      <Text>No hay información disponible para esta categoría</Text>
                    </Box>
                  )}
                </Box>
              </Collapse>
            )}
          </Box>
        )
      })}
    </Box>
  )
}

// Estilos CSS globales para la animación
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`

// Agregar estilos al documento
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.innerText = styles
  document.head.appendChild(styleSheet)
}

export default Accordion