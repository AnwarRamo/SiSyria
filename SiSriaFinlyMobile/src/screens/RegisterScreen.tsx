import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Button, Card, Title, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
  const { theme } = useTheme();
  const { register } = useAuth();
  const navigation = useNavigation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    nationalId: '',
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        nationalId: formData.nationalId.trim(),
      });
      // Navigation will be handled by App.tsx based on auth state
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="airplane" size={40} color="white" />
          </View>
          <Text style={[styles.appTitle, { color: theme.colors.primary }]}>
            SiSriaFinly
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Create your account to start exploring
          </Text>
        </View>

        {/* Registration Form */}
        <Card style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Title style={[styles.formTitle, { color: theme.colors.text }]}>
              Sign Up
            </Title>

            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(value) => updateFormData('name', value)}
              mode="outlined"
              autoCapitalize="words"
              style={styles.input}
              error={!!errors.name}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name}
            </HelperText>

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => updateFormData('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              error={!!errors.email}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => updateFormData('phone', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              error={!!errors.phone}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.phone}>
              {errors.phone}
            </HelperText>

            <TextInput
              label="National ID"
              value={formData.nationalId}
              onChangeText={(value) => updateFormData('nationalId', value)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
              error={!!errors.nationalId}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.nationalId}>
              {errors.nationalId}
            </HelperText>

            <TextInput
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateFormData('password', value)}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              error={!!errors.password}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            <TextInput
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateFormData('confirmPassword', value)}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              style={styles.input}
              error={!!errors.confirmPassword}
              theme={{
                colors: {
                  primary: theme.colors.primary,
                  background: theme.colors.surface,
                  error: theme.colors.error,
                },
              }}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              disabled={loading}
              style={[styles.registerButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              Create Account
            </Button>

            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[styles.linkText, { color: theme.colors.primary }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            By creating an account, you agree to our{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Terms of Service
            </Text>
          </TouchableOpacity>
          <Text style={[styles.termsText, { color: theme.colors.textSecondary }]}>
            {' '}and{' '}
          </Text>
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: theme.colors.primary }]}>
              Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
    elevation: 4,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 4,
  },
  registerButton: {
    marginTop: 16,
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
  },
});

export default RegisterScreen; 