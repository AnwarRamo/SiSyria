import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Surface } from 'react-native-paper';
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

const HomeScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [featuredTrips, setFeaturedTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadFeaturedTrips();
  }, []);

  const loadFeaturedTrips = async () => {
    setLoading(true);
    try {
      const response = await tripsAPI.getFeaturedTrips();
      console.log('Featured trips loaded:', response);
      
      // Transform the response to match our interface
      const transformedTrips = Array.isArray(response) ? response : (response.trips || response.featured || []);
      
      setFeaturedTrips(transformedTrips);
    } catch (error) {
      console.error('Error loading featured trips:', error);
      // Fallback to mock data if API fails
      const mockFeaturedTrips: Trip[] = [
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
      ];
      setFeaturedTrips(mockFeaturedTrips);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeaturedTrips();
    setRefreshing(false);
  };

  const renderTripCard = ({ item }: { item: Trip }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('TripDetails', { trip: item })}
      style={styles.cardContainer}
    >
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
              onPress={() => navigation.navigate('TripDetails', { trip: item })}
            >
              View Details
            </Button>
          </View>
        </View>
      </Surface>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Welcome to
          </Text>
          <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
            SiSriaFinly
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Discover amazing destinations
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Trips')}
        >
          <Ionicons name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate('Trips')}
        >
          <Ionicons name="airplane" size={24} color="white" />
          <Text style={styles.actionText}>Browse Trips</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
          onPress={() => navigation.navigate('Souvenirs')}
        >
          <Ionicons name="gift" size={24} color="white" />
          <Text style={styles.actionText}>Souvenirs</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
          onPress={() => navigation.navigate('Contact')}
        >
          <Ionicons name="call" size={24} color="white" />
          <Text style={styles.actionText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Featured Trips Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Featured Trips
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Trips')}>
            <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Loading featured trips...
            </Text>
          </View>
        ) : (
          <FlatList
            data={featuredTrips}
            renderItem={renderTripCard}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tripsList}
          />
        )}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Surface style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.aboutContent}>
            <Title style={[styles.aboutTitle, { color: theme.colors.text }]}>
              About SiSriaFinly
            </Title>
            <Paragraph style={[styles.aboutText, { color: theme.colors.textSecondary }]}>
              We specialize in creating unforgettable travel experiences. From exotic destinations 
              to local adventures, we make your travel dreams come true.
            </Paragraph>
            <Button
              mode="contained"
              style={[styles.aboutButton, { backgroundColor: theme.colors.primary }]}
              labelStyle={styles.aboutButtonText}
              onPress={() => navigation.navigate('About')}
            >
              Learn More
            </Button>
          </View>
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  searchButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    minWidth: 80,
    elevation: 2,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
  },
  tripsList: {
    paddingLeft: 20,
  },
  cardContainer: {
    marginRight: 15,
  },
  enhancedCard: {
    width: width * 0.75,
    borderRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
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
  aboutCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 4,
  },
  aboutContent: {
    padding: 20,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  aboutButton: {
    borderRadius: 12,
    paddingVertical: 8,
  },
  aboutButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 