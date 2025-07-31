// Import all models and set up associations
const Admin = require('./Admin');
const { TaxPackage, PackageCategory } = require('./Course');
const { Service } = require('./Service');
const { PriorityTradelinesAU } = require('./PriorityTradelinesAU');

// Export all models
module.exports = {
  Admin,
  TaxPackage,
  PackageCategory,
  // Keep these for backward compatibility
  Course: TaxPackage,
  CourseCategory: PackageCategory,
  Service,
  PriorityTradelinesAU
};
