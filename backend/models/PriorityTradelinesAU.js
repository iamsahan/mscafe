const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const PriorityTradelinesAU = sequelize.define('PriorityTradelinesAU', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  spots: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Available spots/slots'
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Account opening year (e.g., 2022)'
  },
  bank: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Bank name'
  },
  creditLimit: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'credit_limit',
    comment: 'Credit limit amount'
  },
  statement: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'Statement information'
  },
  closingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'closing_date',
    comment: 'Account closing date'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price for the tradeline'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active',
    comment: 'Whether the tradeline is active/available'
  }
}, {
  tableName: 'priority_tradelines_au',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = { PriorityTradelinesAU };
