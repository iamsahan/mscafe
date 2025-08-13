import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';

const ProtectedAdminRoute = ({ children, requiredRole = null, requiredPermission = null }) => {
  const { admin, loading, isAuthenticated } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated || !admin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Check role requirement
  if (requiredRole && admin.role !== requiredRole && admin.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (requiredPermission && admin.role !== 'super_admin') {
    const permissions = admin.permissions || {};
    const hasPermission = permissions[requiredPermission] === 'full' || 
                         permissions[requiredPermission] === 'edit';

    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      );
    }
  }

  return children;
};

export default ProtectedAdminRoute;


