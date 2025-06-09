import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../srccontext/ThemeContext';
import { useAuthStore } from '../srcstore/authStore';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [recoveryAlerts, setRecoveryAlerts] = useState(true);
  const { isDarkMode, toggleTheme, theme } = useTheme();
  const { user, logout } = useAuthStore();

  const toggleNotifications = () => setNotifications(prev => !prev);
  const toggleRecoveryAlerts = () => setRecoveryAlerts(prev => !prev);
  
  const handleLogout = async () => {
    try {
      const result = await logout();
      if (!result.success) {
        Alert.alert('Error', result.error || 'Failed to log out');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Enable Notifications</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Receive app notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
              thumbColor={notifications ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Recovery Alerts</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Get notified when muscles are ready</Text>
            </View>
            <Switch
              value={recoveryAlerts}
              onValueChange={toggleRecoveryAlerts}
              trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
              thumbColor={recoveryAlerts ? '#4CAF50' : '#f4f3f4'}
              disabled={!notifications}
            />
          </View>
        </View>
        
        {/* App Settings Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Use dark theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d3d3d3', true: '#a5d6a7' }}
              thumbColor={isDarkMode ? '#4CAF50' : '#f4f3f4'}
            />
          </View>
        </View>
        
        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          
          {user && (
            <View style={[styles.userInfo, { borderBottomColor: theme.border }]}>
              <Text style={[styles.userName, { color: theme.text }]}>
                {user.displayName || user.email}
              </Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                {user.email}
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.accountButton, { borderBottomColor: theme.border }]}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="person" size={20} color="#4CAF50" />
            <Text style={[styles.accountButtonText, { color: theme.text }]}>Edit Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.accountButton, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color="#F44336" />
            <Text style={[styles.accountButtonText, styles.logoutText]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set dynamically
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  userInfo: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
  },
  toggleButton: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  toggleButtonText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Will be set dynamically
  },
  accountButtonText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#F44336',
  },
});

export default SettingsScreen;