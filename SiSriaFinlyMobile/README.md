# SiSriaFinly Mobile App

A React Native mobile application for the SiSriaFinly travel and tourism platform. This mobile app provides the same functionality as the web application but optimized for mobile devices.

## 🌟 Features

### Core Features
- **User Authentication**: Login/Register with JWT token management
- **Trip Browsing**: Browse and search through available trips
- **Trip Details**: View detailed information about each trip
- **User Profile**: Manage user profile and preferences
- **Souvenirs Shop**: Browse and purchase travel souvenirs
- **Contact & About**: Information about the company
- **Admin Dashboard**: Admin panel for trip management (admin users only)

### Mobile-Specific Features
- **Responsive Design**: Optimized for mobile screens
- **Offline Support**: Basic offline functionality with AsyncStorage
- **Push Notifications**: Real-time notifications (coming soon)
- **Location Services**: GPS integration for trip locations
- **Camera Integration**: Photo capture for trip memories
- **Dark/Light Theme**: Theme switching capability

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Navigate to the mobile app directory**
```bash
cd store/SiSriaFinlyMobile
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm start
```

4. **Run on device/simulator**
```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios

# For web
npm run web
```

## 📱 App Structure

```
SiSriaFinlyMobile/
├── src/
│   ├── context/           # Context providers
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── screens/           # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── TripsScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── TripDetailsScreen.tsx
│   │   ├── SouvenirsScreen.tsx
│   │   ├── ContactScreen.tsx
│   │   ├── AboutScreen.tsx
│   │   └── admin/
│   │       └── AdminDashboardScreen.tsx
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   ├── utils/            # Utility functions
│   └── assets/           # Images, fonts, etc.
├── App.tsx               # Main app component
├── package.json
└── README.md
```

## 🔧 Configuration

### Backend Connection
Update the API base URL in `src/context/AuthContext.tsx`:

```typescript
const API_BASE = 'http://your-backend-url:5000';
```

### Environment Variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_BASE=http://localhost:5000
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

## 📱 Screens Overview

### Authentication Screens
- **LoginScreen**: User login with email/password and Google OAuth
- **RegisterScreen**: User registration with form validation

### Main Screens
- **HomeScreen**: Welcome screen with featured trips and quick actions
- **TripsScreen**: Browse and search all available trips
- **TripDetailsScreen**: Detailed view of a specific trip
- **ProfileScreen**: User profile management
- **SouvenirsScreen**: Browse and purchase souvenirs
- **ContactScreen**: Contact information and support
- **AboutScreen**: Company information

### Admin Screens
- **AdminDashboardScreen**: Admin panel for trip and user management

## 🎨 Design System

### Colors
- Primary: `#115d5a` (Teal)
- Secondary: `#0f4f4c` (Dark Teal)
- Background: `#ffffff` (Light) / `#121212` (Dark)
- Surface: `#f8f9fa` (Light) / `#1e1e1e` (Dark)

### Typography
- Headings: Bold, various sizes
- Body: Regular, readable font sizes
- Captions: Smaller text for secondary information

### Components
- Cards: Elevated surfaces with rounded corners
- Buttons: Primary and secondary styles
- Inputs: Outlined text inputs with validation
- Chips: Small, selectable elements

## 🔌 API Integration

The mobile app connects to the same backend as the web application:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Trip Endpoints
- `GET /api/trips` - Get all trips
- `GET /api/trips/:id` - Get trip details
- `POST /api/trips/:id/book` - Book a trip

### Admin Endpoints
- `GET /api/admin/trips` - Get all trips (admin)
- `POST /api/admin/trips` - Create new trip (admin)
- `PUT /api/admin/trips/:id` - Update trip (admin)

## 🛠 Development

### Adding New Screens
1. Create a new screen component in `src/screens/`
2. Add the screen to the navigation in `App.tsx`
3. Update the navigation types if needed

### Adding New Features
1. Create components in `src/components/`
2. Add services in `src/services/`
3. Update context if needed
4. Test on both Android and iOS

### Styling Guidelines
- Use the theme context for consistent colors
- Follow the design system
- Test on different screen sizes
- Ensure accessibility compliance

## 📦 Dependencies

### Core Dependencies
- `react-native`: Core React Native framework
- `expo`: Development platform and tools
- `@react-navigation/native`: Navigation library
- `react-native-paper`: Material Design components
- `axios`: HTTP client for API calls
- `@react-native-async-storage/async-storage`: Local storage

### UI/UX Dependencies
- `@expo/vector-icons`: Icon library
- `react-native-gesture-handler`: Gesture handling
- `react-native-reanimated`: Animations
- `react-native-screens`: Native screen components

### Development Dependencies
- `typescript`: Type checking
- `@types/react`: TypeScript definitions

## 🚀 Deployment

### Building for Production

1. **Android APK**
```bash
expo build:android
```

2. **iOS IPA**
```bash
expo build:ios
```

3. **Web Build**
```bash
expo build:web
```

### App Store Deployment
1. Configure app.json with proper app details
2. Build production version
3. Submit to App Store/Google Play Store

## 🔒 Security

- JWT tokens stored securely in AsyncStorage
- API calls include authentication headers
- Input validation on all forms
- Secure HTTPS connections to backend

## 🧪 Testing

### Manual Testing
- Test on both Android and iOS devices
- Test on different screen sizes
- Test offline functionality
- Test authentication flow

### Automated Testing
```bash
npm test
```

## 📈 Performance

- Lazy loading of images
- Optimized bundle size
- Efficient state management
- Minimal re-renders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

## 🔄 Updates

### Version 1.0.0
- Initial release
- Basic authentication
- Trip browsing
- Responsive design

### Planned Features
- Push notifications
- Offline mode
- Advanced search filters
- Payment integration
- Social features
- Multi-language support 