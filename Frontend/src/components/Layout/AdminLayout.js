import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { toast } from 'react-toastify';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminMainContent from './AdminMainContent';
import AdminNotifications from './AdminNotifications';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const { admin, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Mock notifications data - replace with real data from API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New Service Created',
      message: 'Tax consultation service has been successfully created.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'Package Updated',
      message: 'Basic tax package has been updated with new pricing.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'System Maintenance',
      message: 'Scheduled maintenance will occur tonight at 2 AM EST.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: true
    }
  ]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed');
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setNotificationsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar */}
      <AdminSidebar 
        admin={admin}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        mobile={true}
      />

      {/* Desktop Sidebar */}
      <AdminSidebar 
        admin={admin}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        mobile={false}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 lg:pl-80">
        {/* Header with Notifications */}
        <div className="relative">
          <AdminHeader 
            setSidebarOpen={setSidebarOpen}
            notificationsOpen={notificationsOpen}
            setNotificationsOpen={setNotificationsOpen}
          />
          
          {/* Notifications Dropdown */}
          <div className="absolute top-full right-6 z-50">
            <AdminNotifications
              notifications={notifications}
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAllNotifications}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <AdminMainContent>
          {children}
        </AdminMainContent>
      </div>
    </div>
  );
};

export default AdminLayout;

