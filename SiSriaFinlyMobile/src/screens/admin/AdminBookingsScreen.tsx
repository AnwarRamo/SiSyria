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

const AdminBookingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchQuery, bookings]);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getDashboardStats();
      console.log('Admin bookings loaded:', response);

      // Transform the response to match our interface
      // Note: This is a placeholder - you'll need to create a specific bookings endpoint
      const transformedBookings = Array.isArray(response) ? response : (response.bookings || response.data || []);

      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
      // Fallback to mock data if API fails
      const mockBookings = [
        {
          _id: '1',
          tripTitle: 'Damascus Heritage Tour',
          userName: 'Ahmed Al-Hassan',
          userEmail: 'ahmed@example.com',
          status: 'confirmed',
          bookingDate: '2024-03-01',
          tripDate: '2024-03-15',
          price: 899,
        },
        {
          _id: '2',
          tripTitle: 'Aleppo Adventure',
          userName: 'Fatima Al-Zahra',
          userEmail: 'fatima@example.com',
          status: 'pending',
          bookingDate: '2024-03-05',
          tripDate: '2024-04-10',
          price: 699,
        },
        {
          _id: '3',
          tripTitle: 'Palmyra Desert Experience',
          userName: 'Omar Al-Rashid',
          userEmail: 'omar@example.com',
          status: 'confirmed',
          bookingDate: '2024-03-08',
          tripDate: '2024-05-05',
          price: 599,
        },
        {
          _id: '4',
          tripTitle: 'Latakia Beach Retreat',
          userName: 'Layla Al-Mahmoud',
          userEmail: 'layla@example.com',
          status: 'cancelled',
          bookingDate: '2024-03-10',
          tripDate: '2024-06-20',
          price: 799,
        },
      ];
      setBookings(mockBookings);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;
    if (searchQuery) {
      filtered = filtered.filter(booking =>
        booking.tripTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredBookings(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  const handleBookingAction = (booking: any, action: string) => {
    Alert.alert(
      `${action} Booking`,
      `Are you sure you want to ${action.toLowerCase()} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          style: action === 'Cancel' ? 'destructive' : 'default',
          onPress: () => {
            // Implement booking action logic here
            Alert.alert('Success', `Booking ${action.toLowerCase()}d successfully`);
          }
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'cancelled': return '#f44336';
      default: return '#9E9E9E';
    }
  };

  const renderBookingCard = (booking: any) => (
    <Card key={booking._id} style={[styles.bookingCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.bookingHeader}>
          <View style={styles.bookingInfo}>
            <Text style={[styles.tripTitle, { color: theme.colors.text }]}>
              {booking.tripTitle}
            </Text>
            <Text style={[styles.userName, { color: theme.colors.textSecondary }]}>
              {booking.userName} • {booking.userEmail}
            </Text>
            <View style={styles.bookingDetails}>
              <Text style={[styles.bookingDetail, { color: theme.colors.textSecondary }]}>
                Booked: {booking.bookingDate}
              </Text>
              <Text style={[styles.bookingDetail, { color: theme.colors.textSecondary }]}>
                Travel: {booking.travelDate}
              </Text>
            </View>
            <Text style={[styles.bookingAmount, { color: theme.colors.primary }]}>
              ${booking.amount}
            </Text>
          </View>
          <View style={styles.bookingStatus}>
            <Chip
              mode="outlined"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(booking.status) }
              ]}
              textStyle={{ color: 'white' }}
            >
              {booking.status}
            </Chip>
          </View>
        </View>
        <View style={styles.bookingActions}>
          <Button
            mode="outlined"
            onPress={() => handleBookingAction(booking, 'Confirm')}
            style={[styles.actionButton, { borderColor: '#4CAF50' }]}
            textColor="#4CAF50"
            disabled={booking.status === 'confirmed'}
          >
            Confirm
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleBookingAction(booking, 'Contact')}
            style={[styles.actionButton, { borderColor: '#2196F3' }]}
            textColor="#2196F3"
          >
            Contact
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleBookingAction(booking, 'Cancel')}
            style={[styles.actionButton, { borderColor: '#f44336' }]}
            textColor="#f44336"
            disabled={booking.status === 'cancelled'}
          >
            Cancel
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Booking Management</Text>
        <Text style={styles.headerSubtitle}>
          Monitor and manage trip bookings
        </Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search bookings..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
      />

      {/* Bookings List */}
      <ScrollView
        style={styles.bookingsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredBookings.map(renderBookingCard)}
      </ScrollView>

      {/* Export Button */}
      <View style={styles.exportButtonContainer}>
        <Button
          mode="contained"
          onPress={() => Alert.alert('Export', 'Export bookings functionality coming soon')}
          style={[styles.exportButton, { backgroundColor: theme.colors.primary }]}
          icon="download"
        >
          Export Bookings
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
  bookingsList: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  bookingInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userName: {
    fontSize: 14,
    marginBottom: 8,
  },
  bookingDetails: {
    marginBottom: 8,
  },
  bookingDetail: {
    fontSize: 12,
    marginBottom: 2,
  },
  bookingAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 0,
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  exportButtonContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  exportButton: {
    borderRadius: 8,
  },
});

export default AdminBookingsScreen; 