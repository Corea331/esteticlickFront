import { Edit } from 'lucide-react';
import './profileinfo.css';

const ProfileInfo = ({ profile, formatDate, onEdit }) => {
  if (!profile) return null;

  return (
    <div className="profile-info-details">
      <div className="profile-info-header">
        <h4>Información Personal</h4>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onEdit}
        >
          <Edit size={14} className="me-1" />
          Editar
        </button>
      </div>

      <div className="profile-info-grid">
        <div className="info-card">
          <div className="info-card-header">
            <h6>Datos Básicos</h6>
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-label">Nombre completo:</span>
              <span className="info-value">{profile.name}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Email:</span>
              <span className="info-value">{profile.email}</span>
            </div>
            {profile.phone && (
              <div className="info-row">
                <span className="info-label">Teléfono:</span>
                <span className="info-value">{profile.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <h6>Información de Cuenta</h6>
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-label">Miembro desde:</span>
              <span className="info-value">{formatDate(profile.created_at)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Última actualización:</span>
              <span className="info-value">{formatDate(profile.updated_at)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Estado:</span>
              <span className={`status-badge ${profile.is_active ? 'active' : 'inactive'}`}>
                {profile.is_active ? 'Activa' : 'Inactiva'}
              </span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <div className="info-card-header">
            <h6>Roles y Permisos</h6>
          </div>
          <div className="info-card-body">
            <div className="info-row">
              <span className="info-label">Roles asignados:</span>
              <div className="roles-container">
                {profile.roles?.map((role, index) => (
                  <span key={index} className="role-tag">
                    {role.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;