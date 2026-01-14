import { 
  Container, 
  Title, 
  Text, 
  Box, 
  Group,
  Button,
  Center,
  Stack,
  Loader
} from '@mantine/core'
import { RefreshCw } from 'lucide-react'
import GenericTable from '../../components/generictable/genericTable'
import { reloadPage } from '../../utils/navigation.js'
import { useBusinesses } from '../../hooks'

const BusinessesPage = () => {
  const { data: businesses, isLoading, error } = useBusinesses()

  const columns = [
    {
      key: 'business_name',
      title: 'Nombre del Negocio',
      sortable: true,
      width: '20%',
    },
    {
      key: 'specialty',
      title: 'Especialidad',
      sortable: true,
      width: '15%',
    },
    {
      key: 'average_rating',
      title: 'Calificación',
      sortable: false,
      type: 'rating',
      width: '15%',
    },
    {
      key: 'total_reviews',
      title: 'Reseñas',
      sortable: true,
      width: '10%',
    },
    {
      key: 'phone',
      title: 'Teléfono',
      width: '15%',
    },
    {
      key: 'address',
      title: 'Dirección',
      width: '25%',
    },
  ]

  // Manejo de errores
  if (error) {
    return (
      <Container size="xl" py="xl" px="md">
        <Center style={{ minHeight: '70vh' }}>
          <Stack align="center" gap="lg">
            <Box
              style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'var(--color-blanco)',
                borderRadius: 'var(--border-radius-lg)',
                boxShadow: 'var(--sombra-suave)',
                maxWidth: 500,
              }}
            >
              <Title order={2} c="red.6" mb="md">
                Error al cargar los negocios
              </Title>
              <Text c="dimmed" mb="lg">
                {error.message || 'Ocurrió un error al obtener los datos'}
              </Text>
              <Button
                onClick={reloadPage}
                leftSection={<RefreshCw size={18} />}
                size="md"
                style={{
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  color: 'var(--color-blanco)',
                }}
              >
                Reintentar
              </Button>
            </Box>
          </Stack>
        </Center>
      </Container>
    )
  }

  // Estado de carga
  if (isLoading) {
    return (
      <Container size="xl" py="xl" px="md">
        <Center style={{ minHeight: '70vh' }}>
          <Stack align="center" gap="md">
            <Loader size="lg" color="var(--color-botones)" />
            <Text>Cargando negocios...</Text>
          </Stack>
        </Center>
      </Container>
    )
  }

  return (
    <Container size="xl" py="xl" px="md">
      <Stack gap="xl">
        {/* Header */}
        <Box
          style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: 'var(--color-blanco)',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--sombra-suave)',
          }}
        >
          <Title 
            order={1} 
            mb="md" 
            style={{ 
              color: 'var(--color-texto-primario)',
              fontSize: '2.5rem',
              fontWeight: 600,
            }}
          >
            Negocios Registrados
          </Title>
          <Text 
            size="xl" 
            c="dimmed"
            style={{
              opacity: 0.8,
            }}
          >
            Descubre y conecta con los mejores profesionales de belleza y bienestar cerca de ti
          </Text>
        </Box>

        {/* Filtros (opcional, puedes agregarlos después) */}
        {/* <Box
          p="lg"
          style={{
            backgroundColor: 'var(--color-blanco)',
            borderRadius: 'var(--border-radius)',
            boxShadow: 'var(--sombra-suave)',
          }}
        >
          <Group gap="md">
            <Text fw={600}>Filtrar por:</Text>
            <Select
              placeholder="Especialidad"
              data={['Todas', 'Cortes', 'Coloración', 'Tratamientos']}
              style={{ minWidth: 200 }}
            />
          </Group>
        </Box> */}

        {/* Tabla de negocios */}
        <Box>
          <GenericTable
            data={businesses || []}
            columns={columns}
            loading={isLoading}
            searchable={true}
            sortable={true}
            pagination={true}
            itemsPerPage={10}
            emptyMessage="No se encontraron negocios registrados"
            onRowClick={(business) => {
              console.log('Negocio clickeado: ', business)
              // Navegar a página del negocio:
              // navigateTo(`/business/${business.id}`)
            }}
            styles={{
              root: {
                borderRadius: 'var(--border-radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--sombra-media)',
              },
              header: {
                backgroundColor: 'var(--color-header)',
                borderBottom: 'none',
                padding: '1.5rem',
              },
              th: {
                backgroundColor: 'var(--color-header)',
                color: 'var(--color-blanco)',
                borderBottom: 'none',
                fontWeight: 600,
                padding: '1.25rem 1rem',
                '&:hover': {
                  backgroundColor: 'var(--color-botones) !important',
                },
              },
              td: {
                padding: '1.25rem 1rem',
                borderBottom: '1px solid var(--color-border)',
                color: 'var(--color-texto-primario)',
              },
              tr: {
                cursor: 'pointer',
                transition: 'var(--transicion-suave)',
                '&:hover': {
                  backgroundColor: 'var(--color-beige)',
                  transform: 'translateX(4px)',
                },
              },
              pagination: {
                backgroundColor: 'var(--color-fondo)',
                borderTop: '1px solid var(--color-border)',
                padding: '1.5rem',
              }
            }}
          />
        </Box>
      </Stack>
    </Container>
  )
}

export default BusinessesPage