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
import { Card, Title, Paragraph, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { adminAPI } from '../../services/api';

const AdminAnalyticsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [analytics, setAnalytics] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    averageRating: 0,
    topDestinations: [],
    monthlyRevenue: [],
    userGrowth: 0,
  });
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      // Ensure we have valid data with fallbacks
      setAnalytics({
        totalRevenue: response?.totalRevenue || 0,
        totalBookings: response?.totalBookings || 0,
        averageRating: response?.averageRating || 0,
        topDestinations: response?.topDestinations || [],
        monthlyRevenue: response?.monthlyRevenue || [],
        userGrowth: response?.userGrowth || 0,
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Fallback to mock data
      setAnalytics({
        totalRevenue: 125000,
        totalBookings: 320,
        averageRating: 4.8,
        topDestinations: [
          { name: 'Damascus', bookings: 45, revenue: 35000 },
          { name: 'Paris', bookings: 32, revenue: 42000 },
          { name: 'Tokyo', bookings: 28, revenue: 45000 },
          { name: 'New York', bookings: 25, revenue: 25000 },
        ],
        monthlyRevenue: [
          { month: 'Jan', revenue: 15000 },
          { month: 'Feb', revenue: 18000 },
          { month: 'Mar', revenue: 22000 },
          { month: 'Apr', revenue: 19000 },
          { month: 'May', revenue: 25000 },
          { month: 'Jun', revenue: 28000 },
        ],
        userGrowth: 15,
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const renderStatCard = (title: string, value: string, icon: string, color: string, subtitle?: string) => (
    <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.statContent}>
        <View style={[styles.statIcon, { backgroundColor: color }]}>
          <Ionicons name={icon as any} size={24} color="white" />
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>{value}</Text>
          <Text style={[styles.statTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.statSubtitle, { color: theme.colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

  const renderDestinationCard = (destination: any, index: number) => (
    <Card key={destination.name} style={[styles.destinationCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.destinationHeader}>
          <View style={styles.rankContainer}>
            <Text style={[styles.rank, { color: theme.colors.primary }]}>#{index + 1}</Text>
          </View>
          <View style={styles.destinationInfo}>
            <Text style={[styles.destinationName, { color: theme.colors.text }]}>
              {destination.name}
            </Text>
            <Text style={[styles.destinationStats, { color: theme.colors.textSecondary }]}>
              {destination.bookings || 0} bookings • ${Number(destination.revenue || 0).toLocaleString()}
            </Text>
          </View>
          <View style={styles.destinationTrend}>
            <Ionicons name="trending-up" size={16} color="#4CAF50" />
            <Text style={[styles.trendText, { color: '#4CAF50' }]}>+12%</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderMonthlyRevenueCard = () => (
    <Card style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Title style={[styles.chartTitle, { color: theme.colors.text }]}>
          Monthly Revenue
        </Title>
        <View style={styles.chartContainer}>
          {analytics.monthlyRevenue.map((month, index) => (
            <View key={month.month} style={styles.chartBar}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    height: (Number(month.revenue || 0) / 30000) * 100,
                    backgroundColor: theme.colors.primary 
                  }
                ]} 
              />
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>
                {month.month}
              </Text>
              <Text style={[styles.barValue, { color: theme.colors.text }]}>
                ${Number(month.revenue || 0).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </Card.Content>
    </Card>
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
        <Text style={styles.headerTitle}>Analytics & Reports</Text>
        <Text style={styles.headerSubtitle}>
          Track performance and insights
        </Text>
      </View>

      {/* Key Metrics */}
      <View style={styles.metricsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Key Metrics
        </Text>
        <View style={styles.metricsGrid}>
          {renderStatCard(
            'Total Revenue', 
            `$${Number(analytics.totalRevenue || 0).toLocaleString()}`, 
            'card', 
            '#9C27B0'
          )}
          {renderStatCard(
            'Total Bookings', 
            String(analytics.totalBookings || 0), 
            'calendar', 
            '#2196F3'
          )}
          {renderStatCard(
            'Average Rating', 
            String(analytics.averageRating || 0), 
            'star', 
            '#FF9800',
            'out of 5.0'
          )}
          {renderStatCard(
            'User Growth', 
            `${analytics.userGrowth || 0}%`, 
            'trending-up', 
            '#4CAF50',
            'this month'
          )}
        </View>
      </View>

      {/* Top Destinations */}
      <View style={styles.destinationsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Top Destinations
        </Text>
        {analytics.topDestinations.map((destination, index) => 
          renderDestinationCard(destination, index)
        )}
      </View>

      {/* Monthly Revenue Chart */}
      <View style={styles.chartContainer}>
        {renderMonthlyRevenueCard()}
      </View>

      {/* Quick Actions */}
      <Card style={[styles.actionsCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Quick Actions
          </Title>
          <View style={styles.actionsGrid}>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Export', 'Export analytics functionality coming soon')}
              style={styles.actionButton}
              icon="download"
            >
              Export Report
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Schedule', 'Schedule report functionality coming soon')}
              style={styles.actionButton}
              icon="calendar"
            >
              Schedule Report
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Share', 'Share analytics functionality coming soon')}
              style={styles.actionButton}
              icon="share"
            >
              Share Analytics
            </Button>
            <Button
              mode="outlined"
              onPress={() => Alert.alert('Settings', 'Analytics settings functionality coming soon')}
              style={styles.actionButton}
              icon="cog"
            >
              Settings
            </Button>
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
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'white',
    fontSize: 16,
    opacity: 0.9,
  },
  metricsContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  metricsGrid: {
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
  statSubtitle: {
    fontSize: 10,
    marginTop: 2,
  },
  destinationsContainer: {
    padding: 16,
  },
  destinationCard: {
    marginBottom: 12,
    elevation: 2,
  },
  destinationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  destinationStats: {
    fontSize: 14,
  },
  destinationTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chartContainer: {
    padding: 16,
  },
  chartCard: {
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    paddingHorizontal: 16,
  },
  chartBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  bar: {
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    textAlign: 'center',
  },
  actionsCard: {
    margin: 16,
    elevation: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    marginBottom: 12,
  },
});

export default AdminAnalyticsScreen; 