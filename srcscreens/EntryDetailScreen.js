import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { useMuscleStore } from '../srcstore/muscleStore';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../srccontext/ThemeContext';

const EntryDetailScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { muscleEntries, deleteEntry } = useMuscleStore();
  const [entry, setEntry] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { theme } = useTheme();
  
  useEffect(() => {
    const foundEntry = muscleEntries.find(item => item.id === entryId);
    setEntry(foundEntry);
  }, [entryId, muscleEntries]);
  
  useEffect(() => {
    if (!entry || !entry.recoveryEndTime) return;
    
    const calculateTimeRemaining = () => {
      const now = new Date().getTime();
      const endTime = entry.recoveryEndTime;
      const difference = Math.max(0, endTime - now);
      
      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      return { days, hours, minutes, seconds };
    };
    
    setTimeRemaining(calculateTimeRemaining());
    
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);
    
    return () => clearInterval(timer);
  }, [entry]);
  
  const handleDelete = () => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEntry(entryId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete entry');
            }
          }
        }
      ]
    );
  };
  
  if (!entry) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Entry not found</Text>
      </View>
    );
  }
  
  const getStatusColor = () => {
    if (entry.status === 'ready') {
      return '#4CAF50'; // Green
    }
    
    // Calculate a gradient from red to green based on recovery progress
    const progress = entry.recoveryProgress / entry.recoveryTime;
    if (progress < 0.3) return '#F44336'; // Red
    if (progress < 0.6) return '#FF9800'; // Orange
    if (progress < 0.9) return '#FFEB3B'; // Yellow
    return '#8BC34A'; // Light green
  };
  
  const statusColor = getStatusColor();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView>
        <View style={[styles.header, { backgroundColor: theme.card }]}>
          <Text style={[styles.muscleName, { color: theme.text }]}>{entry.muscleName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {entry.status === 'ready' ? 'Ready' : `${entry.recoveryProgress}/${entry.recoveryTime} days`}
            </Text>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recovery Countdown</Text>
          <View style={styles.countdownContainer}>
            <View style={styles.countdownItem}>
              <Text style={[styles.countdownValue, { color: theme.primary }]}>{timeRemaining.days}</Text>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>Days</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={[styles.countdownValue, { color: theme.primary }]}>{timeRemaining.hours}</Text>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>Hours</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={[styles.countdownValue, { color: theme.primary }]}>{timeRemaining.minutes}</Text>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>Minutes</Text>
            </View>
            <View style={styles.countdownItem}>
              <Text style={[styles.countdownValue, { color: theme.primary }]}>{timeRemaining.seconds}</Text>
              <Text style={[styles.countdownLabel, { color: theme.textSecondary }]}>Seconds</Text>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Workout Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Intensity:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{entry.intensity}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Weight:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{entry.weight}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Sets:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{entry.sets}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Reps:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{entry.reps}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Last Workout:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{entry.lastWorkout}</Text>
          </View>
        </View>
        
        {entry.notes && (
          <View style={[styles.section, { backgroundColor: theme.card }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Notes</Text>
            <Text style={[styles.notes, { color: theme.text }]}>{entry.notes}</Text>
          </View>
        )}
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.editButton, { backgroundColor: theme.primary }]}
            onPress={() => navigation.navigate('EditEntry', { entryId: entry.id })}
          >
            <Ionicons name="create-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={20} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
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
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 40,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  muscleName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  countdownItem: {
    alignItems: 'center',
    flex: 1,
  },
  countdownValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  countdownLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    flex: 1,
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  notes: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default EntryDetailScreen;