import { apiRequest } from './apicore.js';

/**
 * API para operaciones de perfil de usuario
 * Comunicación con backend Laravel
 */
export const profileApi = {
  // Obtener perfil del usuario
  getProfile: () => {
    return apiRequest('/user');
  },
  
  // Actualizar datos del perfil
  updateProfile: (profileData) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: profileData
    });
  },
  
  // Guardar URL de avatar en backend
  saveAvatarUrl: (imageUrl) => {
    return apiRequest('/user/profile/image', {
      method: 'POST',
      body: { image_url: imageUrl }
    });
  },
  
  // Eliminar avatar (solo referencia en BD)
  removeAvatarUrl: () => {
    return apiRequest('/user/profile/image', {
      method: 'DELETE'
    });
  },

  // Listar negocios el usuario
  getUserBusinesses: () => {
    return apiRequest('/user/businesses');
  },
};