import { useState, useEffect } from 'react';
import { apiRequest } from '../../apis/apicore';
import { useAuth } from '../../context/authcontext';
import { useImageUpload } from '../../hooks/useimageupload';
import ProfileLayout from '../../components/profile/components/profilelayout/profilelayout.jsx';
import ProfileSidebar from '../../components/profile/components/profilesidebar/profilesidebar.jsx';
import ProfileInfo from '../../components/profile/components/profileinfo/profileinfo.jsx';
import ProfileEdit from '../../components/profile/components/profileedit/profileedit.jsx';
import ProfileAvatar from '../../components/profile/components/profileavatar/profileavatar.jsx';
import './profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  
  const { user: authUser, updateUser } = useAuth();
  const { getAvatarUrl } = useImageUpload();

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Si ya tenemos datos del usuario en auth, usamos esos
        if (authUser) {
          setProfile(authUser);
        } else {
          // Si no, hacemos una petición para obtener datos completos
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
      
      // Actualizar también en el contexto de auth
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
      <div className="profile-page">
        <div className="container py-5">
          <div className="d-flex justify-content-center align-items-center min-vh-50">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-3 text-muted">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="container py-5">
          <div className="text-center">
            <h4 className="text-muted mb-3">{error}</h4>
            <button 
              onClick={refetchProfile} 
              className="btn btn-primary"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profile && !isLoading) {
    return (
      <div className="profile-page">
        <div className="container py-5">
          <div className="text-center">
            <h4 className="text-muted mb-3">No se encontraron datos del perfil</h4>
            <button 
              onClick={refetchProfile} 
              className="btn btn-primary"
            >
              Cargar datos
            </button>
          </div>
        </div>
      </div>
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
    <div className="profile-page">
      <div className="container py-4">
        {/* Header de la página */}
        <div className="mb-4">
          <h1 className="h2 mb-1">Mi Perfil</h1>
          <p className="text-muted mb-0">Administra tu información personal</p>
        </div>

        {/* Contenedor principal con sidebar y layout */}
        <div className="profile-container">
          {/* Sidebar a la izquierda */}
          <div className="profile-sidebar-wrapper">
            <ProfileSidebar
              profile={profile}
              currentAvatar={currentAvatar}
              formatDate={formatDate}
            />
          </div>

          {/* Layout con tabs a la derecha */}
          <div className="profile-layout-wrapper">
            <ProfileLayout
              activeTab={activeTab}
              onTabChange={setActiveTab}
            >
              {/* Solo el contenido del tab activo va aquí */}
              {renderTabContent()}
            </ProfileLayout>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;