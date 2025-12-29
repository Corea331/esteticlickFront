import { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { 
  User, 
  Trash2, 
  Image as ImageIcon 
} from 'lucide-react';
import { useImageUpload } from '../../hooks/useimageupload';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateType
);

const AvatarUploader = ({ onUploadComplete, compact = false }) => {
  const { 
    getAvatarUrl, 
    uploadAvatar, 
    deleteAvatar, 
    isUploading, 
    isCustomImage,
    user,
    userType
  } = useImageUpload();
  
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [filepondFiles, setFilepondFiles] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cargar avatar actual
  useEffect(() => {
    if (user) {
      const url = getAvatarUrl(user);
      setAvatarUrl(url);
    }
  }, [user, getAvatarUrl]);

  // Configuración de FilePond
  const pondConfig = {
    allowMultiple: false,
    maxFiles: 1,
    name: 'avatar',
    labelIdle: compact 
      ? '<span class="text-muted">Arrastra o selecciona</span>'
      : 'Arrastra y suelta tu foto o <span class="filepond--label-action">selecciona</span>',
    labelFileProcessing: 'Subiendo...',
    labelFileProcessingComplete: '¡Subida completa!',
    labelFileProcessingError: 'Error al subir',
    labelTapToCancel: 'Toca para cancelar',
    labelTapToRetry: 'Toca para reintentar',
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize: '5MB',
    imagePreviewHeight: 150,
    stylePanelLayout: compact ? 'compact circle' : 'integrated',
    styleLoadIndicatorPosition: 'center bottom',
    styleProgressIndicatorPosition: 'right bottom',
    styleButtonRemoveItemPosition: 'left bottom',
    styleButtonProcessItemPosition: 'right bottom',
  };

  // Manejar subida de FilePond
  const handleFilePondProcess = async (error, file) => {
    if (error) {
      console.error('FilePond error:', error);
      return;
    }
    
    try {
      const result = await uploadAvatar(file.file);
      
      if (result?.image_url || result?.user?.image_url) {
        const newUrl = result.image_url || result.user.image_url;
        setAvatarUrl(newUrl);
        if (onUploadComplete) {
          onUploadComplete(newUrl);
        }
      }
      
      file.setMetadata('uploaded', true);
    } catch (err) {
      file.setMetadata('uploadError', err.message);
    }
  };

  // Manejar eliminación de avatar
  const handleDeleteAvatar = async () => {
    if (!avatarUrl || !isCustomImage(avatarUrl)) return;
    
    try {
      await deleteAvatar(avatarUrl);
      setAvatarUrl(getAvatarUrl(user)); // Volver al default
      setFilepondFiles([]);
      setShowDeleteConfirm(false);
      
      if (onUploadComplete) {
        onUploadComplete(null);
      }
    } catch (error) {
      console.error('Error deleting avatar:', error);
    }
  };

  // Versión compacta
  if (compact) {
    return (
      <div className="avatar-uploader-compact">
        <div className="d-flex align-items-center">
          {/* Avatar preview */}
          <div className="position-relative me-3">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
            ) : (
              <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                  style={{ width: '60px', height: '60px' }}>
                <User size={24} className="text-secondary" />
              </div>
            )}
            
            {isCustomImage(avatarUrl) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle"
                style={{ width: '20px', height: '20px', padding: 0 }}
              >
                ×
              </button>
            )}
          </div>
          
          {/* FilePond compacto */}
          <div className="flex-grow-1">
            <FilePond
              {...pondConfig}
              files={filepondFiles}
              onupdatefiles={setFilepondFiles}
              onprocessfile={handleFilePondProcess}
              server={{
                process: () => {
                  return {
                    abort: () => {}
                  };
                }
              }}
            />
            
            <small className="text-muted d-block mt-1">
              JPG, PNG, WebP • Máx 5MB
            </small>
          </div>
        </div>
        
        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="alert alert-warning mt-2 p-2">
            <div className="d-flex justify-content-between align-items-center">
              <small>¿Eliminar foto de perfil?</small>
              <div>
                <button
                  onClick={handleDeleteAvatar}
                  className="btn btn-sm btn-danger me-1"
                >
                  Sí
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-sm btn-outline-secondary"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Versión completa
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h5 className="mb-0 d-flex align-items-center">
          <User size={20} className="me-2 text-primary" />
          Foto de Perfil
        </h5>
      </div>
      
      <div className="card-body">
        {/* Avatar actual */}
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            {avatarUrl ? (
              <img
                src={avatarUrl}
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
            <span className="position-absolute top-0 end-0 translate-middle badge bg-primary">
              {isCustomImage(avatarUrl) ? 'Personalizada' : 'Por defecto'}
            </span>
          </div>
          
          {userType && (
            <div className="mt-2">
              <small className="text-muted">
                Tipo: <span className="text-capitalize">{userType.replace('_', ' ')}</span>
              </small>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="alert alert-info mb-4">
          <div className="d-flex align-items-start">
            <div>
              <h6 className="mb-2">Información de subida</h6>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <small className="d-flex align-items-center">
                  <span className="text-success me-1">✓</span>
                  Formatos: JPG, PNG, WebP
                </small>
                <small className="d-flex align-items-center">
                  <span className="text-success me-1">✓</span>
                  Tamaño máximo: 5MB
                </small>
                <small className="d-flex align-items-center">
                  <span className="text-success me-1">✓</span>
                  Se guarda en Vercel Blob
                </small>
              </div>
              <small className="text-muted">
                Al eliminar tu foto, se mostrará el avatar por defecto generado por el sistema.
              </small>
            </div>
          </div>
        </div>

        {/* FilePond */}
        <div className="mb-4">
          <FilePond
            {...pondConfig}
            files={filepondFiles}
            onupdatefiles={setFilepondFiles}
            onprocessfile={handleFilePondProcess}
            server={{
              process: () => {
                return {
                  abort: () => {}
                };
              }
            }}
          />
        </div>

        {/* Controles adicionales */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {isCustomImage(avatarUrl) && (
              <button
                onClick={handleDeleteAvatar}
                disabled={isUploading}
                className="btn btn-outline-danger"
              >
                <Trash2 size={16} className="me-2" />
                Eliminar foto personalizada
              </button>
            )}
          </div>
          
          <div className="text-muted">
            <small>
              <ImageIcon size={14} className="me-1" />
              {isCustomImage(avatarUrl) ? 'Imagen personalizada' : 'Avatar por defecto'}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarUploader;