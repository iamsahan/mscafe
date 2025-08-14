import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  UsersIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ 
  admin, 
  sidebarOpen, 
  setSidebarOpen, 
  onLogout, 
  mobile = false 
}) => {
  const location = useLocation();

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: HomeIcon,
      description: 'Overview & Statistics'
    },
    { 
      name: 'Package Management', 
      href: '/admin/packages', 
      icon: CubeIcon,
      description: 'Manage packages & courses'
    },
    { 
      name: 'Services Management', 
      href: '/admin/services', 
      icon: WrenchScrewdriverIcon,
      description: 'Manage all services'
    },
    { 
      name: 'Priority Tradelines', 
      href: '/admin/priority-tradelines', 
      icon: CreditCardIcon,
      description: 'Manage tradeline offerings'
    },
    { 
      name: 'Admin Management', 
      href: '/admin/admin-management', 
      icon: UsersIcon,
      description: 'Manage admin users',
      permission: 'admin_management'
    },
    { 
      name: 'Profile Settings', 
      href: '/admin/profile', 
      icon: UserCircleIcon,
      description: 'Account settings'
    },
  ];

  const filteredNavigation = navigation.filter(item => {
    if (!item.permission) return true;
    if (admin?.role === 'super_admin') return true;
    return admin?.permissions?.[item.permission] === 'full' || admin?.permissions?.[item.permission] === 'edit';
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="flex items-center justify-between p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              MSG Admin
            </h2>
            <p className="text-xs text-slate-500">Management Portal</p>
          </div>
        </div>
        {mobile && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Admin Info */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {admin?.firstName?.[0]}{admin?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">
              {admin?.firstName} {admin?.lastName}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {admin?.email}
            </p>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                admin?.role === 'super_admin' 
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {admin?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 transition-colors ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="truncate">{item.name}</div>
                <div className={`text-xs truncate ${
                  isActive ? 'text-white/80' : 'text-slate-500'
                }`}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-500" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  if (mobile) {
    return (
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="fixed inset-0 bg-slate-600 bg-opacity-75"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl"
            >
              <SidebarContent />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <div className="hidden lg:flex lg:flex-shrink-0 lg:fixed lg:inset-y-0 lg:z-30">
      <div className="flex flex-col w-80">
        <div className="flex flex-col h-full bg-white shadow-xl border-r border-slate-200">
          <SidebarContent />
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
