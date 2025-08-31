const { Service } = require('../models');
const { TaxPackage } = require('../models/Course');
const path = require('path');
const fs = require('fs');

/**
 * Fix missing images by mapping existing files to database entries
 * and updating image URLs in the database
 */
async function fixMissingImages() {
  try {
    console.log('🔍 Starting missing images fix...');

    // Define upload paths
    const servicesUploadPath = path.join(__dirname, '../uploads/images/services');
    const coursesUploadPath = path.join(__dirname, '../uploads/images/courses');

    // Get all services from database
    const services = await Service.findAll();
    console.log(`📊 Found ${services.length} services in database`);

    // Get all existing service images
    const existingServiceImages = fs.readdirSync(servicesUploadPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort();

    console.log(`📁 Found ${existingServiceImages.length} service images in upload folder:`, existingServiceImages);

    // Map services to existing images
    let imageIndex = 0;
    const servicesUpdated = [];

    for (const service of services) {
      if (service.imageUrl) {
        // Extract filename from current image URL
        const currentImageName = path.basename(service.imageUrl);
        const currentImagePath = path.join(servicesUploadPath, currentImageName);

        // Check if the current image file exists
        if (fs.existsSync(currentImagePath)) {
          console.log(`✅ Image exists for service ${service.id}: ${currentImageName}`);
          continue;
        }

        // If current image doesn't exist, map to an available image
        if (imageIndex < existingServiceImages.length) {
          const newImageName = existingServiceImages[imageIndex];
          const newImageUrl = `/uploads/images/services/${newImageName}`;

          await service.update({ imageUrl: newImageUrl });
          servicesUpdated.push({
            id: service.id,
            name: service.name,
            oldImage: currentImageName,
            newImage: newImageName
          });

          console.log(`🔄 Updated service ${service.id} (${service.name}): ${currentImageName} → ${newImageName}`);
          imageIndex++;
        } else {
          console.log(`⚠️  No more images available for service ${service.id} (${service.name})`);
        }
      }
    }

    // Handle courses/tax packages
    const courses = await TaxPackage.findAll();
    console.log(`📊 Found ${courses.length} courses/packages in database`);

    const existingCourseImages = fs.readdirSync(coursesUploadPath)
      .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
      .sort();

    console.log(`📁 Found ${existingCourseImages.length} course images in upload folder:`, existingCourseImages);

    const coursesUpdated = [];
    imageIndex = 0;

    for (const course of courses) {
      if (course.imageUrl) {
        const currentImageName = path.basename(course.imageUrl);
        const currentImagePath = path.join(coursesUploadPath, currentImageName);

        if (fs.existsSync(currentImagePath)) {
          console.log(`✅ Image exists for course ${course.id}: ${currentImageName}`);
          continue;
        }

        if (imageIndex < existingCourseImages.length) {
          const newImageName = existingCourseImages[imageIndex];
          const newImageUrl = `/uploads/images/courses/${newImageName}`;

          await course.update({ imageUrl: newImageUrl });
          coursesUpdated.push({
            id: course.id,
            title: course.title,
            oldImage: currentImageName,
            newImage: newImageName
          });

          console.log(`🔄 Updated course ${course.id} (${course.title}): ${currentImageName} → ${newImageName}`);
          imageIndex++;
        } else {
          console.log(`⚠️  No more images available for course ${course.id} (${course.title})`);
        }
      }
    }

    // Summary
    console.log('\n📋 SUMMARY:');
    console.log(`✅ Services updated: ${servicesUpdated.length}`);
    console.log(`✅ Courses updated: ${coursesUpdated.length}`);

    if (servicesUpdated.length > 0) {
      console.log('\n🔄 Service Updates:');
      servicesUpdated.forEach(update => {
        console.log(`   - Service ${update.id}: "${update.name}" → ${update.newImage}`);
      });
    }

    if (coursesUpdated.length > 0) {
      console.log('\n🔄 Course Updates:');
      coursesUpdated.forEach(update => {
        console.log(`   - Course ${update.id}: "${update.title}" → ${update.newImage}`);
      });
    }

    console.log('\n🎉 Missing images fix completed successfully!');

    return {
      servicesUpdated: servicesUpdated.length,
      coursesUpdated: coursesUpdated.length,
      details: { servicesUpdated, coursesUpdated }
    };

  } catch (error) {
    console.error('❌ Error fixing missing images:', error);
    throw error;
  }
}

/**
 * Check which images are referenced in database but missing from disk
 */
async function checkMissingImages() {
  try {
    console.log('🔍 Checking for missing images...');

    const servicesUploadPath = path.join(__dirname, '../uploads/images/services');
    const coursesUploadPath = path.join(__dirname, '../uploads/images/courses');

    // Check services
    const services = await Service.findAll();
    const missingServiceImages = [];

    for (const service of services) {
      if (service.imageUrl) {
        const imageName = path.basename(service.imageUrl);
        const imagePath = path.join(servicesUploadPath, imageName);

        if (!fs.existsSync(imagePath)) {
          missingServiceImages.push({
            serviceId: service.id,
            serviceName: service.name,
            imageUrl: service.imageUrl,
            imageName: imageName
          });
        }
      }
    }

    // Check courses
    const courses = await TaxPackage.findAll();
    const missingCourseImages = [];

    for (const course of courses) {
      if (course.imageUrl) {
        const imageName = path.basename(course.imageUrl);
        const imagePath = path.join(coursesUploadPath, imageName);

        if (!fs.existsSync(imagePath)) {
          missingCourseImages.push({
            courseId: course.id,
            courseTitle: course.title,
            imageUrl: course.imageUrl,
            imageName: imageName
          });
        }
      }
    }

    console.log(`⚠️  Found ${missingServiceImages.length} missing service images`);
    console.log(`⚠️  Found ${missingCourseImages.length} missing course images`);

    if (missingServiceImages.length > 0) {
      console.log('\n📋 Missing Service Images:');
      missingServiceImages.forEach(item => {
        console.log(`   - Service ${item.serviceId}: "${item.serviceName}" → ${item.imageName}`);
      });
    }

    if (missingCourseImages.length > 0) {
      console.log('\n📋 Missing Course Images:');
      missingCourseImages.forEach(item => {
        console.log(`   - Course ${item.courseId}: "${item.courseTitle}" → ${item.imageName}`);
      });
    }

    return {
      missingServiceImages,
      missingCourseImages,
      totalMissing: missingServiceImages.length + missingCourseImages.length
    };

  } catch (error) {
    console.error('❌ Error checking missing images:', error);
    throw error;
  }
}

// If running this file directly
if (require.main === module) {
  (async () => {
    try {
      // First check what's missing
      const checkResult = await checkMissingImages();
      
      if (checkResult.totalMissing > 0) {
        console.log('\n🔧 Fixing missing images...');
        await fixMissingImages();
      } else {
        console.log('✅ All images are present!');
      }
    } catch (error) {
      console.error('💥 Script failed:', error);
      process.exit(1);
    }
  })();
}

module.exports = {
  fixMissingImages,
  checkMissingImages
};
