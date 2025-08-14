import React from 'react';
import { motion } from 'framer-motion';

const AdminStatsCard = ({ title, value, change, changeType, icon: Icon, color = 'violet' }) => {
  const colorClasses = {
    violet: 'from-violet-600 to-purple-600',
    blue: 'from-blue-600 to-indigo-600',
    green: 'from-green-600 to-emerald-600',
    orange: 'from-orange-600 to-red-600',
    pink: 'from-pink-600 to-rose-600'
  };

  const changeColor = changeType === 'increase' ? 'text-green-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-sm ${changeColor}`}>
              <span>{changeType === 'increase' ? '↗' : '↘'} {change}</span>
              <span className="text-slate-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 bg-gradient-to-r ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const AdminStatsGrid = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <AdminStatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export { AdminStatsCard, AdminStatsGrid };
