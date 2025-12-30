import AvatarUploader from '../../avataruploader/avataruploader.jsx';
import './profileavatar.css';

const ProfileAvatar = ({ currentAvatar, onUploadComplete, onCancel }) => {
  return (
    <div className="profile-avatar-container">
      <div className="profile-avatar-header">
        <h4>Cambiar Avatar</h4>
        <p className="text-muted">Sube una nueva foto de perfil</p>
      </div>

      <div className="profile-avatar-content">
        <AvatarUploader
          currentAvatar={currentAvatar}
          onUploadComplete={onUploadComplete}
        />
        
        <div className="profile-avatar-actions">
          <button
            className="btn btn-outline-secondary"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileAvatar;