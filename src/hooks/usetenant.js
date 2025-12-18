import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tenantApi } from '../apis'

export const useTenantAppointments = (ownerId) => {
  return useQuery({
    queryKey: ['tenant-appointments', ownerId],
    queryFn: () => tenantApi.getAppointments(ownerId),
    enabled: !!ownerId,
  });
};

export const useCreateAppointment = (ownerId) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => tenantApi.createAppointment(ownerId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tenant-appointments', ownerId]);
    },
  });
};

// Clientes
export const useTenantClients = (ownerId) => {
  return useQuery({
    queryKey: ['tenant-clients', ownerId],
    queryFn: () => tenantApi.getClients(ownerId),
    enabled: !!ownerId,
  });
};

// Servicios del negocio
export const useTenantServices = (ownerId) => {
  return useQuery({
    queryKey: ['tenant-services', ownerId],
    queryFn: () => tenantApi.getTenantServices(ownerId),
    enabled: !!ownerId,
  });
};

// Usuarios del negocio
export const useTenantUsers = (ownerId) => {
  return useQuery({
    queryKey: ['tenant-users', ownerId],
    queryFn: () => tenantApi.getTenantUsers(ownerId),
    enabled: !!ownerId,
  });
};

