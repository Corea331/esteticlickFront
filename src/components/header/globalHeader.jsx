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
  ActionIcon
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
      <Group justify="space-between" align="center" h="100%" px="md">
        <Group>
          <Avatar 
            src={Logo} 
            alt="Logo"
            size="lg"
            radius="xl"
            style={{ border: '3px solid white', cursor: 'pointer' }}
            component={Link}
            to="/"
          />
          <Box>
            <Text fw={700} size="xl" c="white">Esteticlick</Text>
            <Text size="sm" c="white" opacity={0.9}>Tu Belleza, Nuestra Prioridad</Text>
          </Box>
        </Group>
        <Loader color="gray" size="md" />
      </Group>
    );
  }

  const navItems = [
    { path: '/', label: 'Inicio', icon: <Home size={18} /> },
    { path: '/services', label: 'Servicios', icon: <Scissors size={18} /> },
    { path: '/businesses', label: 'Negocios', icon: <Building2 size={18} /> },
  ];

  return (
    <>
      <Group justify="space-between" align="center" h="100%" wrap="nowrap">
        {/* Logo y título */}
        <Group>
          <Avatar 
            src={Logo} 
            alt="Logo"
            size="lg"
            radius="xl"
            style={{ 
              border: '3px solid white', 
              boxShadow: 'var(--sombra-media)',
              cursor: 'pointer'
            }}
            component={Link}
            to="/"
          />
          <Box>
            <Text fw={700} size="xl" c="white" style={{ fontFamily: 'inherit' }}>
              Esteticlick
            </Text>
            <Text size="sm" c="white" opacity={0.9}>
              Tu Belleza, Nuestra Prioridad
            </Text>
          </Box>
        </Group>

        {/* Navegación principal - Desktop */}
        <Group gap="xs" visibleFrom="sm" style={{ flexWrap: 'nowrap' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              variant={isActiveLink(item.path) ? 'filled' : 'subtle'}
              color={isActiveLink(item.path) ? 'pink' : 'gray'}
              leftSection={item.icon}
              style={{
                border: isActiveLink(item.path) ? '2px solid var(--color-botones)' : '2px solid transparent',
                backgroundColor: isActiveLink(item.path) 
                  ? 'rgba(232, 169, 156, 0.2)' 
                  : 'transparent',
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
                  variant={isActiveLink('/admin') ? 'filled' : 'subtle'}
                  color={isActiveLink('/admin') ? 'pink' : 'gray'}
                  leftSection={<ShieldCheck size={18} />}
                >
                  Admin
                </Button>
              )}
              
              <Button
                component={Link}
                to="/dashboard"
                variant={isActiveLink('/dashboard') ? 'filled' : 'subtle'}
                color={isActiveLink('/dashboard') ? 'pink' : 'gray'}
                leftSection={<LayoutDashboard size={18} />}
              >
                Panel
              </Button>

              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <Button
                    variant="subtle"
                    color="gray"
                    leftSection={<UserCircle2 size={18} />}
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
              variant={isActiveLink('/login') ? 'filled' : 'subtle'}
              color={isActiveLink('/login') ? 'pink' : 'gray'}
              leftSection={<LogIn size={18} />}
            >
              Login
            </Button>
          )}

          <Button
            variant="filled"
            color="pink"
            leftSection={<Phone size={18} />}
            onClick={() => setShowModalContact(true)}
            style={{
              background: 'linear-gradient(135deg, var(--color-botones) 0%, var(--color-botones-hover) 100%)',
            }}
          >
            Contacto
          </Button>
        </Group>

        {/* Menú móvil */}
        <Menu shadow="md" width={200} hiddenFrom="sm">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray" size="lg">
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
            >
              Contacto
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <ModalContacto
        show={showModalContact}
        handleClose={() => setShowModalContact(false)}
      />
    </>
  );
}

export default Header;