import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vercelBlobApi } from '../apis';
import { blobOrganizer } from '../apis';
import { profileApi } from '../apis';
import { useAlert } from '../context/alertcontext.jsx';
import { useAuth } from '../context/authcontext.jsx';

export const useAvatar = () => {
  const { showSuccess, showError, showInfo } = useAlert();
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();

  // Obtener datos estructurados del usuario
  const getUserData = () => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const roles = user.roles?.map(role => role.name) || [];
    const tenantRoles = user.tenantRoles || [];
    
    // Determinar tipo de usuario
    const userType = blobOrganizer.getUserType(roles, user.owner?.id, tenantRoles);
    
    // Obtener businessId si aplica
    const businessId = blobOrganizer.getBusinessId(userType, user.owner?.id, tenantRoles);
    
    return {
      userId: user.id,
      name: user.name,
      email: user.email,
      roles,
      userType,
      ownerId: user.owner?.id,
      tenantRoles,
      businessId,
      isOwner: userType === 'owner',
      isStaff: userType === 'staff', // Incluye editor
      isEditor: roles.includes('editor'),
      isAdmin: userType === 'admin'
    };
  };

  // Subir avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file) => {
      const userData = getUserData();
      
      // Validar archivo
      const validation = vercelBlobApi.validateImageFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join('. '));
      }
      
      // Subir a Vercel Blob
      const blobResult = await vercelBlobApi.uploadAvatar(file, userData);
      
      if (!blobResult.success) {
        throw new Error('Error al subir a Vercel Blob');
      }
      
      // Guardar URL en backend
      const saveResult = await profileApi.saveAvatarUrl(blobResult.url);
      
      if (!saveResult || !saveResult.user) {
        // Limpiar archivo huérfano
        try {
          await vercelBlobApi.deleteFile(blobResult.url);
        } catch (error) {
          console.error('No se pudo eliminar archivo huérfano:', error);
        }
        throw new Error('Error al guardar en el sistema');
      }
      
      return {
        url: blobResult.url,
        user: saveResult.user,
        organization: blobResult.organization,
        userType: userData.userType,
        businessId: userData.businessId
      };
    },
    onSuccess: (data) => {
      // Mostrar información de organización
      const userTypeLabel = blobOrganizer.getUserTypeLabel(data.userType);
      showInfo(
        `Avatar organizado como: ${userTypeLabel}`,
        'Organización automática',
        { autoDismiss: true, duration: 5000 }
      );
      
      // Actualizar contexto y cache
      if (updateUser) {
        updateUser(data.user);
      }
      
      queryClient.setQueryData(['profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      showSuccess('Foto de perfil actualizada correctamente');
    },
    onError: (error) => {
      console.error('Error uploading avatar:', error);
      showError(error.message || 'Error al subir la foto de perfil');
    }
  });

  // Eliminar avatar
  const deleteAvatarMutation = useMutation({
    mutationFn: async (currentAvatarUrl) => {
      if (!currentAvatarUrl) {
        throw new Error('No hay avatar para eliminar');
      }
      
      //const userData = getUserData();
      const urlInfo = blobOrganizer.parseBlobUrl(currentAvatarUrl);
      
      // Eliminar de Vercel Blob si es imagen personalizada
      if (urlInfo.isCustomImage && urlInfo.source === 'vercel-blob') {
        await vercelBlobApi.deleteFile(currentAvatarUrl);
      }
      
      // Eliminar referencia en backend
      const deleteResult = await profileApi.removeAvatarUrl();
      
      if (!deleteResult || !deleteResult.user) {
        throw new Error('Error al eliminar del sistema');
      }
      
      return {
        user: deleteResult.user,
        deletedUrl: currentAvatarUrl,
        isNowDefault: true
      };
    },
    onSuccess: (data) => {
      if (updateUser) {
        updateUser(data.user);
      }
      
      queryClient.setQueryData(['profile'], data.user);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      showSuccess('Foto eliminada. Se mostrará el avatar por defecto');
    },
    onError: (error) => {
      console.error('Error deleting avatar:', error);
      showError(error.message || 'Error al eliminar la foto de perfil');
    }
  });

  // Obtener URL del avatar (maneja default vs custom)
  const getAvatarUrl = (targetUser = null) => {
    const userProfile = targetUser || user;
    
    if (!userProfile) {
      return null;
    }
    
    // Usar el accessor del backend que ya existe
    return userProfile.profile_image;
  };

  // Verificar si es avatar personalizado
  const isCustomAvatar = (avatarUrl) => {
    const info = blobOrganizer.parseBlobUrl(avatarUrl);
    return info.isCustomImage && info.source === 'vercel-blob';
  };

  // Obtener información del usuario actual
  const getCurrentUserInfo = () => {
    const userData = getUserData();
    
    return {
      ...userData,
      userTypeLabel: blobOrganizer.getUserTypeLabel(userData.userType),
      defaultAvatarUrl: blobOrganizer.getDefaultAvatarUrl(userData),
      organizationInfo: userData.businessId 
        ? `Negocio: ${userData.businessId}`
        : 'Sin negocio asociado'
    };
  };

  return {
    // Estados
    isUploading: uploadAvatarMutation.isPending,
    isDeleting: deleteAvatarMutation.isPending,
    
    // Acciones
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    
    // Utilidades
    getAvatarUrl,
    isCustomAvatar,
    validateFile: vercelBlobApi.validateImageFile,
    getCurrentUserInfo,
    
    // Información del usuario
    userData: getUserData()
  };
};