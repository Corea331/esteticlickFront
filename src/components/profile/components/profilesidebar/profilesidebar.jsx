import { Mail, Phone, Calendar, Shield } from 'lucide-react';
import './profilesidebar.css';

const ProfileSidebar = ({ profile, currentAvatar, formatDate }) => {
  if (!profile) return null;

  return (
    <div className="profile-sidebar">
      {/* Foto tipo fichero */}
      <div className="profile-file-card">
        <div className="profile-file-header">
          <span className="profile-file-icon">📁</span>
          <span className="profile-file-title">Perfil</span>
        </div>
        
        <div className="profile-file-content">
          <div className="profile-avatar-container">
            <img
              src={currentAvatar}
              alt={`Avatar de ${profile.name}`}
              className="profile-avatar"
              loading="lazy"
            />
          </div>
          
          <div className="profile-basic-info">
            <h5 className="profile-name">{profile.name}</h5>
            <p className="profile-email">{profile.email}</p>
            
            <div className="profile-roles">
              {profile.roles?.map((role, index) => (
                <span key={index} className="profile-role-badge">
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Información resumida */}
      <div className="profile-info-summary">
        <div className="info-summary-item">
          <Mail size={16} className="me-2" />
          <span>{profile.email}</span>
        </div>
        
        {profile.phone && (
          <div className="info-summary-item">
            <Phone size={16} className="me-2" />
            <span>{profile.phone}</span>
          </div>
        )}
        
        <div className="info-summary-item">
          <Calendar size={16} className="me-2" />
          <span>Miembro desde: {formatDate(profile.created_at)}</span>
        </div>
        
        <div className="info-summary-item">
          <Shield size={16} className="me-2" />
          <span>
            Estado: 
            <span className={`status-badge ${profile.is_active ? 'active' : 'inactive'}`}>
              {profile.is_active ? 'Activo' : 'Inactivo'}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;