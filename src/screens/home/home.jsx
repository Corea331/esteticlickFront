import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Stack, 
  SimpleGrid, 
  Card,
  Box,
  List,
  Divider,
  Paper,
  Button
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
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useRef } from 'react';
import PresentationCarousel from '../../components/carousel/presentationcarousel';

function Home() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  
  // Referencias para cada sección
  const heroRef = useRef(null);
  const whyChooseRef = useRef(null);
  const appointmentsRef = useRef(null);
  const clientsRef = useRef(null);
  const howItWorksRef = useRef(null);
  const benefitsRef = useRef(null);
  const readyRef = useRef(null);
  
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
      py={isMobile ? 'xl' : '3rem'}
    >
      <Container size="xl">
        {/* Header Principal */}
        <section id="hero" ref={heroRef} mb={isMobile ? '6rem' : '8rem'} pt="md">
          <Stack align="center" gap="xl" ta="center" pt="md">
            <Title 
              order={1}
              fw={800}
              size={isMobile ? '2rem' : (isTablet ? '3rem' : 'clamp(2.5rem, 6vw, 4rem)')}
              lh={1.2}
              mb="lg"
              c="var(--color-texto-primario)"
              style={{
                background: 'linear-gradient(135deg, var(--color-texto-primario) 0%, var(--color-botones) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
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
              <Group justify="center" gap="xs">
                <Sparkles size={20} color="var(--color-botones)" />
                Optimiza la administración de turnos, clientes y servicios
                <Sparkles size={20} color="var(--color-botones)" />
              </Group>
            </Title>
            
            <Paper 
              withBorder 
              p="xl" 
              radius="lg" 
              shadow="sm" 
              bg="white"
              style={{
                borderLeft: '4px solid var(--color-botones)',
                maxWidth: '800px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
              }}
            >
              <Text 
                size={isMobile ? '1rem' : '1.1rem'}
                lh={1.6}
                mx="auto"
                c="var(--color-texto-secundario)"
              >
                Descubre las herramientas diseñadas específicamente para potenciar el crecimiento 
                y la eficiencia de tu centro de estética. Una solución completa que transforma 
                la manera en que gestionas tu negocio.
              </Text>
            </Paper>
          </Stack>
        </section>

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <Star size={16} />
              <Text fw={600}>Por qué elegirnos</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Sección Por qué elegirnos */}
        <section id="why-choose" ref={whyChooseRef} mb={isMobile ? '7rem' : '10rem'}>
          <Stack gap="xl">
            <Group gap="md" align="center" justify="center">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Star size={isMobile ? 24 : 28} color="white" />
              </Box>
              <Title 
                order={2}
                fw={700}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                ¿Por qué elegir nuestro sistema?
              </Title>
            </Group>
            <Text 
              size="xl"
              fw={500}
              ta="center"
              c="var(--color-texto-claro)"
              mb="xl"
            >
              Soluciones completas para la gestión moderna de tu estética
            </Text>
            
            <Paper
              p="xl" 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: 'lg',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--sombra-suave)',
              }}
            >
              <Group justify="center" mb="lg">
                <ChevronRight size={20} color="var(--color-botones)" />
                <Text size="lg" fw={600}>Ventajas exclusivas</Text>
                <ChevronRight size={20} color="var(--color-botones)" />
              </Group>
              
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                <Stack gap="md">
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>100% personalizable a tus necesidades</Text>
                  </Group>
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>Soporte técnico especializado 24/7</Text>
                  </Group>
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>Actualizaciones constantes sin costo adicional</Text>
                  </Group>
                </Stack>
                
                <Stack gap="md">
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>Integración con redes sociales y marketing</Text>
                  </Group>
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>Reportes analíticos en tiempo real</Text>
                  </Group>
                  <Group>
                    <CheckCircle size={20} color="var(--color-botones)" />
                    <Text fw={500}>Múltiples usuarios con permisos personalizados</Text>
                  </Group>
                </Stack>
              </SimpleGrid>
            </Paper>
          </Stack>
        </section>

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <Calendar size={16} />
              <Text fw={600}>Gestión de Turnos</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Gestión de Turnos */}
        <section id="appointments" ref={appointmentsRef} mb={isMobile ? '7rem' : '10rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Calendar size={isMobile ? 24 : 28} color="white" />
              </Box>
              <Title 
                order={3}
                fw={700}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                Gestión de Turnos Inteligente
              </Title>
            </Group>
            
            <Stack gap="xl">
              <Paper p="xl" radius="lg" withBorder bg="rgba(255, 255, 255, 0.95)" shadow="sm">
                <Text 
                  size={isMobile ? '1rem' : '1.1rem'}
                  lh={1.8}
                  c="var(--color-texto-secundario)"
                >
                  Gestionamos el ciclo completo de reservas mediante un flujo automatizado que inicia 
                  con la solicitud del cliente, se consolida con confirmaciones instantáneas, permite 
                  reprogramaciones flexibles y facilita cancelaciones asistidas.
                </Text>
              </Paper>
              
              <Paper p="xl" radius="lg" withBorder bg="rgba(255, 255, 255, 0.95)" shadow="sm">
                <Text 
                  size={isMobile ? '1rem' : '1.1rem'}
                  lh={1.8}
                  c="var(--color-texto-secundario)"
                >
                  Todo el proceso está respaldado por notificaciones automáticas bidireccionales que 
                  mantienen informados tanto a tus clientes como a tu equipo en todo momento.
                </Text>
              </Paper>
              
              <Box p="md" style={{ backgroundColor: 'rgba(var(--color-botones-rgb, 59, 130, 246), 0.05)', borderRadius: 'lg' }}>
                <List
                  spacing="md"
                  size="lg"
                  center
                  icon={<CheckCircle size={20} color="var(--color-botones)" />}
                  styles={{
                    item: {
                      color: 'var(--color-texto-secundario)',
                      padding: '12px',
                      backgroundColor: 'white',
                      borderRadius: 'md',
                      marginBottom: '8px',
                      border: '1px solid var(--color-border)',
                    },
                  }}
                >
                  <List.Item>Agenda inteligente para asignación eficiente de horarios</List.Item>
                  <List.Item>Notificaciones automáticas a clientes y a la estética en cada acción</List.Item>
                  <List.Item>Reducción de tiempos muertos y optimización de la capacidad instalada</List.Item>
                  <List.Item>Sistema de recordatorios automáticos por email y SMS</List.Item>
                </List>
              </Box>
            </Stack>
          </Box>
        </section>

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <Users size={16} />
              <Text fw={600}>Control de Clientes</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Control de Clientes */}
        <section id="clients" ref={clientsRef} mb={isMobile ? '7rem' : '10rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Users size={isMobile ? 24 : 28} color="white" />
              </Box>
              <Title 
                order={3}
                fw={700}
                size={isMobile ? '1.5rem' : (isTablet ? '2rem' : '2.5rem')}
                c="var(--color-texto-primario)"
              >
                Control Integral de Clientes
              </Title>
            </Group>
            
            <Stack gap="lg">
              <Paper p="xl" radius="lg" withBorder bg="rgba(255, 255, 255, 0.95)" shadow="sm">
                <Text 
                  size={isMobile ? '1rem' : '1.1rem'}
                  lh={1.8}
                  mb="md"
                  c="var(--color-texto-secundario)"
                >
                  Mantén un registro detallado y organizado de cada cliente que visita tu estética. 
                  Nuestro sistema te permite ofrecer un servicio personalizado y de alta calidad.
                </Text>
                
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mt="lg">
                  <Stack gap="md">
                    <Group>
                      <CheckCircle size={18} color="var(--color-botones)" />
                      <Text fw={500}>Historial completo de servicios realizados</Text>
                    </Group>
                    <Group>
                      <CheckCircle size={18} color="var(--color-botones)" />
                      <Text fw={500}>Preferencias y observaciones personalizadas</Text>
                    </Group>
                  </Stack>
                  
                  <Stack gap="md">
                    <Group>
                      <CheckCircle size={18} color="var(--color-botones)" />
                      <Text fw={500}>Seguimiento de fidelización y recordatorios automáticos</Text>
                    </Group>
                    <Group>
                      <CheckCircle size={18} color="var(--color-botones)" />
                      <Text fw={500}>Comunicación segmentada por grupos de clientes</Text>
                    </Group>
                  </Stack>
                </SimpleGrid>
              </Paper>
            </Stack>
          </Box>
        </section>

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <PlayCircle size={16} />
              <Text fw={600}>Cómo funciona</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Carrusel */}
        <section id="how-it-works" ref={howItWorksRef} mb={isMobile ? '7rem' : '10rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl" justify="center">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PlayCircle size={isMobile ? 24 : 28} color="white" />
              </Box>
              <Title 
                order={3}
                fw={700}
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
            
            <Paper p="lg" radius="lg" withBorder bg="rgba(255, 255, 255, 0.95)" shadow="md">
              <Box 
                maw={900}
                mx="auto"
                py={isMobile ? 'md' : 'xl'}
              >
                <PresentationCarousel />
              </Box>
            </Paper>
          </Box>
        </section>

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <Award size={16} />
              <Text fw={600}>Beneficios Clave</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Beneficios Clave */}
        <section id="benefits" ref={benefitsRef} mb={isMobile ? '7rem' : '10rem'}>
          <Box>
            <Group gap="md" align="center" mb="xl" justify="center">
              <Box
                style={{
                  padding: '12px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Award size={isMobile ? 24 : 28} color="white" />
              </Box>
              <Title 
                order={3}
                fw={700}
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
                  radius="lg"
                  withBorder
                  shadow="sm"
                  styles={{
                    root: {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderColor: 'var(--color-border)',
                      transition: 'var(--transicion-suave)',
                      borderTop: '4px solid var(--color-botones)',
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
                    fw={700}
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

        <Divider 
          my="xl" 
          label={
            <Group gap="xs">
              <Award size={16} />
              <Text fw={600}>Listo para unirte?</Text>
            </Group>
          } 
          labelPosition="center" 
          color="var(--color-border)"
        />

        {/* Llamada a la acción */}
        <section id="ready" ref={readyRef} mb={isMobile ? '7rem' : '10rem'}>
          <Paper 
            mt="xl" 
            p="xl" 
            radius="lg" 
            bg="linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)"
            ta="center"
            shadow="md"
            style={{
              backgroundColor: 'var(--color-botones)',
            }}
          >
            <Title order={3} c="white" mb="md">
              ¿Listo para transformar tu estética?
            </Title>
            <Text c="white" mb="xl">
              Comienza ahora y descubre cómo podemos ayudarte a optimizar tu negocio
            </Text>
            <Group justify="center">
              <Button 
                size="lg" 
                variant="white" 
                component="a" 
                
                radius="xl"
              >
                
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                color="white" 
                component="a" 
                href="/contacto"
                radius="xl"
              >
                Contactar
              </Button>
            </Group>
          </Paper>
        </section>
      </Container>
    </Box>
  );
}

export default Home;