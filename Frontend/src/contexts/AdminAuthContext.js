import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { adminAPI } from '../services/api';
import Cookies from 'js-cookie';

const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = Cookies.get('adminToken');
      
      if (token) {
        // Verify token with backend
        const response = await adminAPI.getMe();
        setAdmin(response.data.data);
        setIsAuthenticated(true);
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      // Token is invalid or expired
      Cookies.remove('adminToken');
      setAdmin(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await adminAPI.login(credentials);
      const { token, admin: adminData } = response.data.data;
      
      // Store token in cookie
      Cookies.set('adminToken', token, { expires: 7 });
      
      setAdmin(adminData);
      setIsAuthenticated(true);
      
      return { success: true, admin: adminData };
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await adminAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      Cookies.remove('adminToken');
      setAdmin(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await adminAPI.updateProfile(profileData);
      setAdmin(response.data.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    try {
      const response = await adminAPI.changePassword(passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }, []);

  const value = useMemo(() => ({
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  }), [admin, loading, isAuthenticated, login, logout, updateProfile, changePassword, checkAuthStatus]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};
