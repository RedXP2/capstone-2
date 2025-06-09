import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useMuscleStore } from '../srcstore/muscleStore';
import { useTheme } from '../srccontext/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const intensityOptions = ['Easy', 'Medium', 'Hard'];

const EditEntryScreen = ({ route, navigation }) => {
  const { entryId } = route.params;
  const { muscleEntries, updateEntry } = useMuscleStore();
  const { theme } = useTheme();
  
  const [muscleName, setMuscleName] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const entry = muscleEntries.find(item => item.id === entryId);
    if (entry) {
      setMuscleName(entry.muscleName);
      setIntensity(entry.intensity);
      setWeight(entry.weight);
      setSets(entry.sets.toString());
      setReps(entry.reps.toString());
      setRecoveryTime(entry.recoveryTime.toString());
      setNotes(entry.notes || '');
    }
  }, [entryId, muscleEntries]);
  
  const handleUpdateEntry = async () => {
    if (!muscleName || !weight || !sets || !reps || !recoveryTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    
    if (isNaN(parseInt(sets)) || isNaN(parseInt(reps)) || isNaN(parseInt(recoveryTime))) {
      Alert.alert('Error', 'Sets, reps, and recovery time must be numbers');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const updatedEntry = {
        muscleName,
        intensity,
        weight,
        sets: parseInt(sets),
        reps: parseInt(reps),
        recoveryTime: parseInt(recoveryTime),
        notes
      };
      
      const result = await updateEntry(entryId, updatedEntry);
      
      if (result.success) {
        navigation.navigate('EntryDetail', { entryId });
      } else {
        Alert.alert('Error', result.error || 'Failed to update entry');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetTimer = async () => {
    Alert.alert(
      'Reset Recovery Timer',
      'Are you sure you want to reset the recovery timer? This will start the countdown from the beginning.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          onPress: async () => {
            try {
              const now = new Date();
              const updatedEntry = {
                createdAtTimestamp: now.getTime(),
                recoveryEndTime: now.getTime() + (parseInt(recoveryTime) * 24 * 60 * 60 * 1000)
              };
              
              const result = await updateEntry(entryId, updatedEntry);
              
              if (result.success) {
                Alert.alert('Success', 'Recovery timer has been reset');
              } else {
                Alert.alert('Error', result.error || 'Failed to reset timer');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred');
              console.error(error);
            }
          }
        }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Muscle Name *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="e.g., Biceps, Chest, Legs"
              placeholderTextColor={theme.textSecondary}
              value={muscleName}
              onChangeText={setMuscleName}
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Intensity *</Text>
            <View style={styles.optionsContainer}>
              {intensityOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    { backgroundColor: theme.card, borderColor: theme.border },
                    intensity === option && [styles.selectedOption, { backgroundColor: theme.primary, borderColor: theme.primary }]
                  ]}
                  onPress={() => setIntensity(option)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { color: theme.text },
                      intensity === option && styles.selectedOptionText
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Weight *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="e.g., Bodyweight, 10kg, 25lbs"
              placeholderTextColor={theme.textSecondary}
              value={weight}
              onChangeText={setWeight}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Sets *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card, 
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="e.g., 3"
                placeholderTextColor={theme.textSecondary}
                value={sets}
                onChangeText={setSets}
                keyboardType="numeric"
              />
            </View>
            
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={[styles.label, { color: theme.text }]}>Reps *</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.card, 
                  borderColor: theme.border,
                  color: theme.text
                }]}
                placeholder="e.g., 12"
                placeholderTextColor={theme.textSecondary}
                value={reps}
                onChangeText={setReps}
                keyboardType="numeric"
              />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Recovery Time (days) *</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: theme.card, 
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="e.g., 3"
              placeholderTextColor={theme.textSecondary}
              value={recoveryTime}
              onChangeText={setRecoveryTime}
              keyboardType="numeric"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Notes</Text>
            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: theme.card, 
                borderColor: theme.border,
                color: theme.text
              }]}
              placeholder="Any additional notes about this exercise"
              placeholderTextColor={theme.textSecondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={handleUpdateEntry}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Updating...' : 'Update Muscle Entry'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={handleResetTimer}
          >
            <Ionicons name="refresh" size={20} color={theme.primary} />
            <Text style={[styles.resetButtonText, { color: theme.primary }]}>
              Reset Recovery Timer
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
    color: '#555',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    marginHorizontal: 4,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  optionText: {
    color: '#555',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    padding: 15,
    marginTop: 12,
    borderWidth: 1,
  },
  resetButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  }
});

export default EditEntryScreen;