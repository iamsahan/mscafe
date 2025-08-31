const fs = require('fs');
const path = require('path');

/**
 * Create simple placeholder without canvas (SVG approach)
 */
function createSimplePlaceholder(width = 400, height = 300, text = 'No Image', outputPath, bgColor = '#667eea') {
  const svgContent = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;

  fs.writeFileSync(outputPath, svgContent);
  console.log(`✅ Created SVG placeholder: ${outputPath}`);
  return true;
}

/**
 * Create placeholder for the missing service image
 */
async function createMissingServicePlaceholder() {
  const { Service } = require('../models');
  
  try {
    // Find service without valid image
    const service = await Service.findByPk(20);
    if (!service) {
      console.log('Service 20 not found');
      return;
    }

    const servicesUploadPath = path.join(__dirname, '../uploads/images/services');
    const placeholderName = 'placeholder-service-20.jpg';
    const placeholderPath = path.join(servicesUploadPath, placeholderName);

    // Create simple placeholder (no external dependencies needed)
    createSimplePlaceholder(400, 300, 'Service Image', placeholderPath.replace('.jpg', '.svg'));

    // Update database
    const newImageUrl = `/uploads/images/services/${placeholderName.replace('.jpg', '.svg')}`;
    await service.update({ imageUrl: newImageUrl });
    
    console.log(`✅ Updated service 20 with placeholder image: ${newImageUrl}`);
    
  } catch (error) {
    console.error('❌ Error creating placeholder for service 20:', error);
  }
}

/**
 * Create default placeholder images for services and courses
 */
function createDefaultPlaceholders() {
  const servicesPath = path.join(__dirname, '../uploads/images/services');
  const coursesPath = path.join(__dirname, '../uploads/images/courses');

  // Create service placeholder
  createSimplePlaceholder(
    400, 300, 
    'Service Image', 
    path.join(servicesPath, 'default-service.svg'),
    '#2563eb'
  );

  // Create course placeholder
  createSimplePlaceholder(
    400, 300, 
    'Course Image', 
    path.join(coursesPath, 'default-course.svg'),
    '#059669'
  );
}

// If running directly
if (require.main === module) {
  (async () => {
    try {
      console.log('🎨 Creating placeholder images...');
      
      // Create default placeholders
      createDefaultPlaceholders();
      
      // Create specific placeholder for missing service
      await createMissingServicePlaceholder();
      
      console.log('✅ Placeholder creation completed!');
    } catch (error) {
      console.error('💥 Error:', error);
    }
  })();
}

module.exports = {
  createSimplePlaceholder,
  createMissingServicePlaceholder,
  createDefaultPlaceholders
};
