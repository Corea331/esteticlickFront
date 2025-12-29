import { useState } from 'react';
import { useAlert } from '../context/alertcontext';
import { useAuth } from '../context/authcontext';

export const useImageUpload = () => {
  const { showSuccess, showError } = useAlert();
  const { user, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Validar archivo localmente
  const validateImage = (file, options = {}) => {
    const defaultOptions = {
      maxSizeMB: 5,
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      ...options
    };

    const errors = [];

    if (!defaultOptions.allowedTypes.includes(file.type)) {
      errors.push(`Formato no permitido. Use: JPG, PNG, WebP`);
    }

    const maxSizeBytes = defaultOptions.maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      errors.push(`Tamaño máximo: ${defaultOptions.maxSizeMB}MB`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
        sizeMB: (file.size / (1024 * 1024)).toFixed(2),
        extension: file.name.split('.').pop().toLowerCase()
      }
    };
  };

  // Subir imagen a Vercel Blob
  const uploadToBlob = async (file, path) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) {
      throw new Error('Token de Vercel Blob no configurado');
    }

    const baseUrl = 'https://3ula0dbwdyebwbnd.public.blob.vercel-storage.com';

    console.log('📤 Subiendo a:', `${baseUrl}/${path}`);

    const response = await fetch(`${baseUrl}/${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': file.type || 'application/octet-stream',
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error Vercel Blob: ${errorText}`);
    }

    const blobData = await response.json();
    return blobData.url.replace('blob.vercel-storage.com', 'public.blob.vercel-storage.com');
  };

  // Generar path organizado para avatar
  const getAvatarPath = (userData, fileName) => {
    const userId = userData.id;
    const userType = userData.user_type;
    const businessId = userData.owner?.id || userData.tenant_roles?.[0]?.owner_id;
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = fileName.split('.').pop().toLowerCase();

    if (userType === 'admin') {
      return `admins/${userId}/avatar-${timestamp}-${randomSuffix}.${extension}`;
    } else if (userType === 'owner' && businessId) {
      return `businesses/${businessId}/avatars/owner-${userId}-${timestamp}-${randomSuffix}.${extension}`;
    } else if ((userType === 'tenant_editor' || userType === 'tenant_staff') && businessId) {
      const roleFolder = userType === 'tenant_editor' ? 'editors' : 'staff';
      return `businesses/${businessId}/${roleFolder}/${userId}/avatar-${timestamp}-${randomSuffix}.${extension}`;
    } else {
      return `users/${userId}/avatar-${timestamp}-${randomSuffix}.${extension}`;
    }
  };

  // Generar path para imágenes de trabajo
  const getWorkImagePath = (businessId, fileName) => {
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const name = fileName.replace(/\.[^/.]+$/, ""); // Remover extensión
    const extension = fileName.split('.').pop().toLowerCase();
    return `businesses/${businessId}/work-images/${name}-${timestamp}-${randomSuffix}.${extension}`;
  };

  // Subir avatar
  const uploadAvatar = async (file) => {
    setIsUploading(true);
    
    try {
      // Validar archivo
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Generar path y subir a Vercel Blob
      const blobPath = getAvatarPath(user, file.name);
      const blobUrl = await uploadToBlob(file, blobPath);

      // Guardar URL en backend
      const response = await fetch('/api/user/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: blobUrl }),
      });

      if (!response.ok) {
        // Si falla el backend, eliminar de Blob
        try {
          await deleteFromBlob(blobPath);
        } catch (blobError) {
          console.error('Error eliminando archivo huérfano:', blobError);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar en el sistema');
      }

      const result = await response.json();
      
      // Actualizar usuario en contexto
      if (updateUser) {
        updateUser(result.user);
      }

      showSuccess('Foto de perfil actualizada correctamente');
      return result;

    } catch (error) {
      console.error('Error uploading avatar:', error);
      showError(error.message || 'Error al subir la foto de perfil');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Eliminar avatar
  const deleteAvatar = async (imageUrl) => {
    try {
      // Primero eliminar del backend
      const response = await fetch('/api/user/profile/image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar del sistema');
      }

      const result = await response.json();
      
      // Si hay imagen personalizada, eliminar de Blob
      if (imageUrl && isCustomImage(imageUrl)) {
        try {
          const path = extractBlobPath(imageUrl);
          if (path) {
            await deleteFromBlob(path);
          }
        } catch (blobError) {
          console.warn('No se pudo eliminar de Vercel Blob:', blobError);
        }
      }

      // Actualizar usuario en contexto
      if (updateUser) {
        updateUser(result.user);
      }

      showSuccess('Foto eliminada. Se mostrará el avatar por defecto');
      return result;

    } catch (error) {
      console.error('Error deleting avatar:', error);
      showError(error.message || 'Error al eliminar la foto de perfil');
      throw error;
    }
  };

  // Subir imagen de trabajo
  const uploadWorkImage = async (file, businessId, metadata = {}) => {
    setIsUploading(true);
    
    try {
      // Validar archivo
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Verificar permisos
      const permissions = await checkImagePermissions(businessId);
      if (!permissions.can_upload) {
        throw new Error('No tienes permisos para subir imágenes');
      }

      // Generar path y subir a Vercel Blob
      const blobPath = getWorkImagePath(businessId, file.name);
      const blobUrl = await uploadToBlob(file, blobPath);

      // Guardar URL en backend
      const response = await fetch(`/api/owners/${businessId}/work-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_url: blobUrl,
          caption: metadata.caption || '',
          title: metadata.title || file.name.replace(/\.[^/.]+$/, "")
        }),
      });

      if (!response.ok) {
        // Si falla el backend, eliminar de Blob
        try {
          await deleteFromBlob(blobPath);
        } catch (blobError) {
          console.error('Error eliminando archivo huérfano:', blobError);
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar en el sistema');
      }

      const result = await response.json();
      showSuccess('Imagen subida correctamente');
      return result;

    } catch (error) {
      console.error('Error uploading work image:', error);
      showError(error.message || 'Error al subir la imagen');
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Eliminar imagen de trabajo
  const deleteWorkImage = async (businessId, imageUrl, imageId = null) => {
    try {
      const response = await fetch(`/api/owners/${businessId}/work-images`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar del sistema');
      }

      const result = await response.json();
      
      // Eliminar de Blob
      if (imageUrl) {
        try {
          const path = extractBlobPath(imageUrl);
          if (path) {
            await deleteFromBlob(path);
          }
        } catch (blobError) {
          console.warn('No se pudo eliminar de Vercel Blob:', blobError);
        }
      }

      showSuccess('Imagen eliminada correctamente');
      return result;

    } catch (error) {
      console.error('Error deleting work image:', error);
      showError(error.message || 'Error al eliminar la imagen');
      throw error;
    }
  };

  // Verificar permisos de imágenes
  const checkImagePermissions = async (businessId) => {
    try {
      const response = await fetch(`/api/owners/${businessId}/image-permissions`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return null;
    }
  };

  // Eliminar de Vercel Blob
  const deleteFromBlob = async (path) => {
    const token = import.meta.env.VITE_BLOB_READ_WRITE_TOKEN;
    
    if (!token) return;

    const response = await fetch(`https://blob.vercel-storage.com/${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('No se pudo eliminar de Vercel Blob');
    }
  };

  // Extraer path de URL de Blob
  const extractBlobPath = (url) => {
    if (!url.includes('vercel-storage.com')) return null;
    
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remover slash inicial
    } catch (error) {
      return null;
    }
  };

  // Verificar si es imagen personalizada (no DiceBear)
  const isCustomImage = (imageUrl) => {
    if (!imageUrl) return false;
    return !imageUrl.includes('dicebear.com') && !imageUrl.includes('api.dicebear.com');
  };

  // Obtener URL del avatar
  const getAvatarUrl = (userData = user) => {
    if (!userData) return null;
    
    // Prioridad: image_url personalizada
    if (userData.image_url && isCustomImage(userData.image_url)) {
      return userData.image_url;
    }
    
    // Avatar por defecto del backend
    return userData.image_url;
  };

  return {
    // Estados
    isUploading,
    
    // Acciones
    uploadAvatar,
    deleteAvatar,
    uploadWorkImage,
    deleteWorkImage,
    checkImagePermissions,
    
    // Utilidades
    validateImage,
    isCustomImage,
    getAvatarUrl,
    
    // Información del usuario
    user,
    userType: user?.user_type,
    businessId: user?.owner?.id || user?.tenant_roles?.[0]?.owner_id
  };
};