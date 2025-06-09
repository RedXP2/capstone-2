import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { useMuscleStore } from '../srcstore/muscleStore';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../srccontext/ThemeContext';

const HomeScreen = ({ navigation }) => {
  const { muscleEntries, loadEntries, isLoading } = useMuscleStore();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  useEffect(() => {
    loadEntries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const getStatusColor = (entry) => {
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

  const renderItem = ({ item }) => {
    const statusColor = getStatusColor(item);
    
    return (
      <TouchableOpacity
        style={[styles.card, { 
          borderLeftColor: statusColor, 
          borderLeftWidth: 5,
          backgroundColor: theme.card
        }]}
        onPress={() => navigation.navigate('EntryDetail', { entryId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.muscleName, { color: theme.text }]}>{item.muscleName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>
              {item.status === 'ready' ? 'Ready' : `${item.recoveryProgress}/${item.recoveryTime} days`}
            </Text>
          </View>
        </View>
        
        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Intensity:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{item.intensity}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Weight:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{item.weight}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>Sets/Reps:</Text>
            <Text style={[styles.detailValue, { color: theme.text }]}>{item.sets} × {item.reps}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={styles.headerTitle}>Muscle Recovery</Text>
      </View>
      <FlatList
        data={muscleEntries}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No muscle entries yet</Text>
            <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>
              Swipe to the next page to add your first muscle group!
            </Text>
          </View>
        }
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  muscleName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardDetails: {
    marginTop: 8,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  detailLabel: {
    fontWeight: '500',
    marginRight: 8,
    color: '#666',
  },
  detailValue: {
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default HomeScreen;