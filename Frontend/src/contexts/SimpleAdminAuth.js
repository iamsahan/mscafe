import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
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
      console.error('Auth check error:', error);
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
      setLoading(true);
      
      // Make real API call to backend
      const response = await adminAPI.login(credentials);
      const { token, admin: adminData } = response.data.data;
      
      // Store token in cookie
      Cookies.set('adminToken', token, { expires: 7, secure: false, sameSite: 'lax' });
      
      // Update state
      setAdmin(adminData);
      setIsAuthenticated(true);
      
      return { success: true, admin: adminData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API
      await adminAPI.logout();
    } catch (error) {
      console.error('Logout API error:', error);
      // Continue with logout even if API call fails
    } finally {
      // Always clear local state
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

  const value = {
    admin,
    loading,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};


