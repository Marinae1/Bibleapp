import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setAuthToken, login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth on mount
  useEffect(() => {
    async function loadAuth() {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        const userJson = await SecureStore.getItemAsync(USER_KEY);
        if (token && userJson) {
          setAuthToken(token);
          setUser(JSON.parse(userJson));
        }
      } catch {
        // Ignore stored auth errors
      } finally {
        setIsLoading(false);
      }
    }
    loadAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const { user: userData, token } = await apiLogin(email, password);
    setAuthToken(token);
    setUser(userData);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const register = useCallback(async (email, password, displayName) => {
    const { user: userData, token } = await apiRegister(email, password, displayName);
    setAuthToken(token);
    setUser(userData);
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
    return userData;
  }, []);

  const logout = useCallback(async () => {
    setAuthToken(null);
    setUser(null);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
