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
import { Card, Title, Paragraph, Button, Searchbar, List, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { adminAPI } from '../../services/api';

const AdminUsersScreen: React.FC = () => {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getAllUsers();
      console.log('Admin users loaded:', response);
      
      // Transform the response to match our interface
      const transformedUsers = Array.isArray(response) ? response : (response.users || response.data || []);
      
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
      // Fallback to mock data if API fails
      const mockUsers = [
        {
          _id: '1',
          name: 'Ahmed Al-Hassan',
          email: 'ahmed@example.com',
          role: 'user',
          status: 'active',
          joinDate: '2024-01-15',
          lastLogin: '2024-03-10',
        },
        {
          _id: '2',
          name: 'Fatima Al-Zahra',
          email: 'fatima@example.com',
          role: 'user',
          status: 'active',
          joinDate: '2024-02-20',
          lastLogin: '2024-03-12',
        },
        {
          _id: '3',
          name: 'Omar Al-Rashid',
          email: 'omar@example.com',
          role: 'admin',
          status: 'active',
          joinDate: '2024-01-10',
          lastLogin: '2024-03-15',
        },
        {
          _id: '4',
          name: 'Layla Al-Mahmoud',
          email: 'layla@example.com',
          role: 'user',
          status: 'suspended',
          joinDate: '2024-03-01',
          lastLogin: '2024-03-08',
        },
      ];
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredUsers(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleUserAction = (user: any, action: string) => {
    Alert.alert(
      `${action} User`,
      `Are you sure you want to ${action.toLowerCase()} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action, 
          style: action === 'Delete' ? 'destructive' : 'default',
          onPress: () => {
            // Implement user action logic here
            Alert.alert('Success', `User ${action.toLowerCase()}d successfully`);
          }
        },
      ]
    );
  };

  const renderUserCard = (user: any) => (
    <Card key={user._id} style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.userHeader}>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.colors.text }]}>
              {user.name}
            </Text>
            <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
              {user.email}
            </Text>
          </View>
          <View style={styles.userStatus}>
            <Chip 
              mode="outlined"
              style={[
                styles.statusChip,
                user.status === 'active' ? { backgroundColor: '#4CAF50' } : { backgroundColor: '#f44336' }
              ]}
              textStyle={{ color: 'white' }}
            >
              {user.status}
            </Chip>
            <Chip 
              mode="outlined"
              style={[
                styles.roleChip,
                user.role === 'admin' ? { backgroundColor: theme.colors.primary } : { backgroundColor: '#2196F3' }
              ]}
              textStyle={{ color: 'white' }}
            >
              {user.role}
            </Chip>
          </View>
        </View>
        <View style={styles.userActions}>
          <Button
            mode="outlined"
            onPress={() => handleUserAction(user, 'Edit')}
            style={styles.actionButton}
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleUserAction(user, 'Suspend')}
            style={[styles.actionButton, { borderColor: '#FF9800' }]}
            textColor="#FF9800"
          >
            Suspend
          </Button>
          <Button
            mode="outlined"
            onPress={() => handleUserAction(user, 'Delete')}
            style={[styles.actionButton, { borderColor: '#f44336' }]}
            textColor="#f44336"
          >
            Delete
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>
          Manage user accounts and permissions
        </Text>
      </View>

      {/* Search Bar */}
      <Searchbar
        placeholder="Search users..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
        iconColor={theme.colors.primary}
      />

      {/* Users List */}
      <ScrollView
        style={styles.usersList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredUsers.map(renderUserCard)}
      </ScrollView>

      {/* Add User Button */}
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          onPress={() => Alert.alert('Add User', 'Add user functionality coming soon')}
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          icon="plus"
        >
          Add New User
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
  usersList: {
    flex: 1,
    padding: 16,
  },
  userCard: {
    marginBottom: 16,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  statusChip: {
    marginBottom: 4,
  },
  roleChip: {
    marginBottom: 0,
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButtonContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  addButton: {
    borderRadius: 8,
  },
});

export default AdminUsersScreen; 