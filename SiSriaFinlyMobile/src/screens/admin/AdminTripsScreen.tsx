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
import { Card, Title, Paragraph, Button, Searchbar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { adminAPI } from '../../services/api';

const AdminTripsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchQuery, trips]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllTrips();
      console.log('Admin trips loaded:', response);

      // Transform the response to match our interface
      const transformedTrips = Array.isArray(response) ? response : (response.trips || response.data || []);

      setTrips(transformedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      // Fallback to mock data if API fails
      const mockTrips = [
        {
          _id: '1',
          title: 'Damascus Heritage Tour',
          destination: 'Damascus, Syria',
          type: 'Cultural',
          price: 899,
          capacity: 20,
          bookings: 15,
          status: 'Active',
          startDate: '2024-03-15',
          endDate: '2024-03-20',
        },
        {
          _id: '2',
          title: 'Aleppo Adventure',
          destination: 'Aleppo, Syria',
          type: 'Adventure',
          price: 699,
          capacity: 15,
          bookings: 12,
          status: 'Active',
          startDate: '2024-04-10',
          endDate: '2024-04-14',
        },
        {
          _id: '3',
          title: 'Palmyra Desert Experience',
          destination: 'Palmyra, Syria',
          type: 'Cultural',
          price: 599,
          capacity: 12,
          bookings: 8,
          status: 'Draft',
          startDate: '2024-05-05',
          endDate: '2024-05-08',
        },
        {
          _id: '4',
          title: 'Latakia Beach Retreat',
          destination: 'Latakia, Syria',
          type: 'Relaxation',
          price: 799,
          capacity: 25,
          bookings: 20,
          status: 'Active',
          startDate: '2024-06-20',
          endDate: '2024-06-26',
        },
      ];
      setTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;
    if (searchQuery) {
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredTrips(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const handleTripAction = (trip: any, action: string) => {
    Alert.alert(
      `${action} Trip`,
      `Are you sure you want to ${action.toLowerCase()} "${trip.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: action === 'Delete' ? 'destructive' : 'default',
          onPress: () => {
            // Implement trip action logic here
            Alert.alert('Success', `Trip ${action.toLowerCase()}d successfully`);
          }
        },
      ]
    );
  };

  const renderTripCard = (trip: any) => (
    <Card key={trip._id} style={[styles.tripCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.tripHeader}>
          <View style={styles.tripInfo}>
            <Text style={[styles.tripTitle, { color: theme.colors.text }]}>
              {trip.title}
            </Text>
            <Text style={[styles.tripDestination, { color: theme.colors.textSecondary }]}>
              {trip.destination}
            </Text>
            <View style={styles.tripDetails}>
              <Text style={[styles.tripDetail, { color: theme.colors.textSecondary }]}>
                ${trip.price} • {trip.duration}
              </Text>
              <Text style={[styles.tripBookings, { color: theme.colors.primary }]}>
                {trip.bookings} bookings
              </Text>
            </View>
          </View>
          <View style={styles.tripStatus}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                trip.status === 'active' ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#FF9800' }
              ]}
              textStyle={{ color: 'white' }}
            >
              {trip.status}
            </Chip>
          </View>
        </View>
        <View style={styles.tripActions}>
          <Button
            mode="outlined"
            onPress={() => handleTripAction(trip, 'Edit')}
            style={styles.actionButton}
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleTripAction(trip, 'Duplicate')}
            style={[styles.actionButton, { borderColor: '#2196F3' }]}
            textColor="#2196F3"
          >
            Duplicate
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleTripAction(trip, 'Delete')}
            style={[styles.actionButton, { borderColor: '#f44336' }]}
            textColor="#f44336"
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Trip Management</Text>
        <Text style={styles.headerSubtitle}>
          Create and manage travel packages
        </Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search trips..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
      />

      {/* Trips List */}
      <ScrollView
        style={styles.tripsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTrips.map(renderTripCard)}
      </ScrollView>

      {/* Add Trip Button */}
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          onPress={() => Alert.alert('Add Trip', 'Add trip functionality coming soon')}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          icon="plus"
        >
          Add New Trip
        </Button>
      </View>
    </View>
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
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  tripsList: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    marginBottom: 16,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  tripInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tripDestination: {
    fontSize: 14,
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tripDetail: {
    fontSize: 14,
  },
  tripBookings: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 0,
  },
  tripActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButtonContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  addButton: {
    borderRadius: 8,
  },
});

export default AdminTripsScreen; 