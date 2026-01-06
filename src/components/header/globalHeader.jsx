import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Group, 
  Text, 
  Button, 
  Avatar, 
  Loader,
  Box,
  Menu,
  ActionIcon,
  Container,
} from '@mantine/core';
import {
  Home,
  Scissors,
  Building2,
  ShieldCheck,
  UserCircle2,
  LogOut,
  LogIn,
  Phone,
  User,
  LayoutDashboard,
  Menu as MenuIcon
} from 'lucide-react';
import { useAuth } from '../../context/authcontext';
import ModalContacto from '../modalcontacto/modalcontacto';
import Logo from '../../assets/logo.png';
import './globalHeader.css';

function Header() {
  const [showModalContact, setShowModalContact] = useState(false);
  const location = useLocation();
  
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch(error) {
      console.error('Error al desconectarse:', error);
    }
  };

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  if(isLoading) {
    return (
      <Container size="xl" h="100%">
        <Group justify="space-between" align="center" h="100%" px="md">
          <Group>
            <Avatar 
              src={Logo} 
              alt="Logo"
              size="xl"
              radius="xl"
              style={{ 
                border: '3px solid white', 
                cursor: 'pointer',
                marginLeft: '1rem'
              }}
              component={Link}
              to="/"
            />
            <Box ml="md">
              <Text fw={700} size="xl" c="white">Esteticlick</Text>
              <Text size="sm" c="white" opacity={0.9}>Tu Belleza, Nuestra Prioridad</Text>
            </Box>
          </Group>
          <Loader color="gray" size="md" />
        </Group>
      </Container>
    );
  }

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={18} /> },
    { path: '/services', label: 'Servicios', icon: <Scissors size={18} /> },
    { path: '/businesses', label: 'Negocios', icon: <Building2 size={18} /> },
  ];

  return (
    <>
      <Container size="xl" h="100%">
        <Group 
          justify="space-between" 
          align="center" 
          h="100%" 
          wrap="nowrap"
        >
          {/* Logo y título con mejor espaciado */}
          <Group>
            <Avatar 
              src={Logo} 
              alt="Logo"
              size={60} // Tamaño fijo más grande
              radius="xl"
              style={{ 
                border: '3px solid white', 
                boxShadow: 'var(--sombra-media)',
                cursor: 'pointer',
                marginLeft: '1rem' // Espacio desde el borde izquierdo
              }}
              component={Link}
              to="/"
            />
            <Box ml="md">
              <Text fw={700} size="xl" c="white" style={{ fontFamily: 'inherit' }}>
                Esteticlick
              </Text>
              <Text size="sm" c="white" opacity={0.9}>
                Tu Belleza, Nuestra Prioridad
              </Text>
            </Box>
          </Group>

          {/* Navegación principal - Desktop */}
          <Group gap="md" visibleFrom="sm" style={{ flexWrap: 'nowrap' }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                component={Link}
                to={item.path}
                variant={isActiveLink(item.path) ? 'filled' : 'light'}
                color={isActiveLink(item.path) ? 'pink' : 'blue'} // Cambiado de gray a blue
                leftSection={item.icon}
                style={{
                  border: isActiveLink(item.path) ? '2px solid var(--color-botones)' : '2px solid rgba(255, 255, 255, 0.3)',
                  backgroundColor: isActiveLink(item.path) 
                    ? 'rgba(232, 169, 156, 0.3)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: isActiveLink(item.path) ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 600,
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'rgba(232, 169, 156, 0.2)',
                      borderColor: 'var(--color-botones)',
                      color: 'white',
                    },
                  },
                }}
              >
                {item.label}
              </Button>
            ))}

            {isAuthenticated ? (
              <>
                {(user?.role === 'admin' || user?.role === 'owner') && (
                  <Button
                    component={Link}
                    to="/admin"
                    variant={isActiveLink('/admin') ? 'filled' : 'light'}
                    color={isActiveLink('/admin') ? 'pink' : 'violet'} // Color violet para admin
                    leftSection={<ShieldCheck size={18} />}
                    style={{
                      backgroundColor: isActiveLink('/admin') 
                        ? 'rgba(232, 169, 156, 0.3)' 
                        : 'rgba(138, 43, 226, 0.2)',
                      color: isActiveLink('/admin') ? 'white' : 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    Admin
                  </Button>
                )}
                
                <Button
                  component={Link}
                  to="/dashboard"
                  variant={isActiveLink('/dashboard') ? 'filled' : 'light'}
                  color={isActiveLink('/dashboard') ? 'pink' : 'teal'} // Color teal para panel
                  leftSection={<LayoutDashboard size={18} />}
                  style={{
                    backgroundColor: isActiveLink('/dashboard') 
                      ? 'rgba(232, 169, 156, 0.3)' 
                      : 'rgba(0, 128, 128, 0.2)',
                    color: isActiveLink('/dashboard') ? 'white' : 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Panel
                </Button>

                <Menu shadow="md" width={200}>
                  <Menu.Target>
                    <Button
                      variant="light"
                      color="cyan" // Color cyan para usuario
                      leftSection={<UserCircle2 size={18} />}
                      style={{
                        backgroundColor: 'rgba(0, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.9)',
                      }}
                    >
                      {user?.name || 'Perfil'}
                    </Button>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>{user?.email}</Menu.Label>
                    <Menu.Item 
                      component={Link} 
                      to="/profile"
                      leftSection={<User size={14} />}
                    >
                      Mi perfil
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      color="red" 
                      leftSection={<LogOut size={14} />}
                      onClick={handleLogout}
                    >
                      Cerrar sesión
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant={isActiveLink('/login') ? 'filled' : 'light'}
                color={isActiveLink('/login') ? 'pink' : 'green'} // Color green para login
                leftSection={<LogIn size={18} />}
                style={{
                  backgroundColor: isActiveLink('/login') 
                    ? 'rgba(232, 169, 156, 0.3)' 
                    : 'rgba(0, 128, 0, 0.2)',
                  color: isActiveLink('/login') ? 'white' : 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Login
              </Button>
            )}

            <Button
              variant="filled"
              color="orange" // Color naranja para contacto
              leftSection={<Phone size={18} />}
              onClick={() => setShowModalContact(true)}
              style={{
                background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(232, 169, 156, 0.3)',
              }}
              styles={{
                root: {
                  '&:hover': {
                    background: 'linear-gradient(135deg, var(--color-botones-hover) 0%, #ff7b54 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 16px rgba(232, 169, 156, 0.4)',
                  },
                },
              }}
            >
              Contacto
            </Button>
          </Group>

          {/* Menú móvil */}
          <Menu shadow="md" width={200} hiddenFrom="sm">
            <Menu.Target>
              <ActionIcon 
                variant="light" 
                color="white" 
                size="xl"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <MenuIcon size={24} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              {navItems.map((item) => (
                <Menu.Item
                  key={item.path}
                  component={Link}
                  to={item.path}
                  leftSection={item.icon}
                  style={{
                    fontWeight: isActiveLink(item.path) ? 600 : 400,
                    color: isActiveLink(item.path) ? 'var(--color-botones)' : 'inherit',
                  }}
                >
                  {item.label}
                </Menu.Item>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Menu.Divider />
                  <Menu.Label>Mi cuenta</Menu.Label>
                  <Menu.Item 
                    component={Link}
                    to="/profile"
                    leftSection={<User size={14} />}
                  >
                    {user?.name || 'Perfil'}
                  </Menu.Item>
                  <Menu.Item 
                    component={Link}
                    to="/dashboard"
                    leftSection={<LayoutDashboard size={14} />}
                  >
                    Panel
                  </Menu.Item>
                  {user?.role === 'admin' && (
                    <Menu.Item 
                      component={Link}
                      to="/admin"
                      leftSection={<ShieldCheck size={14} />}
                    >
                      Admin
                    </Menu.Item>
                  )}
                  <Menu.Divider />
                  <Menu.Item 
                    color="red" 
                    leftSection={<LogOut size={14} />}
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item 
                  component={Link}
                  to="/login"
                  leftSection={<LogIn size={14} />}
                >
                  Login
                </Menu.Item>
              )}
              
              <Menu.Divider />
              <Menu.Item 
                leftSection={<Phone size={14} />}
                onClick={() => setShowModalContact(true)}
                style={{
                  color: 'var(--color-botones)',
                  fontWeight: 600,
                }}
              >
                Contacto
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Container>

      <ModalContacto
        show={showModalContact}
        handleClose={() => setShowModalContact(false)}
      />
    </>
  );
}

export default Header;