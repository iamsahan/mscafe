import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  CreditCardIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { priorityTradelinesAUAPI } from '../../services/api';

const PriorityTradelinesManagement = () => {
  const [tradelines, setTradelines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTradeline, setSelectedTradeline] = useState(null);
  const [formData, setFormData] = useState({
    spots: '',
    age: '',
    bank: '',
    creditLimit: '',
    statement: '',
    closingDate: '',
    price: '',
    isActive: true
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadTradelines = async () => {
      if (isMounted) {
        await fetchTradelines();
      }
    };
    
    loadTradelines();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const fetchTradelines = async () => {
    try {
      setLoading(true);
      let allTradelines = [];
      let currentPage = 1;
      let totalPages = 1;
      
      // Fetch all pages of data for admin view
      do {
        const response = await priorityTradelinesAUAPI.getAll({ 
          includeInactive: 'true',
          limit: 50, // Reasonable page size
          page: currentPage
        });
        
        if (response.data && response.data.success) {
          const pageData = response.data.data || [];
          allTradelines = [...allTradelines, ...pageData];
          
          // Check if there's pagination info
          if (response.data.pagination) {
            totalPages = response.data.pagination.totalPages || 1;
          } else if (response.data.totalPages) {
            totalPages = response.data.totalPages;
          } else {
            // If no pagination info and we got data, assume this is all the data
            totalPages = currentPage;
          }
          
          console.log(`Loaded page ${currentPage}/${totalPages}, got ${pageData.length} records`);
        } else {
          break;
        }
        
        currentPage++;
      } while (currentPage <= totalPages);
      
      setTradelines(allTradelines);
      console.log(`Total tradelines loaded: ${allTradelines.length}`);
      console.log('Tradelines status breakdown:', allTradelines.map(t => ({
        id: t.id,
        bank: t.bank,
        isActive: t.isActive,
        is_active: t.is_active,
        actualActiveStatus: t.isActive === 1 || t.isActive === true || t.is_active === 1 || t.is_active === true
      })));
      
      if (allTradelines.length === 0) {
        toast.info('No tradelines found');
      }
    } catch (error) {
      console.error('Error fetching tradelines:', error);
      if (error.response?.status === 404) {
        setTradelines([]);
        toast.info('No tradelines found');
      } else {
        toast.error('Failed to load tradelines');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Get form values directly from form elements (uncontrolled inputs)
      const form = e.target;
      if (!form) {
        throw new Error('Form not found');
      }
      
      const tradelineData = {
        spots: (form.spots?.value || '').trim(), // String as expected by backend
        age: parseInt(form.age?.value) || 2024, // Integer (year) as expected by backend
        bank: (form.bank?.value || '').trim(),
        creditLimit: parseFloat(form.creditLimit?.value) || 0,
        statement: (form.statement?.value || '').trim(), // Optional field that exists in backend
        closingDate: form.closingDate?.value || '',
        price: parseFloat(form.price?.value) || 0,
        isActive: Boolean(form.isActive?.checked) // Read directly from checkbox, not formData
        // Removed isFeatured and riskLevel as they don't exist in backend model
      };
      
      const response = await priorityTradelinesAUAPI.create(tradelineData);
      
      if (response.data && response.data.success) {
        toast.success('Tradeline created successfully');
        setShowCreateModal(false);
        resetForm();
        await fetchTradelines();
      } else {
        toast.error(response.data?.message || 'Failed to create tradeline');
      }
    } catch (error) {
      console.error('Error creating tradeline:', error);
      toast.error(error.response?.data?.message || 'Failed to create tradeline');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Get form values directly from form elements (uncontrolled inputs)
      const form = e.target;
      if (!form) {
        throw new Error('Form not found');
      }
      
      const tradelineData = {
        spots: (form.spots?.value || '').trim(), // String as expected by backend
        age: parseInt(form.age?.value) || 2024, // Integer (year) as expected by backend
        bank: (form.bank?.value || '').trim(),
        creditLimit: parseFloat(form.creditLimit?.value) || 0,
        statement: (form.statement?.value || '').trim(), // Optional field that exists in backend
        closingDate: form.closingDate?.value || '',
        price: parseFloat(form.price?.value) || 0,
        isActive: Boolean(form.isActive?.checked) // Read directly from checkbox, not formData
        // Removed isFeatured and riskLevel as they don't exist in backend model
      };
      
      const response = await priorityTradelinesAUAPI.update(selectedTradeline.id, tradelineData);
      
      if (response.data && response.data.success) {
        toast.success('Tradeline updated successfully');
        setShowEditModal(false);
        resetForm();
        await fetchTradelines();
      } else {
        toast.error(response.data?.message || 'Failed to update tradeline');
      }
    } catch (error) {
      console.error('Error updating tradeline:', error);
      toast.error(error.response?.data?.message || 'Failed to update tradeline');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await priorityTradelinesAUAPI.delete(selectedTradeline.id);
      if (response.data && response.data.success) {
        toast.success('Tradeline deleted successfully');
        setShowDeleteModal(false);
        setSelectedTradeline(null);
        await fetchTradelines();
      } else {
        toast.error('Failed to delete tradeline');
      }
    } catch (error) {
      console.error('Error deleting tradeline:', error);
      toast.error(error.response?.data?.message || 'Failed to delete tradeline');
    }
  };

  const resetForm = () => {
    setFormData({
      spots: '',
      age: '',
      bank: '',
      creditLimit: '',
      statement: '',
      closingDate: '',
      price: '',
      isActive: true
    });
    setSelectedTradeline(null);
  };

  const openEditModal = (tradeline) => {
    setSelectedTradeline(tradeline);
    
    // Format closing date properly for date input
    let formattedClosingDate = '';
    const closingDate = tradeline.closingDate || tradeline.closing_date || '';
    if (closingDate) {
      try {
        const date = new Date(closingDate);
        if (!isNaN(date.getTime())) {
          formattedClosingDate = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
      } catch (error) {
        console.warn('Error formatting closing date:', error);
      }
    }
    
    setFormData({
      spots: (tradeline.spots || '').toString(),
      age: (tradeline.age || '').toString(),
      bank: tradeline.bank || '',
      creditLimit: (tradeline.creditLimit || tradeline.credit_limit || '').toString(),
      statement: tradeline.statement || '',
      closingDate: formattedClosingDate,
      price: (tradeline.price || '').toString(),
      isActive: tradeline.isActive === 1 || tradeline.isActive === true || tradeline.is_active === 1 || tradeline.is_active === true
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (tradeline) => {
    setSelectedTradeline(tradeline);
    setShowDeleteModal(true);
  };

  const filteredTradelines = tradelines
    .filter(tradeline => {
      const bank = tradeline.bank || '';
      const age = tradeline.age || '';
      const matchesSearch = bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           age.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isActive = tradeline.isActive === 1 || tradeline.isActive === true || 
                      tradeline.is_active === 1 || tradeline.is_active === true;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'active' && isActive) ||
                           (filterStatus === 'inactive' && !isActive);
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = parseFloat(a.price || 0);
          bValue = parseFloat(b.price || 0);
          break;
        case 'bank':
          aValue = (a.bank || '').toLowerCase();
          bValue = (b.bank || '').toLowerCase();
          break;
        case 'creditLimit':
          aValue = parseFloat(a.creditLimit || a.credit_limit || 0);
          bValue = parseFloat(b.creditLimit || b.credit_limit || 0);
          break;
        case 'age':
          aValue = (a.age || '').toLowerCase();
          bValue = (b.age || '').toLowerCase();
          break;
        case 'spots':
          aValue = parseInt(a.spots || 0);
          bValue = parseInt(b.spots || 0);
          break;
        case 'closingDate':
          aValue = new Date(a.closingDate || a.closing_date || '1970-01-01');
          bValue = new Date(b.closingDate || b.closing_date || '1970-01-01');
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.created_at || a.createdAt || '1970-01-01');
          bValue = new Date(b.created_at || b.createdAt || '1970-01-01');
          break;
      }
      
      // Handle different data types for comparison
      if (aValue instanceof Date && bValue instanceof Date) {
        const result = aValue.getTime() - bValue.getTime();
        return sortOrder === 'asc' ? result : -result;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortOrder === 'asc' ? result : -result;
      } else {
        // Numeric comparison
        const result = (aValue || 0) - (bValue || 0);
        return sortOrder === 'asc' ? result : -result;
      }
    });

  const FormModal = ({ isOpen, onClose, onSubmit, title, isEdit = false, selectedTradeline = null }) => {
    // Create refs for all form inputs to manage them manually
    const formRef = useRef();
    
    // Reset form when modal opens
    useEffect(() => {
      if (isOpen && formRef.current) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (formRef.current) {
            if (isEdit && selectedTradeline) {
              // Fill form with selected tradeline data for edit
              const form = formRef.current;
              if (form && form.spots) form.spots.value = selectedTradeline.spots || '';
              if (form && form.age) form.age.value = selectedTradeline.age || '';
              if (form && form.bank) form.bank.value = selectedTradeline.bank || '';
              if (form && form.creditLimit) form.creditLimit.value = selectedTradeline.creditLimit || '';
              if (form && form.statement) form.statement.value = selectedTradeline.statement || '';
              if (form && form.closingDate) form.closingDate.value = selectedTradeline.closingDate || '';
              if (form && form.price) form.price.value = selectedTradeline.price || '';
              // isActive is now controlled by React state, no need to set manually
            } else {
              // Reset form for create and set default values
              formRef.current.reset();
              // isActive is now controlled by React state, defaults to true
            }
          }
        }, 50);
      }
    }, [isOpen, isEdit, selectedTradeline]);

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form ref={formRef} onSubmit={onSubmit} className="space-y-6" autoComplete="off">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Spots Available
                    </label>
                    <input
                      type="text"
                      name="spots"
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="e.g., 5 spots available"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Account Year
                    </label>
                    <input
                      type="number"
                      name="age"
                      required
                      min="1990"
                      max="2025"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Bank Institution
                    </label>
                    <input
                      type="text"
                      name="bank"
                      required
                      maxLength="255"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="e.g., Chase Bank"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Credit Limit ($)
                    </label>
                    <input
                      type="number"
                      name="creditLimit"
                      required
                      min="0"
                      step="0.01"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="25000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Statement Information
                    </label>
                    <input
                      type="text"
                      name="statement"
                      maxLength="255"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="e.g., Monthly statement (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Closing Date
                    </label>
                    <input
                      type="date"
                      name="closingDate"
                      required
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Investment Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      step="0.01"
                      autoComplete="off"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      placeholder="1500.00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={isEdit ? formData.isActive : true}
                      onChange={(e) => {
                        // For controlled checkbox, we need to update formData
                        setFormData(prev => ({
                          ...prev,
                          isActive: e.target.checked
                        }));
                      }}
                      className="w-4 h-4 text-violet-600 border-slate-300 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      Active
                    </span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={submitting}
                    className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isEdit ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      isEdit ? 'Update Tradeline' : 'Create Tradeline'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Priority Tradelines Management</h1>
          <p className="text-slate-600 mt-1">
            Manage your tradeline offerings and inventory
          </p>
        </div>
        <button
          onClick={() => {
            resetForm(); // Ensure form starts with default values including isActive: true
            setShowCreateModal(true);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Tradeline
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
          {/* Search and Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tradelines by bank institution or account year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
              
              {/* Clear Filters Button */}
              {(searchTerm || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                  }}
                  className="px-3 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FunnelIcon className="h-4 w-4" />
              <span>Sort by:</span>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent text-sm"
            >
              <option value="createdAt">Date Created</option>
              <option value="bank">Bank Institution</option>
              <option value="price">Investment Price</option>
              <option value="creditLimit">Credit Limit</option>
              <option value="age">Account Year</option>
              <option value="spots">Spots Available</option>
              <option value="closingDate">Closing Date</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className={`p-2 border rounded-lg transition-colors ${
                sortOrder === 'asc' 
                  ? 'border-violet-300 bg-violet-50 text-violet-600' 
                  : 'border-slate-300 hover:bg-slate-50 text-slate-600'
              }`}
              title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              <ChevronUpDownIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>
              Showing {filteredTradelines.length} of {tradelines.length} tradelines
              {searchTerm && (
                <span className="ml-2 text-violet-600">
                  matching "{searchTerm}"
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className="ml-2 px-2 py-1 bg-slate-100 rounded text-xs">
                  {filterStatus}
                </span>
              )}
            </span>
            {tradelines.length > 0 && (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {tradelines.filter(t => t.isActive === 1 || t.isActive === true || t.is_active === 1 || t.is_active === true).length} Active
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {tradelines.filter(t => !(t.isActive === 1 || t.isActive === true || t.is_active === 1 || t.is_active === true)).length} Inactive
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  {tradelines.filter(t => t.isFeatured === 1 || t.isFeatured === true || t.is_featured === 1 || t.is_featured === true).length} Featured
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tradelines Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Spots Available
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Account Year
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Bank Institution
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Credit Limit
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Closing Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Investment Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTradelines.map((tradeline) => {
                const spots = tradeline.spots || '0';
                const age = tradeline.age || '';
                const bank = tradeline.bank || '';
                const creditLimit = tradeline.creditLimit || tradeline.credit_limit || 0;
                const closingDate = tradeline.closingDate || tradeline.closing_date || '';
                const price = tradeline.price || 0;
                const isActive = tradeline.isActive === 1 || tradeline.isActive === true || 
                               tradeline.is_active === 1 || tradeline.is_active === true;

                // Helper function to format currency
                const formatCurrency = (amount) => {
                  return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(amount);
                };

                // Helper function to format date
                const formatDate = (dateString) => {
                  if (!dateString) return 'N/A';
                  try {
                    return new Date(dateString).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  } catch {
                    return 'Invalid Date';
                  }
                };

                return (
                  <motion.tr
                    key={tradeline.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                        <div className="text-sm font-medium text-slate-900">
                          {spots}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-violet-100 to-purple-100 text-violet-800 border border-violet-200">
                        {age}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">
                        {bank}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-green-600">
                        {formatCurrency(creditLimit)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-medium text-slate-900">
                        {formatDate(closingDate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200">
                        {formatCurrency(price)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActive 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openEditModal(tradeline)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit tradeline"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(tradeline)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete tradeline"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredTradelines.length === 0 && (
          <div className="text-center py-12">
            <CreditCardIcon className="mx-auto h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">
              No tradelines found
            </h3>
            <p className="text-slate-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'Get started by creating your first tradeline'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <FormModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreate}
        title="Create New Tradeline"
        isEdit={false}
        selectedTradeline={null}
      />

      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleEdit}
        title="Edit Tradeline"
        isEdit={true}
        selectedTradeline={selectedTradeline}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Delete Tradeline
                </h3>
                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete "{selectedTradeline?.bank} - {selectedTradeline?.age}"? This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PriorityTradelinesManagement;


