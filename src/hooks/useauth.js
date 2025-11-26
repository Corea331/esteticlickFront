import { useUser } from './apihooks.js';

const checkAuthStatus = () => {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');

  return {
    hasToken: !!token,
    hasUser: !!user,
    userData: user ? JSON.parse(user) : null,
  };
};

export const useAuth = () => {
  const { data: user, isLoading, error, isError } = useUser();

  const authStatus = checkAuthStatus();

  const isAuthenticated = !isLoading && ((user && !isError) || (authStatus.hasToken && authStatus.hasUser));

  const userData = user?.data || user || authStatus.userData;

  return {
    user: user?.data || user,
    isAuthenticated,
    userRole: userData?.role || userData?.data?.role,
    isLoading,
    error,
    hasLocalAuth: authStatus.hasToken && authStatus.hasUser,
  }
};