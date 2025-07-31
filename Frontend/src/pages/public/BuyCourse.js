import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { coursesAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import {
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
  GiftIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  PlayCircleIcon,
  BookOpenIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const BuyCourse = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await coursesAPI.getById(id);
      setCourse(response.data.data);
    } catch (error) {
      console.error('Failed to fetch course:', error);
      setError('Course not found or unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = (course) => {
    if (!course) return null;
    const imageUrl = course.image_url || course.imageUrl;
    if (!imageUrl) return null;
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';
    
    if (imageUrl.startsWith('/uploads/')) {
      return `${baseUrl}${imageUrl}`;
    }
    
    return `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const handleBuyNow = async () => {
    try {
      setIsEnrolling(true);
    
      // If course has a link, redirect to external enrollment page
      if (course.link) {
        window.open(course.link, '_blank');
        return;
      }
      
      console.log('Processing enrollment for course:', course.id);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, show success and redirect
      alert('Enrollment successful! Welcome to the course.');
      navigate('/dashboard/courses'); // Redirect to user dashboard
      
    } catch (error) {
      console.error('Enrollment failed:', error);
      alert('Enrollment failed. Please try again.');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <LoadingSpinner size="w-12 h-12" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center ">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-secondary-900 dark:text-white ">
            Course Not Found
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            {error || 'The course you are looking for could not be found.'}
          </p>
          <Link
            to="/tax-professional"
            className="btn-primary inline-flex items-center"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 pt-20">
      {/* Header Navigation */}
      <div className="bg-white dark:bg-secondary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/tax-professional"
            className="inline-flex items-center text-[#93268f] hover:text-[#93268f] dark:text-[#93268f] dark:hover:text-primary-300"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    {course.category && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-[#93268f] dark:bg-primary-900/30 dark:text-primary-300">
                        {course.category.name}
                      </span>
                    )}
                    {course.featured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                        <StarIcon className="w-3 h-3 mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">
                    {course.title}
                  </h1>
                </div>
              </div>

              {/* Course Image */}
              {!imageError && getImageUrl(course) && (
                <div className="mb-6">
                  <img
                    src={getImageUrl(course)}
                    alt={course.title}
                    onError={handleImageError}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* Course Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-[#93268f] dark:border-[#93268f]">
                  <CurrencyDollarIcon className="w-8 h-8 text-[#93268f] dark:[#93268f]-400 mr-4" />
                  <div>
                    <div className="text-2xl font-bold text-primary-900 dark:text-primary-100">{course.price}</div>
                    <div className="text-sm text-primary-700 dark:text-primary-300">Course Price</div>
                  </div>
                </div>
                {course.revenueShare && (
                  <div className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <TrophyIcon className="w-8 h-8 text-green-600 dark:text-green-400 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-green-900 dark:text-green-100">{course.revenueShare}</div>
                      <div className="text-sm text-green-700 dark:text-green-300">Revenue Share</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Course Features */}
            {(() => {
              const includes = course.includes;
              let includesArray = [];
              
              if (Array.isArray(includes)) {
                includesArray = includes;
              } else if (typeof includes === 'string' && includes.trim()) {
                try {
                  includesArray = JSON.parse(includes);
                } catch (e) {
                  includesArray = [includes]; // If not JSON, treat as single item
                }
              }
              
              return includesArray.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    What's Included
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {includesArray.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-secondary-700 dark:text-secondary-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            })()}

            {/* Course Process */}
            {(() => {
              const process = course.process;
              let processArray = [];
              
              if (Array.isArray(process)) {
                processArray = process;
              } else if (typeof process === 'string' && process.trim()) {
                try {
                  processArray = JSON.parse(process);
                } catch (e) {
                  processArray = [process]; // If not JSON, treat as single item
                }
              }
              
              return processArray.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="card p-8"
                >
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                    Course Process
                  </h2>
                  <div className="space-y-6">
                    {processArray.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900 dark:text-white mb-2">
                            {typeof step === 'object' ? step.title || step : step}
                          </h3>
                          {typeof step === 'object' && step.description && (
                            <p className="text-secondary-600 dark:text-secondary-400">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            })()}

            {/* Requirements */}
            {(course.efinRequired || course.ptinRequired || course.minReturns > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                  Requirements & Prerequisites
                </h2>
                <div className="space-y-4">
                  {course.efinRequired && (
                    <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">EFIN Required</h3>
                        <p className="text-blue-700 dark:text-blue-300">{course.efinDescription}</p>
                      </div>
                    </div>
                  )}
                  {course.ptinRequired && (
                    <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <DocumentTextIcon className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-orange-900 dark:text-orange-100">PTIN Required</h3>
                        <p className="text-orange-700 dark:text-orange-300">{course.ptinDescription}</p>
                      </div>
                    </div>
                  )}
                  {course.minReturns > 0 && (
                    <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <AcademicCapIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100">
                          Minimum {course.minReturns} Returns Experience
                        </h3>
                        <p className="text-green-700 dark:text-green-300">{course.minReturnsDescription}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Course Description */}
            {course.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-8"
              >
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">
                  About This Course
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                    {course.description}
                  </p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Purchase Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-20"
            >
              <div className="card p-6 space-y-6">
                {/* Course Price */}
                <div className="text-center">
                  <div className="text-4xl font-bold text-secondary-900 dark:text-white mb-2">
                    {course.price}
                  </div>
                  {course.revenueShare && (
                    <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                      Revenue Share: {course.revenueShare}
                    </div>
                  )}
                </div>

                {/* Enroll Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={isEnrolling}
                  className="w-full btn-primary flex items-center justify-center py-4 text-lg font-semibold bg-[#93268f]"
                >
                  {isEnrolling ? (
                    <>
                      <LoadingSpinner size="w-5 h-5" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon className="w-5 h-5 mr-2  " />
                      Enroll Now
                    </>
                  )}
                </button>

                {/* Course Features */}
                <div className="space-y-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center space-x-3 text-sm text-secondary-600 dark:text-secondary-400">
                    <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                    <span>Quality education guarantee</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600 dark:text-secondary-400">
                    <GiftIcon className="w-5 h-5 text-blue-500" />
                    <span>Comprehensive learning materials</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-secondary-600 dark:text-secondary-400">
                    <ChatBubbleLeftRightIcon className="w-5 h-5 text-purple-500" />
                    <span>Professional support</span>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
                    Questions about this course?
                  </p>
                  <Link
                    to="/contact"
                    className="block text-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm mt-2"
                  >
                    Contact our support team
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyCourse;
