import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "../apis";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getUsers,
  });
};

export const useGetUser = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => usersApi.getUser(id),
    enabled: !!id,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => usersApi.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      console.log('Usuario creado exitosamente');
    },
    onError: (error) => {
      console.error('Error al crear usuario:', error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => usersApi.updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
    onError: (error) => {
      console.error('Error al actualizar usuario:', error);
    },
  });
};

export const useToggleUserActive = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => usersApi.toggleActive(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables] });
    },
    onError: (error) => {
      console.error('Error al cambiar estado del usuario:', error);
    },
  });
};