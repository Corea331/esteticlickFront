import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ownersApi } from '../apis'

export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: ownersApi.getOwners,
    staleTime: 2 * 60 * 1000,
    enabled: false, // Solo admin
  });
};

export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: ownersApi.getBusinesses,
    staleTime: 5 * 60 * 1000,
  });
};

export const useOwner = (id) => {
  return useQuery({
    queryKey: ['owner', id],
    queryFn: () => ownersApi.getOwner(id),
    enabled: !!id,
  });
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersApi.createOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => ownersApi.updateOwner(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['owners', variables.id]);
    },
  });
};

export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersApi.deleteOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useToggleOwnerActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersApi.toggleActive,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries(['owners', id]);
    },
  });
};