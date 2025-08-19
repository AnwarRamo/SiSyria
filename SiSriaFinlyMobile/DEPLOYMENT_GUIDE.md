# SiSriaFinly Mobile App - Deployment Guide

This guide will help you deploy your React Native mobile app to production and app stores.

## 🚀 Pre-Deployment Checklist

### 1. Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration
EXPO_PUBLIC_API_BASE_URL=https://your-backend-domain.com

# Google OAuth (optional)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# App Configuration
EXPO_PUBLIC_APP_NAME=SiSriaFinly
EXPO_PUBLIC_APP_VERSION=1.0.0
```

### 2. Update Configuration

Update `src/config/config.ts` with your production settings:

```typescript
export const CONFIG = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://your-backend-domain.com',
  // ... other config
};
```

### 3. Backend Connection

Ensure your backend is:
- ✅ Running and accessible
- ✅ CORS configured for mobile app
- ✅ All API endpoints working
- ✅ SSL certificate installed (for production)

## 📱 Building for Production

### Android APK Build

1. **Install EAS CLI** (if not already installed):
```bash
npm install -g @expo/eas-cli
```

2. **Login to Expo**:
```bash
eas login
```

3. **Configure EAS Build**:
```bash
eas build:configure
```

4. **Build for Android**:
```bash
eas build --platform android
```

### iOS IPA Build

1. **Build for iOS** (requires macOS):
```bash
eas build --platform ios
```

### Web Build

1. **Build for Web**:
```bash
eas build --platform web
```

## 🏪 App Store Deployment

### Google Play Store

1. **Create Google Play Console Account**
   - Go to [Google Play Console](https://play.google.com/console)
   - Pay the $25 registration fee
   - Complete account setup

2. **Prepare App Bundle**:
```bash
eas build --platform android --profile production
```

3. **Upload to Play Console**:
   - Download the AAB file from EAS
   - Upload to Google Play Console
   - Fill in app details, screenshots, description
   - Submit for review

### Apple App Store

1. **Create Apple Developer Account**
   - Go to [Apple Developer](https://developer.apple.com)
   - Pay the $99/year fee
   - Complete account setup

2. **Prepare IPA**:
```bash
eas build --platform ios --profile production
```

3. **Upload to App Store Connect**:
   - Download the IPA file from EAS
   - Upload to App Store Connect
   - Fill in app details, screenshots, description
   - Submit for review

## 🔧 Production Configuration

### 1. Update app.json

```json
{
  "expo": {
    "name": "SiSriaFinly",
    "slug": "sisriafinly-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#115d5a"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.sisriafinly"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#115d5a"
      },
      "package": "com.yourcompany.sisriafinly"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### 2. Create eas.json

```json
{
  "cli": {
    "version": ">= 3.13.3"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

## 🧪 Testing Before Deployment

### 1. Local Testing

```bash
# Test on Android
npm run android

# Test on iOS (macOS only)
npm run ios

# Test on Web
npm run web
```

### 2. Device Testing

- Test on real Android devices
- Test on real iOS devices
- Test on different screen sizes
- Test offline functionality
- Test all user flows

### 3. API Testing

- Test all API endpoints
- Test authentication flow
- Test booking functionality
- Test error handling

## 📊 Analytics & Monitoring

### 1. Add Analytics

Install analytics package:
```bash
npm install expo-analytics
```

### 2. Add Crash Reporting

Install crash reporting:
```bash
npm install expo-crashlytics
```

### 3. Add Performance Monitoring

Install performance monitoring:
```bash
npm install expo-performance
```

## 🔒 Security Checklist

- [ ] API endpoints use HTTPS
- [ ] JWT tokens are secure
- [ ] User data is encrypted
- [ ] API keys are not exposed
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive data

## 📈 Performance Optimization

### 1. Image Optimization

- Use optimized images
- Implement lazy loading
- Use appropriate image formats

### 2. Bundle Size

- Remove unused dependencies
- Use tree shaking
- Implement code splitting

### 3. Network Optimization

- Implement caching
- Use compression
- Optimize API calls

## 🚨 Error Handling

### 1. Network Errors

```typescript
// Add to your API calls
try {
  const response = await api.get('/endpoint');
  return response.data;
} catch (error) {
  if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.code === 'NETWORK_ERROR') {
    // Handle network error
  } else {
    // Handle other errors
  }
}
```

### 2. User Feedback

- Show loading states
- Display error messages
- Provide retry options
- Implement offline indicators

## 📱 App Store Optimization

### 1. App Store Listing

- **App Name**: SiSriaFinly - Travel & Tourism
- **Subtitle**: Discover amazing destinations
- **Description**: Write compelling description
- **Keywords**: travel, tourism, trips, adventure, booking
- **Screenshots**: High-quality screenshots
- **App Icon**: Professional icon design

### 2. ASO (App Store Optimization)

- Use relevant keywords
- Optimize app title
- Write compelling description
- Use high-quality screenshots
- Get positive reviews

## 🔄 Continuous Deployment

### 1. Set up CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Mobile App

on:
  push:
    branches: [main]

jobs:
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: eas build --platform android --non-interactive
```

### 2. Automated Testing

```yaml
- name: Run Tests
  run: npm test

- name: Run Linting
  run: npm run lint
```

## 📞 Support & Maintenance

### 1. User Support

- Set up support email
- Create FAQ section
- Implement in-app help
- Monitor app reviews

### 2. Regular Updates

- Fix bugs promptly
- Add new features
- Update dependencies
- Monitor performance

### 3. Monitoring

- Set up crash reporting
- Monitor API performance
- Track user analytics
- Monitor app store reviews

## 🎉 Post-Deployment

### 1. Launch Checklist

- [ ] App is live on stores
- [ ] Backend is production-ready
- [ ] Analytics are tracking
- [ ] Support system is ready
- [ ] Marketing materials are ready
- [ ] Social media accounts are set up

### 2. Marketing

- Create app store listing
- Prepare marketing materials
- Set up social media
- Plan launch campaign

### 3. Monitoring

- Monitor app performance
- Track user feedback
- Monitor crash reports
- Analyze user behavior

## 🆘 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check EAS configuration
   - Verify app.json settings
   - Check for missing dependencies

2. **App Store Rejection**
   - Review app store guidelines
   - Fix any issues mentioned
   - Resubmit with explanations

3. **API Connection Issues**
   - Verify backend is running
   - Check CORS configuration
   - Verify API endpoints

4. **Performance Issues**
   - Optimize images
   - Reduce bundle size
   - Implement caching

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)

## 🎯 Success Metrics

Track these metrics after deployment:

- **Downloads**: Number of app downloads
- **Active Users**: Daily/Monthly active users
- **Retention**: User retention rates
- **Bookings**: Number of trip bookings
- **Reviews**: App store ratings and reviews
- **Performance**: App crash rate and performance

---

**Congratulations!** Your SiSriaFinly mobile app is now ready for production deployment. Follow this guide step by step to ensure a successful launch. 