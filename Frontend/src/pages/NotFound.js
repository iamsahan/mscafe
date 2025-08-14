import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <ExclamationTriangleIcon className="mx-auto h-24 w-24 text-warning-400" />
          </div>
          
          <h1 className="text-6xl font-bold text-secondary-900 mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-semibold text-secondary-700 mb-4">
            Page Not Found
          </h2>
          
          <p className="text-secondary-600 mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Go Back Home
            </Link>
            
            <div className="text-sm text-secondary-500">
              Or try one of these helpful links:
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/about"
                className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
              >
                About Us
              </Link>
              <Link
                to="/book-now"
                className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
              >
                Book Now
              </Link>
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
              >
                Contact Us
              </Link>
              <Link
                to="/resources"
                className="text-primary-600 hover:text-primary-700 text-sm hover:underline"
              >
                Resources
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
