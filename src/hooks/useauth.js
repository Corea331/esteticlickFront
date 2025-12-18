import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi} from '../apis'

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      const {access_token: token, user} = data;
      if(token) { sessionStorage.setItem('authToken', token); }
      if(user) {
        sessionStorage.setItem('user', JSON.stringify(user));
        queryClient.setQueryData(['user'], user);
      }
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
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      console.log('✅ Logout exitoso:', data);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Logout API error: ', error);
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('user');
      queryClient.clear();
    },
  });
};

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getUser,
    enabled: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      console.log('Registro exitoso');
      if (data.access_token) {
        sessionStorage.setItem('authToken', data.access_token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
    },
    onError: (error) => {
      console.error('Error en registro:', error);
      throw error;
    },
  });
};

// Helper para verifiar autenticación
export const checkAuth = () => {
  return !!sessionStorage.getItem('authToken');
};