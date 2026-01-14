import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Stack, 
  SimpleGrid, 
  Card,
  Box,
  List
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  Star, 
  Calendar, 
  Users, 
  PlayCircle, 
  Award,
  Bell,
  CalendarDays,
  MessageCircleHeart,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import PresentationCarousel from '../../components/carousel/presentationcarousel';

function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  
  const benefits = [
    { 
      icon: Bell, 
      title: 'Reducción de Ausentismo', 
      description: 'Recordatorios automáticos que disminuyen las inasistencias hasta en un 60%' 
    },
    { 
      icon: CalendarDays, 
      title: 'Agenda Optimizada', 
      description: 'Asignación inteligente que maximiza la ocupación y reduce tiempos muertos' 
    },
    { 
      icon: MessageCircleHeart, 
      title: 'Experiencia Mejorada', 
      description: 'Comunicación constante que incrementa la satisfacción y fidelización' 
    },
    { 
      icon: TrendingDown, 
      title: 'Ahorro de Tiempo', 
      description: 'Automatización que reduce la administración manual en un 70%' 
    }
  ];

  return (
    <Box 
      style={{
        minHeight: 'calc(100vh - 300px)',
        background: 'var(--color-fondo)',
      }}
      py={isMobile ? 'xl' : '2rem'}
    >
      <Container size="xl">
        {/* Header Principal */}
        <section id="hero" mb={isMobile ? '3rem' : '4rem'}>
          <Stack align="center" gap="lg" ta="center" pt="md">
            <Title 
              order={1}
              fw={700}
              size={isMobile ? '2rem' : (isTablet ? '3rem' : 'clamp(2.5rem, 6vw, 4rem)')}
              lh={1.2}
              mb="lg"
              c="var(--color-texto-primario)"
            >
              Sistema Integral de Gestión para Estéticas
            </Title>
            
            <Title 
              order={3}
              fw={500}
              size={isMobile ? '1.1rem' : (isTablet ? '1.4rem' : '1.8rem')}
              lh={1.4}
              mb="xl"
              c="var(--color-texto-claro)"
            >
              Optimiza la administración de turnos, clientes y servicios con nuestra plataforma profesional
            </Title>
            
            <Text 
              size={isMobile ? '1rem' : '1.1rem'}
              lh={1.6}
              maw={800}
              mx="auto"
              c="var(--color-texto-secundario)"
            >
              Descubre las herramientas diseñadas específicamente para potenciar el crecimiento 
              y la eficiencia de tu centro de estética.
            </Text>
          </Stack>
        </section>

        {/* Sección Por qué elegirnos */}
        <section id="why-choose" mb={isMobile ? '3rem' : '4rem'}>
          <Stack gap="md">
            <Group gap="md" align="center">
              <Star size={isMobile ? 24 : 28} color="var(--color-botones)" />
              <Title 
                order={2}
                fw={600}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                ¿Por qué elegir nuestro sistema?
              </Title>
            </Group>
            <Text 
              size="xl"
              fw={500}
              c="var(--color-texto-claro)"
            >
              Soluciones completas para la gestión moderna de tu estética
            </Text>
          </Stack>
        </section>

        {/* Gestión de Turnos */}
        <section id="appointments" mb={isMobile ? '3rem' : '4rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl">
              <Calendar size={isMobile ? 24 : 28} color="var(--color-botones)" />
              <Title 
                order={3}
                fw={600}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                Gestión de Turnos Inteligente
              </Title>
            </Group>
            
            <Stack gap="md">
              <Text 
                size={isMobile ? '1rem' : '1.1rem'}
                lh={1.8}
                mb="md"
                c="var(--color-texto-secundario)"
              >
                Gestionamos el ciclo completo de reservas mediante un flujo automatizado que inicia 
                con la solicitud del cliente, se consolida con confirmaciones instantáneas, permite 
                reprogramaciones flexibles y facilita cancelaciones asistidas.
              </Text>
              
              <Text 
                size={isMobile ? '1rem' : '1.1rem'}
                lh={1.8}
                mb="md"
                c="var(--color-texto-secundario)"
              >
                Todo el proceso está respaldado por notificaciones automáticas bidireccionales que 
                mantienen informados tanto a tus clientes como a tu equipo en todo momento.
              </Text>
              
              <List
                spacing="sm"
                size="lg"
                center
                icon={<CheckCircle size={20} color="var(--color-botones)" />}
                styles={{
                  item: {
                    color: 'var(--color-texto-secundario)',
                  },
                }}
              >
                <List.Item>Agenda inteligente para asignación eficiente de horarios</List.Item>
                <List.Item>Notificaciones automáticas a clientes y a la estética en cada acción</List.Item>
                <List.Item>Reducción de tiempos muertos y optimización de la capacidad instalada</List.Item>
              </List>
            </Stack>
          </Box>
        </section>

        {/* Control de Clientes */}
        <section id="clients" mb={isMobile ? '3rem' : '4rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl">
              <Users size={isMobile ? 24 : 28} color="var(--color-botones)" />
              <Title 
                order={3}
                fw={600}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                Control Integral de Clientes
              </Title>
            </Group>
            
            <Text 
              size={isMobile ? '1rem' : '1.1rem'}
              lh={1.8}
              mb="md"
              c="var(--color-texto-secundario)"
            >
              Mantén un registro detallado y organizado de cada cliente que visita tu estética. 
              Nuestro sistema te permite ofrecer un servicio personalizado y de alta calidad.
            </Text>
            
            <List
              spacing="sm"
              size="lg"
              center
              icon={<CheckCircle size={20} color="var(--color-botones)" />}
              styles={{
                item: {
                  color: 'var(--color-texto-secundario)',
                },
              }}
            >
              <List.Item>Historial completo de servicios realizados</List.Item>
              <List.Item>Preferencias y observaciones personalizadas</List.Item>
              <List.Item>Seguimiento de fidelización y recordatorios automáticos</List.Item>
            </List>
          </Box>
        </section>

        {/* Carrusel */}
        <section id="how-it-works" mb={isMobile ? '3rem' : '4rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl" justify="center">
              <PlayCircle size={isMobile ? 24 : 28} color="var(--color-botones)" />
              <Title 
                order={3}
                fw={600}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                ¿Cómo funciona nuestra gestión de turnos?
              </Title>
            </Group>
            
            <Text 
              size={isMobile ? '1rem' : '1.1rem'}
              ta="center"
              mb="xl"
              c="var(--color-texto-secundario)"
            >
              Descubre el proceso completo y automatizado de nuestra solución
            </Text>
            
            <Box 
              maw={900}
              mx="auto"
              py={isMobile ? 'md' : 'xl'}
            >
              <PresentationCarousel />
            </Box>
          </Box>
        </section>

        {/* Beneficios Clave */}
        <section id="benefits">
          <Box>
            <Group gap="md" align="center" mb="xl" justify="center">
              <Award size={isMobile ? 24 : 28} color="var(--color-botones)" />
              <Title 
                order={3}
                fw={600}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                Beneficios Clave
              </Title>
            </Group>
            
            <SimpleGrid 
              cols={{ base: 1, sm: 2, lg: 4 }}
              spacing={isMobile ? 'md' : 'lg'}
              verticalSpacing={isMobile ? 'md' : 'lg'}
            >
              {benefits.map((benefit, index) => (
                <Card 
                  key={index}
                  padding={isMobile ? 'md' : 'lg'}
                  radius="md"
                  withBorder
                  shadow="sm"
                  styles={{
                    root: {
                      backgroundColor: 'var(--color-blanco)',
                      borderColor: 'var(--color-border)',
                      transition: 'var(--transicion-suave)',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 'var(--sombra-media)',
                      },
                    },
                  }}
                >
                  <Card.Section 
                    ta="center"
                    py={isMobile ? 'lg' : 'xl'}
                  >
                    <Box
                      w={isMobile ? 60 : 80}
                      h={isMobile ? 60 : 80}
                      style={{ 
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                        display:"flex",
                        alignItems:"center",
                        justifyContent:"center",
                      }}
                      mx="auto"
                      mb="lg"
                    >
                      <benefit.icon size={isMobile ? 24 : 32} color="white" />
                    </Box>
                  </Card.Section>
                  
                  <Title 
                    order={4}
                    ta="center"
                    fw={600}
                    mb="md"
                    size={isMobile ? '1.1rem' : '1.3rem'}
                    c="var(--color-texto-primario)"
                  >
                    {benefit.title}
                  </Title>
                  
                  <Text 
                    ta="center"
                    lh={1.6}
                    c="var(--color-texto-secundario)"
                  >
                    {benefit.description}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </Box>
        </section>
      </Container>
    </Box>
  );
}

export default Home;