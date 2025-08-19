import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';

// Context providers
import { ThemeProvider } from './src/context/ThemeContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import TripsScreen from './src/screens/TripsScreen';
import SouvenirsScreen from './src/screens/SouvenirsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import TripDetailsScreen from './src/screens/TripDetailsScreen';
import ContactScreen from './src/screens/ContactScreen';
import AboutScreen from './src/screens/AboutScreen';
import CreateTripScreen from './src/screens/CreateTripScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import AdminUsersScreen from './src/screens/admin/AdminUsersScreen';
import AdminTripsScreen from './src/screens/admin/AdminTripsScreen';
import AdminBookingsScreen from './src/screens/admin/AdminBookingsScreen';
import AdminAnalyticsScreen from './src/screens/admin/AdminAnalyticsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// User Tab Navigator
function TabNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'airplane' : 'airplane-outline';
          } else if (route.name === 'Souvenirs') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#115d5a',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#115d5a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Trips" component={TripsScreen} />
      <Tab.Screen name="Souvenirs" component={SouvenirsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Admin Tab Navigator
function AdminTabNavigator() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'airplane' : 'airplane-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#115d5a',
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          backgroundColor: '#115d5a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
      <Tab.Screen name="Users" component={AdminUsersScreen} />
      <Tab.Screen name="Trips" component={AdminTripsScreen} />
      <Tab.Screen name="Bookings" component={AdminBookingsScreen} />
      <Tab.Screen name="Analytics" component={AdminAnalyticsScreen} />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
function AppNavigator() {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#115d5a" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#115d5a',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {!isAuthenticated ? (
        // Auth screens
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Register" 
            component={RegisterScreen} 
            options={{ headerShown: false }}
          />
        </>
      ) : user?.role === 'admin' ? (
        // Admin screens with tab navigation
        <>
          <Stack.Screen 
            name="AdminTabs" 
            component={AdminTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TripDetails" 
            component={TripDetailsScreen}
            options={{ title: 'Trip Details' }}
          />
          <Stack.Screen 
            name="Contact" 
            component={ContactScreen}
            options={{ title: 'Contact Us' }}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen}
            options={{ title: 'About Us' }}
          />
          <Stack.Screen 
            name="CreateTrip" 
            component={CreateTripScreen}
            options={{ title: 'Create New Trip' }}
          />
        </>
      ) : (
        // User screens
        <>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="TripDetails" 
            component={TripDetailsScreen}
            options={{ title: 'Trip Details' }}
          />
          <Stack.Screen 
            name="Contact" 
            component={ContactScreen}
            options={{ title: 'Contact Us' }}
          />
          <Stack.Screen 
            name="About" 
            component={AboutScreen}
            options={{ title: 'About Us' }}
          />
          <Stack.Screen 
            name="CreateTrip" 
            component={CreateTripScreen}
            options={{ title: 'Create New Trip' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <AppNavigator />
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Import View and ActivityIndicator for the loading screen
import { View, ActivityIndicator } from 'react-native';
