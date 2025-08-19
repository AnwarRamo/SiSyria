import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { Card, Title, Paragraph, List, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const AboutScreen: React.FC = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: 'airplane',
      title: 'Curated Travel Experiences',
      description: 'Handpicked destinations and experiences that showcase the best of Syria and beyond.',
    },
    {
      icon: 'shield-checkmark',
      title: 'Safe & Secure',
      description: 'Your safety is our priority with verified accommodations and trusted local partners.',
    },
    {
      icon: 'heart',
      title: 'Authentic Culture',
      description: 'Immerse yourself in local traditions, cuisine, and authentic cultural experiences.',
    },
    {
      icon: 'star',
      title: 'Premium Quality',
      description: 'High-quality services and accommodations for unforgettable travel memories.',
    },
  ];

  const teamMembers = [
    {
      name: 'Ahmed Al-Rashid',
      role: 'Founder & CEO',
      description: 'Passionate about showcasing Syria\'s rich cultural heritage to the world.',
    },
    {
      name: 'Fatima Zahra',
      role: 'Travel Curator',
      description: 'Expert in creating authentic and memorable travel experiences.',
    },
    {
      name: 'Omar Khalil',
      role: 'Technology Lead',
      description: 'Ensuring seamless digital experiences for our travelers.',
    },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400' }}
          style={styles.headerImage}
        />
        <View style={styles.headerOverlay}>
          <Text style={[styles.appTitle, { color: 'white' }]}>SiSriaFinly</Text>
          <Text style={[styles.appSubtitle, { color: 'white' }]}>
            Discover the Beauty of Syria
          </Text>
        </View>
      </View>

      {/* About Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            About SiSriaFinly
          </Title>
          <Paragraph style={[styles.description, { color: theme.colors.textSecondary }]}>
            SiSriaFinly is your gateway to discovering the rich cultural heritage, 
            stunning landscapes, and warm hospitality of Syria. We specialize in 
            creating authentic travel experiences that connect you with the heart 
            and soul of this beautiful country.
          </Paragraph>
          <Paragraph style={[styles.description, { color: theme.colors.textSecondary }]}>
            From ancient historical sites to modern cities, from traditional 
            markets to pristine natural wonders, we offer carefully curated 
            tours that showcase the best of Syria's diverse attractions.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Features Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Why Choose SiSriaFinly?
          </Title>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name={feature.icon as any} size={24} color="white" />
              </View>
              <View style={styles.featureContent}>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                  {feature.title}
                </Text>
                <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                  {feature.description}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Team Section */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Our Team
          </Title>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <View style={[styles.memberAvatar, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.memberInitial}>
                  {member.name.charAt(0)}
                </Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: theme.colors.text }]}>
                  {member.name}
                </Text>
                <Text style={[styles.memberRole, { color: theme.colors.primary }]}>
                  {member.role}
                </Text>
                <Text style={[styles.memberDescription, { color: theme.colors.textSecondary }]}>
                  {member.description}
                </Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Contact Info */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Get in Touch
          </Title>
          <View style={styles.contactItem}>
            <Ionicons name="mail" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              info@sisriafinly.com
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="call" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              +963 11 123 4567
            </Text>
          </View>
          <View style={styles.contactItem}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
            <Text style={[styles.contactText, { color: theme.colors.textSecondary }]}>
              Damascus, Syria
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Version Info */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  memberInitial: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 14,
    marginBottom: 4,
  },
  memberDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 16,
    marginLeft: 12,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 20,
  },
  versionText: {
    fontSize: 14,
  },
});

export default AboutScreen; 