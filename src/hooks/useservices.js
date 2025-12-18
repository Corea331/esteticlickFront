import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { servicesApi } from '../apis'

export const useServices = () => {
  return useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getServices,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => servicesApi.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['services']);
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: servicesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries(['services']);
    },
  });
};