'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add link column to tax_packages table
    await queryInterface.addColumn('tax_packages', 'link', {
      type: Sequelize.STRING(1000),
      allowNull: true,
      after: 'image_url'
    });

    // Add link column to services table
    await queryInterface.addColumn('services', 'link', {
      type: Sequelize.STRING(1000),
      allowNull: true,
      after: 'requirements'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove link column from tax_packages table
    await queryInterface.removeColumn('tax_packages', 'link');
    
    // Remove link column from services table
    await queryInterface.removeColumn('services', 'link');
  }
};
