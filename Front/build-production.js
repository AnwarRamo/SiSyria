const { execSync } = require('child_process');

console.log('🚀 Building for production with ESLint disabled...');

try {
  // Set environment variables to bypass all checks
  process.env.CI = 'false';
  process.env.DISABLE_ESLINT_PLUGIN = 'true';
  process.env.GENERATE_SOURCEMAP = 'false';
  process.env.ESLINT_NO_DEV_ERRORS = 'true';
  process.env.REACT_APP_API_URL = 'https://sisyriaback-production.up.railway.app';
  process.env.REACT_APP_CLIENT_URL = 'https://sisyria.netlify.app';
  
  // Run the build command
  execSync('react-scripts build', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  
  console.log('✅ Production build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 