import { Group, Button, ActionIcon, Container, Box, Tooltip } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { 
  Home, Scissors, Building2, ShieldCheck, UserCircle2, 
  LogIn, Phone, Mail, Share2, ChevronUp, LayoutDashboard 
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';
import { useDisclosure } from '@mantine/hooks';
import ModalContacto from '../modales/modalContacto';
import ModalRedesSociales from '../modales/modalRedesSociales';

function StickyNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');
  
  const [contactoOpened, { open: openContacto, close: closeContacto }] = useDisclosure(false);
  const [redesOpened, { open: openRedes, close: closeRedes }] = useDisclosure(false);
  
  // Items para home page (scrollspy)
  const homeSections = [
    { id: 'hero', label: 'Inicio', icon: <Home size={14} /> },
    { id: 'why-choose', label: '¿Por qué elegirnos?', icon: <Scissors size={14} /> },
    { id: 'appointments', label: 'Turnos', icon: <Building2 size={14} /> },
    { id: 'clients', label: 'Clientes', icon: <UserCircle2 size={14} /> },
    { id: 'benefits', label: 'Beneficios', icon: <ShieldCheck size={14} /> },
  ];
  
  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
              
              {/* Secciones específicas para Home */}
              {location.pathname === '/' && !isMobile && (
                <Group gap={2} ml="sm">
                  {homeSections.map((section) => (
                    <Tooltip key={section.id} label={section.label}>
                      <ActionIcon
                        variant="subtle"
                        color="gray"
                        size="sm"
                        onClick={() => scrollToSection(section.id)}
                      >
                        {section.icon}
                      </ActionIcon>
                    </Tooltip>
                  ))}
                </Group>
              )}
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
              {isAuthenticated ? (
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
              ) : (
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
              )}
              
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