import React, { useState, useEffect, useCallback } from 'react';
import { priorityTradelinesAUAPI } from '../../services/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import zelleIcon from '../../images/z.png';
import cashAppIcon from '../../images/$.png';
import applePayIcon from '../../images/ipay.png';
import logoImage from '../../images/logo.png';

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
    maxCreditLimit: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0
  });
  const [stats, setStats] = useState(null);

  // Fetch tradelines data
  const fetchTradelines = useCallback(async () => {
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
  }, [pagination.page, pagination.limit, filters]);

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
    fetchTradelines();
    fetchStats();
    
    // Load the form embed script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [fetchTradelines, pagination.page, pagination.limit]);

  // Auto-filter when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchTradelines();
    }, 500); // 500ms delay for debouncing

    return () => clearTimeout(timer);
  }, [filters, fetchTradelines]);

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

  // Handle pagination
  const goToPage = (page) => {
    setPagination(prev => ({ ...prev, page }));
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

  if (loading && tradelines.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-full mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent mb-6">
            Priority Tradelines AU
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover premium authorized user tradeline opportunities to enhance your credit profile with our curated inventory
          </p>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Tradelines</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTradelines}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Average Price</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${stats.priceStats.average}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Average Credit Limit</h3>
              <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent">${stats.avgCreditLimit}</p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Price Range</h3>
              <p className="text-lg font-bold text-gray-900">
                ${stats.priceStats.minimum} - ${stats.priceStats.maximum}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-12">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-xl flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent">Smart Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M7 7h3m0 0v8m0-8h7m-7 0V3" />
                </svg>
                Bank Institution
              </label>
              <input
                type="text"
                name="bank"
                value={filters.bank}
                onChange={handleFilterChange}
                placeholder="Search by bank name..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              />
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Account Year Range
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  name="minAge"
                  value={filters.minAge}
                  onChange={handleFilterChange}
                  placeholder="From Year"
                  min="1990"
                  max="2025"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxAge"
                  value={filters.maxAge}
                  onChange={handleFilterChange}
                  placeholder="To Year"
                  min="1990"
                  max="2025"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Price Range
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  placeholder="Min Price"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  placeholder="Max Price"
                  min="0"
                  step="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-3 group-hover:text-primary-600 transition-colors">
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Credit Limit Range
              </label>
              <div className="flex space-x-3">
                <input
                  type="number"
                  name="minCreditLimit"
                  value={filters.minCreditLimit}
                  onChange={handleFilterChange}
                  placeholder="Min Limit"
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
                <input
                  type="number"
                  name="maxCreditLimit"
                  value={filters.maxCreditLimit}
                  onChange={handleFilterChange}
                  placeholder="Max Limit"
                  min="0"
                  step="100"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </div>
        </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

        {/* Tradelines Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-8 py-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-xl flex items-center justify-center mr-4">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent">
                  Available Tradelines
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {pagination.total} premium tradelines in inventory
                </p>
              </div>
            </div>
          </div>        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : tradelines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tradelines found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative">
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
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Available Spots
                    </div>
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Account Year
                    </div>
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h2M7 3h10M7 7h3m0 0v8m0-8h7m-7 0V3" />
                      </svg>
                      Bank Institution
                    </div>
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      Credit Limit
                    </div>
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Closing Date
                    </div>
                  </th>
                  <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
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
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:bg-green-500"></div>
                        {tradeline.spots}
                      </div>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-primary-100 to-purple-100 text-primary-800 border border-primary-200">
                        {tradeline.age}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-primary-700">
                      {tradeline.bank}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-green-600">
                      {formatCurrency(tradeline.creditLimit)}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-medium">
                        {formatDate(tradeline.closingDate)}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-sm">
                      <span className="inline-flex px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                        {formatCurrency(tradeline.price)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
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
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => goToPage(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
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
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Section */}
      <div className="mt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-12 shadow-2xl border border-gray-200/50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-[#93268f] bg-clip-text text-transparent mb-4">
            <svg className="w-10 h-10 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Secure Payment Portal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Complete your tradeline purchase with our encrypted payment system
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Payment Form */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-[#93268f] px-8 py-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Purchase Tradeline
              </h2>
              <p className="text-white/90 mt-2">
                Complete the form below to purchase your selected tradeline
              </p>
            </div>
            <div className="p-8">
              <div style={{ height: '2500px', minHeight: '1200px' }} className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-2 border-2 border-gray-200/50">
                <iframe
                  src="https://api.leadconnectorhq.com/widget/form/ENmFAls3bPBOyTtbu0yD"
                  style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }}
                  id="inline-ENmFAls3bPBOyTtbu0yD"
                  data-layout="{'id':'INLINE'}"
                  data-trigger-type="alwaysShow"
                  data-trigger-value=""
                  data-activation-type="alwaysActivated"
                  data-activation-value=""
                  data-deactivation-type="neverDeactivate"
                  data-deactivation-value=""
                  data-form-name="MSC Tradeline Purchase - New//"
                  data-height="1200"
                  data-layout-iframe-id="inline-ENmFAls3bPBOyTtbu0yD"
                  data-form-id="ENmFAls3bPBOyTtbu0yD"
                  title="MSC Tradeline Purchase - New//"
                />
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-[#93268f] px-8 py-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Payment Methods
                </h2>
                <p className="text-white/90 mt-2">
                  Choose your preferred payment method
                </p>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  {/* Zelle */}
                  <div className="group bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-2 border-purple-200 rounded-xl hover:from-purple-100 hover:to-indigo-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-white to-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={zelleIcon} 
                            alt="Zelle" 
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Zelle</h3>
                        <p className="text-purple-700 font-semibold">Elyse Whisby</p>
                        <p className="text-lg font-mono text-primary-600 font-bold">770-500-0566</p>
                      </div>
                    </div>
                  </div>

                  {/* CashApp */}
                  <div className="group bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-2 border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-white to-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={cashAppIcon} 
                            alt="CashApp" 
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">CashApp</h3>
                        <p className="text-lg font-mono text-green-600 font-bold">$moneysolutioncafe</p>
                      </div>
                    </div>
                  </div>

                  {/* Apple Pay */}
                  <div className="group bg-gradient-to-r from-gray-50 to-slate-50 p-6 border-2 border-gray-200 rounded-xl hover:from-gray-100 hover:to-slate-100 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-white to-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <img 
                            src={applePayIcon} 
                            alt="Apple Pay" 
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                      </div>
                      <div className="ml-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Apple Pay</h3>
                        <p className="text-lg font-mono text-gray-600 font-bold">770-500-0566</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200 rounded-xl">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-[#93268f] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-primary-800 mb-2">Payment Instructions</h3>
                      <div className="text-primary-700 space-y-2">
                        <p className="font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          After completing the form, please send payment using one of the methods above.
                        </p>
                        <p className="font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Include your name and "Tradeline Purchase" in the payment note.
                        </p>
                        <p className="font-medium flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
