import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { adminAPI } from '../../services/api';
import { toast } from 'react-toastify';
import {
  ChartBarIcon,
  CubeIcon,
  WrenchScrewdriverIcon,
  CreditCardIcon,
  UsersIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CalendarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { AdminStatsGrid } from '../../components/Layout/AdminStats';
import AdminBreadcrumb from '../../components/Layout/AdminBreadcrumb';

const AdminDashboard = () => {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const dashboardStats = [
    {
      title: 'Total Packages',
      value: stats?.overview?.totalPackages || 0,
      change: stats?.changes?.packages || '0%',
      changeType: (stats?.changes?.packages || 0) >= 0 ? 'increase' : 'decrease',
      icon: CubeIcon,
      color: 'blue'
    },
    {
      title: 'Total Services',
      value: stats?.overview?.totalServices || 0,
      change: stats?.changes?.services || '0%',
      changeType: (stats?.changes?.services || 0) >= 0 ? 'increase' : 'decrease',
      icon: WrenchScrewdriverIcon,
      color: 'green'
    },
    {
      title: 'Priority Tradelines',
      value: stats?.overview?.totalTradelines || 0,
      change: stats?.changes?.tradelines || '0%',
      changeType: (stats?.changes?.tradelines || 0) >= 0 ? 'increase' : 'decrease',
      icon: CreditCardIcon,
      color: 'violet'
    },
    {
      title: 'Admin Users',
      value: stats?.overview?.totalAdmins || 0,
      change: stats?.changes?.admins || '0%',
      changeType: (stats?.changes?.admins || 0) >= 0 ? 'increase' : 'decrease',
      icon: UsersIcon,
      color: 'orange'
    }
  ];

  const recentStats = [
    {
      name: 'Recent Packages',
      value: stats?.recentCounts?.packages || 0,
      total: stats?.overview?.totalPackages || 0,
      icon: CubeIcon,
      color: 'text-blue-600'
    },
    {
      name: 'Recent Services',
      value: stats?.recentCounts?.services || 0,
      total: stats?.overview?.totalServices || 0,
      icon: WrenchScrewdriverIcon,
      color: 'text-green-600'
    },
    {
      name: 'Recent Tradelines',
      value: stats?.recentCounts?.tradelines || 0,
      total: stats?.overview?.totalTradelines || 0,
      icon: CreditCardIcon,
      color: 'text-purple-600'
    }
  ];

  const chartData = stats?.growthData || [];

  const pieData = stats?.distributionData || [
    { name: 'Packages', value: stats?.overview?.totalPackages || 0, color: '#3B82F6' },
    { name: 'Services', value: stats?.overview?.totalServices || 0, color: '#10B981' },
    { name: 'Tradelines', value: stats?.overview?.totalTradelines || 0, color: '#8B5CF6' }
  ];

  const quickActions = [
    {
      name: 'Add Package',
      description: 'Create new tax package',
      href: '/admin/packages',
      icon: CubeIcon,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      name: 'Add Service',
      description: 'Create new service',
      href: '/admin/services',
      icon: WrenchScrewdriverIcon,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      name: 'Add Tradeline',
      description: 'Create new tradeline',
      href: '/admin/priority-tradelines',
      icon: CreditCardIcon,
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      name: 'Manage Admins',
      description: 'User management',
      href: '/admin/admin-management',
      icon: UsersIcon,
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <AdminBreadcrumb />

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {admin?.firstName}! 👋
            </h1>
            <p className="text-violet-100 text-lg">
              Here's what's happening with your platform today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center space-x-4 text-violet-100">
              <div className="text-center">
                <CalendarIcon className="h-8 w-8 mx-auto mb-1" />
                <p className="text-sm">{new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <ClockIcon className="h-8 w-8 mx-auto mb-1" />
                <p className="text-sm">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Statistics */}
      <AdminStatsGrid stats={dashboardStats} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              Growth Trends
            </h3>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
                formatter={(value, name) => [`${value} ${name}`, '']}
                labelFormatter={(month) => `${month}`}
              />
              <Line 
                type="monotone" 
                dataKey="packages" 
                name="Packages"
                stroke="#3B82F6" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="services" 
                name="Services"
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="tradelines" 
                name="Tradelines"
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Distribution Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-6 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {item.name}: {item.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Recent Activity (Last 30 Days)
          </h3>
          <div className="space-y-4">
            {recentStats.map((stat, index) => {
              const Icon = stat.icon;
              const percentage = ((stat.value / stat.total) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {stat.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-slate-900 dark:text-white">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {percentage}% of total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
        >
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.a
                  key={index}
                  href={action.href}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`${action.color} text-white p-4 rounded-xl text-center transition-all duration-200 hover:shadow-lg`}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2" />
                  <div className="font-semibold text-sm">{action.name}</div>
                  <div className="text-xs opacity-90 mt-1">{action.description}</div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            {stats?.systemStatus?.api ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            )}
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">API Status</div>
              <div className={`text-sm ${stats?.systemStatus?.api ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.systemStatus?.apiMessage || 'Checking status...'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {stats?.systemStatus?.database ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            )}
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Database</div>
              <div className={`text-sm ${stats?.systemStatus?.database ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.systemStatus?.databaseMessage || 'Checking connection...'}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {stats?.systemStatus?.storage ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            )}
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">Storage</div>
              <div className={`text-sm ${stats?.systemStatus?.storage ? 'text-green-600' : 'text-red-600'}`}>
                {stats?.systemStatus?.storageMessage || 'Checking storage...'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
