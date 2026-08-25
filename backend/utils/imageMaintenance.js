const { Service } = require('../models');
const { TaxPackage } = require('../models/Course');
const path = require('path');
const fs = require('fs');
const { fixMissingImages, checkMissingImages } = require('./fixMissingImages');
const { createDefaultPlaceholders } = require('./createPlaceholders');

/**
 * Comprehensive image maintenance script
 */
class ImageMaintenanceManager {
  constructor() {
    this.servicesPath = path.join(__dirname, '../uploads/images/services');
    this.coursesPath = path.join(__dirname, '../uploads/images/courses');
  }

  /**
   * Ensure upload directories exist
   */
  ensureDirectories() {
    console.log('📁 Checking upload directories...');
    
    if (!fs.existsSync(this.servicesPath)) {
      fs.mkdirSync(this.servicesPath, { recursive: true });
      console.log('✅ Created services upload directory');
    }
    
    if (!fs.existsSync(this.coursesPath)) {
      fs.mkdirSync(this.coursesPath, { recursive: true });
      console.log('✅ Created courses upload directory');
    }
  }

  /**
   * Get statistics about images
   */
  async getImageStats() {
    const serviceImages = fs.readdirSync(this.servicesPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
    
    const courseImages = fs.readdirSync(this.coursesPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

    const services = await Service.findAll();
    const servicesWithImages = services.filter(s => s.imageUrl);
    const servicesWithoutImages = services.filter(s => !s.imageUrl);

    const courses = await TaxPackage.findAll();
    const coursesWithImages = courses.filter(c => c.imageUrl);
    const coursesWithoutImages = courses.filter(c => !c.imageUrl);

    return {
      images: {
        services: serviceImages.length,
        courses: courseImages.length,
        total: serviceImages.length + courseImages.length
      },
      database: {
        services: services.length,
        servicesWithImages: servicesWithImages.length,
        servicesWithoutImages: servicesWithoutImages.length,
        courses: courses.length,
        coursesWithImages: coursesWithImages.length,
        coursesWithoutImages: coursesWithoutImages.length
      }
    };
  }

  /**
   * Find orphaned images (files not referenced in database)
   */
  async findOrphanedImages() {
    const serviceImages = fs.readdirSync(this.servicesPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));
    
    const courseImages = fs.readdirSync(this.coursesPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file));

    const services = await Service.findAll();
    const courses = await TaxPackage.findAll();

    // Get referenced image names
    const referencedServiceImages = services
      .filter(s => s.imageUrl)
      .map(s => path.basename(s.imageUrl));

    const referencedCourseImages = courses
      .filter(c => c.imageUrl)
      .map(c => path.basename(c.imageUrl));

    // Find orphaned images
    const orphanedServiceImages = serviceImages
      .filter(img => !referencedServiceImages.includes(img) && !img.startsWith('default-'));
    
    const orphanedCourseImages = courseImages
      .filter(img => !referencedCourseImages.includes(img) && !img.startsWith('default-'));

    return {
      services: orphanedServiceImages,
      courses: orphanedCourseImages,
      total: orphanedServiceImages.length + orphanedCourseImages.length
    };
  }

  /**
   * Clean up orphaned images
   */
  async cleanupOrphaned(dryRun = true) {
    const orphaned = await this.findOrphanedImages();
    
    if (orphaned.total === 0) {
      console.log('✅ No orphaned images found');
      return;
    }

    console.log(`🗑️  Found ${orphaned.total} orphaned images`);
    
    if (dryRun) {
      console.log('📋 DRY RUN - Would delete:');
      orphaned.services.forEach(img => console.log(`   - services/${img}`));
      orphaned.courses.forEach(img => console.log(`   - courses/${img}`));
      console.log('Run with dryRun=false to actually delete files');
      return;
    }

    // Delete orphaned service images
    for (const img of orphaned.services) {
      const imgPath = path.join(this.servicesPath, img);
      try {
        fs.unlinkSync(imgPath);
        console.log(`🗑️  Deleted orphaned service image: ${img}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${img}:`, error.message);
      }
    }

    // Delete orphaned course images
    for (const img of orphaned.courses) {
      const imgPath = path.join(this.coursesPath, img);
      try {
        fs.unlinkSync(imgPath);
        console.log(`🗑️  Deleted orphaned course image: ${img}`);
      } catch (error) {
        console.error(`❌ Failed to delete ${img}:`, error.message);
      }
    }
  }

  /**
   * Full maintenance routine
   */
  async runFullMaintenance(options = {}) {
    const { fixMissing = true, cleanOrphaned = false, dryRun = true } = options;
    
    console.log('🔧 Starting full image maintenance...\n');
    
    // Ensure directories
    this.ensureDirectories();
    
    // Create default placeholders if they don't exist
    const defaultServicePath = path.join(this.servicesPath, 'default-service.svg');
    const defaultCoursePath = path.join(this.coursesPath, 'default-course.svg');
    
    if (!fs.existsSync(defaultServicePath) || !fs.existsSync(defaultCoursePath)) {
      console.log('🎨 Creating default placeholder images...');
      createDefaultPlaceholders();
    }
    
    // Get initial stats
    console.log('📊 Initial Statistics:');
    const initialStats = await this.getImageStats();
    console.table(initialStats);
    
    // Check for missing images
    console.log('\n🔍 Checking for missing images...');
    const missingCheck = await checkMissingImages();
    
    if (fixMissing && missingCheck.totalMissing > 0) {
      console.log('\n🔧 Fixing missing images...');
      await fixMissingImages();
    }
    
    // Check for orphaned images
    console.log('\n🗑️  Checking for orphaned images...');
    const orphaned = await this.findOrphanedImages();
    
    if (orphaned.total > 0) {
      console.log(`Found ${orphaned.total} orphaned images`);
      if (cleanOrphaned) {
        await this.cleanupOrphaned(dryRun);
      }
    } else {
      console.log('✅ No orphaned images found');
    }
    
    // Final stats
    console.log('\n📊 Final Statistics:');
    const finalStats = await this.getImageStats();
    console.table(finalStats);
    
    console.log('\n🎉 Image maintenance completed!');
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const maintenance = new ImageMaintenanceManager();
  
  (async () => {
    try {
      if (args.includes('--stats')) {
        const stats = await maintenance.getImageStats();
        console.log('📊 Image Statistics:');
        console.table(stats);
      } else if (args.includes('--orphaned')) {
        const orphaned = await maintenance.findOrphanedImages();
        console.log('🗑️  Orphaned Images:');
        console.log('Services:', orphaned.services);
        console.log('Courses:', orphaned.courses);
        console.log(`Total: ${orphaned.total}`);
      } else if (args.includes('--cleanup')) {
        const dryRun = !args.includes('--force');
        await maintenance.cleanupOrphaned(dryRun);
      } else {
        // Full maintenance
        const options = {
          fixMissing: !args.includes('--no-fix'),
          cleanOrphaned: args.includes('--clean'),
          dryRun: !args.includes('--force')
        };
        await maintenance.runFullMaintenance(options);
      }
    } catch (error) {
      console.error('💥 Maintenance failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = ImageMaintenanceManager;
