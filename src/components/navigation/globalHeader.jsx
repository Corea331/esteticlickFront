import { Link, useLocation } from 'react-router-dom';
import { Group, Text, Button, Avatar, Container, Box, Menu, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Home, Scissors, Building2, Phone, LogIn, UserCircle, LogOut, Settings } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import Logo from '../../assets/logo.png';
import ModalContacto from '../modales/modalContacto';
import { useAuth } from '../../context/authcontext'; // <-- AÑADIR ESTO

function Header() {
  const [modalContactoOpened, { open, close }] = useDisclosure(false);
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isAuthenticated, user, logout } = useAuth(); // <-- AÑADIR AUTH CONTEXT
  
  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={18} /> },
    { path: '/services', label: 'Servicios', icon: <Scissors size={18} /> },
    { path: '/businesses', label: 'Negocios', icon: <Building2 size={18} /> },
  ];
  
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    // Puedes redirigir al home si lo deseas
    // navigate('/');
  };

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
              
              {/* Botón Login/Usuario */}
              {isAuthenticated ? (
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <Button
                      variant="light"
                      color="teal"
                      leftSection={<UserCircle size={18} />}
                      size="sm"
                    >
                      Mi Cuenta
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>
                      <Text size="sm" fw={600}>{user?.name || 'Usuario'}</Text>
                      <Text size="xs" c="dimmed">{user?.email}</Text>
                    </Menu.Label>
                    <Menu.Divider />
                    <Menu.Item 
                      component={Link}
                      to="/dashboard"
                      leftSection={<Settings size={14} />}
                    >
                      Panel de Control
                    </Menu.Item>
                    <Menu.Item 
                      component={Link}
                      to="/profile"
                      leftSection={<UserCircle size={14} />}
                    >
                      Mi Perfil
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      color="red"
                      leftSection={<LogOut size={14} />}
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="filled"
                  color="green"
                  leftSection={<LogIn size={18} />}
                  size="sm"
                >
                  Iniciar Sesión
                </Button>
              )}
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