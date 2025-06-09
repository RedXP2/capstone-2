import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../srccontext/ThemeContext';

const HelpSupportScreen = () => {
  const { theme } = useTheme();
  
  const openEmail = () => {
    Linking.openURL('mailto:wchen771860@gmail.com');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={[styles.content, { backgroundColor: theme.background }]}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Frequently Asked Questions</Text>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>How do I add a new muscle entry?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Swipe to the middle tab (or tap the middle of the navigation bar at the bottom of the screen!), then fill in the details about your workout and muscle group.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>How is recovery time calculated?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Recovery time is based on the number of days you specify when creating an entry. The app will count down in real-time showing days, hours, minutes, and seconds remaining.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>Can I edit an existing entry?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Yes, tap on any entry from the home screen to view details, then use the edit button to make changes to the muscle name, intensity, weight, sets, reps, and recovery time.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>Is my data secure?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Yes, your data is securely stored in Firebase and protected by authentication. Only you can access your muscle entries.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>How do I change my profile name?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Go to Settings > Edit Profile, then enter your new name and tap "Update Name".
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>Can I reset the recovery timer?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Yes, when editing an entry, you can modify the recovery time which will update the countdown timer accordingly.
            </Text>
          </View>
          
          <View style={styles.faqItem}>
            <Text style={[styles.question, { color: theme.primary }]}>How do I enable dark mode?</Text>
            <Text style={[styles.answer, { color: theme.text }]}>
              Go to Settings and toggle the "Dark Mode" switch to enable or disable dark theme.
            </Text>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Support</Text>
          <Text style={[styles.supportText, { color: theme.text }]}>
            If you need further assistance, please contact our support team:
          </Text>
          
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.primary }]} onPress={openEmail}>
            <Ionicons name="mail" size={20} color="white" />
            <Text style={styles.contactButtonText}>Email Support</Text>
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
    backgroundColor: 'white',
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
  faqItem: {
    marginBottom: 16,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  supportText: {
    fontSize: 14,
    marginBottom: 16,
    color: '#333',
  },
  contactButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  contactButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default HelpSupportScreen;