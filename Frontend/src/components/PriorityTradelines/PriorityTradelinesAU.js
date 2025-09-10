import React, { useState, useEffect, useCallback } from 'react';
import { priorityTradelinesAUAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import zelleIcon from '../../images/z.png';
import cashAppIcon from '../../images/$.png';
import applePayIcon from '../../images/ipay.png';
import logoImage from '../../images/logo.png';
import tradelineImage from '../../images/trandline.jpeg';

const PriorityTradelinesAU = () => {
  const [tradelines, setTradelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    bank: '',
    minAge: '',
    maxAge: '',
    minPrice: '',
    maxPrice: '',
    minCreditLimit: '',
    maxCreditLimit: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState(null);
  const [faqOpen, setFaqOpen] = useState({}); // For FAQ accordion state

  // Load the form embed script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on component unmount
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await priorityTradelinesAUAPI.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    // Only fetch when page changes (not when filters change - that's handled separately)
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const queryParams = {
          page: pagination.page,
          limit: pagination.limit,
          ...Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
          )
        };

        const response = await priorityTradelinesAUAPI.getAll(queryParams);
        
        if (response.data.success) {
          setTradelines(response.data.data);
          setPagination(prev => ({
            ...prev,
            totalPages: response.data.pagination.totalPages,
            total: response.data.total
          }));
        }
      } catch (err) {
        setError('Failed to fetch tradelines');
        console.error('Error fetching tradelines:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
    
    // Only load stats and form script on initial mount
    if (pagination.page === 1) {
      fetchStats();
      
      // Add global error handler for form embed script errors
      const handleFormEmbedError = (event) => {
        // Check if the error is from the form embed script
        if (event.filename && event.filename.includes('form_embed.js')) {
          console.warn('Form embed script error suppressed:', event.message);
          event.preventDefault();
          return true;
        }
        // Check for iframe communication errors
        if (event.message && event.message.includes('Script error')) {
          console.warn('Script communication error suppressed');
          event.preventDefault();
          return true;
        }
      };

      // Add error event listener
      window.addEventListener('error', handleFormEmbedError);

      // Load the form embed script with error handling
      const loadFormScript = () => {
        // Check if script is already loaded
        if (document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]')) {
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;
        
        // Add error handling
        script.onerror = (error) => {
          console.warn('Form embed script failed to load:', error);
        };
        
        script.onload = () => {
          console.log('Form embed script loaded successfully');
        };

        document.head.appendChild(script);
      };

      // Add a small delay to ensure DOM is ready
      setTimeout(loadFormScript, 100);

      return () => {
        // Remove error event listener
        window.removeEventListener('error', handleFormEmbedError);
        
        // Cleanup script when component unmounts
        const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
        if (existingScript) {
          document.head.removeChild(existingScript);
        }
      };
    }
  }, [pagination.page, pagination.limit]);

  // Auto-filter when filters change (but not when page changes)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Reset to page 1 and fetch with new filters
      setPagination(prev => {
        if (prev.page !== 1) {
          return { ...prev, page: 1 };
        }
        return prev;
      });
      
      // Fetch with current filters
      const queryParams = {
        page: 1, // Always search from page 1 when filters change
        limit: pagination.limit,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      };

      // Manually fetch with filters to avoid dependency issues
      const fetchWithFilters = async () => {
        try {
          setLoading(true);
          const response = await priorityTradelinesAUAPI.getAll(queryParams);
          
          if (response.data.success) {
            setTradelines(response.data.data);
            setPagination(prev => ({
              ...prev,
              page: 1,
              totalPages: response.data.pagination.totalPages,
              total: response.data.total
            }));
          }
        } catch (err) {
          setError('Failed to fetch tradelines');
          console.error('Error fetching tradelines:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchWithFilters();
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(timer);
  }, [filters, pagination.limit]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Validate numeric inputs
    if (['minAge', 'maxAge', 'minPrice', 'maxPrice', 'minCreditLimit', 'maxCreditLimit'].includes(name)) {
      // Allow empty string or valid positive numbers
      if (value !== '' && (isNaN(value) || parseFloat(value) < 0)) {
        return; // Don't update if invalid
      }
    }
    
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      bank: '',
      minAge: '',
      maxAge: '',
      minPrice: '',
      maxPrice: '',
      minCreditLimit: '',
      maxCreditLimit: '',
      search: ''
    });
  };

  // Handle pagination
  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle FAQ toggle
  const toggleFaq = (index) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format only day with ordinal suffix (e.g., 02nd)
  const formatDayOrdinal = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '';
    const day = d.getDate();
    const dayStr = String(day).padStart(2, '0');
    const mod10 = day % 10;
    const mod100 = day % 100;
    let suffix = 'th';
    if (mod10 === 1 && mod100 !== 11) suffix = 'st';
    else if (mod10 === 2 && mod100 !== 12) suffix = 'nd';
    else if (mod10 === 3 && mod100 !== 13) suffix = 'rd';
    return `${dayStr}${suffix}`;
  };

  if (loading && tradelines.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 pt-16 sm:pt-20">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-full mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent mb-4 sm:mb-6 px-2">
            Boost Your Credit Profile Fast with Priority Tradelines
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4 sm:px-2">
            Discover premium authorized user tradeline opportunities to enhance your credit profile with our curated inventory
          </p>
          <div className="mt-6 sm:mt-8">
            <button 
              onClick={() => document.getElementById('tradelines-table').scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary-600 to-[#93268f] text-white font-bold rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Available Tradelines
            </button>
          </div>
        </div>

        {/* What's a Tradeline Explainer */}
        <div className="mb-8 sm:mb-12 mx-2 sm:mx-0">
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
              {/* Content Side */}
              <div className="order-2 lg:order-1">
                <div className="flex items-center mb-4 lg:mb-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-2xl flex items-center justify-center shadow-lg mr-4">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent">
                    What's a Tradeline?
                  </h2>
                </div>
                
                <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                  Think of a tradeline as a <span className="font-semibold text-primary-600">"credit booster."</span> When you're added as an authorized user on an established credit account, the account's history (on-time payments, age, limit) can report to your credit file. This may help increase your score, strengthen your credit profile, and improve your chances for approvals.
                </p>
                
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl border border-green-200 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm sm:text-base font-semibold">Simple. Legal. Temporary access to stronger credit history.</span>
                </div>
                
                <div>
                  <button
                    onClick={() => document.getElementById('disclaimer-section').scrollIntoView({ behavior: 'smooth' })}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium underline transition-colors"
                  >
                    See full disclaimer here
                  </button>
                </div>
              </div>

              {/* Image Side */}
              <div className="order-1 lg:order-2">
                <div className="relative">
                  <div className="bg-gradient-to-br from-white to-gray-100 rounded-2xl p-4 shadow-lg">
                    <img 
                      src={tradelineImage} 
                      alt="Credit Score Improvement Tradeline Graph" 
                      className="w-full h-auto rounded-xl shadow-md"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Total Tradelines</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{stats.totalTradelines}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Average Price</h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${stats.priceStats.average}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Avg Credit Limit</h3>
              <p className="text-lg sm:text-xl lg:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">${stats.avgCreditLimit}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1 sm:mb-2">Price Range</h3>
              <p className="text-base sm:text-lg lg:text-lg font-bold text-gray-900">
                ${stats.priceStats.minimum} - ${stats.priceStats.maximum}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent">Smart Filters</h2>
                {Object.values(filters).some(value => value !== '') && (
                  <p className="text-xs sm:text-sm text-primary-600 font-medium">
                    {Object.values(filters).filter(value => value !== '').length} filter(s) active
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={clearFilters}
              disabled={!Object.values(filters).some(value => value !== '')}
              className="inline-flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg sm:rounded-xl transition-all duration-200 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* General Search */}
            <div className="group lg:col-span-2">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Tradelines
              </label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by bank name, spots, or statement..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M7 7h3m0 0v8m0-8h7m-7 0V3" />
                </svg>
                Bank Institution
              </label>
              <input
                type="text"
                name="bank"
                value={filters.bank}
                onChange={handleFilterChange}
                placeholder="Filter by bank name..."
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Account Year Range
              </label>
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  placeholder="From"
                  min="1990"
                  max="2025"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  placeholder="To"
                  min="1990"
                  max="2025"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Price Range
              </label>
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  step="1"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  step="1"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Credit Limit Range
              </label>
              <div className="flex space-x-2 sm:space-x-3">
                <input
                  type="number"
                  name="minCreditLimit"
                  value={filters.minCreditLimit}
                  onChange={handleFilterChange}
                  placeholder="Min"
                  min="0"
                  step="100"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxCreditLimit"
                  value={filters.maxCreditLimit}
                  onChange={handleFilterChange}
                  placeholder="Max"
                  min="0"
                  step="100"
                  className="w-full px-2 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-md p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
          <p className="text-red-800 text-sm sm:text-base">{error}</p>
        </div>
      )}

        {/* Tradelines Table */}
        <div id="tradelines-table" className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-white/50 overflow-hidden mb-8 sm:mb-12">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent">
                  Available Tradelines
                  {loading && (
                    <svg className="inline w-4 h-4 ml-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  {pagination.total} premium tradelines in inventory
                  {Object.values(filters).some(value => value !== '') && (
                    <span className="text-primary-600 font-medium ml-2">
                      (Filtered results)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>        {loading ? (
          <div className="flex justify-center py-6 sm:py-8">
            <LoadingSpinner />
          </div>
        ) : tradelines.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No tradelines found</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {Object.values(filters).some(value => value !== '') 
                ? "No tradelines match your current filters. Try adjusting your search criteria."
                : "No tradelines are currently available in our inventory."
              }
            </p>
            {Object.values(filters).some(value => value !== '') && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4 p-4">
              {tradelines.map((tradeline, index) => (
                <div key={tradeline.id} className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200/50 p-4 hover:shadow-xl transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-600">{tradeline.spots} spots available</span>
                    </div>
                    <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 border border-primary-200">
                      {tradeline.age}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{tradeline.bank}</h3>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Credit Limit</p>
                      <p className="text-lg font-bold text-green-600">{formatCurrency(tradeline.creditLimit)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Price</p>
                      <p className="text-lg font-bold text-emerald-600">{formatCurrency(tradeline.price)}</p>
                    </div>
                  </div>
                  
          <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Closing Date</p>
                    <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium">
            {formatDayOrdinal(tradeline.closingDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto relative">
              {/* Watermark */}
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                style={{
                  backgroundImage: `url(${logoImage})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: '300px 300px',
                  opacity: 0.48,
                  filter: 'grayscale(100%)'
                }}
              ></div>
              <table className="min-w-full divide-y divide-gray-200/50 relative z-10">
                <thead className="bg-gradient-to-r from-primary-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Available Spots
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Account Year
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M7 7h3m0 0v8m0-8h7m-7 0V3" />
                        </svg>
                        Bank Institution
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Credit Limit
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Closing Date
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                        Investment Price
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white/70 divide-y divide-gray-200/30 relative z-10">
                  {tradelines.map((tradeline, index) => (
                    <tr key={tradeline.id} className="hover:bg-primary-50/50 transition-all duration-200 group">
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-primary-700">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-500"></div>
                          {tradeline.spots}
                        </div>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 border border-primary-200">
                          {tradeline.age}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                        {tradeline.bank}
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatCurrency(tradeline.creditLimit)}
                      </td>
            <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-900">
                        <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium">
              {formatDayOrdinal(tradeline.closingDate)}
                        </span>
                      </td>
                      <td className="px-6 py-6 whitespace-nowrap text-sm">
                        <span className="inline-flex px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                          {formatCurrency(tradeline.price)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 px-3 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <div className="flex items-center">
                <span className="text-xs text-gray-700">
                  {pagination.page} of {pagination.totalPages}
                </span>
              </div>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.page * pagination.limit, pagination.total)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-lg border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                    let page;
                    if (pagination.totalPages <= 5) {
                      page = index + 1;
                    } else {
                      if (pagination.page <= 3) {
                        page = index + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        page = pagination.totalPages - 4 + index;
                      } else {
                        page = pagination.page - 2 + index;
                      }
                    }
                    
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-3 py-2 border text-xs sm:text-sm font-medium ${
                          page === pagination.page
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => goToPage(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-lg border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Important Disclaimer Section */}
      <div id="disclaimer-section" className="mb-8 sm:mb-12 mx-2 sm:mx-0">
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-200/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center">
            <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-amber-800 mb-4 flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Disclaimer
              </h2>
              <div className="space-y-3 text-sm sm:text-base text-amber-900/80">
                <p className="font-medium">
                  <strong>No Guarantee of Reporting:</strong> While we work with established tradelines, there is no guarantee that any tradeline will report to all three credit bureaus. Our experience shows that tradelines typically report to 2 out of 3 major credit bureaus (Experian, Equifax, and TransUnion).
                </p>
                <p className="font-medium">
                  <strong>Results May Vary:</strong> Individual results depend on your current credit profile, existing accounts, and how credit bureaus process the information. We cannot guarantee specific score increases or approval outcomes.
                </p>
                <p className="font-medium">
                  <strong>Legal Compliance:</strong> Our tradeline services are legal and compliant with federal regulations. You will be added as an authorized user for a specified period, after which you will be removed from the account.
                </p>
              </div>
              <div className="mt-6 p-4 bg-white/70 rounded-xl border border-amber-200">
                <p className="text-xs sm:text-sm text-amber-800 text-center lg:text-left">
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  By proceeding with your purchase, you acknowledge that you understand these terms and limitations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mb-8 sm:mb-12 mx-2 sm:mx-0">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/50 p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-full mb-4 sm:mb-6">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our tradeline services
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(1)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  How long does it take for tradelines to appear on my credit report?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[1] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[1] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Tradelines typically appear on your credit report within <strong>1-2 billing cycles</strong> (30-60 days) after you're added as an authorized user. However, this can vary by credit bureau and the specific bank's reporting schedule. Most tradelines will report to 2 out of 3 major credit bureaus.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Item 2 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(2)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  What credit score increase can I expect?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[2] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[2] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Credit score increases vary greatly depending on your current credit profile. Generally, clients see increases of <strong>40-100+ points</strong> within 30-60 days. Factors that affect your increase include: your current score, existing credit history, credit utilization, and how the tradeline fits into your overall profile. We cannot guarantee specific score increases.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Item 3 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(3)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  How long do I remain on the tradeline?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[3] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[3] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      You typically remain as an authorized user for <strong>1-2 months</strong> (one billing cycle). After this period, you'll be removed from the account. However, the positive payment history and account age often remain on your credit report and continue to benefit your credit score even after removal.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Item 4 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(4)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Are tradelines legal and safe?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[4] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[4] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Yes, tradelines are <strong>100% legal</strong>. Adding authorized users to credit accounts is a common practice that's been around for decades. Banks allow primary cardholders to add family members, employees, or others as authorized users. We simply facilitate this process between willing parties. Our service is compliant with all federal regulations.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Item 5 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(5)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  What information do I need to provide?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[5] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[5] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      We only need basic information: your <strong>full legal name, date of birth, and social security number</strong>. This information is required by banks to add you as an authorized user. We use bank-level security to protect your personal information and never store sensitive data longer than necessary.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ Item 6 */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 overflow-hidden">
              <button
                onClick={() => toggleFaq(6)}
                className="w-full px-6 py-4 sm:py-6 text-left flex items-center justify-between hover:from-gray-100 hover:to-blue-100 transition-all duration-200"
              >
                <span className="text-base sm:text-lg font-semibold text-gray-900">
                  Can I purchase multiple tradelines?
                </span>
                <svg
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-600 transform transition-transform duration-200 ${
                    faqOpen[6] ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {faqOpen[6] && (
                <div className="px-6 pb-4 sm:pb-6">
                  <div className="bg-white/70 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                      Yes, you can purchase multiple tradelines for maximum impact. Many clients purchase <strong>2-3 tradelines</strong> to diversify their credit mix and achieve better results. We can help you select the best combination based on your current credit profile and goals. Contact us for personalized recommendations.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Section */}
      <div className="mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-12 shadow-2xl border border-gray-200/50 mx-0 sm:mx-0">
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent mb-3 sm:mb-4">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 inline mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure Payment Portal
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-2">
            Complete your tradeline purchase with our encrypted payment system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 px-0 sm:px-0">
          {/* Payment Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden order-2 lg:order-1">
            <div className="bg-gradient-to-r from-primary-600 to-[#93268f] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Purchase Tradeline
              </h2>
              <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
                Complete the form below to purchase your selected tradeline
              </p>
            </div>
            <div className="p-0 sm:p-4 lg:p-8">
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg sm:rounded-xl p-1 sm:p-2 border-2 border-gray-200/50">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/ENmFAls3bPBOyTtbu0yD"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    borderRadius: '3px',
                    minHeight: '2226px'
                  }}
                  id="inline-ENmFAls3bPBOyTtbu0yD" 
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="showOnScrolling"
                  data-trigger-value="50"
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="Tradeline Purchase"
                  data-height="2226"
                  data-layout-iframe-id="inline-ENmFAls3bPBOyTtbu0yD"
                  data-form-id="ENmFAls3bPBOyTtbu0yD"
                  title="Tradeline Purchase"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 order-1 lg:order-2">
            <div className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-[#93268f] px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Methods
                </h2>
                <p className="text-white/90 mt-1 sm:mt-2 text-sm sm:text-base">
                  Choose your preferred payment method
                </p>
              </div>
              <div className="p-0 sm:p-6 lg:p-8">
                <div className="space-y-4 sm:space-y-6">
                  {/* Zelle */}
                  <div className="group bg-gradient-to-r from-purple-50 to-indigo-50 p-4 sm:p-5 lg:p-6 border-2 border-purple-200 rounded-lg sm:rounded-xl hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 mb-3 sm:mb-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-white to-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={zelleIcon} 
                            alt="Zelle" 
                            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="sm:ml-4 lg:ml-6 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Zelle</h3>
                        <p className="text-purple-700 font-semibold text-sm sm:text-base">Elyse Whisby</p>
                        <p className="text-base sm:text-lg font-mono text-primary-600 font-bold">770-500-0566</p>
                      </div>
                    </div>
                  </div>

                  {/* CashApp */}
                  <div className="group bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-5 lg:p-6 border-2 border-green-200 rounded-lg sm:rounded-xl hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 mb-3 sm:mb-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-white to-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={cashAppIcon} 
                            alt="CashApp" 
                            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="sm:ml-4 lg:ml-6 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">CashApp</h3>
                        <p className="text-base sm:text-lg font-mono text-green-600 font-bold">$moneysolutioncafe</p>
                      </div>
                    </div>
                  </div>

                  {/* Apple Pay */}
                  <div className="group bg-gradient-to-r from-gray-50 to-slate-50 p-4 sm:p-5 lg:p-6 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center">
                      <div className="flex-shrink-0 mb-3 sm:mb-0">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-r from-white to-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={applePayIcon} 
                            alt="Apple Pay" 
                            className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="sm:ml-4 lg:ml-6 text-center sm:text-left">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">Apple Pay</h3>
                        <p className="text-base sm:text-lg font-mono text-gray-600 font-bold">770-500-0566</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 p-4 sm:p-5 lg:p-6 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-lg sm:rounded-xl">
                  <div className="flex flex-col sm:flex-row items-start">
                    <div className="flex-shrink-0 mb-3 sm:mb-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="sm:ml-4 text-center sm:text-left">
                      <h3 className="text-base sm:text-lg font-bold text-primary-800 mb-2">Payment Instructions</h3>
                      <div className="text-primary-700 space-y-2 text-sm sm:text-base">
                        <p className="font-medium flex flex-col sm:flex-row sm:items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          After completing the form, please send payment using one of the methods above.
                        </p>
                        <p className="font-medium flex flex-col sm:flex-row sm:items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Include your name and "Tradeline Purchase" in the payment note.
                        </p>
                        <p className="font-medium flex flex-col sm:flex-row sm:items-center">
                          <svg className="w-4 h-4 mr-2 flex-shrink-0 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Processing typically takes 24-48 hours after payment confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>
  );
};

export default PriorityTradelinesAU;
