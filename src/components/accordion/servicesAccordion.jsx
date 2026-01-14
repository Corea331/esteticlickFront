import { useState, useMemo, useEffect } from 'react'
import { 
  Box, 
  Text, 
  Loader,
  Center,
  Group
} from "@mantine/core"
import Accordion from "./globalAccordion"
import GenericTable from "../generictable/genericTable"
import { navigateTo } from "../../utils/navigation"
import { useServices } from "../../hooks"
import { useBusinesses } from "../../hooks"

const ServicesAccordion = ({
  className = '',
  searchTerm = '', // Recibe término de búsqueda
  onBusinessClick,
}) => {
  // Obtener servicios y negocios con hooks
  const { data: services, isLoading: loadingServices } = useServices()
  const { data: businesses, isLoading: loadingBusinesses } = useBusinesses()
  
  const [openItems, setOpenItems] = useState([])
  
  const isLoading = loadingServices || loadingBusinesses

  // Preparar items para el acordeón
  const accordionItems = useMemo(() => {
    if (!services || !businesses) return []
    
    return services.map(service => {
      // Filtrar negocios que tienen esta especialidad
      const relatedBusinesses = businesses.filter(
        business => business.specialty === service.slug
      )
      
      const hasBusinesses = relatedBusinesses.length > 0
      
      return {
        id: service.id.toString(),
        title: service.name,
        subtitle: service.description,
        hasContent: hasBusinesses,
        badge: {
          text: hasBusinesses ? `${relatedBusinesses.length} negocio(s)` : 'Sin negocios',
          type: hasBusinesses ? 'success' : 'warning'
        },
        // Contenido: si no tiene negocios, mensaje; si tiene, tabla
        content: hasBusinesses ? (
          <GenericTable
            data={relatedBusinesses}
            columns={[
              { key: 'business_name', title: 'Nombre del Negocio', sortable: true },
              { key: 'phone', title: 'Teléfono' },
              { key: 'address', title: 'Dirección' },
              { key: 'average_rating', title: 'Calificación', type: 'rating' },
              { key: 'total_reviews', title: 'Reseñas' }
            ]}
            searchable={true}
            pagination={true}
            itemsPerPage={5}
            emptyMessage="No se encontraron negocios para este servicio"
            onRowClick={(business) => {
              if (onBusinessClick) {
                onBusinessClick(business)
              } else {
                // Navegación por defecto
                navigateTo(`/business/${business.id}`)
              }
            }}
          />
        ) : (
          <Box
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--color-texto-claro)',
            }}
          >
            <Text fw={600} size="lg" mb="md">
              No hay negocios registrados para este servicio
            </Text>
            <Text>
              Pronto habrá profesionales ofreciendo {service.name.toLowerCase()}.
            </Text>
          </Box>
        )
      }
    })
  }, [services, businesses, onBusinessClick])

  // Filtrar items basado en searchTerm (prop)
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return accordionItems
    
    const term = searchTerm.toLowerCase().trim()
    
    return accordionItems.filter(item => {
      // Buscar en título
      if (item.title.toLowerCase().includes(term)) return true
      
      // Buscar en subtítulo
      if (item.subtitle?.toLowerCase().includes(term)) return true
      
      return false
    })
  }, [accordionItems, searchTerm])

  // Abrir automáticamente los items sin contenido O que coincidan con búsqueda
  useEffect(() => {
    if (accordionItems.length > 0) {
      let itemsToOpen = []
      
      if (searchTerm.trim()) {
        // Si hay búsqueda, abrir los items que coinciden
        itemsToOpen = filteredItems.map(item => item.id)
      } else {
        // Si no hay búsqueda, abrir solo los que no tienen contenido
        itemsToOpen = accordionItems
          .filter(item => !item.hasContent)
          .map(item => item.id)
      }
      
      setOpenItems(itemsToOpen)
    }
  }, [accordionItems, filteredItems, searchTerm])

  // Manejar toggle manual
  const handleToggle = (itemIds) => {
    setOpenItems(itemIds)
  }

  // Estado de carga
  if (isLoading) {
    return (
      <Center style={{ minHeight: '50vh' }}>
        <Group>
          <Loader size="lg" color="var(--color-botones)" />
          <Text>Cargando servicios...</Text>
        </Group>
      </Center>
    )
  }

  // Si no hay servicios
  if (!accordionItems || accordionItems.length === 0) {
    return (
      <Box
        className={className}
        style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-fondo)',
          borderRadius: 'var(--border-radius)',
          border: '2px dashed var(--color-border)',
        }}
      >
        <Text fw={600} mb="xs">No hay servicios disponibles</Text>
        <Text size="sm" c="dimmed">
          No hay servicios registrados en el sistema
        </Text>
      </Box>
    )
  }

  // Si hay búsqueda pero no resultados
  if (searchTerm.trim() && filteredItems.length === 0) {
    return (
      <Box
        className={className}
        style={{
          padding: '3rem',
          textAlign: 'center',
          backgroundColor: 'var(--color-fondo)',
          borderRadius: 'var(--border-radius)',
        }}
      >
        <Text fw={600} mb="xs">No se encontraron servicios</Text>
        <Text size="sm" c="dimmed">
          No hay servicios que coincidan con "{searchTerm}"
        </Text>
      </Box>
    )
  }

  // Renderizar el accordion
  return (
    <Box className={className}>
      <Accordion
        items={filteredItems}
        openItems={openItems}
        onToggle={handleToggle}
        multiple={true}
      />
    </Box>
  )
}

export default ServicesAccordion