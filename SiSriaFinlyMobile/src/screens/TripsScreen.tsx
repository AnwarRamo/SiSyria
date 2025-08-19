import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { Card, Title, Paragraph, Searchbar, Button, Chip, FAB, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { tripsAPI } from '../services/api';

const { width } = Dimensions.get('window');

interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: string;
  price: number;
  duration: string;
  type: string;
  image: string;
  rating: number;
  capacity: number;
  startDate: string;
  endDate: string;
}

const TripsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const tripTypes = ['All', 'Adventure', 'Cultural', 'Relaxation', 'Business', 'Family', 'Romantic'];

  useEffect(() => {
    loadTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [searchQuery, selectedType, trips]);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await tripsAPI.getAllTrips();
      console.log('Trips loaded:', response);
      
      // Transform the response to match our interface
      const transformedTrips = Array.isArray(response) ? response : (response.trips || response.data || []);
      
      setTrips(transformedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      // Fallback to mock data if API fails
      const mockTrips: Trip[] = [
        {
          _id: '1',
          title: 'Damascus Heritage Tour',
          description: 'Explore the ancient city of Damascus with its rich history and culture',
          destination: 'Damascus, Syria',
          price: 899,
          duration: '5 days',
          type: 'Cultural',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          rating: 4.8,
          capacity: 20,
          startDate: '2024-03-15',
          endDate: '2024-03-20',
        },
        {
          _id: '2',
          title: 'Aleppo Adventure',
          description: 'Discover the historic city of Aleppo and its magnificent architecture',
          destination: 'Aleppo, Syria',
          price: 699,
          duration: '4 days',
          type: 'Adventure',
          image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
          rating: 4.6,
          capacity: 15,
          startDate: '2024-04-10',
          endDate: '2024-04-14',
        },
        {
          _id: '3',
          title: 'Palmyra Desert Experience',
          description: 'Journey through the ancient ruins of Palmyra in the Syrian desert',
          destination: 'Palmyra, Syria',
          price: 599,
          duration: '3 days',
          type: 'Cultural',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
          rating: 4.7,
          capacity: 12,
          startDate: '2024-05-01',
          endDate: '2024-05-04',
        },
        {
          _id: '4',
          title: 'Latakia Beach Retreat',
          description: 'Relax on the beautiful beaches of Latakia with crystal clear waters',
          destination: 'Latakia, Syria',
          price: 799,
          duration: '6 days',
          type: 'Relaxation',
          image: 'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400',
          rating: 4.5,
          capacity: 25,
          startDate: '2024-06-15',
          endDate: '2024-06-21',
        },
        {
          _id: '5',
          title: 'Tartus Coastal Adventure',
          description: 'Explore the coastal city of Tartus and its historic port',
          destination: 'Tartus, Syria',
          price: 649,
          duration: '4 days',
          type: 'Adventure',
          image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
          rating: 4.4,
          capacity: 18,
          startDate: '2024-07-10',
          endDate: '2024-07-14',
        },
        {
          _id: '6',
          title: 'Homs Business Trip',
          description: 'Professional business tour of Homs with modern amenities',
          destination: 'Homs, Syria',
          price: 549,
          duration: '3 days',
          type: 'Business',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
          rating: 4.3,
          capacity: 30,
          startDate: '2024-08-05',
          endDate: '2024-08-08',
        }
      ];
      setTrips(mockTrips);
    } finally {
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(trip =>
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by type
    if (selectedType !== 'All') {
      filtered = filtered.filter(trip => trip.type === selectedType);
    }
    
    setFilteredTrips(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const handleTripPress = (trip: Trip) => {
    navigation.navigate('TripDetails', { trip });
  };

  const handleCreateTrip = () => {
    navigation.navigate('CreateTrip');
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity onPress={() => handleTripPress(item)} style={styles.cardContainer}>
      <Surface style={[styles.enhancedCard, { backgroundColor: theme.colors.surface }]}>
        {/* Image Container with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: item.image || 'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400'
            }} 
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Chip 
              mode="outlined"
              style={[styles.typeChip, { backgroundColor: theme.colors.primary }]}
              textStyle={{ color: 'white', fontWeight: 'bold' }}
            >
              {item.type}
            </Chip>
          </View>
        </View>

        {/* Card Content */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Title style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
              {item.title}
            </Title>
          </View>
          
          <Paragraph style={[styles.cardDescription, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Paragraph>
          
          <View style={styles.cardFooter}>
            <View style={styles.priceSection}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                ${item.price}
              </Text>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                per person
              </Text>
            </View>
            
            <View style={styles.tripInfo}>
              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  {item.duration}
                </Text>
              </View>
              <View style={styles.infoItem}>
                <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.infoText, { color: theme.colors.textSecondary }]}>
                  {item.capacity} spots
                </Text>
              </View>
            </View>
          </View>

          {/* Rating Section */}
          <View style={styles.ratingSection}>
            <View style={styles.rating}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                {item.rating}
              </Text>
            </View>
            <Button
              mode="contained"
              style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.bookButtonText}
              onPress={() => handleTripPress(item)}
            >
              View Details
            </Button>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  const renderTypeChip = (type: string) => (
    <TouchableOpacity
      key={type}
      onPress={() => setSelectedType(type)}
      style={[
        styles.typeChipContainer,
        selectedType === type && { backgroundColor: theme.colors.primary }
      ]}
    >
      <Text style={[
        styles.typeChipText,
        { color: selectedType === type ? 'white' : theme.colors.text }
      ]}>
        {type}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading trips...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Discover Trips</Text>
        <Text style={styles.headerSubtitle}>
          Explore amazing travel experiences
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

      {/* Type Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.typesContainer}
        contentContainerStyle={styles.typesContent}
      >
        {tripTypes.map(renderTypeChip)}
      </ScrollView>

      {/* Trips List */}
      <FlatList
        data={filteredTrips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item._id}
        numColumns={1}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={handleCreateTrip}
      />
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
    elevation: 4,
    borderRadius: 12,
  },
  typesContainer: {
    marginBottom: 16,
  },
  typesContent: {
    paddingHorizontal: 16,
  },
  typeChipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 16,
  },
  enhancedCard: {
    borderRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  typeChip: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tripInfo: {
    alignItems: 'flex-end',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  bookButton: {
    borderRadius: 20,
    paddingHorizontal: 16,
  },
  bookButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
});

export default TripsScreen; 