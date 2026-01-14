import { Link, useLocation } from 'react-router-dom';
import { Group, Text, Button, Avatar, Container, Box } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Home, Scissors, Building2, Phone } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import Logo from '../../assets/logo.png';
import ModalContacto from '../modales/modalContacto';

function Header() {
  const [modalContactoOpened, { open, close }] = useDisclosure(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={18} /> },
    { path: '/services', label: 'Servicios', icon: <Scissors size={18} /> },
    { path: '/businesses', label: 'Negocios', icon: <Building2 size={18} /> },
  ];
  
  const isActive = (path) => location.pathname === path;

  return (
    <>
      <Box
        bg="var(--color-header)"
        style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}
      >
        <Container size="xl" h="100%">
          <Group justify="space-between" align="center" h="100%" wrap="nowrap">
            {/* Logo */}
            <Group>
              <Avatar
                src={Logo}
                alt="Logo"
                size={isMobile ? 50 : 60}
                radius="xl"
                component={Link}
                to="/"
              />
              <Box ml={isMobile ? 'sm' : 'md'}>
                <Text fw={800} size={isMobile ? '1.2rem' : '1.5rem'} c="white">
                  Esteticlick
                </Text>
                <Text size="sm" c="white" opacity={0.9}>
                  Tu Belleza, Nuestra Prioridad
                </Text>
              </Box>
            </Group>
            
            {/* Navegación Desktop */}
            <Group gap="sm" visibleFrom="sm">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant={isActive(item.path) ? 'filled' : 'light'}
                  color={isActive(item.path) ? 'pink' : 'blue'}
                  leftSection={item.icon}
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
              
              <Button
                variant="light"
                color="orange"
                leftSection={<Phone size={18} />}
                onClick={open}
                size="sm"
              >
                Contacto
              </Button>
            </Group>
            
            {/* Menú móvil (se puede añadir después) */}
          </Group>
        </Container>
      </Box>
      
      <ModalContacto opened={modalContactoOpened} onClose={close} />
    </>
  );
}

export default Header;