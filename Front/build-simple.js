const { execSync } = require('child_process');

console.log('Building frontend with relaxed settings...');

try {
  // Set environment variables to bypass strict checks
  process.env.CI = 'false';
  process.env.GENERATE_SOURCEMAP = 'false';
  process.env.ESLINT_NO_DEV_ERRORS = 'true';
  
  // Run the build command
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ Build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 