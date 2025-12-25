import { useState } from 'react';
import { useProfile } from '../../hooks';
import { useAvatar } from '../../hooks';
import ProfileLayout from '../../components/profile/components/profilelayout/profilelayout.jsx';
import ProfileSidebar from '../../components/profile/components/profilesidebar/profilesidebar.jsx';
import ProfileInfo from '../../components/profile/components/profileinfo/profileinfo.jsx';
import ProfileEdit from '../../components/profile/components/profileedit/profileedit.jsx';
import ProfileAvatar from '../../components/profile/components/profileavatar/profileavatar.jsx';
import './profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { profile, isProfileLoading, refetchProfile } = useProfile();
  const { getAvatarUrl } = useAvatar();

  const currentAvatar = getAvatarUrl(profile);

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isProfileLoading) {
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

  if (!profile && !isProfileLoading) {
    return (
      <div className="profile-page">
        <div className="container py-5">
          <div className="text-center">
            <h4 className="text-muted mb-3">No se pudo cargar el perfil</h4>
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
            onSuccess={() => {
              refetchProfile();
              setActiveTab('info');
            }}
            onCancel={() => setActiveTab('info')}
          />
        );
      
      case 'avatar':
        return (
          <ProfileAvatar
            currentAvatar={currentAvatar}
            onUploadComplete={() => {
              refetchProfile();
              setActiveTab('info');
            }}
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

        {/* Layout interno con tabs */}
        <ProfileLayout
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {/* Sidebar izquierda - Foto tipo fichero */}
          <ProfileSidebar
            profile={profile}
            currentAvatar={currentAvatar}
            formatDate={formatDate}
          />

          {/* Contenido principal - Cambia según tab activo */}
          <div className="profile-main-content">
            {renderTabContent()}
          </div>
        </ProfileLayout>
      </div>
    </div>
  );
};

export default Profile;