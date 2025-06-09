import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../srccontext/ThemeContext';

const ThemedHeader = ({ title, navigation }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 40, 
    justifyContent: 'center', 
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    left: 10
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default ThemedHeader;