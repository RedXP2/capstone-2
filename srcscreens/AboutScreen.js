import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../srccontext/ThemeContext';

const AboutScreen = () => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Muscle Recovery App</Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>Version 1.1.1</Text>
          <Text style={[styles.description, { color: theme.text }]}>
            This app helps you track your muscle recovery after workouts, ensuring you give each muscle group adequate rest before training it again. With cloud synchronization, your data is securely stored and accessible across devices.
          </Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Features</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Track individual muscle groups</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Monitor recovery progress with real-time countdown</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Cloud synchronization across devices</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Secure user authentication</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Dark mode support</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Customizable user profile</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Visualize recovery status with color indicators</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Technology Stack</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• React Native - Cross-platform mobile framework</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Expo - Development platform and tools</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Firebase Authentication - User authentication</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Cloud Firestore - NoSQL database</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Zustand - Lightweight state management</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• React Navigation - Screen navigation</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Jest & React Testing Library - Testing framework</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• EAS Build - Production build system</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quality Assurance</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Comprehensive unit testing coverage</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Integration testing for navigation and error handling</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Performance testing for critical operations</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Error boundary implementation for crash prevention</Text>
          <Text style={[styles.bulletPoint, { color: theme.text }]}>• Secure authentication and data protection</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Developer</Text>
          <Text style={[styles.description, { color: theme.text }]}>
            Created by Will as part of the Software Development Bootcamp.
          </Text>
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
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  version: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    color: '#333',
  },
});

export default AboutScreen;