import { useState, useEffect } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageValidateSize from 'filepond-plugin-image-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import { 
  Image, Upload, Trash2, Eye, Building, AlertCircle, 
  CheckCircle, XCircle, Users, Edit, User, Info
} from 'lucide-react';
import { useImageUpload } from '../hooks/useimageupload';

registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImageEdit
);

const WorkImageUploader = ({ businessId, businessName, maxImages = 20, onImagesUpdate }) => {
  const { uploadWorkImage, deleteWorkImage, isUploading, checkImagePermissions, user } = useImageUpload();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState(null);
  const [filepondFiles, setFilepondFiles] = useState([]);

  // Cargar imágenes y permisos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Cargar imágenes
        const imagesResponse = await fetch(`/api/owners/${businessId}/work-images`);
        if (imagesResponse.ok) {
          const data = await imagesResponse.json();
          setImages(data.work_images || []);
        }

        // Cargar permisos
        const perms = await checkImagePermissions(businessId);
        setPermissions(perms);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (businessId) {
      loadData();
    }
  }, [businessId, checkImagePermissions]);

  // Notificar actualización
  useEffect(() => {
    if (onImagesUpdate) {
      onImagesUpdate(images);
    }
  }, [images, onImagesUpdate]);

  // Configuración de FilePond
  const pondConfig = {
    allowMultiple: true,
    maxFiles: maxImages - images.length,
    maxParallelUploads: 3,
    name: 'work_images',
    labelIdle: 'Arrastra y suelta tus imágenes o <span class="filepond--label-action">selecciona</span>',
    labelFileProcessing: 'Subiendo...',
    labelFileProcessingComplete: 'Subida completa',
    labelFileProcessingError: 'Error al subir',
    labelTapToCancel: 'Toca para cancelar',
    labelTapToRetry: 'Toca para reintentar',
    acceptedFileTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    maxFileSize: '5MB',
    imagePreviewHeight: 150,
    stylePanelLayout: 'integrated',
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
      const result = await uploadWorkImage(file.file, businessId, {
        title: file.filename || file.file.name,
        caption: ''
      });
      
      if (result?.work_images) {
        setImages(result.work_images);
      }
      
      file.setMetadata('uploaded', true);
    } catch (err) {
      file.setMetadata('uploadError', err.message);
    }
  };

  // Manejar eliminación de imagen
  const handleDeleteImage = async (imageUrl) => {
    try {
      await deleteWorkImage(businessId, imageUrl);
      setImages(prev => prev.filter(img => img.url !== imageUrl));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Obtener etiqueta de rol
  const getRoleLabel = (role) => {
    switch(role) {
      case 'owner': return { label: 'Dueño', icon: Building, color: 'primary' };
      case 'editor': return { label: 'Editor', icon: Edit, color: 'success' };
      case 'staff': return { label: 'Staff', icon: Users, color: 'info' };
      default: return { label: 'Usuario', icon: User, color: 'secondary' };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="work-image-uploader">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1 d-flex align-items-center">
            <Image className="me-2" size={24} />
            Portafolio de {businessName}
          </h4>
          <small className="text-muted">
            Imágenes de trabajo y proyectos
          </small>
        </div>
        
        <div className="text-end">
          <div className="badge bg-light text-dark">
            {images.length} / {maxImages} imágenes
          </div>
        </div>
      </div>

      {/* Información de permisos */}
      {permissions && (
        <div className="alert alert-light mb-4">
          <div className="d-flex align-items-center">
            <Info size={18} className="me-2 text-info flex-shrink-0" />
            <div>
              <div className="d-flex flex-wrap gap-3 mb-2">
                <span className={`badge ${permissions.can_upload ? 'bg-primary' : 'bg-secondary'}`}>
                  <Upload size={12} className="me-1" /> Subir
                </span>
                <span className={`badge ${permissions.can_delete ? 'bg-danger' : 'bg-secondary'}`}>
                  <Trash2 size={12} className="me-1" /> Eliminar
                </span>
              </div>
              <small className="text-muted">
                {permissions.message || 'Los permisos dependen de tu rol en el negocio'}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* FilePond para subida (solo si tiene permisos) */}
      {permissions?.can_upload && images.length < maxImages && (
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-body">
            <h6 className="card-title mb-3 d-flex align-items-center">
              <Upload size={18} className="me-2" />
              Subir imágenes al portafolio
            </h6>
            
            <FilePond
              {...pondConfig}
              files={filepondFiles}
              onupdatefiles={setFilepondFiles}
              onprocessfile={handleFilePondProcess}
              server={{
                process: (fieldName, file, metadata, load, error, progress, abort) => {
                  // FilePond solo maneja preview
                  const controller = new AbortController();
                  
                  const interval = setInterval(() => {
                    progress(true, 1, 1024);
                  }, 1000);
                  
                  return {
                    abort: () => {
                      controller.abort();
                      clearInterval(interval);
                    }
                  };
                }
              }}
            />
            
            <div className="mt-3">
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted d-block mb-1">
                    <CheckCircle size={12} className="me-1 text-success" />
                    Formatos: JPG, PNG, WebP
                  </small>
                  <small className="text-muted d-block mb-1">
                    <CheckCircle size={12} className="me-1 text-success" />
                    Tamaño máximo: 5MB c/u
                  </small>
                </div>
                <div className="col-md-6">
                  <small className="text-muted d-block mb-1">
                    <CheckCircle size={12} className="me-1 text-success" />
                    Máx {maxImages} imágenes
                  </small>
                  <small className="text-muted d-block mb-1">
                    <XCircle size={12} className="me-1 text-danger" />
                    Límite estricto
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de imágenes */}
      <div className="mt-4">
        <h5 className="mb-3 d-flex align-items-center">
          <Image size={20} className="me-2" />
          Imágenes del portafolio ({images.length})
        </h5>
        
        {images.length === 0 ? (
          <div className="text-center py-5 border rounded bg-light">
            <Image size={48} className="text-muted mb-3" />
            <p className="text-muted mb-0">No hay imágenes en el portafolio</p>
            <small>Sube imágenes para mostrar el trabajo del negocio</small>
          </div>
        ) : (
          <div className="row g-3">
            {images.map((image, index) => {
              const roleInfo = getRoleLabel(image.user_role || image.tenant_role);
              const RoleIcon = roleInfo.icon;
              
              return (
                <div key={index} className="col-12 col-md-6 col-lg-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="position-relative">
                      <img
                        src={image.url}
                        alt={image.caption || 'Imagen de trabajo'}
                        className="card-img-top"
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      
                      {/* Badge de rol */}
                      <span className={`position-absolute top-0 start-0 m-2 badge bg-${roleInfo.color}`}>
                        <RoleIcon size={10} className="me-1" />
                        {roleInfo.label}
                      </span>
                      
                      {/* Botón eliminar */}
                      {permissions?.can_delete && (
                        <button
                          onClick={() => handleDeleteImage(image.url)}
                          disabled={isUploading}
                          className="position-absolute top-0 end-0 m-2 btn btn-sm btn-danger"
                          style={{ width: '32px', height: '32px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="card-body p-3">
                      {image.caption && (
                        <p className="card-text small text-muted mb-3">
                          {image.caption}
                        </p>
                      )}
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted d-block">
                            <User size={12} className="me-1" />
                            {image.uploaded_by}
                          </small>
                          <small className="text-muted">
                            {new Date(image.uploaded_at).toLocaleDateString()}
                          </small>
                        </div>
                        
                        <a 
                          href={image.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-outline-primary"
                        >
                          <Eye size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Advertencia de límite */}
      {images.length >= maxImages && (
        <div className="alert alert-warning mt-4">
          <AlertCircle size={18} className="me-2" />
          <strong>Límite alcanzado.</strong> Has subido el máximo de {maxImages} imágenes permitidas.
          <p className="mb-0 small mt-1">
            Elimina algunas imágenes antiguas para poder subir nuevas.
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkImageUploader;