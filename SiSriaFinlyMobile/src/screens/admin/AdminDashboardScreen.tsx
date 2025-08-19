import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, List, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { adminAPI } from '../../services/api';

const AdminDashboardScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTrips: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log('AdminDashboardScreen loaded!');
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      console.log('Dashboard stats loaded:', response);
      
      // Transform the response to match our interface
      setStats({
        totalUsers: response?.totalUsers || response?.users || 0,
        totalTrips: response?.totalTrips || response?.trips || 0,
        totalBookings: response?.totalBookings || response?.bookings || 0,
        totalRevenue: response?.totalRevenue || response?.revenue || 0,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      // Fallback to mock data if API fails
      setStats({
        totalUsers: 1250,
        totalTrips: 45,
        totalBookings: 320,
        totalRevenue: 125000,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardStats();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: logout
        },
      ]
    );
  };

  const adminActions = [
    {
      id: 'users',
      title: 'Manage Users',
      description: 'View and manage user accounts',
      icon: 'people',
      color: '#4CAF50',
      onPress: () => navigation.navigate('Users'),
    },
    {
      id: 'trips',
      title: 'Manage Trips',
      description: 'Create and edit travel packages',
      icon: 'airplane',
      color: '#2196F3',
      onPress: () => navigation.navigate('Trips'),
    },
    {
      id: 'bookings',
      title: 'View Bookings',
      description: 'Monitor trip bookings and reservations',
      icon: 'calendar',
      color: '#FF9800',
      onPress: () => navigation.navigate('Bookings'),
    },
    {
      id: 'reports',
      title: 'Analytics',
      description: 'View detailed reports and analytics',
      icon: 'analytics',
      color: '#9C27B0',
      onPress: () => navigation.navigate('Analytics'),
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure app settings and preferences',
      icon: 'settings',
      color: '#607D8B',
      onPress: () => Alert.alert('Settings', 'Settings coming soon'),
    },
  ];

  const recentActivities = [
    { id: '1', action: 'New user registered', time: '2 minutes ago', type: 'user' },
    { id: '2', action: 'Trip booking confirmed', time: '15 minutes ago', type: 'booking' },
    { id: '3', action: 'New trip added', time: '1 hour ago', type: 'trip' },
    { id: '4', action: 'Payment received', time: '2 hours ago', type: 'payment' },
  ];

  const renderStatCard = (title: string, value: string, icon: string, color: string) => (
    <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={24} color="white" />
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
          <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  const renderActionCard = (action: any) => (
    <TouchableOpacity
      key={action.id}
      style={styles.actionCard}
      onPress={action.onPress}
    >
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.actionContent}>
          <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
            <Ionicons name={action.icon as any} size={24} color="white" />
          </View>
          <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
              {action.title}
            </Text>
            <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
              {action.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderActivityItem = (activity: any) => (
    <View key={activity.id} style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: theme.colors.primary }]}>
        <Ionicons 
          name={
            activity.type === 'user' ? 'person' :
            activity.type === 'booking' ? 'calendar' :
            activity.type === 'trip' ? 'airplane' : 'card'
          } 
          size={16} 
          color="white" 
        />
      </View>
      <View style={styles.activityInfo}>
        <Text style={[styles.activityText, { color: theme.colors.text }]}>
          {activity.action}
        </Text>
        <Text style={[styles.activityTime, { color: theme.colors.textSecondary }]}>
          {activity.time}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>{user?.displayName || user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <Chip style={styles.roleChip}>
          <Text style={styles.roleText}>Administrator</Text>
        </Chip>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Dashboard Overview
        </Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Total Users', String(stats.totalUsers || 0), 'people', '#4CAF50')}
          {renderStatCard('Total Trips', String(stats.totalTrips || 0), 'airplane', '#2196F3')}
          {renderStatCard('Total Bookings', String(stats.totalBookings || 0), 'calendar', '#FF9800')}
          {renderStatCard('Revenue', `$${Number(stats.totalRevenue || 0).toLocaleString()}`, 'card', '#9C27B0')}
        </View>
      </View>

      {/* Admin Actions */}
      <View style={styles.actionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Quick Actions
        </Text>
        {adminActions.map(renderActionCard)}
      </View>

      {/* Recent Activities */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Recent Activities
          </Title>
          {recentActivities.map(renderActivityItem)}
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Stats
          </Title>
          <View style={styles.quickStats}>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: theme.colors.primary }]}>85%</Text>
              <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
                User Satisfaction
              </Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: theme.colors.primary }]}>12</Text>
              <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
                Active Trips
              </Text>
            </View>
            <View style={styles.quickStatItem}>
              <Text style={[styles.quickStatValue, { color: theme.colors.primary }]}>24</Text>
              <Text style={[styles.quickStatLabel, { color: theme.colors.textSecondary }]}>
                Pending Bookings
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  adminName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  roleChip: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  roleText: {
    color: 'white',
    fontSize: 12,
  },
  statsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
  },
  actionsContainer: {
    padding: 16,
  },
  actionCard: {
    marginBottom: 12,
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default AdminDashboardScreen; 