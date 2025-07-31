const jwt = require('jsonwebtoken');
const { Admin, User } = require('../models');

// Middleware to verify JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's a user or admin token
    let user;
    if (decoded.isAdmin) {
      user = await Admin.findByPk(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. Admin not found or inactive.' 
        });
      }
      req.admin = user;
      req.isAdmin = true;
    } else {
      user = await User.findByPk(decoded.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token. User not found or inactive.' 
        });
      }
      req.user = user;
      req.isAdmin = false;
    }

    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to require user authentication (not admin)
const requireUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. User access required.' 
      });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. User not found or inactive.' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to require admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access required.' 
      });
    }

    const admin = await Admin.findByPk(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Admin not found or inactive.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token.' 
    });
  }
};

// Middleware to check admin permissions
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin access required.' 
      });
    }

    // Super admin has all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    // Check specific permission
    const permissions = req.admin.permissions || {};
    if (permissions[requiredPermission] === 'full' || permissions[requiredPermission] === 'edit') {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: 'Access denied. Insufficient permissions.' 
    });
  };
};

module.exports = {
  auth,
  requireUser,
  requireAdmin,
  checkPermission
};
