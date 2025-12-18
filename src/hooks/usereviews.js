import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from '../apis'

export const useGetReviews = (ownerId) => {
  return useQuery({
    queryKey: ['reviews', ownerId],
    queryFn: () => reviewsApi.getReviews(ownerId),
    enabled: !!ownerId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, data }) => reviewsApi.createReview(ownerId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.ownerId] });
    },
    onError: (error) => {
      console.error('Error al crear reseña:', error);
    },
  });
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, reviewId }) => reviewsApi.approveReview(ownerId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.ownerId] });
    },
    onError: (error) => {
      console.error('Error al aprobar reseña:', error);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ownerId, reviewId }) => reviewsApi.deleteReview(ownerId, reviewId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.ownerId] });
    },
    onError: (error) => {
      console.error('Error al eliminar reseña:', error);
    },
  });
};