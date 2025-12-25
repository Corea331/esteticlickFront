import ProfileForm from '../../profileform';
import './profileedit.css';

const ProfileEdit = ({ profile, onSuccess, onCancel }) => {
  return (
    <div className="profile-edit-container">
      <div className="profile-edit-header">
        <h4>Editar Información Personal</h4>
        <p className="text-muted">Actualiza tus datos personales</p>
      </div>

      <div className="profile-edit-content">
        <ProfileForm
          initialData={profile}
          onSuccess={onSuccess}
        />
        
        <div className="profile-edit-actions">
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

export default ProfileEdit;