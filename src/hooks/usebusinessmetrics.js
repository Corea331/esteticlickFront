import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { businessMetricsApi } from "../apis";

export const useBusinessMetrics = () => {
  return useQuery({
    queryKey: ['businessMetrics'],
    queryFn: businessMetricsApi.getBusinessMetrics,
  });
};

export const useOwnerMetrics = (ownerId) => {
  return useQuery({
    queryKey: ['ownerMetrics', ownerId],
    queryFn: () => businessMetricsApi.getOwnerMetrics(ownerId),
    enabled: !!ownerId,
  });
};

export const useCalculateMetrics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ year, month }) => businessMetricsApi.calculateMetrics(year, month),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessMetrics'] });
      console.log('Métricas calculadas exitosamente');
    },
    onError: (error) => {
      console.error('Error al calcular métricas:', error);
    },
  });
};

export const useCalculateOwnerMetrics = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, year, month }) => 
      businessMetricsApi.calculateOwnerMetrics(ownerId, year, month),
    onSuccess: (_, variables) => { 
      queryClient.invalidateQueries({ queryKey: ['ownerMetrics', variables.ownerId] });
      console.log('Métricas del owner calculadas exitosamente');
    },
    onError: (error) => {
      console.error('Error al calcular métricas del owner:', error);
    },
  });
};