import { useState } from 'react'
import { 
  Container, 
  Title, 
  Text, 
  Box, 
  Group,
  Stack
} from '@mantine/core'
import SearchBox from '../../components/searchbox/globalSearchBox'
import ServicesAccordion from '../../components/accordion/servicesAccordion'

const ServicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')

  // Manejar búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)
  }

  return (
    <Container size="xl" py="xl" px="md">
      <Stack gap="xl">
        {/* Header */}
        <Box style={{ textAlign: 'center' }}>
          <Title order={1} mb="xs" style={{ color: 'var(--color-texto-primario)' }}>
            Servicios Disponibles
          </Title>
          <Text size="lg" c="dimmed" maw={600} mx="auto">
            Explora todos los servicios y encuentra los mejores profesionales
          </Text>
        </Box>

        {/* Search */}
        <Box 
          p="lg"
          style={{
            backgroundColor: 'var(--color-fondo)',
            borderRadius: 'var(--border-radius)',
          }}
        >
          <SearchBox
            placeholder="Buscar servicios por nombre o descripción..."
            onChange={handleSearch}
            size="lg"
            fullWidth
          />
          
          {searchTerm && (
            <Box 
              mt="md" 
              pt="md"
              style={{
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <Group justify="space-between">
                <Text size="sm" c="dimmed">
                  Búsqueda: <Text span fw={600}>"{searchTerm}"</Text>
                </Text>
                <Text size="sm" c="dimmed">
                  {searchTerm ? "Resultados filtrados" : "Mostrando todos los servicios"}
                </Text>
              </Group>
            </Box>
          )}
        </Box>

        {/* Services Accordion */}
        <ServicesAccordion
          searchTerm={searchTerm}
          onBusinessClick={(business) => {
            // Callback opcional cuando se hace clic en un negocio
            console.log('Negocio seleccionado:', business)
            // navigateTo(`/business/${business.id}`)
          }}
        />
      </Stack>
    </Container>
  )
}

export default ServicesPage