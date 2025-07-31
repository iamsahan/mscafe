const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Service = sequelize.define('Service', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'short_description'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    defaultValue: 60,
    field: 'duration_minutes'
  },
  serviceType: {
    type: DataTypes.ENUM('consultation', 'tax_preparation', 'financial_planning', 'business_advisory'),
    allowNull: false,
    field: 'service_type'
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'image_url'
  },
  link: {
    type: DataTypes.STRING(1000),
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  requirements: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'services',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = { Service };
