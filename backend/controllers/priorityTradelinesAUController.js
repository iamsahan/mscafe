const { PriorityTradelinesAU } = require('../models');
const { asyncHandler } = require('../middleware/error');
const { Op, sequelize } = require('sequelize');
const { sequelize: dbSequelize } = require('../config/database');

// @desc    Get all priority tradelines AU inventory
// @route   GET /api/v1/priority-tradelines-au
// @access  Public
const getPriorityTradelinesAU = asyncHandler(async (req, res) => {
  const { bank, minAge, maxAge, minPrice, maxPrice, minCreditLimit, maxCreditLimit, search, page = 1, limit = 10 } = req.query;
  
  const where = { isActive: true };
  
  // Filter by bank name
  if (bank) {
    where.bank = { [Op.like]: `%${bank}%` };
  }
  
  // Filter by age range
  if (minAge || maxAge) {
    where.age = {};
    if (minAge) where.age[Op.gte] = parseInt(minAge);
    if (maxAge) where.age[Op.lte] = parseInt(maxAge);
  }
  
  // Filter by price range
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
    if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
  }
  
  // Filter by credit limit range
  if (minCreditLimit || maxCreditLimit) {
    where.creditLimit = {};
    if (minCreditLimit) where.creditLimit[Op.gte] = parseFloat(minCreditLimit);
    if (maxCreditLimit) where.creditLimit[Op.lte] = parseFloat(maxCreditLimit);
  }
  
  // Search functionality
  if (search) {
    where[Op.or] = [
      { bank: { [Op.like]: `%${search}%` } },
      { spots: { [Op.like]: `%${search}%` } },
      { statement: { [Op.like]: `%${search}%` } }
    ];
  }

  const offset = (page - 1) * limit;

  const { count, rows: tradelines } = await PriorityTradelinesAU.findAndCountAll({
    where,
    order: [['age', 'DESC'], ['creditLimit', 'DESC'], ['created_at', 'DESC']],
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  res.json({
    success: true,
    count: tradelines.length,
    total: count,
    data: tradelines,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    }
  });
});

// @desc    Get single priority tradeline AU
// @route   GET /api/v1/priority-tradelines-au/:id
// @access  Public
const getPriorityTradelineAU = asyncHandler(async (req, res) => {
  const tradeline = await PriorityTradelinesAU.findByPk(req.params.id);

  if (!tradeline || !tradeline.isActive) {
    return res.status(404).json({
      success: false,
      message: 'Priority tradeline not found'
    });
  }

  res.json({
    success: true,
    data: tradeline
  });
});

// @desc    Create priority tradeline AU
// @route   POST /api/v1/priority-tradelines-au
// @access  Private (Admin)
const createPriorityTradelineAU = asyncHandler(async (req, res) => {
  const tradeline = await PriorityTradelinesAU.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Priority tradeline created successfully',
    data: tradeline
  });
});

// @desc    Update priority tradeline AU
// @route   PUT /api/v1/priority-tradelines-au/:id
// @access  Private (Admin)
const updatePriorityTradelineAU = asyncHandler(async (req, res) => {
  const tradeline = await PriorityTradelinesAU.findByPk(req.params.id);

  if (!tradeline) {
    return res.status(404).json({
      success: false,
      message: 'Priority tradeline not found'
    });
  }

  await tradeline.update(req.body);

  res.json({
    success: true,
    message: 'Priority tradeline updated successfully',
    data: tradeline
  });
});

// @desc    Delete priority tradeline AU
// @route   DELETE /api/v1/priority-tradelines-au/:id
// @access  Private (Admin)
const deletePriorityTradelineAU = asyncHandler(async (req, res) => {
  const tradeline = await PriorityTradelinesAU.findByPk(req.params.id);

  if (!tradeline) {
    return res.status(404).json({
      success: false,
      message: 'Priority tradeline not found'
    });
  }

  await tradeline.destroy();

  res.json({
    success: true,
    message: 'Priority tradeline deleted successfully'
  });
});

// @desc    Get priority tradelines AU statistics
// @route   GET /api/v1/priority-tradelines-au/stats
// @access  Public
const getPriorityTradelinesAUStats = asyncHandler(async (req, res) => {
  const totalTradelines = await PriorityTradelinesAU.count({ where: { isActive: true } });
  
  const avgPrice = await PriorityTradelinesAU.findOne({
    attributes: [
      [dbSequelize.fn('AVG', dbSequelize.col('price')), 'avgPrice'],
      [dbSequelize.fn('MIN', dbSequelize.col('price')), 'minPrice'],
      [dbSequelize.fn('MAX', dbSequelize.col('price')), 'maxPrice'],
      [dbSequelize.fn('AVG', dbSequelize.col('credit_limit')), 'avgCreditLimit']
    ],
    where: { isActive: true },
    raw: true
  });

  const bankStats = await PriorityTradelinesAU.findAll({
    attributes: [
      'bank',
      [dbSequelize.fn('COUNT', dbSequelize.col('id')), 'count']
    ],
    where: { isActive: true },
    group: ['bank'],
    order: [[dbSequelize.fn('COUNT', dbSequelize.col('id')), 'DESC']],
    raw: true
  });

  res.json({
    success: true,
    data: {
      totalTradelines,
      priceStats: {
        average: parseFloat(avgPrice?.avgPrice || 0).toFixed(2),
        minimum: parseFloat(avgPrice?.minPrice || 0).toFixed(2),
        maximum: parseFloat(avgPrice?.maxPrice || 0).toFixed(2)
      },
      avgCreditLimit: parseFloat(avgPrice?.avgCreditLimit || 0).toFixed(2),
      bankDistribution: bankStats
    }
  });
});

module.exports = {
  getPriorityTradelinesAU,
  getPriorityTradelineAU,
  createPriorityTradelineAU,
  updatePriorityTradelineAU,
  deletePriorityTradelineAU,
  getPriorityTradelinesAUStats
};
