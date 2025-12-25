import { useState, useRef } from 'react';
import { 
  Upload, User, X, Trash2, Image as ImageIcon, Shield, Building, Users, Info
} from 'lucide-react';
import { useAvatar } from '../../hooks';
import { useAlert } from '../../context/alertcontext';

const AvatarUploader = ({ currentAvatar, onUploadComplete }) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const { 
    uploadAvatar, 
    deleteAvatar, 
    isUploading, 
    isDeleting, 
    isCustomAvatar,
    validateFile,
    getCurrentUserInfo 
  } = useAvatar();
  
  const { showError } = useAlert();
  
  const userInfo = getCurrentUserInfo();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (!file) return;

    // Validar archivo
    const validation = validateFile(file);
    if (!validation.isValid) {
      showError(validation.errors.join('. '));
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showError('Por favor seleccione una imagen');
      return;
    }

    try {
      const result = await uploadAvatar(selectedFile);
      
      if (onUploadComplete) {
        onUploadComplete(result.url);
      }
      
      resetForm();
      
    } catch (err) {
      console.error('Error uploading avatar:', err);
      resetForm();
    }
  };

  const handleRemoveAvatar = async () => {
    if (!currentAvatar) return;

    try {
      await deleteAvatar(currentAvatar);
      
      if (onUploadComplete) {
        onUploadComplete(null);
      }
      
      resetForm();
    } catch (err) {
      console.error('Error removing avatar:', err);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determinar si mostrar botón de eliminar
  const showDeleteButton = currentAvatar && isCustomAvatar(currentAvatar);

  // Obtener icono según tipo de usuario
  const getUserIcon = () => {
    switch(userInfo.userType) {
      case 'admin': return <Shield size={20} className="me-2 text-danger" />;
      case 'owner': return <Building size={20} className="me-2 text-primary" />;
      case 'staff': return <Users size={20} className="me-2 text-success" />;
      default: return <User size={20} className="me-2 text-secondary" />;
    }
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <div className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0 d-flex align-items-center">
            {getUserIcon()}
            Foto de Perfil
          </h5>
          <span className="badge bg-info">Vercel Blob</span>
        </div>
      </div>
      
      <div className="card-body">
        {/* Información del usuario */}
        <div className="alert alert-light mb-4">
          <div className="d-flex align-items-start">
            <Info size={16} className="me-2 text-primary mt-1 flex-shrink-0" />
            <div>
              <div className="d-flex align-items-center mb-1">
                <strong className="me-2">Tipo de usuario:</strong>
                <span className="badge bg-primary">{userInfo.userTypeLabel}</span>
              </div>
              
              {userInfo.businessId && (
                <div className="d-flex align-items-center mb-1">
                  <strong className="me-2">Negocio asociado:</strong>
                  <small className="text-muted">ID: {userInfo.businessId}</small>
                </div>
              )}
              
              <div className="mt-2">
                <small className="text-muted">
                  Tu avatar se organizará automáticamente en la carpeta correspondiente
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Avatar actual/preview */}
        <div className="mb-4 text-center">
          <div className="position-relative d-inline-block">
            {previewImage || currentAvatar ? (
              <img
                src={previewImage || currentAvatar}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
              />
            ) : (
              <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                  style={{ width: '150px', height: '150px' }}>
                <User size={64} className="text-secondary" />
              </div>
            )}
            
            {/* Badge de estado */}
            {currentAvatar && !previewImage && (
              <span className="position-absolute top-0 end-0 translate-middle badge bg-primary">
                {isCustomAvatar(currentAvatar) ? 'Personalizada' : 'Por defecto'}
              </span>
            )}
          </div>
        </div>

        {/* Información técnica */}
        <div className="alert alert-info mb-4">
          <div className="d-flex">
            <ImageIcon size={16} className="me-2 flex-shrink-0 mt-1" />
            <div>
              <small>
                <strong>Formatos permitidos:</strong> JPG, PNG, WebP<br />
                <strong>Tamaño máximo:</strong> 5MB<br />
                <strong>Ubicación automática:</strong> 
                {userInfo.businessId 
                  ? ` businesses/${userInfo.businessId}/` 
                  : ` ${userInfo.userType}s/${userInfo.userId}/`}
              </small>
            </div>
          </div>
        </div>

        {/* Controles de subida */}
        <div className="mb-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="form-control"
            disabled={isUploading || isDeleting}
          />
        </div>

        {/* Vista previa */}
        {previewImage && (
          <div className="mb-3 p-3 bg-light rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Vista previa:</small>
              <button
                onClick={handleCancel}
                className="btn btn-sm btn-outline-danger"
                disabled={isUploading || isDeleting}
              >
                <X size={16} />
              </button>
            </div>
            <div className="d-flex align-items-center">
              <img
                src={previewImage}
                alt="Preview"
                className="rounded me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div className="flex-grow-1">
                <p className="mb-1 small text-truncate">{selectedFile?.name}</p>
                <p className="mb-0 small text-muted">
                  {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB • 
                  {selectedFile?.type.split('/')[1].toUpperCase()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="d-flex gap-2">
          {selectedFile && (
            <button
              onClick={handleUpload}
              disabled={isUploading || isDeleting}
              className="btn btn-primary flex-grow-1"
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload size={16} className="me-2" />
                  Subir Foto
                </>
              )}
            </button>
          )}
          
          {showDeleteButton && !previewImage && (
            <button
              onClick={handleRemoveAvatar}
              className="btn btn-outline-danger"
              disabled={isUploading || isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="me-2" />
                  Eliminar
                </>
              )}
            </button>
          )}
        </div>

        {/* Información adicional */}
        <div className="mt-3">
          <small className="text-muted d-block">
            <strong>Nota para editores:</strong> Tu avatar será visible para los clientes del negocio donde trabajas.
          </small>
          <small className="text-muted d-block mt-1">
            Al eliminar tu foto, el sistema generará automáticamente un avatar por defecto basado en tu perfil.
          </small>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploader;