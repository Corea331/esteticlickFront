import { useState } from 'react';
import { useAlert } from '../context/alertcontext';
import { useAuth } from '../context/authcontext';

export const useImageUpload = () => {
  const { showSuccess, showError } = useAlert();
  const { user, updateUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  // Validar archivo localmente - CAMBIAR maxSizeMB DE 5 A 2
  const validateImage = (file, options = {}) => {
    const defaultOptions = {
      maxSizeMB: 2, // ← CAMBIADO DE 5 A 2
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
      ...options
    };

    const errors = [];

    if (!defaultOptions.allowedTypes.includes(file.type)) {
      errors.push(`Formato no permitido. Use: JPG, PNG, WebP, GIF, SVG`);
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

  // ============ SUBIR AVATAR ============
  const uploadAvatar = async (file) => {
    setIsUploading(true);
    
    try {
      // Validar archivo
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Crear FormData para Laravel
      const formData = new FormData();
      formData.append('image', file); // KEY IMPORTANTE: 'image'

      const token = sessionStorage.getItem('authToken');
      
      // Subir al backend Laravel
      const response = await fetch('https://esteticlick.alwaysdata.net/api/user/profile/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NO incluir 'Content-Type' - FormData lo maneja automáticamente
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen');
      }

      const result = await response.json();
      console.log('✅ Avatar upload response:', result); // Debug
      
      // Actualizar usuario en contexto
      if (updateUser) {
        const updatedUser = {
          ...user,
          image_url: result.image_url || result.avatar_url,
          avatar_url: result.avatar_url || result.image_url,
        };
        updateUser(updatedUser);
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

  // ============ ELIMINAR AVATAR ============
  const deleteAvatar = async () => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      // Eliminar del backend Laravel
      const response = await fetch('https://esteticlick.alwaysdata.net/api/user/profile/image', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la imagen');
      }

      const result = await response.json();
      console.log('✅ Avatar delete response:', result); // Debug
      
      // Actualizar usuario en contexto
      if (updateUser) {
        const updatedUser = {
          ...user,
          image_url: null,
          avatar_url: null,
        };
        updateUser(updatedUser);
      }

      showSuccess('Foto eliminada. Se mostrará el avatar por defecto');
      return result;

    } catch (error) {
      console.error('Error deleting avatar:', error);
      showError(error.message || 'Error al eliminar la foto de perfil');
      throw error;
    }
  };

  // ============ SUBIR IMAGEN DE TRABAJO ============
  const uploadWorkImage = async (file, businessId, metadata = {}) => {
    setIsUploading(true);
    
    try {
      // Validar archivo
      const validation = validateImage(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }

      // Crear FormData para Laravel
      const formData = new FormData();
      formData.append('image', file); // KEY: 'image'
      if (metadata.caption) {
        formData.append('caption', metadata.caption);
      }

      const token = sessionStorage.getItem('authToken');
      
      // Subir al backend Laravel
      const response = await fetch(`https://esteticlick.alwaysdata.net/api/owners/${businessId}/work-images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen');
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

  // ============ ELIMINAR IMAGEN DE TRABAJO ============
  const deleteWorkImage = async (businessId, imageUrl) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      // Eliminar del backend Laravel
      const response = await fetch(`https://esteticlick.alwaysdata.net/api/owners/${businessId}/work-images`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image_url: imageUrl }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar la imagen');
      }

      const result = await response.json();
      showSuccess('Imagen eliminada correctamente');
      return result;

    } catch (error) {
      console.error('Error deleting work image:', error);
      showError(error.message || 'Error al eliminar la imagen');
      throw error;
    }
  };

  // ============ VERIFICAR PERMISOS ============
  const checkImagePermissions = async (businessId) => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`https://esteticlick.alwaysdata.net/api/owners/${businessId}/image-permissions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error checking permissions:', error);
      return null;
    }
  };

  // ============ UTILIDADES ============
  const isCustomImage = (imageUrl) => {
    if (!imageUrl) return false;

    // Verificar si es imagen por defecto (DiceBear)
    const isDefaultAvatar = 
      imageUrl.includes('api.dicebear.com') ||
      imageUrl.includes('dicebear') ||
      imageUrl.includes('avatars') || // Solo si viene de DiceBear
      (imageUrl.includes('seed=') && imageUrl.includes('dicebear'));
    
    // Si es DiceBear, no es custom
    if (isDefaultAvatar) return false;

    // Cualquier otra url se considera custom
    return true;
  };

  const getAvatarUrl = (userData = user) => {
    if (!userData) return null;
    
    // Prioridad: image_url personalizada de Laravel Storage
    if (userData.image_url && isCustomImage(userData.image_url)) {
      return userData.image_url;
    }

    // Prioridad 2: avatar_url de Laravel Storage
    if (userData.avatar_url && isCustomImage(userData.avatar_url)) {
      return userData.avatar_url;
    }

    // Prioridad 3: profile_image del accessor (backend lo devuelve)
    if (userData.profile_image) {
      return userData.profile_image;
    }
    
    // Prioridad 4: image_url aunque sea DiceBear
    if (userData.image_url) {
      return userData.image_url;
    }
    
    // Prioridad 5: avatar_url aunque sea DiceBear
    if (userData.avatar_url) {
      return userData.avatar_url;
    }
    
    // Fallback: Generar uno por email (como en el backend)
    if (userData.email) {
      const emailHash = md5(strtolower(trim(userData.email)));
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailHash}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    }
    
    return null;
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