import React, { useState } from 'react';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../srccontext/ThemeContext';

const intensityOptions = ['Easy', 'Medium', 'Hard'];

const AddEntryScreen = ({ navigation }) => {
  const [muscleName, setMuscleName] = useState('');
  const [intensity, setIntensity] = useState('Medium');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  
  const { addEntry } = useMuscleStore();
  
  const handleAddEntry = async () => {
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
      const newEntry = {
        muscleName,
        intensity,
        weight,
        sets: parseInt(sets),
        reps: parseInt(reps),
        recoveryTime: parseInt(recoveryTime),
        notes,
        lastWorkout: new Date().toISOString().split('T')[0]
      };
      
      const result = await addEntry(newEntry);
      
      if (result.success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Error', result.error || 'Failed to add entry');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Add New Entry</Text>
      </View>
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
          onPress={handleAddEntry}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Adding...' : 'Add Muscle Entry'}
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
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 0,
    paddingHorizontal: 20,
    elevation: 2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
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
});

export default AddEntryScreen;