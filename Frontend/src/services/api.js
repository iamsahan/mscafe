import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Admin API instance with admin token
const adminApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Admin API interceptor
adminApi.interceptors.request.use(
  (config) => {
    const adminToken = Cookies.get('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Admin API response interceptor
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Admin API 401 error:', error.response);
      
      // Only redirect if we're not already on the login page and this isn't an initial auth check
      const isOnLoginPage = window.location.pathname.includes('/admin/login');
      const isAuthCheckRequest = error.config?.url?.includes('/auth/verify') || 
                                error.config?.url?.includes('/admin/auth/check');
      
      if (!isOnLoginPage && !isAuthCheckRequest) {
        // Clear the admin token
        Cookies.remove('adminToken');
        
        // Add a small delay to prevent race conditions with form submissions
        setTimeout(() => {
          if (!window.location.pathname.includes('/admin/login')) {
            console.log('Redirecting to admin login due to 401 error');
            window.location.href = '/admin/login';
          }
        }, 100);
      }
    }
    return Promise.reject(error);
  }
);

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('authToken');
    const adminToken = Cookies.get('adminToken');
    
    // Use admin token for admin routes, regular token for others
    if (config.url.includes('/admin/')) {
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized errors
    if (error.response?.status === 401) {
      // Check if it's an admin route
      if (error.config?.url?.includes('/admin/')) {
        // Remove invalid admin token
        Cookies.remove('adminToken');
        // Redirect to admin login
        if (!window.location.pathname.includes('/admin/login')) {
          window.location.href = '/admin/login';
        }
      } else {
        // Remove invalid regular token
        Cookies.remove('authToken');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', email),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  verifyToken: () => api.get('/auth/verify'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Services API
export const servicesAPI = {
  getAll: (params = {}) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (serviceData) => adminApi.post('/services', serviceData),
  update: (id, serviceData) => adminApi.put(`/services/${id}`, serviceData),
  delete: (id) => adminApi.delete(`/services/${id}`),
};

// Tax Packages API (uses /courses endpoint for backward compatibility)
export const coursesAPI = {
  getAll: (params = {}) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories'),
  create: (packageData) => adminApi.post('/courses', packageData),
  update: (id, packageData) => adminApi.put(`/courses/${id}`, packageData),
  delete: (id) => adminApi.delete(`/courses/${id}`),
};

// Tax Packages API (alias for better semantic meaning)
export const taxPackagesAPI = {
  getAll: (params = {}) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  getCategories: () => api.get('/courses/categories'),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  getEnrollments: () => api.get('/courses/enrollments'),
  create: (packageData) => api.post('/courses', packageData),
  update: (id, packageData) => api.put(`/courses/${id}`, packageData),
  delete: (id) => api.delete(`/courses/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: (params = {}) => api.get('/bookings', { params }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (bookingData) => api.post('/bookings', bookingData),
  update: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  delete: (id) => api.delete(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
};

// Events API
export const eventsAPI = {
  getAll: (params = {}) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  register: (eventId, registrationData) => api.post(`/events/${eventId}/register`, registrationData),
  getRegistrations: (params = {}) => api.get('/events/registrations', { params }),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: (params = {}) => api.get('/testimonials', { params }),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (testimonialData) => api.post('/testimonials', testimonialData),
  update: (id, testimonialData) => api.put(`/testimonials/${id}`, testimonialData),
  delete: (id) => api.delete(`/testimonials/${id}`),
  approve: (id) => api.patch(`/testimonials/${id}/approve`),
};

// FAQs API
export const faqsAPI = {
  getAll: (params = {}) => api.get('/faqs', { params }),
  getById: (id) => api.get(`/faqs/${id}`),
  create: (faqData) => api.post('/faqs', faqData),
  update: (id, faqData) => api.put(`/faqs/${id}`, faqData),
  delete: (id) => api.delete(`/faqs/${id}`),
};

// Resources API
export const resourcesAPI = {
  getAll: (params = {}) => api.get('/resources', { params }),
  getById: (id) => api.get(`/resources/${id}`),
  download: (id) => api.get(`/resources/${id}/download`, { responseType: 'blob' }),
  create: (resourceData) => api.post('/resources', resourceData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, resourceData) => api.put(`/resources/${id}`, resourceData),
  delete: (id) => api.delete(`/resources/${id}`),
};

// Contact API removed as per requirements

// Newsletter API
export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe', { email }),
};

// Priority Tradelines AU API
export const priorityTradelinesAUAPI = {
  getAll: (params = {}) => api.get('/priority-tradelines-au', { params }),
  getById: (id) => api.get(`/priority-tradelines-au/${id}`),
  getStats: () => api.get('/priority-tradelines-au/stats'),
  create: (tradelineData) => adminApi.post('/priority-tradelines-au', tradelineData),
  update: (id, tradelineData) => adminApi.put(`/priority-tradelines-au/${id}`, tradelineData),
  delete: (id) => adminApi.delete(`/priority-tradelines-au/${id}`),
};

// Admin API
export const adminAPI = {
  // Authentication
  login: (credentials) => api.post('/admin/auth/login', credentials),
  logout: () => api.post('/admin/auth/logout'),
  getMe: () => api.get('/admin/auth/me'),
  updateProfile: (profileData) => api.put('/admin/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/admin/auth/change-password', passwordData),
  
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  
  // Admin Management
  getAdmins: (params = {}) => api.get('/admin/users', { params }),
  createAdmin: (adminData) => api.post('/admin/users', adminData),
  updateAdmin: (id, adminData) => api.put(`/admin/users/${id}`, adminData),
  deleteAdmin: (id) => api.delete(`/admin/users/${id}`),
};

export default api;


