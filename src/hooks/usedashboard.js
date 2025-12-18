import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from '../apis'

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 2 * 60 * 1000,
    enabled: false, // Se activa según rol
  });
};

export const useOwnerDashboard = (ownerId) => {
  return useQuery({
    queryKey: ['owner-dashboard', ownerId],
    queryFn: () => dashboardApi.getOwnerDashboard(ownerId),
    staleTime: 2 * 60 * 1000,
    enabled: !!ownerId,
  });
};

export const useEditorDashboard = (ownerId) => {
  return useQuery({
    queryKey: ['editor-dashboard', ownerId],
    queryFn: () => dashboardApi.getEditorDashboard(ownerId),
    staleTime: 2 * 60 * 1000,
    enabled: !!ownerId,
  });
};

export const useStaffDashboard = (ownerId, userId) => {
  return useQuery({
    queryKey: ['staff-dashboard', ownerId, userId],
    queryFn: () => dashboardApi.getStaffDashboard(ownerId, userId),
    staleTime: 2 * 60 * 1000,
    enabled: !!ownerId && !!userId,
  });
};

// Hook inteligente que selecciona automáticamente según rol
export const useDashboard = (user) => {
  if (!user) {
    return { isLoading: false, error: 'Usuario no disponible', data: null };
  }

  const { role, ownerId, id: userId } = user;

  // Usar los hooks específicos según el rol
  if (role === 'admin') {
    const query = useAdminDashboard();
    return { ...query, role: 'admin' };
  }
  
  if (role === 'owner' && ownerId) {
    const query = useOwnerDashboard(ownerId);
    return { ...query, role: 'owner' };
  }
  
  if (role === 'editor' && ownerId) {
    const query = useEditorDashboard(ownerId);
    return { ...query, role: 'editor' };
  }
  
  if (role === 'staff' && ownerId && userId) {
    const query = useStaffDashboard(ownerId, userId);
    return { ...query, role: 'staff' };
  }
  
  return { 
    isLoading: false, 
    error: `Rol no soportado o datos insuficientes: ${role}`, 
    data: null 
  };
};
