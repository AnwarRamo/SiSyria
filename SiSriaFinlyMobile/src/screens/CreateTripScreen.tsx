import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Chip,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { tripsAPI } from '../services/api';

const { width } = Dimensions.get('window');

interface TripFormData {
  title: string;
  description: string;
  destination: string;
  type: string;
  price: string;
  capacity: string;
  startDate: string;
  days: string;
  dayPlans: Array<{ details: string }>;
}

const CreateTripScreen: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TripFormData>({
    title: '',
    description: '',
    destination: '',
    type: '',
    price: '',
    capacity: '',
    startDate: '',
    days: '1',
    dayPlans: [{ details: '' }],
  });

  const tripTypes = ['Adventure', 'Cultural', 'Relaxation', 'Business', 'Family', 'Romantic'];

  const handleInputChange = (field: keyof TripFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDayPlanChange = (index: number, value: string) => {
    const newDayPlans = [...formData.dayPlans];
    newDayPlans[index] = { details: value };
    setFormData(prev => ({ ...prev, dayPlans: newDayPlans }));
  };

  const addDayPlan = () => {
    setFormData(prev => ({
      ...prev,
      dayPlans: [...prev.dayPlans, { details: '' }],
      days: String(prev.dayPlans.length + 1),
    }));
  };

  const removeDayPlan = (index: number) => {
    if (formData.dayPlans.length > 1) {
      const newDayPlans = formData.dayPlans.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        dayPlans: newDayPlans,
        days: String(newDayPlans.length),
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter a trip title');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a trip description');
      return false;
    }
    if (!formData.destination.trim()) {
      Alert.alert('Error', 'Please enter a destination');
      return false;
    }
    if (!formData.type.trim()) {
      Alert.alert('Error', 'Please select a trip type');
      return false;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price))) {
      Alert.alert('Error', 'Please enter a valid price');
      return false;
    }
    if (!formData.capacity.trim() || isNaN(Number(formData.capacity))) {
      Alert.alert('Error', 'Please enter a valid capacity');
      return false;
    }
    if (!formData.startDate.trim()) {
      Alert.alert('Error', 'Please enter a start date');
      return false;
    }
    if (!formData.days.trim() || isNaN(Number(formData.days)) || Number(formData.days) < 1) {
      Alert.alert('Error', 'Please enter a valid number of days');
      return false;
    }

    // Validate day plans
    for (let i = 0; i < formData.dayPlans.length; i++) {
      if (!formData.dayPlans[i].details.trim()) {
        Alert.alert('Error', `Please enter details for day ${i + 1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const tripData = {
        ...formData,
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        days: Number(formData.days),
        dayPlansJSON: JSON.stringify(formData.dayPlans),
      };

      const response = await tripsAPI.createTrip(tripData);
      Alert.alert(
        'Success',
        'Trip created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating trip:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create trip. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderDayPlanInput = (index: number) => (
    <Card key={index} style={[styles.dayPlanCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.dayPlanHeader}>
          <Title style={[styles.dayPlanTitle, { color: theme.colors.text }]}>
            Day {index + 1}
          </Title>
          {formData.dayPlans.length > 1 && (
            <Button
              mode="text"
              onPress={() => removeDayPlan(index)}
              textColor="#f44336"
              icon="delete"
            >
              Remove
            </Button>
          )}
        </View>
        <TextInput
          mode="outlined"
          label="Day Plan Details"
          value={formData.dayPlans[index].details}
          onChangeText={(value) => handleDayPlanChange(index, value)}
          multiline
          numberOfLines={3}
          style={styles.textInput}
        />
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>Create New Trip</Text>
        <Text style={styles.headerSubtitle}>
          Share your travel experience with others
        </Text>
      </View>

      {/* Basic Information */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Basic Information
          </Title>
          
          <TextInput
            mode="outlined"
            label="Trip Title"
            value={formData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            style={styles.textInput}
          />

          <TextInput
            mode="outlined"
            label="Description"
            value={formData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={3}
            style={styles.textInput}
          />

          <TextInput
            mode="outlined"
            label="Destination"
            value={formData.destination}
            onChangeText={(value) => handleInputChange('destination', value)}
            style={styles.textInput}
          />

          <Text style={[styles.label, { color: theme.colors.text }]}>Trip Type</Text>
          <View style={styles.chipContainer}>
            {tripTypes.map((type) => (
              <Chip
                key={type}
                selected={formData.type === type}
                onPress={() => handleInputChange('type', type)}
                style={[
                  styles.chip,
                  formData.type === type && { backgroundColor: theme.colors.primary }
                ]}
                textStyle={[
                  styles.chipText,
                  formData.type === type && { color: 'white' }
                ]}
              >
                {type}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Trip Details */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Trip Details
          </Title>
          
          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Price ($)"
              value={formData.price}
              onChangeText={(value) => handleInputChange('price', value)}
              keyboardType="numeric"
              style={[styles.textInput, styles.halfWidth]}
            />
            <TextInput
              mode="outlined"
              label="Capacity"
              value={formData.capacity}
              onChangeText={(value) => handleInputChange('capacity', value)}
              keyboardType="numeric"
              style={[styles.textInput, styles.halfWidth]}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              mode="outlined"
              label="Start Date (YYYY-MM-DD)"
              value={formData.startDate}
              onChangeText={(value) => handleInputChange('startDate', value)}
              style={[styles.textInput, styles.halfWidth]}
            />
            <TextInput
              mode="outlined"
              label="Number of Days"
              value={formData.days}
              onChangeText={(value) => handleInputChange('days', value)}
              keyboardType="numeric"
              style={[styles.textInput, styles.halfWidth]}
            />
          </View>
        </Card.Content>
      </Card>

      {/* Day Plans */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.dayPlansHeader}>
            <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Day Plans
            </Title>
            <Button
              mode="outlined"
              onPress={addDayPlan}
              icon="plus"
              style={styles.addButton}
            >
              Add Day
            </Button>
          </View>
          
          {formData.dayPlans.map((_, index) => renderDayPlanInput(index))}
        </Card.Content>
      </Card>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
          style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
          icon="send"
        >
          Create Trip
        </Button>
      </View>
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
  card: {
    margin: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textInput: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  dayPlansHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    borderRadius: 20,
  },
  dayPlanCard: {
    marginBottom: 12,
  },
  dayPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayPlanTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default CreateTripScreen; 