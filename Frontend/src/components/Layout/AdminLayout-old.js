import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import {
  UsersIcon,
  WrenchScrewdriverIcon,
  BookOpenIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
  InboxIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigation = [
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Services', href: '/admin/services', icon: WrenchScrewdriverIcon },
    { name: 'Courses', href: '/admin/courses', icon: BookOpenIcon },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarIcon },
    { name: 'Testimonials', href: '/admin/testimonials', icon: ChatBubbleLeftRightIcon },
    { name: 'FAQs', href: '/admin/faqs', icon: QuestionMarkCircleIcon },
    { name: 'Resources', href: '/admin/resources', icon: DocumentTextIcon },
    { name: 'Contacts', href: '/admin/contacts', icon: InboxIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-secondary-100">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-secondary-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-xl"
          >
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h2 className="text-lg font-semibold text-primary-600">
                  Admin Panel
                </h2>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`${
                        isActive
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'border-transparent text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full"
              >
                <div className="flex items-center">
                  <ArrowRightOnRectangleIcon className="inline-block h-5 w-5 text-secondary-400 group-hover:text-secondary-500 mr-2" />
                  <span className="text-sm font-medium text-secondary-700 group-hover:text-secondary-900">
                    Sign out
                  </span>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white shadow-sm">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <h2 className="text-lg font-semibold text-primary-600">
                  Admin Panel
                </h2>
              </div>
              <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'border-transparent text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md border-l-4 transition-colors duration-150`}
                    >
                      <item.icon
                        className={`${
                          isActive ? 'text-primary-500' : 'text-secondary-400 group-hover:text-secondary-500'
                        } mr-3 flex-shrink-0 h-6 w-6`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-secondary-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 group block w-full"
              >
                <div className="flex items-center">
                  <ArrowRightOnRectangleIcon className="inline-block h-5 w-5 text-secondary-400 group-hover:text-secondary-500 mr-2" />
                  <span className="text-sm font-medium text-secondary-700 group-hover:text-secondary-900">
                    Sign out
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-secondary-500 hover:text-secondary-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
