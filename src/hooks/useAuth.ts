import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api/auth';
import { LoginRequest, RegisterRequest } from '../types/auth';
import { User } from '../types/user';
import { storage, AUTH_TOKEN_KEY, USER_KEY } from '../utils/storage';
import { showErrorToast } from '../utils/handleError';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => storage.get<User>(USER_KEY));
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!storage.get(AUTH_TOKEN_KEY);
  });

  const login = useCallback(async (request: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(request);
      setUser(response.user);
      setIsAuthenticated(true);
      storage.set(USER_KEY, response.user);
      storage.set(AUTH_TOKEN_KEY, response.token);
      toast.success('Login successful!');
      return response;
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (request: RegisterRequest) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(request);
      setUser(response.user);
      setIsAuthenticated(true);
      storage.set(USER_KEY, response.user);
      storage.set(AUTH_TOKEN_KEY, response.token);
      toast.success('Registration successful!');
      return response;
    } catch (error) {
      showErrorToast(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      storage.remove(USER_KEY);
      storage.remove(AUTH_TOKEN_KEY);
      toast.success('Logged out successfully');
    } catch (error) {
      showErrorToast(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    try {
      const currentUser = await authApi.getCurrentUser();
      setUser(currentUser);
      storage.set(USER_KEY, currentUser);
    } catch (error) {

    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setIsAuthenticated(false);
      storage.remove(USER_KEY);
      toast.error('Session expired. Please login again.');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    fetchCurrentUser,
  };
}
