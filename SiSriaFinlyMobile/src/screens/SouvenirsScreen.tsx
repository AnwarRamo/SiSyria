import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, Dimensions, Alert, ScrollView, Image } from 'react-native';
import { Card, Title, Paragraph, Searchbar, Button, Chip, Surface } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { souvenirsAPI } from '../services/api';

const { width } = Dimensions.get('window');

interface Souvenir {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  inStock: boolean;
  stock?: number;
}

const SouvenirsScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [souvenirs, setSouvenirs] = useState<Souvenir[]>([]);
  const [filteredSouvenirs, setFilteredSouvenirs] = useState<Souvenir[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Traditional', 'Handmade', 'Food', 'Clothing', 'Accessories'];

  useEffect(() => {
    loadSouvenirs();
  }, []);

  useEffect(() => {
    filterSouvenirs();
  }, [searchQuery, selectedCategory, souvenirs]);

  const loadSouvenirs = async () => {
    setLoading(true);
    try {
      const response = await souvenirsAPI.getAllSouvenirs();
      console.log('Souvenirs loaded:', response);
      
      // Transform the response to match our interface
      const transformedSouvenirs = Array.isArray(response) ? response : (response.products || response.souvenirs || []);
      
      setSouvenirs(transformedSouvenirs);
    } catch (error) {
      console.error('Error loading souvenirs:', error);
      // Fallback to mock data if API fails
      const mockSouvenirs: Souvenir[] = [
        {
          _id: '1',
          name: 'Damascus Rose Soap',
          description: 'Handmade traditional soap with Damascus rose essence',
          price: 15.99,
          category: 'Traditional',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          rating: 4.8,
          inStock: true,
          stock: 50
        },
        {
          _id: '2',
          name: 'Syrian Olive Oil',
          description: 'Pure extra virgin olive oil from Syrian groves',
          price: 25.99,
          category: 'Traditional',
          image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
          rating: 4.9,
          inStock: true,
          stock: 30
        },
        {
          _id: '3',
          name: 'Handwoven Scarf',
          description: 'Beautiful handwoven scarf with traditional patterns',
          price: 35.99,
          category: 'Handmade',
          image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
          rating: 4.7,
          inStock: true,
          stock: 20
        },
        {
          _id: '4',
          name: 'Damascus Steel Knife',
          description: 'Traditional Damascus steel knife with wooden handle',
          price: 89.99,
          category: 'Traditional',
          image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=400',
          rating: 4.6,
          inStock: true,
          stock: 10
        },
        {
          _id: '5',
          name: 'Syrian Spices Set',
          description: 'Premium collection of authentic Syrian spices',
          price: 19.99,
          category: 'Food',
          image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
          rating: 4.5,
          inStock: true,
          stock: 40
        },
        {
          _id: '6',
          name: 'Traditional Dress',
          description: 'Elegant traditional Syrian dress with embroidery',
          price: 120.99,
          category: 'Clothing',
          image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400',
          rating: 4.8,
          inStock: false,
          stock: 0
        }
      ];
      setSouvenirs(mockSouvenirs);
    } finally {
      setLoading(false);
    }
  };

  const filterSouvenirs = () => {
    let filtered = souvenirs;
    
    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredSouvenirs(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSouvenirs();
    setRefreshing(false);
  };

  const handlePurchase = (souvenir: Souvenir) => {
    Alert.alert(
      'Purchase Souvenir',
      `Would you like to purchase ${souvenir.name} for $${souvenir.price}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Purchase',
          onPress: async () => {
            try {
              await souvenirsAPI.purchaseSouvenir(souvenir._id, {
                quantity: 1,
                price: souvenir.price
              });
              Alert.alert('Success', 'Souvenir purchased successfully!');
            } catch (error) {
              console.error('Purchase error:', error);
              Alert.alert('Error', 'Failed to purchase souvenir. Please try again.');
            }
          }
        }
      ]
    );
  };

  const renderSouvenirCard = ({ item }: { item: Souvenir }) => (
    <Surface style={[styles.enhancedCard, { backgroundColor: theme.colors.surface }]}>
      {/* Image Container */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: item.image || 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
          }} 
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.imageOverlay}>
          <Chip 
            mode="outlined"
            style={[styles.categoryChip, { backgroundColor: theme.colors.primary }]}
            textStyle={{ color: 'white', fontWeight: 'bold', fontSize: 10 }}
          >
            {item.category}
          </Chip>
          {!item.inStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Title style={[styles.cardTitle, { color: theme.colors.text }]} numberOfLines={2}>
            {item.name}
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
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={[styles.ratingText, { color: theme.colors.textSecondary }]}>
                {item.rating}
              </Text>
            </View>
          </View>
          
          <View style={styles.stockInfo}>
            <Text style={[styles.stockText, { color: item.inStock ? '#4CAF50' : '#f44336' }]}>
              {item.inStock ? `${item.stock || '∞'} left` : 'Unavailable'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate('TripDetails', { souvenir: item })}
            style={[styles.actionButton, { borderColor: theme.colors.primary }]}
            labelStyle={[styles.actionButtonText, { color: theme.colors.primary }]}
            disabled={!item.inStock}
          >
            View Details
          </Button>
          <Button
            mode="contained"
            onPress={() => handlePurchase(item)}
            disabled={!item.inStock}
            style={[styles.actionButton, { backgroundColor: item.inStock ? theme.colors.primary : '#ccc' }]}
            labelStyle={styles.actionButtonText}
          >
            {item.inStock ? 'Purchase' : 'Out of Stock'}
          </Button>
        </View>
      </View>
    </Surface>
  );

  const renderCategoryChip = (category: string) => (
    <TouchableOpacity
      key={category}
      onPress={() => setSelectedCategory(category)}
      style={[
        styles.categoryChipContainer,
        selectedCategory === category && { backgroundColor: theme.colors.primary }
      ]}
    >
      <Text style={[
        styles.categoryChipText,
        { color: selectedCategory === category ? 'white' : theme.colors.text }
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Souvenirs & Gifts</Text>
        <Text style={styles.headerSubtitle}>
          Take home a piece of Syria with you
        </Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search souvenirs..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
      />

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryChip)}
      </ScrollView>

      {/* Souvenirs List */}
      <FlatList
        data={filteredSouvenirs}
        renderItem={renderSouvenirCard}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
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
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  enhancedCard: {
    width: (width - 48) / 2,
    marginBottom: 16,
    borderRadius: 16,
    elevation: 6,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  categoryChip: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  outOfStockText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardContent: {
    padding: 12,
  },
  cardHeader: {
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 14,
    marginBottom: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  priceSection: {
    alignItems: 'flex-start',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  ratingText: {
    fontSize: 10,
    marginLeft: 2,
  },
  stockInfo: {
    alignItems: 'flex-end',
  },
  stockText: {
    fontSize: 10,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 4,
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default SouvenirsScreen; 