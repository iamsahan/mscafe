import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

const AdminBreadcrumb = ({ customPaths = [] }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = () => {
    if (customPaths.length > 0) {
      return customPaths;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [{ name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      
      if (index > 0) { // Skip 'admin' segment
        const name = segment
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        
        breadcrumbs.push({
          name,
          href: currentPath,
          current: index === pathSegments.length - 1
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={`${breadcrumb.href}-${index}`} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="flex-shrink-0 h-4 w-4 text-slate-400 mx-2" />
            )}
            {breadcrumb.current ? (
              <span className="text-sm font-medium text-slate-900 flex items-center">
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
                {breadcrumb.name}
              </span>
            ) : (
              <Link
                to={breadcrumb.href}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center transition-colors"
              >
                {breadcrumb.icon && <breadcrumb.icon className="h-4 w-4 mr-1" />}
                {breadcrumb.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default AdminBreadcrumb;
