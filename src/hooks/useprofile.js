// En: ../hooks/useprofile.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../apis';
import { useAlert } from '../context/alertcontext.jsx';
import { useAuth } from '../context/authcontext.jsx';

// Claves para React Query
const PROFILE_QUERY_KEY = ['profile'];
const USER_BUSINESSES_QUERY_KEY = ['userBusinesses'];

// ==================== FUNCIÓN DE TRANSFORMACIÓN ====================
const transformProfileData = (data) => {
  if (!data) return null;
  
  // Asegurar que los arrays existan
  const permissions = Array.isArray(data.permissions) ? data.permissions : [];
  const roles = Array.isArray(data.roles) ? data.roles : [];
  const tenantRoles = Array.isArray(data.tenant_roles) ? data.tenant_roles : [];
  
  // Crear objeto 'can' basado en permisos y roles
  const can = {
    // Permisos directos
    manage_own_profile: permissions.includes('manage_own_profile'),
    upload_avatar: permissions.includes('upload_avatar') || permissions.includes('upload_profile_image'),
    
    // Permisos basados en roles
    is_admin: roles.includes('admin') || tenantRoles.includes('admin'),
    is_user: roles.includes('user') || tenantRoles.includes('user') || data.user_type === 'user',
    
    // Permisos de negocio (si tienes)
    has_businesses: (data.tenant_roles && data.tenant_roles.length > 0) ||(data.user_businesses && data.user_businesses.length > 0),
    
    // Otros permisos que puedas necesitar
    edit_profile: true, // Por defecto si tiene manage_own_profile
    view_profile: true,
  };
  
  return {
    ...data,
    can,
    // Asegurar arrays consistentes
    permissions,
    roles,
    tenant_roles: tenantRoles
  };
};

export const useProfile = () => {
  const { showSuccess, showError } = useAlert();
  const { updateUser } = useAuth();
  const queryClient = useQueryClient();

  // ==================== QUERIES ====================

  // Obtener perfil del usuario - MODIFICADO
  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await profileApi.getProfile();
        const userData = response.user || response;
        
        // TRANSFORMAR los datos aquí
        console.log('📊 Datos recibidos del backend:', userData);
        const transformedData = transformProfileData(userData);
        console.log('🔄 Datos transformados con can:', transformedData?.can);

        return transformedData;
        
      } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  });

  // Obtener negocios del usuario
  const {
    data: userBusinessesData,
    isLoading: isBusinessesLoading,
    refetch: refetchBusinesses
  } = useQuery({
    queryKey: USER_BUSINESSES_QUERY_KEY,
    queryFn: async () => {
      try {
        const response = await profileApi.getUserBusinesses();
        return response.data || response;
      } catch (error) {
        console.error('Error fetching user businesses:', error);
        return []; // Retornar array vacío en caso de error
      }
    },
    enabled: !!profileData, // Solo ejecutar si hay perfil
  });

  // ==================== MUTATIONS ====================

  // Actualizar perfil - MODIFICADO para mantener transformación
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      try {
        const response = await profileApi.updateProfile(profileData);
        const userData = response.user || response;
        
        // TRANSFORMAR también en update
        return transformProfileData(userData);
        
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    },
    onSuccess: (transformedData) => {
      // Actualizar contexto de autenticación
      if (updateUser) {
        updateUser(transformedData);
      }

      // Actualizar cache de React Query con datos transformados
      queryClient.setQueryData(PROFILE_QUERY_KEY, transformedData);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });

      showSuccess('Perfil actualizado correctamente');
    },
    onError: (error) => {
      showError(error.message || 'Error al actualizar el perfil');
    }
  });

  // ==================== UTILIDADES ====================

  // Obtener negocios activos
  const getActiveBusinesses = () => {
    if (!userBusinessesData) return [];
    return userBusinessesData.filter(business => business.is_active);
  };

  // Obtener negocios inactivos
  const getInactiveBusinesses = () => {
    if (!userBusinessesData) return [];
    return userBusinessesData.filter(business => !business.is_active);
  };

  // Verificar si el usuario tiene negocios
  const hasBusinesses = () => {
    return userBusinessesData && userBusinessesData.length > 0;
  };

  // Verificar si es owner de algún negocio
  const isOwnerOfAnyBusiness = () => {
    if (!userBusinessesData) return false;
    return userBusinessesData.some(business => 
      business.role_in_tenant === 'owner' || !business.role_in_tenant
    );
  };

  // Obtener el negocio principal (el primero o el del owner)
  const getPrimaryBusiness = () => {
    if (!userBusinessesData || userBusinessesData.length === 0) return null;
    
    // Prioridad: 1. Negocio del owner, 2. Primer negocio activo
    const ownerBusiness = userBusinessesData.find(b => 
      b.role_in_tenant === 'owner' || !b.role_in_tenant
    );
    
    if (ownerBusiness) return ownerBusiness;
    
    const activeBusiness = userBusinessesData.find(b => b.is_active);
    return activeBusiness || userBusinessesData[0];
  };

  // ==================== RETORNO DEL HOOK ====================

  return {
    // ===== DATOS =====
    profile: profileData,
    userBusinesses: userBusinessesData,
    
    // ===== ESTADOS DE CARGA =====
    isProfileLoading,
    isBusinessesLoading,
    isLoading: isProfileLoading || isBusinessesLoading,
    
    // ===== ERRORES =====
    profileError,
    
    // ===== REFETCH =====
    refetchProfile,
    refetchBusinesses,
    refetchAll: () => {
      refetchProfile();
      refetchBusinesses();
    },
    
    // ===== MUTACIONES =====
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
    
    // ===== UTILIDADES =====
    getActiveBusinesses,
    getInactiveBusinesses,
    hasBusinesses,
    isOwnerOfAnyBusiness,
    getPrimaryBusiness,
    
    // ===== ESTADÍSTICAS =====
    stats: {
      totalBusinesses: userBusinessesData?.length || 0,
      activeBusinesses: getActiveBusinesses().length,
      inactiveBusinesses: getInactiveBusinesses().length,
      isOwner: isOwnerOfAnyBusiness(),
      hasActiveBusinesses: getActiveBusinesses().length > 0
    }
  };
};

// Hook simplificado para obtener solo el perfil (sin negocios)
export const useUserProfile = () => {
  const { profile, isProfileLoading, refetchProfile } = useProfile();
  return { profile, isLoading: isProfileLoading, refetchProfile };
};

// Hook para obtener solo los negocios
export const useUserBusinesses = () => {
  const { userBusinesses, isBusinessesLoading, refetchBusinesses } = useProfile();
  return { businesses: userBusinesses, isLoading: isBusinessesLoading, refetch: refetchBusinesses };
};