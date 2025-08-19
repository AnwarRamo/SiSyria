import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Card, Title, Paragraph, TextInput, Button, List } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { contactAPI } from '../services/api';

const ContactScreen: React.FC = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await contactAPI.sendMessage(formData);
      Alert.alert('Success', 'Your message has been sent successfully!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleContactAction = (type: string, value: string) => {
    switch (type) {
      case 'phone':
        Linking.openURL(`tel:${value}`);
        break;
      case 'email':
        Linking.openURL(`mailto:${value}`);
        break;
      case 'location':
        // You can integrate with maps app here
        Alert.alert('Location', 'Damascus, Syria');
        break;
      case 'website':
        Linking.openURL(value);
        break;
    }
  };

  const contactInfo = [
    {
      icon: 'call',
      title: 'Phone',
      value: '+963 11 123 4567',
      action: 'phone',
    },
    {
      icon: 'mail',
      title: 'Email',
      value: 'info@sisriafinly.com',
      action: 'email',
    },
    {
      icon: 'location',
      title: 'Address',
      value: 'Damascus, Syria',
      action: 'location',
    },
    {
      icon: 'globe',
      title: 'Website',
      value: 'www.sisriafinly.com',
      action: 'website',
    },
  ];

  const socialMedia = [
    { icon: 'logo-facebook', name: 'Facebook', url: 'https://facebook.com/sisriafinly' },
    { icon: 'logo-instagram', name: 'Instagram', url: 'https://instagram.com/sisriafinly' },
    { icon: 'logo-twitter', name: 'Twitter', url: 'https://twitter.com/sisriafinly' },
    { icon: 'logo-linkedin', name: 'LinkedIn', url: 'https://linkedin.com/company/sisriafinly' },
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Card style={[styles.headerCard, { backgroundColor: theme.colors.primary }]}>
        <Card.Content style={styles.headerContent}>
          <Ionicons name="chatbubbles" size={48} color="white" />
          <Title style={[styles.headerTitle, { color: 'white' }]}>
            Get in Touch
          </Title>
          <Paragraph style={[styles.headerSubtitle, { color: 'white' }]}>
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </Paragraph>
        </Card.Content>
      </Card>

      {/* Contact Form */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Send us a Message
          </Title>
          
          <TextInput
            label="Your Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}
          />

          <TextInput
            label="Email Address"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            mode="outlined"
            keyboardType="email-address"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}
          />

          <TextInput
            label="Subject"
            value={formData.subject}
            onChangeText={(text) => setFormData({ ...formData, subject: text })}
            mode="outlined"
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}
          />

          <TextInput
            label="Message"
            value={formData.message}
            onChangeText={(text) => setFormData({ ...formData, message: text })}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            theme={{
              colors: {
                primary: theme.colors.primary,
                background: theme.colors.surface,
              },
            }}
          />

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          >
            Send Message
          </Button>
        </Card.Content>
      </Card>

      {/* Contact Information */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Contact Information
          </Title>
          
          {contactInfo.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contactItem}
              onPress={() => handleContactAction(item.action, item.value)}
            >
              <View style={[styles.contactIcon, { backgroundColor: theme.colors.primary }]}>
                <Ionicons name={item.icon as any} size={20} color="white" />
              </View>
              <View style={styles.contactDetails}>
                <Text style={[styles.contactTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.contactValue, { color: theme.colors.textSecondary }]}>
                  {item.value}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          ))}
        </Card.Content>
      </Card>

      {/* Social Media */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Follow Us
          </Title>
          
          <View style={styles.socialContainer}>
            {socialMedia.map((social, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.socialButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => Linking.openURL(social.url)}
              >
                <Ionicons name={social.icon as any} size={24} color="white" />
                <Text style={styles.socialText}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Business Hours */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Business Hours
          </Title>
          
          <View style={styles.hoursContainer}>
            <View style={styles.hoursItem}>
              <Text style={[styles.hoursDay, { color: theme.colors.text }]}>Monday - Friday</Text>
              <Text style={[styles.hoursTime, { color: theme.colors.textSecondary }]}>9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursItem}>
              <Text style={[styles.hoursDay, { color: theme.colors.text }]}>Saturday</Text>
              <Text style={[styles.hoursTime, { color: theme.colors.textSecondary }]}>10:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hoursItem}>
              <Text style={[styles.hoursDay, { color: theme.colors.text }]}>Sunday</Text>
              <Text style={[styles.hoursTime, { color: theme.colors.textSecondary }]}>Closed</Text>
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
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
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
  input: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactDetails: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialButton: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  socialText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hoursDay: {
    fontSize: 16,
    fontWeight: '500',
  },
  hoursTime: {
    fontSize: 16,
  },
});

export default ContactScreen; 