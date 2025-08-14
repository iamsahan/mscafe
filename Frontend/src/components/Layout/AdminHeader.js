import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Bars3Icon,
  BellIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const AdminHeader = ({ 
  setSidebarOpen, 
  notificationsOpen, 
  setNotificationsOpen 
}) => {
  const location = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      description: 'Overview & Statistics'
    },
    { 
      name: 'Package Management', 
      href: '/admin/packages', 
      description: 'Manage packages & courses'
    },
    { 
      name: 'Services Management', 
      href: '/admin/services', 
      description: 'Manage all services'
    },
    { 
      name: 'Priority Tradelines', 
      href: '/admin/priority-tradelines', 
      description: 'Manage tradeline offerings'
    },
    { 
      name: 'Admin Management', 
      href: '/admin/admin-management', 
      description: 'Manage admin users'
    },
    { 
      name: 'Profile Settings', 
      href: '/admin/profile', 
      description: 'Account settings'
    },
  ];

  const currentPage = navigation.find(item => item.href === location.pathname);

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          {/* Page Title */}
          <div className="ml-4 lg:ml-0">
            <h1 className="text-2xl font-bold text-slate-900">
              {currentPage?.name || 'Dashboard'}
            </h1>
            <p className="text-sm text-slate-500">
              {currentPage?.description || 'Welcome to MSG Admin Portal'}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors relative"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-200">
                  <h3 className="text-sm font-medium text-slate-900">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  <div className="px-4 py-3 text-sm text-slate-600">
                    No new notifications
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-slate-600">
              <ChartBarIcon className="h-4 w-4" />
              <span>System Status: Online</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All Services</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
