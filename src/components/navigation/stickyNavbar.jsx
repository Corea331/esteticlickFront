import { Group, Button, ActionIcon, Container, Box, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  Home, 
  Scissors, 
  Building2, 
  LogIn, 
  Phone, 
  Mail, 
  Share2, 
  ChevronUp, 
  LayoutDashboard,
  ShieldCheck,
  Star, 
  Calendar, 
  Users, 
  PlayCircle, 
  Award,
  Rocket
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import { useDisclosure } from '@mantine/hooks';
import ModalContacto from '../modales/modalContacto';
import ModalRedesSociales from '../modales/modalRedesSociales';
import { useEffect, useState } from 'react';

function StickyNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  const [activeSection, setActiveSection] = useState('hero');
  
  const [contactoOpened, { open: openContacto, close: closeContacto }] = useDisclosure(false);
  const [redesOpened, { open: openRedes, close: closeRedes }] = useDisclosure(false);
  
  // Items para home page (scrollspy) - Sincronizados con home.jsx
  const homeSections = [
    { id: 'hero', label: 'Inicio', icon: <Home size={14} /> },
    { id: 'why-choose', label: '¿Por qué elegirnos?', icon: <Star size={14} /> },
    { id: 'appointments', label: 'Turnos', icon: <Calendar size={14} /> },
    { id: 'clients', label: 'Clientes', icon: <Users size={14} /> },
    { id: 'how-it-works', label: 'Cómo funciona', icon: <PlayCircle size={14} /> },
    { id: 'benefits', label: 'Beneficios', icon: <Award size={14} /> },
    { id: 'ready', label: 'Listo para unirte?', icon: <Rocket size={14} /> },
  ];
  
  // Scrollspy effect
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;
      
      const scrollPosition = window.scrollY + 120; // Offset para sticky navbar
      
      for (const section of homeSections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Llamar inicialmente
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80; // Compensar altura del navbar sticky
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80; // Compensar altura del navbar sticky
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  // Función para renderizar los botones del scrollspy
  const renderScrollSpyButtons = () => {
    if (location.pathname !== '/' || isMobile) return null;
    
    return (
      <Group gap={2} ml="sm">
        {homeSections.map((section) => (
          <Tooltip key={section.id} label={section.label} position="bottom">
            <ActionIcon
              variant={activeSection === section.id ? 'filled' : 'subtle'}
              color={activeSection === section.id ? 'var(--color-botones)' : 'gray'}
              size="md"
              onClick={() => scrollToSection(section.id)}
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: activeSection === section.id ? 'var(--color-botones)' : 'transparent',
                borderColor: activeSection === section.id ? 'var(--color-botones)' : 'var(--color-border)',
              }}
            >
              {section.icon}
            </ActionIcon>
          </Tooltip>
        ))}
      </Group>
    );
  };

  // Función para renderizar los botones de autenticación
  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <>
          <Button
            component={Link}
            to="/dashboard"
            variant="light"
            color="teal"
            size="compact-sm"
            leftSection={<LayoutDashboard size={14} />}
          >
            {!isMobile && 'Panel'}
          </Button>
          
          {user?.role === 'admin' && (
            <Button
              component={Link}
              to="/admin"
              variant="light"
              color="violet"
              size="compact-sm"
              leftSection={<ShieldCheck size={14} />}
            >
              {!isMobile && 'Admin'}
            </Button>
          )}
        </>
      );
    } else {
      return (
        <Button
          component={Link}
          to="/login"
          variant="light"
          color="green"
          size="compact-sm"
          leftSection={<LogIn size={14} />}
        >
          {!isMobile && 'Login'}
        </Button>
      );
    }
  };
  
  return (
    <>
      <Box
        bg="var(--color-header)"
        py={6}
        style={{
          borderBottom: '2px solid var(--color-botones)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center" wrap="nowrap" gap="xs">
            {/* Navegación principal compacta */}
            <Group gap={isMobile ? 2 : 'xs'} wrap="nowrap">
              <Button
                component={Link}
                to="/"
                variant="light"
                color="blue"
                size="compact-sm"
                leftSection={<Home size={14} />}
              >
                {!isMobile && 'Inicio'}
              </Button>
              
              <Button
                component={Link}
                to="/services"
                variant="light"
                color="teal"
                size="compact-sm"
                leftSection={<Scissors size={14} />}
              >
                {!isMobile && 'Servicios'}
              </Button>
              
              <Button
                component={Link}
                to="/businesses"
                variant="light"
                color="violet"
                size="compact-sm"
                leftSection={<Building2 size={14} />}
              >
                {!isMobile && 'Negocios'}
              </Button>
              
              {/* Scrollspy buttons */}
              {renderScrollSpyButtons()}
            </Group>
            
            {/* Acciones rápidas */}
            <Group gap={2} wrap="nowrap">
              <Tooltip label="Redes">
                <ActionIcon variant="subtle" color="blue" size="sm" onClick={openRedes}>
                  <Share2 size={16} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Email">
                <ActionIcon 
                  variant="subtle" 
                  color="orange" 
                  size="sm"
                  onClick={() => window.location.href = 'mailto:contacto@esteticlick.com'}
                >
                  <Mail size={16} />
                </ActionIcon>
              </Tooltip>
              
              <Tooltip label="Contacto">
                <ActionIcon variant="subtle" color="green" size="sm" onClick={openContacto}>
                  <Phone size={16} />
                </ActionIcon>
              </Tooltip>
              
              {/* Login/Dashboard */}
              {renderAuthButtons()}
              
              {/* Botón volver arriba */}
              <Tooltip label="Arriba">
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  <ChevronUp size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>
        </Container>
      </Box>
      
      <ModalContacto opened={contactoOpened} onClose={closeContacto} />
      <ModalRedesSociales opened={redesOpened} onClose={closeRedes} />
    </>
  );
}

export default StickyNavbar;