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
      maxSizeMB: 2,
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

  // Función para generar un hash simple del email
  const generateEmailHash = (email) => {
    if (!email) return 'default';
    
    // Normalizar el email
    const normalizedEmail = email.toLowerCase().trim();

    // Hacerlo URL-safe
    return normalizedEmail
    .replace(/@/g, '-at-')
    .replace(/\./g, '-dot-')
    .replace(/[^a-zA-Z0-9-_]/g, '')
    .substring(0, 50)
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
      //console.log('✅ Avatar upload response:', result); // Debug
      
      // Actualizar usuario en contexto
      if (updateUser) {
        const updatedUser = {
          ...user,
          image_url: result.image_url || result.avatar_url,
          avatar_url: result.avatar_url || result.image_url,
          profile_image: result.profile_image || result.image_url || result.avatar_url,
        };
        updateUser(updatedUser);
        //console.log('✅ Usuario actualizado (upload):', updatedUser);
      }

      showSuccess('Foto de perfil actualizada correctamente');
      return result;

    } catch (error) {
      //console.error('Error uploading avatar:', error);
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
      //console.log('✅ Avatar delete response:', result); // Debug
      
      // Actualizar usuario en contexto
      if (updateUser) {
        const updatedUser = {
          ...user,
          image_url: null,
          avatar_url: null,
          profile_image: result.profile_image || null,
        };
        updateUser(updatedUser);
        //console.log('✅ Usuario actualizado (delete):', updatedUser);
      }

      showSuccess('Foto eliminada. Se mostrará el avatar por defecto');
      return result;

    } catch (error) {
      //console.error('Error deleting avatar:', error);
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
      //console.error('Error uploading work image:', error);
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
      //console.error('Error deleting work image:', error);
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
      //console.error('Error checking permissions:', error);
      return null;
    }
  };

  // ============ UTILIDADES ============
  const isCustomImage = (imageUrl) => {
    if (!imageUrl) return false;

    // Verificar si es imagen por defecto (DiceBear)
    const isDiceBar = imageUrl.includes('api.dicebear.com') || imageUrl.includes('dicebear') || (imageUrl.includes('seed=') && imageUrl.includes('dicebear'));
    
    // Si es DiceBear, no es custom
    if(isDiceBar) {
      return false
    };

    // Si es de nuestro storage → SÍ es custom
    const isOurStorage = 
    imageUrl.includes('esteticlick.alwaysdata.net/storage/') ||
    imageUrl.includes('storage/avatars/') ||
    imageUrl.includes('/storage/');

    if(isOurStorage) {
      return true
    };

    // 3. Si es una data URL (preview local) → SÍ es custom
    if (imageUrl.startsWith('data:image/')) {
      return true;
    }

    // Cualquier otra URL (por seguridad) → NO es custom
    return false;
  };

  const getAvatarUrl = (userData = user) => {
    if (!userData) return null;
    
    // Prioridad 1: profile_image del accessor (backend lo devuelve)
    if (userData.profile_image) {
      return userData.profile_image;
    }

    // Prioridad 2: image_url personalizada de Laravel Storage
    if (userData.image_url && isCustomImage(userData.image_url)) {
      return userData.image_url;
    }

    // Prioridad 3: avatar_url de Laravel Storage
    if (userData.avatar_url && isCustomImage(userData.avatar_url)) {
      return userData.avatar_url;
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
      const emailSeed = generateEmailHash(userData.email);
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${emailSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
    }
    
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=b6e3f4,c0aede,d1d4f9`;
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