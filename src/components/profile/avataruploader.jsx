import { useState, useEffect, useRef } from 'react'; 
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { 
  User, 
  Trash2, 
  Image as ImageIcon,
  Upload,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useImageUpload } from '../../hooks/useimageupload';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateType
);

const AvatarUploader = ({ currentAvatar, onUploadComplete, compact = false }) => {
  const { 
    getAvatarUrl, 
    uploadAvatar, 
    deleteAvatar, 
    isUploading, 
    isCustomImage,
    user,
    userType
  } = useImageUpload();
  
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const pondRef = useRef(null);

  // Sincronizar avatarUrl con currentAvatar
  useEffect(() => {
    if (currentAvatar) {
      setAvatarUrl(currentAvatar);
    } else if (user) {
      const url = getAvatarUrl(user);
      setAvatarUrl(url);
    }
  }, [currentAvatar, user, getAvatarUrl]);

  // FUNCIÓN PARA MANEJAR SUBIDA
  const handleFileAdd = async (fileItem) => {
    setLocalUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      const file = fileItem.file;
      
      // Mostrar preview inmediatamente
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Subir al servidor usando el hook
      const result = await uploadAvatar(file);
      console.log('Resultado de uploadAvatar:', result);
      
      // Obtener la nueva URL de imagen
      const newUrl = result?.image_url || result?.avatar_url || result?.profile_image;
      if (newUrl) {
        setAvatarUrl(newUrl);
        setUploadSuccess(true);
        
        // Notificar al componente padre
        if (onUploadComplete) {
          setTimeout(() => {
            onUploadComplete(newUrl);
          }, 500);
        }
      }
      
    } catch (err) {
      console.error('Error en upload:', err);
      setUploadError(err.message || 'Error al subir la imagen');
    } finally {
      setLocalUploading(false);
      
      // IMPORTANTE: Limpiar FilePond después de procesar
      setTimeout(() => {
        if (pondRef.current) {
          pondRef.current.removeFile(fileItem.id);
        }
      }, 500);
    }
  };

  // CONFIGURACIÓN SIMPLIFICADA DE FILEPOND
  const pondConfig = {
    allowMultiple: false,
    maxFiles: 1,
    name: 'avatar',
    labelIdle: compact 
      ? '<span class="text-muted">Arrastra o selecciona</span>'
      : 'Arrastra y suelta tu foto o <span class="filepond--label-action">selecciona</span>',
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize: '2MB',
    imagePreviewHeight: 150,
    stylePanelLayout: compact ? 'compact circle' : 'integrated',
    
    // CONFIGURACIÓN CRÍTICA: Deshabilitar todo el servidor de FilePond
    server: false,
    
    // Solo usar onaddfile para capturar el archivo
    onaddfile: (error, fileItem) => {
      if (error) {
        setUploadError('Error al cargar el archivo: ' + error.message);
        return;
      }
      
      // Manejar la subida manualmente
      handleFileAdd(fileItem);
    },
    
    // Manejar error de carga
    onerror: (error) => {
      console.error('FilePond error:', error);
      setUploadError('Error con el archivo: ' + error.message);
    }
  };

  // Manejar eliminación de avatar
  const handleDeleteAvatar = async () => {
    if (!avatarUrl || !isCustomImage(avatarUrl)) return;
    
    try {
      setLocalUploading(true);
      const result = await deleteAvatar(); // No pasar parámetro
      console.log('Resultado de deleteAvatar:', result);
      
      // Obtener URL por defecto
      const defaultUrl = result?.profile_image || getAvatarUrl(user);
      setAvatarUrl(defaultUrl);
      setUploadSuccess(false);
      
      if (onUploadComplete) {
        setTimeout(() => {
          onUploadComplete(defaultUrl);
        }, 500);
      }
      
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Error deleting avatar:', error);
      setUploadError(error.message || 'Error al eliminar la imagen');
    } finally {
      setLocalUploading(false);
    }
  };

  // Obtener URL de avatar para mostrar
  const displayAvatarUrl = avatarUrl || getAvatarUrl(user);

  // Versión simplificada compacta
  if (compact) {
    return (
      <div className="avatar-uploader-compact">
        <div className="d-flex align-items-center">
          {/* Avatar preview */}
          <div className="position-relative me-3">
            {displayAvatarUrl ? (
              <img
                src={displayAvatarUrl}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAvatarUrl({ email: user?.email || 'default' });
                }}
              />
            ) : (
              <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                  style={{ width: '60px', height: '60px' }}>
                <User size={24} className="text-secondary" />
              </div>
            )}
            
            {displayAvatarUrl && isCustomImage(displayAvatarUrl) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle"
                style={{ width: '20px', height: '20px', padding: 0 }}
                disabled={localUploading || isUploading}
              >
                ×
              </button>
            )}
          </div>
          
          {/* FilePond simplificado */}
          <div className="flex-grow-1">
            <FilePond
              ref={pondRef}
              {...pondConfig}
              files={[]}
            />
            
            <small className="text-muted d-block mt-1">
              JPG, PNG, WebP • Máx 2MB
            </small>
          </div>
        </div>
        
        {/* Mensajes de estado */}
        {uploadError && (
          <div className="alert alert-danger mt-2 p-2">
            <AlertCircle size={14} className="me-2" />
            <small>{uploadError}</small>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="alert alert-success mt-2 p-2">
            <small>¡Imagen subida correctamente!</small>
          </div>
        )}
        
        {(localUploading || isUploading) && (
          <div className="alert alert-info mt-2 p-2">
            <div className="d-flex align-items-center">
              <Loader size={14} className="me-2 spinner-border spinner-border-sm" />
              <small>Procesando imagen...</small>
            </div>
          </div>
        )}
        
        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="alert alert-warning mt-2 p-2">
            <div className="d-flex justify-content-between align-items-center">
              <small>¿Eliminar foto de perfil?</small>
              <div>
                <button
                  onClick={handleDeleteAvatar}
                  className="btn btn-sm btn-danger me-1"
                  disabled={localUploading || isUploading}
                >
                  Sí
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="btn btn-sm btn-outline-secondary"
                  disabled={localUploading || isUploading}
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

  // Versión completa simplificada
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-white border-0">
        <h5 className="mb-0 d-flex align-items-center">
          <User size={20} className="me-2 text-primary" />
          Foto de Perfil
          {(localUploading || isUploading) && (
            <Loader size={16} className="ms-2 spinner-border spinner-border-sm text-primary" />
          )}
        </h5>
      </div>
      
      <div className="card-body">
        {/* Avatar actual */}
        <div className="text-center mb-4">
          <div className="position-relative d-inline-block">
            {displayAvatarUrl ? (
              <img
                src={displayAvatarUrl}
                alt="Avatar"
                className="rounded-circle border"
                style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAvatarUrl({ email: user?.email || 'default' });
                }}
              />
            ) : (
              <div className="rounded-circle border d-flex align-items-center justify-content-center bg-light"
                  style={{ width: '150px', height: '150px' }}>
                <User size={64} className="text-secondary" />
              </div>
            )}
            
            {/* Badge de estado */}
            <span className="position-absolute top-0 end-0 translate-middle badge bg-primary">
              {displayAvatarUrl && isCustomImage(displayAvatarUrl) ? 'Personalizada' : 'Por defecto'}
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

        {/* Mensajes de estado */}
        {uploadError && (
          <div className="alert alert-danger mb-3">
            <div className="d-flex align-items-center">
              <AlertCircle size={16} className="me-2" />
              <span>{uploadError}</span>
            </div>
          </div>
        )}
        
        {uploadSuccess && (
          <div className="alert alert-success mb-3">
            <div className="d-flex align-items-center">
              <Upload size={16} className="me-2" />
              <span>¡Imagen subida correctamente!</span>
            </div>
          </div>
        )}

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
                  Tamaño máximo: 2MB
                </small>
              </div>
              <small className="text-muted">
                Al eliminar tu foto, se mostrará el avatar por defecto generado por el sistema.
              </small>
            </div>
          </div>
        </div>

        {/* FilePond simplificado */}
        <div className="mb-4">
          <FilePond
            ref={pondRef}
            {...pondConfig}
            files={[]}
          />
          
          <div className="text-center mt-2">
            <small className="text-muted">
              Selecciona una imagen para subir
            </small>
          </div>
        </div>

        {/* Controles adicionales */}
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {displayAvatarUrl && isCustomImage(displayAvatarUrl) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={localUploading || isUploading}
                className="btn btn-outline-danger"
              >
                <Trash2 size={16} className="me-2" />
                {localUploading || isUploading ? 'Procesando...' : 'Eliminar foto personalizada'}
              </button>
            )}
          </div>
          
          <div className="text-muted">
            <small>
              <ImageIcon size={14} className="me-1" />
              {displayAvatarUrl && isCustomImage(displayAvatarUrl) ? 'Imagen personalizada' : 'Avatar por defecto'}
            </small>
          </div>
        </div>

        {/* Confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar eliminación</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={localUploading || isUploading}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que quieres eliminar tu foto de perfil personalizada?</p>
                  <p className="text-muted small">Se mostrará el avatar por defecto.</p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={localUploading || isUploading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={handleDeleteAvatar}
                    disabled={localUploading || isUploading}
                  >
                    {(localUploading || isUploading) ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Eliminando...
                      </>
                    ) : 'Sí, eliminar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;