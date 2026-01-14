import { 
  Box, 
  Title, 
  Text, 
  Stack
} from '@mantine/core';
import { 
  Clock, 
  CalendarCheck, 
  ArrowLeftRight, 
  XCircle
} from 'lucide-react';
import CarouselReutilizable from './globalCarousel';

function PresentationCarousel() {
  const slides = [
    {
      title: "Solicitar Turnos",
      icon: <Clock size={24} />,
      items: [
        "Reserva online 24/7 desde cualquier dispositivo",
        "Visualización en tiempo real de horarios disponibles",
        "Asignación automática según especialidad y disponibilidad"
      ]
    },
    {
      title: "Confirmación Automática",
      icon: <CalendarCheck size={24} />,
      items: [
        "Notificaciones inmediatas vía email o SMS",
        "Recordatorios programados previo a la cita",
        "Confirmación con un solo clic por parte del cliente"
      ]
    },
    {
      title: "Modificación Flexible",
      icon: <ArrowLeftRight size={24} />,
      items: [
        "Cambio de horarios sin complicaciones",
        "Reagendamiento automático según nueva disponibilidad",
        "Notificación instantánea de modificaciones"
      ]
    },
    {
      title: "Cancelación Controlada",
      icon: <XCircle size={24} />,
      items: [
        "Proceso simple y rápido en pocos clics",
        "Liberación automática del horario para nuevos turnos",
        "Políticas personalizables de cancelación"
      ]
    }
  ];

  const renderSlide = (slide) => (
    <Box
      style={{
        background: 'linear-gradient(135deg, var(--color-header) 0%, #7a957c 100%)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--sombra-suave)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        '@media (maxWidth: 768px)': {
          padding: '2rem 1.5rem',
        },
        '@media (maxWidth: 480px)': {
          padding: '1.5rem 1rem',
        }
      }}
    >
      <Title
        order={4}
        style={{
          color: 'var(--color-blanco)',
          fontWeight: 600,
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          marginBottom: '2rem',
          textAlign: 'center',
          '@media (maxWidth: 480px)': {
            fontSize: '1.3rem',
            marginBottom: '1.5rem',
          }
        }}
      >
        {slide.icon}
        {slide.title}
      </Title>

      <Stack gap="md" style={{ flex: 1 }}>
        {slide.items.map((item, index) => (
          <Box
            key={index}
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              borderLeft: '4px solid var(--color-botones)',
              borderRadius: 'var(--border-radius)',
              padding: '1.25rem 1.5rem',
              transition: 'var(--transicion-suave)',
              boxShadow: 'var(--sombra-suave)',
              ':hover': {
                transform: 'translateX(8px)',
                boxShadow: 'var(--sombra-media)',
              },
              '@media (maxWidth: 768px)': {
                padding: '1rem 1.25rem',
              }
            }}
          >
            <Text
              style={{
                color: 'var(--color-texto-primario)',
                fontWeight: 500,
                fontSize: '1.1rem',
                lineHeight: 1.5,
                '@media (maxWidth: 768px)': {
                  fontSize: '1rem',
                }
              }}
            >
              {item}
            </Text>
          </Box>
        ))}
      </Stack>
    </Box>
  );

  return (
    <CarouselReutilizable
      slides={slides.map(slide => renderSlide(slide))}
      interval={5000}
      height={500}
      showControls={true}
      showIndicators={true}
      autoPlay={true}
    />
  );
}

export default PresentationCarousel;