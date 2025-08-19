import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { Card, Title, Paragraph, Button, Chip, Divider, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { tripsAPI, reviewsAPI } from '../services/api';

const { width } = Dimensions.get('window');

interface TripDetails {
  _id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  destination: string;
  image: string;
  images: string[];
  rating: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  maxGroupSize: number;
  included: string[];
  excluded: string[];
  itinerary: Array<{
    day: number;
    title: string;
    description: string;
  }>;
  reviews: Array<{
    id: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
  }>;
}

const TripDetailsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params as { tripId: string };

  const [trip, setTrip] = useState<TripDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

  const loadTripDetails = async () => {
    setLoading(true);
    try {
      // Try to get trip details from API
      const response = await tripsAPI.getTripById(tripId);
      const apiTrip = response.trip || response;
      
      // If API doesn't return full details, use mock data as fallback
      if (apiTrip && apiTrip._id) {
        // Merge API data with mock data for missing fields
        const mockTrip: TripDetails = {
          _id: tripId,
          title: apiTrip.title || 'Paris Adventure',
          description: apiTrip.description || 'Experience the magic of Paris with our exclusive tour package.',
          longDescription: apiTrip.longDescription || 'Discover the City of Light with our comprehensive Paris adventure. This 7-day tour takes you through the most iconic landmarks, hidden gems, and authentic experiences that make Paris truly special. From the majestic Eiffel Tower to the charming streets of Montmartre, you\'ll experience the perfect blend of history, culture, and modern Parisian life.',
          price: apiTrip.price || 1299,
          duration: apiTrip.duration || '7 days',
          destination: apiTrip.destination || 'Paris, France',
          image: apiTrip.image || 'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400',
          images: apiTrip.images || [
            'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400',
            'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          ],
          rating: apiTrip.rating || 4.8,
          category: apiTrip.category || 'Cultural',
          difficulty: apiTrip.difficulty || 'Easy',
          maxGroupSize: apiTrip.maxGroupSize || 15,
          included: apiTrip.included || [
            'Hotel accommodation (4-star)',
            'Daily breakfast',
            'Professional tour guide',
            'Transportation between sites',
            'Skip-the-line tickets',
            'Welcome dinner',
          ],
          excluded: apiTrip.excluded || [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Optional activities',
          ],
          itinerary: apiTrip.itinerary || [
            {
              day: 1,
              title: 'Arrival & Welcome',
              description: 'Arrive in Paris, check into your hotel, and enjoy a welcome dinner at a traditional French restaurant.',
            },
            {
              day: 2,
              title: 'Eiffel Tower & Champs-Élysées',
              description: 'Visit the iconic Eiffel Tower, stroll down the Champs-Élysées, and explore the Arc de Triomphe.',
            },
            {
              day: 3,
              title: 'Louvre Museum & Seine River',
              description: 'Discover the world\'s largest art museum and enjoy a scenic Seine River cruise.',
            },
          ],
          reviews: apiTrip.reviews || [
            {
              id: '1',
              user: 'Sarah Johnson',
              rating: 5,
              comment: 'Amazing experience! The tour guide was knowledgeable and the itinerary was perfect.',
              date: '2024-01-15',
            },
            {
              id: '2',
              user: 'Michael Chen',
              rating: 4,
              comment: 'Great value for money. Would definitely recommend to friends and family.',
              date: '2024-01-10',
            },
          ],
        };
        setTrip(mockTrip);
      } else {
        throw new Error('Trip not found');
      }
    } catch (error) {
      console.error('Error loading trip details:', error);
      Alert.alert('Error', 'Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrip = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to book this trip',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    setBookingLoading(true);
    try {
      // Try to book trip through API
      await tripsAPI.bookTrip(tripId, {
        userId: user?._id,
        tripId: tripId,
        bookingDate: new Date().toISOString(),
      });
      
      Alert.alert(
        'Booking Successful',
        'Your trip has been booked successfully! You will receive a confirmation email shortly.',
        [
          {
            text: 'View Bookings',
            onPress: () => navigation.navigate('Bookings'),
          },
          { text: 'OK' },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', 'Unable to book trip. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const renderImageCarousel = () => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: trip?.images[selectedImageIndex] }} style={styles.mainImage} />
      <View style={styles.imageIndicators}>
        {trip?.images.map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.indicator,
              selectedImageIndex === index && { backgroundColor: theme.colors.primary }
            ]}
            onPress={() => setSelectedImageIndex(index)}
          />
        ))}
      </View>
    </View>
  );

  const renderItineraryItem = (item: any) => (
    <Card key={item.day} style={[styles.itineraryCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.itineraryHeader}>
          <View style={[styles.dayBadge, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.dayText}>Day {item.day}</Text>
          </View>
          <Title style={[styles.itineraryTitle, { color: theme.colors.text }]}>
            {item.title}
          </Title>
        </View>
        <Paragraph style={[styles.itineraryDescription, { color: theme.colors.textSecondary }]}>
          {item.description}
        </Paragraph>
      </Card.Content>
    </Card>
  );

  const renderReview = (review: any) => (
    <Card key={review.id} style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.reviewHeader}>
          <Text style={[styles.reviewUser, { color: theme.colors.text }]}>
            {review.user}
          </Text>
          <View style={styles.reviewRating}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < review.rating ? 'star' : 'star-outline'}
                size={16}
                color="#ffc107"
              />
            ))}
          </View>
        </View>
        <Paragraph style={[styles.reviewComment, { color: theme.colors.textSecondary }]}>
          {review.comment}
        </Paragraph>
        <Text style={[styles.reviewDate, { color: theme.colors.textSecondary }]}>
          {review.date}
        </Text>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading trip details...
        </Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.text }]}>
          Trip not found
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Image Carousel */}
      {renderImageCarousel()}

      {/* Trip Info */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.tripTitle, { color: theme.colors.text }]}>
            {trip.title}
          </Title>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#ffc107" />
            <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
              {trip.rating} ({trip.reviews.length} reviews)
            </Text>
          </View>

          <Paragraph style={[styles.tripDescription, { color: theme.colors.textSecondary }]}>
            {trip.longDescription}
          </Paragraph>

          <View style={styles.tripDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="location" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {trip.destination}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="time" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                {trip.duration}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="people" size={16} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.textSecondary }]}>
                Max {trip.maxGroupSize} people
              </Text>
            </View>
          </View>

          <View style={styles.chipsContainer}>
            <Chip
              mode="outlined"
              style={[styles.chip, { borderColor: theme.colors.primary }]}
              textStyle={{ color: theme.colors.primary }}
            >
              {trip.category}
            </Chip>
            <Chip
              mode="outlined"
              style={[styles.chip, { borderColor: theme.colors.primary }]}
              textStyle={{ color: theme.colors.primary }}
            >
              {trip.difficulty}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {/* What's Included/Excluded */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            What's Included
          </Title>
          {trip.included.map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={[styles.includedText, { color: theme.colors.textSecondary }]}>
                {item}
              </Text>
            </View>
          ))}

          <Divider style={styles.divider} />

          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            What's Not Included
          </Title>
          {trip.excluded.map((item, index) => (
            <View key={index} style={styles.includedItem}>
              <Ionicons name="close-circle" size={16} color={theme.colors.error} />
              <Text style={[styles.includedText, { color: theme.colors.textSecondary }]}>
                {item}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Itinerary */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Itinerary
          </Title>
          {trip.itinerary.map(renderItineraryItem)}
        </Card.Content>
      </Card>

      {/* Reviews */}
      <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Reviews
          </Title>
          {trip.reviews.map(renderReview)}
        </Card.Content>
      </Card>

      {/* Booking Section */}
      <View style={styles.bookingSection}>
        <Card style={[styles.bookingCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.priceContainer}>
              <Text style={[styles.priceLabel, { color: theme.colors.textSecondary }]}>
                Price per person
              </Text>
              <Text style={[styles.priceText, { color: theme.colors.primary }]}>
                ${trip.price}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={handleBookTrip}
              loading={bookingLoading}
              disabled={bookingLoading}
              style={[styles.bookButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              Book This Trip
            </Button>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: 250,
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 4,
  },
  infoCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
  },
  tripDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  tripDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  includedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  includedText: {
    marginLeft: 8,
    fontSize: 14,
  },
  divider: {
    marginVertical: 16,
  },
  itineraryCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  itineraryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 12,
  },
  dayText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itineraryDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  reviewCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewRating: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 12,
  },
  bookingSection: {
    padding: 16,
  },
  bookingCard: {
    borderRadius: 12,
    elevation: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 14,
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  bookButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default TripDetailsScreen; 