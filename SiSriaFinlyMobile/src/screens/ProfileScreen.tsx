import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { Card, Title, Paragraph, Button, Avatar, List, Switch, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const { theme } = useTheme();
  const { user, logout, updateProfile } = useAuth();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  const menuItems = [
    {
      id: 'bookings',
      title: 'My Bookings',
      icon: 'calendar',
      onPress: () => navigation.navigate('Bookings'),
    },
    {
      id: 'favorites',
      title: 'Favorites',
      icon: 'heart',
      onPress: () => navigation.navigate('Favorites'),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => navigation.navigate('Settings'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => navigation.navigate('Contact'),
    },
    {
      id: 'about',
      title: 'About App',
      icon: 'information-circle',
      onPress: () => navigation.navigate('About'),
    },
  ];

  const renderMenuItem = (item: any) => (
    <List.Item
      key={item.id}
      title={item.title}
      left={(props) => <List.Icon {...props} icon={item.icon} />}
      right={(props) => <List.Icon {...props} icon="chevron-right" />}
      onPress={item.onPress}
      style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
      titleStyle={{ color: theme.colors.text }}
    />
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Profile Header */}
      <Card style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.profileHeader}>
            <Avatar.Image
              size={80}
              source={
                user?.avatar
                  ? { uri: user.avatar }
                  : { uri: 'https://via.placeholder.com/80x80/cccccc/666666?text=User' }
              }
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Title style={[styles.userName, { color: theme.colors.text }]}>
                {user?.name || 'User Name'}
              </Title>
              <Paragraph style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
                {user?.email || 'user@example.com'}
              </Paragraph>
              <Paragraph style={[styles.userPhone, { color: theme.colors.textSecondary }]}>
                {user?.phone || '+1 234 567 8900'}
              </Paragraph>
            </View>
          </View>
          
          <View style={styles.profileActions}>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('EditProfile')}
              style={[styles.editButton, { borderColor: theme.colors.primary }]}
              textColor={theme.colors.primary}
            >
              Edit Profile
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="airplane" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Trips</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="heart" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>8</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Favorites</Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="star" size={24} color={theme.colors.primary} />
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>4.8</Text>
            <Text style={[styles.statLabel, { color: theme.colors.textSecondary }]}>Rating</Text>
          </Card.Content>
        </Card>
      </View>

      {/* Menu Items */}
      <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Account & Settings
          </Title>
          {menuItems.map(renderMenuItem)}
        </Card.Content>
      </Card>

      {/* Theme Toggle */}
      <Card style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Appearance
          </Title>
          <List.Item
            title="Dark Mode"
            left={(props) => <List.Icon {...props} icon="moon" />}
            right={() => (
              <Switch
                value={false}
                onValueChange={() => {}}
                color={theme.colors.primary}
              />
            )}
            style={styles.menuItem}
            titleStyle={{ color: theme.colors.text }}
          />
        </Card.Content>
      </Card>

      {/* Logout Section */}
      <View style={styles.logoutSection}>
        <Button
          mode="contained"
          onPress={handleLogout}
          loading={loading}
          disabled={loading}
          style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
          contentStyle={styles.buttonContent}
        >
          Logout
        </Button>
      </View>

      {/* App Version */}
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>
          SiSriaFinly v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 4,
  },
  profileContent: {
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
  },
  profileActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  editButton: {
    borderRadius: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 8,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  menuCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  menuItem: {
    borderRadius: 8,
    marginVertical: 2,
  },
  logoutSection: {
    padding: 16,
  },
  logoutButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 16,
  },
  versionText: {
    fontSize: 12,
  },
});

export default ProfileScreen; 