const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Package Categories Model
const PackageCategory = sequelize.define('PackageCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'package_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Tax Packages Model
const TaxPackage = sequelize.define('TaxPackage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at'
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  price: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  revenueShare: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'revenue_share'
  },
  efinRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'efin_required'
  },
  efinDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'efin_description'
  },
  ptinRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'ptin_required'
  },
  ptinDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'ptin_description'
  },
  minReturns: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'min_returns'
  },
  minReturnsDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'min_returns_description'
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'category_id',
    references: {
      model: PackageCategory,
      key: 'id'
    }
  },
  process: {
    type: DataTypes.JSON,
    allowNull: true
  },
  includes: {
    type: DataTypes.JSON,
    allowNull: true
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
  seoKeywords: {
    type: DataTypes.STRING(500),
    allowNull: true,
    field: 'seo_keywords'
  },
  seoDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'seo_description'
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'sort_order'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'tax_packages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Define associations
PackageCategory.hasMany(TaxPackage, {
  foreignKey: 'categoryId',
  as: 'packages'
});

TaxPackage.belongsTo(PackageCategory, {
  foreignKey: 'categoryId',
  as: 'category'
});

module.exports = {
  TaxPackage,
  PackageCategory
};
