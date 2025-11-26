import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authAPI, serviceAPI, contactMessagesAPI, ownersAPI } from "../apis/api.js";

// Auth HOOKS
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      const {access_token: token, user} = data;
      if(token) { localStorage.setItem('authToken', token); }
      if(user) {
        localStorage.setItem('user', JSON.stringify(user));
        queryClient.setQueryData(['user'], user);
      }
      queryClient.invalidateQueries(['user']);
    },
    onError: (error) => {
      console.error('Error al iniciar sesión: ', error);
      throw error;
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      queryClient.clear();
      window.location.href('/login');
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getUser,
    enabled: !!localStorage.getItem('authToken'),
  });
};

// Services HOOKS
export const useServices = (filters = {}) => {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => serviceAPI.getServices(filters),
  });
};

// Contact HOOKS
export const useCreateContactMessage = () => {
  return useMutation({
    mutationFn: contactMessagesAPI.createMessage,
    onSuccess: () => { console.log('Mensaje enviado exitosamente.'); },
  });
};

// Business HOOKS - PÚBLICO
export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: ownersAPI.getBusinesses,
    staleTime: 5 * 60 * 1000,
  });
};

// Owners HOOKS - ADMIN
export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: ownersAPI.getOwners,
    staleTime: 2 * 60 * 1000,
    enabled: false,
  });
};

// Owners Mutations
export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersAPI.createOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...ownerData }) => ownersAPI.updateOwner(id, ownerData),
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useDeleteOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ownersAPI.deleteOwner,
    onSuccess: () => {
      queryClient.invalidateQueries(['owners']);
    },
  });
};

export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth-check'],
    queryFn: () => !!localStorage.getItem('authToken'),
    enabled: false,
  });
};