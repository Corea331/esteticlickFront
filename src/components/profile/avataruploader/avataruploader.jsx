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
import { useImageUpload } from '../../../hooks/useimageupload.js';
import { useImageConverter } from '../../../hooks/index.js';
import ImageConverterModal from '../../imageconverter/imageconvertermodal.jsx';
import './avataruploader.css';

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

  const imageConverter = useImageConverter();
  const [avatarUrl, setAvatarUrl] = useState(currentAvatar);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [localUploading, setLocalUploading] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
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

  // Manejar subida con conversión
  const handleFileWithConversion = async (file) => {
    setLocalUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    
    try {
      // Verificar si necesita conversión
      if (imageConverter.needsConversion(file)) {
        // Guardar archivo pendiente y abrir modal
        setPendingFile(file);
        
        // Abrir modal de conversión
        await imageConverter.openConverter(file, {
          maxWidth: 800,
          maxHeight: 800,
          quality: 80,
          format: 'webp'
        });
        
        // El modal manejará el resto
        return;
      }
      
      // Si no necesita conversión, subir directamente
      await processFileUpload(file);
      
    } catch (error) {
      console.error('Error en subida:', error);
      setUploadError(error.message || 'Error al procesar la imagen');
    } finally {
      if (!imageConverter.needsConversion(file)) {
        setLocalUploading(false);
      }
    }
  };

  // Procesar subida después de conversión
  useEffect(() => {
    const processAfterConversion = async () => {
      if (!imageConverter.isOpen && pendingFile) {
        // El modal se cerró, verificar resultado
        if (imageConverter.conversionResult) {
          try {
            // Usar archivo convertido
            await processFileUpload(imageConverter.conversionResult.converted.file);
          } catch (error) {
            setUploadError(error.message || 'Error al subir la imagen convertida');
          }
        } else {
          // Usuario canceló, usar archivo original
          await processFileUpload(pendingFile);
        }
        
        setPendingFile(null);
        setLocalUploading(false);
      }
    };
    
    processAfterConversion();
  }, [imageConverter.isOpen, pendingFile, imageConverter.conversionResult]);

  // Función para procesar subida (común)
  const processFileUpload = async (file) => {
    try {
      const result = await uploadAvatar(file);
      
      if (result?.image_url) {
        const newUrl = result.image_url;
        setAvatarUrl(newUrl);
        setUploadSuccess(true);
        
        if (onUploadComplete) {
          setTimeout(() => {
            onUploadComplete(newUrl);
          }, 500);
        }
      }
      
    } catch (err) {
      console.error('Error en upload:', err);
      setUploadError(err.message || 'Error al subir la imagen');
      throw err;
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
    acceptedFileTypes: ['image/*'],  // ACEPTA CUALQUIER IMAGEN
    maxFileSize: '10MB',  // AUMENTADO A 10MB
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
      
      // Usar conversión inteligente
      handleFileWithConversion(fileItem.file);

      // Limpiar FilePond usando el ref
      setTimeout(() => {
        if (pondRef.current) {
          pondRef.current.removeFile(fileItem.id);
        }
      }, 100);
    },
    
    // Manejar error de carga
    onerror: (error) => {
      setUploadError('Error con el archivo: ' + error.message);
    }
  };

  // Manejar eliminación de avatar
  const handleDeleteAvatar = async () => {
    if (!avatarUrl || !isCustomImage(avatarUrl)) return;
    
    try {
      setLocalUploading(true);
      const result = await deleteAvatar(); // No pasar parámetro
      
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
      setUploadError(error.message || 'Error al eliminar la imagen');
    } finally {
      setLocalUploading(false);
    }
  };

  // Obtener URL de avatar para mostrar
  const displayAvatarUrl = avatarUrl || getAvatarUrl(user);

  // Renderizar modal de conversión
  const renderConverterModal = () => {
    if (imageConverter.isOpen) {
      return <ImageConverterModal converter={imageConverter} />;
    }
    return null;
  };

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
                className="avatar-image-compact"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAvatarUrl({ email: user?.email || 'default' });
                }}
              />
            ) : (
              <div className="avatar-default-compact">
                <User className="avatar-icon-compact" />
              </div>
            )}
            
            {displayAvatarUrl && isCustomImage(displayAvatarUrl) && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn btn-sm btn-danger avatar-delete-btn-compact"
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
              Cualquier imagen • Máx 10MB • Se convertirá automáticamente
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

        {/* Modal de conversión */}
        {renderConverterModal()}
      </div>
    );
  }

  // Versión completa simplificada
  return (
    <>
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
                  className="avatar-image-large"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getAvatarUrl({ email: user?.email || 'default' });
                  }}
                />
              ) : (
                <div className="avatar-default-large">
                  <User className="avatar-icon-large" />
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
                    Formatos: Cualquier imagen (JPEG, PNG, WebP, HEIC, etc.)
                  </small>
                  <small className="d-flex align-items-center">
                    <span className="text-success me-1">✓</span>
                    Tamaño máximo: 10MB (se optimizará automáticamente)
                  </small>
                  <small className="d-flex align-items-center">
                    <span className="text-success me-1">✓</span>
                    Conversión automática a WebP
                  </small>
                </div>
                <small className="text-muted">
                  Las imágenes grandes o en formatos pesados (HEIC, BMP, TIFF) se convertirán automáticamente a WebP para optimizar espacio.
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
                Selecciona una imagen para subir (se optimizará automáticamente si es necesario)
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

          {/* Modal de confirmación de eliminación */}
          {showDeleteConfirm && (
            <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
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

      {/* Modal de conversión */}
      {renderConverterModal()}
    </>
  );
};

export default AvatarUploader;