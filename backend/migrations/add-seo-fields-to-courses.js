const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

async function addSeoFieldsToCourses() {
  try {
    console.log('Starting migration: Adding SEO fields to tax_packages table...');

    // Check if columns already exist
    const columns = await sequelize.query(
      "SHOW COLUMNS FROM `tax_packages` LIKE 'seo_keywords'",
      { type: QueryTypes.SELECT }
    );

    if (columns.length > 0) {
      console.log('SEO fields already exist in tax_packages table. Skipping migration.');
      return;
    }

    // Add seo_keywords column
    await sequelize.query(`
      ALTER TABLE tax_packages 
      ADD COLUMN seo_keywords VARCHAR(500) NULL AFTER link
    `);
    console.log('✓ Added seo_keywords column');

    // Add seo_description column
    await sequelize.query(`
      ALTER TABLE tax_packages 
      ADD COLUMN seo_description TEXT NULL AFTER seo_keywords
    `);
    console.log('✓ Added seo_description column');

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration if executed directly
if (require.main === module) {
  addSeoFieldsToCourses()
    .then(() => {
      console.log('Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { addSeoFieldsToCourses };
