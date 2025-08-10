const { Admin, TaxPackage, Service, PriorityTradelinesAU } = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op, sequelize } = require('sequelize');
const { sequelize: dbSequelize } = require('../config/database');

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/dashboard
// @access  Private (Admin)
const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Initialize dashboard stats with system status
    const stats = {
      overview: {
        totalPackages: 0,
        totalServices: 0,
        totalTradelines: 0,
        totalAdmins: 0
      },
      recentCounts: {
        packages: 0,
        services: 0,
        tradelines: 0
      },
      statistics: {
        packages: {
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0
        },
        services: {
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0
        },
        tradelines: {
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0,
          avgCreditLimit: 0
        }
      },
      systemStatus: {
        api: false,
        apiMessage: '',
        database: false,
        databaseMessage: '',
        storage: false,
        storageMessage: ''
      },
      recentActivity: []
    };

    try {
      // Get basic counts with error handling
      stats.overview.totalPackages = await TaxPackage.count({ where: { is_active: true } }) || 0;
    } catch (error) {
      console.log('TaxPackage count error:', error.message);
    }

    try {
      stats.overview.totalServices = await Service.count({ where: { is_active: true } }) || 0;
    } catch (error) {
      console.log('Service count error:', error.message);
    }

    try {
      stats.overview.totalTradelines = await PriorityTradelinesAU.count({ where: { is_active: true } }) || 0;
    } catch (error) {
      console.log('PriorityTradelinesAU count error:', error.message);
    }

    try {
      stats.overview.totalAdmins = await Admin.count({ where: { is_active: true } }) || 0;
    } catch (error) {
      console.log('Admin count error:', error.message);
    }

    // Get growth trends for the last 6 months
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return {
        startDate: new Date(date.getFullYear(), date.getMonth(), 1),
        endDate: new Date(date.getFullYear(), date.getMonth() + 1, 0),
        month: date.toLocaleString('default', { month: 'short' })
      };
    }).reverse();

    const growthData = await Promise.all(
      lastSixMonths.map(async ({ startDate, endDate, month }) => {
        const packages = await TaxPackage.count({
          where: {
            created_at: {
              [Op.between]: [startDate, endDate]
            }
          }
        });

        const services = await Service.count({
          where: {
            created_at: {
              [Op.between]: [startDate, endDate]
            }
          }
        });

        const tradelines = await PriorityTradelinesAU.count({
          where: {
            created_at: {
              [Op.between]: [startDate, endDate]
            }
          }
        });

        return {
          month,
          packages,
          services,
          tradelines
        };
      })
    );

    stats.growthData = growthData;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentPackages, recentServices, recentTradelines] = await Promise.all([
      TaxPackage.count({
        where: {
          created_at: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      }),
      Service.count({
        where: {
          created_at: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      }),
      PriorityTradelinesAU.count({
        where: {
          created_at: {
            [Op.gte]: thirtyDaysAgo
          }
        }
      })
    ]);

    stats.recentCounts = {
      packages: recentPackages,
      services: recentServices,
      tradelines: recentTradelines
    };

    stats.distributionData = [
      { name: 'Tax Packages', value: stats.overview.totalPackages, color: '#8884d8' },
      { name: 'Services', value: stats.overview.totalServices, color: '#82ca9d' },
      { name: 'Tradelines', value: stats.overview.totalTradelines, color: '#ffc658' }
    ];

    // Check API Status
    stats.systemStatus.api = true;
    stats.systemStatus.apiMessage = 'API is running normally';

    // Check Database Status
    try {
      await dbSequelize.authenticate();
      stats.systemStatus.database = true;
      stats.systemStatus.databaseMessage = 'Database connection is healthy';
    } catch (error) {
      stats.systemStatus.database = false;
      stats.systemStatus.databaseMessage = 'Database connection error';
      console.error('Database connection error:', error);
    }

    // Check Storage Status (uploads directory)
    const fs = require('fs');
    const path = require('path');
    const uploadsPath = path.join(__dirname, '../uploads');
    
    try {
      await fs.promises.access(uploadsPath, fs.constants.W_OK);
      stats.systemStatus.storage = true;
      stats.systemStatus.storageMessage = 'Storage system is accessible';
    } catch (error) {
      stats.systemStatus.storage = false;
      stats.systemStatus.storageMessage = 'Storage system is not accessible';
      console.error('Storage access error:', error);
    }

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// @desc    Get all admins
// @route   GET /api/v1/admin/users
// @access  Private (Super Admin)
const getAdmins = asyncHandler(async (req, res) => {
  const { page = 1, limit = 100, search = '', role = '' } = req.query;

  const where = {};
  
  if (search) {
    where[Op.or] = [
      { firstName: { [Op.like]: `%${search}%` } },
      { lastName: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } }
    ];
  }

  if (role && role !== '') {
    where.role = role;
  }

  const offset = (page - 1) * limit;

  const { count, rows: admins } = await Admin.findAndCountAll({
    where,
    attributes: { exclude: ['password'] },
    order: [['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    count: admins.length,
    total: count,
    data: admins,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
});

// @desc    Create new admin
// @route   POST /api/v1/admin/users
// @access  Private (Super Admin)
const createAdmin = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role, permissions } = req.body;

  // Check if admin already exists
  const existingAdmin = await Admin.findOne({
    where: { email: email.toLowerCase() }
  });

  if (existingAdmin) {
    return res.status(400).json({
      success: false,
      message: 'Admin with this email already exists'
    });
  }

  // Create admin
  const admin = await Admin.create({
    email: email.toLowerCase(),
    password,
    firstName,
    lastName,
    role: role || 'admin',
    permissions: permissions || {}
  });

  // Remove password from response
  const adminData = {
    id: admin.id,
    email: admin.email,
    firstName: admin.firstName,
    lastName: admin.lastName,
    role: admin.role,
    permissions: admin.permissions,
    isActive: admin.isActive,
    createdAt: admin.createdAt
  };

  res.status(201).json({
    success: true,
    message: 'Admin created successfully',
    data: adminData
  });
});

// @desc    Update admin
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Super Admin)
const updateAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found'
    });
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email && req.body.email !== admin.email) {
    const existingAdmin = await Admin.findOne({
      where: { email: req.body.email.toLowerCase() }
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Email is already registered'
      });
    }
  }

  await admin.update(req.body);

  // Remove password from response
  const adminData = {
    id: admin.id,
    email: admin.email,
    firstName: admin.firstName,
    lastName: admin.lastName,
    role: admin.role,
    permissions: admin.permissions,
    isActive: admin.isActive,
    lastLogin: admin.lastLogin,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  };

  res.json({
    success: true,
    message: 'Admin updated successfully',
    data: adminData
  });
});

// @desc    Delete admin
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Super Admin)
const deleteAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByPk(req.params.id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: 'Admin not found'
    });
  }

  // Prevent deleting yourself
  if (admin.id === req.admin.id) {
    return res.status(400).json({
      success: false,
      message: 'You cannot delete your own account'
    });
  }

  await admin.destroy();

  res.json({
    success: true,
    message: 'Admin deleted successfully'
  });
});

module.exports = {
  getDashboardStats,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
};
