import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Box,
  LoadingOverlay,
  Title,
  Text,
  Button,
  Alert,
  Paper,
  Stack,
  Group
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  AlertCircle,
  RefreshCw,
  User,
  ArrowLeft
} from 'lucide-react';
import { apiRequest } from '../../apis/apicore';
import { useAuth } from '../../context/authcontext';
import { useImageUpload } from '../../hooks/useimageupload';
import { 
  ProfileAvatar, 
  ProfileEdit, 
  ProfileInfo, 
  ProfileLayout, 
  ProfileSidebar, 
} from '../../components/profile';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  
  const { user: authUser, updateUser } = useAuth();
  const { getAvatarUrl } = useImageUpload();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 992px)');

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        if (authUser) {
          setProfile(authUser);
        } else {
          const userData = await apiRequest('/user');
          setProfile(userData);
        }
      } catch (error) {
        console.error('Error cargando perfil:', error);
        setError(error.message || 'No se pudo cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      setProfile(authUser);
      setIsLoading(false);
    } else {
      loadProfile();
    }
  }, [authUser]);

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const refetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await apiRequest('/user');
      setProfile(userData);
      
      if (updateUser) {
        updateUser(userData);
      }
    } catch (error) {
      console.error('Error recargando perfil:', error);
      setError(error.message || 'Error al recargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container size="xl" py="xl">
        <Box style={{ height: '50vh' }}>
          <LoadingOverlay 
            visible={isLoading} 
            zIndex={1000} 
            overlayProps={{ radius: "sm", blur: 2 }}
            loaderProps={{ type: 'dots' }}
          />
        </Box>
      </Container>
    );
  }

  if (error && !profile) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" style={{ height: '50vh' }}>
          <Alert 
            icon={<AlertCircle size={20} />}
            title="Error"
            color="red"
            variant="light"
            w={isMobile ? '100%' : 400}
          >
            <Text ta="center">{error}</Text>
          </Alert>
          <Button
            onClick={refetchProfile}
            leftSection={<RefreshCw size={16} />}
            variant="light"
            mt="md"
          >
            Reintentar
          </Button>
        </Stack>
      </Container>
    );
  }

  if (!profile && !isLoading) {
    return (
      <Container size="xl" py="xl">
        <Stack align="center" justify="center" style={{ height: '50vh' }}>
          <Text size="lg" c="dimmed" ta="center">
            No se encontraron datos del perfil
          </Text>
          <Button
            onClick={refetchProfile}
            leftSection={<User size={16} />}
            variant="light"
          >
            Cargar datos
          </Button>
        </Stack>
      </Container>
    );
  }

  const currentAvatar = getAvatarUrl(profile);

  const handleProfileUpdate = () => {
    refetchProfile();
    setActiveTab('info');
  };

  const handleAvatarUpdate = () => {
    refetchProfile();
    setActiveTab('info');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <ProfileInfo 
            profile={profile}
            formatDate={formatDate}
            onEdit={() => setActiveTab('edit')}
          />
        );
      
      case 'edit':
        return (
          <ProfileEdit
            profile={profile}
            onSuccess={handleProfileUpdate}
            onCancel={() => setActiveTab('info')}
          />
        );
      
      case 'avatar':
        return (
          <ProfileAvatar
            currentAvatar={currentAvatar}
            onUploadComplete={handleAvatarUpdate}
            onCancel={() => setActiveTab('info')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <Container size="xl" py={isMobile ? 'md' : 'xl'}>
      {/* Header de la página */}
      <Box mb={isMobile ? 'lg' : 'xl'}>
        <Title order={1} size={isMobile ? 'h3' : 'h2'} mb="xs">
          Mi Perfil
        </Title>
        <Text size="sm" c="dimmed">
          Administra tu información personal
        </Text>
      </Box>

      {/* Contenedor principal con sidebar y layout */}
      <Grid gutter={isMobile ? 'md' : 'lg'}>
        {/* Sidebar a la izquierda */}
        <Grid.Col 
          span={{ 
            base: 12, 
            md: 4,
            lg: 3 
          }}
        >
          <Box
            pos={isTablet ? 'static' : 'sticky'}
            top={isTablet ? 0 : '1rem'}
          >
            <ProfileSidebar
              profile={profile}
              currentAvatar={currentAvatar}
              formatDate={formatDate}
            />
          </Box>
        </Grid.Col>

        {/* Layout con tabs a la derecha */}
        <Grid.Col 
          span={{ 
            base: 12, 
            md: 8,
            lg: 9 
          }}
        >
          <Paper
            withBorder
            radius="lg"
            shadow="sm"
            style={{
              minHeight: isMobile ? 400 : 500,
              overflow: 'hidden'
            }}
          >
            <Box p={isMobile ? 'md' : 'lg'}>
              <ProfileLayout
                activeTab={activeTab}
                onTabChange={setActiveTab}
              >
                <Box pt="md" pb="xl">
                  {renderTabContent()}
                </Box>
              </ProfileLayout>
            </Box>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default Profile;