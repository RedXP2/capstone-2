import { create } from 'zustand';
import { format } from 'date-fns';
import { firebase, db } from '../srcconfig/firebase';
import { useAuthStore } from './authStore';

export const useMuscleStore = create((set, get) => ({
  muscleEntries: [],
  isLoading: false,
  error: null,

  // Load entries from Firestore
  loadEntries: async () => {
    set({ isLoading: true });
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        set({ muscleEntries: [], isLoading: false });
        return;
      }
      
      // Query entries for the current user
      const snapshot = await db.collection('muscleEntries')
        .where('userId', '==', user.uid)
        .get();
      
      const entries = [];
      snapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      set({ muscleEntries: entries, isLoading: false });
    } catch (error) {
      console.error('Error loading entries:', error);
      set({ error: 'Failed to load entries', isLoading: false });
    }
  },

  // Add a new muscle entry
  addEntry: async (entry) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' };
      }
      
      const now = new Date();
      const newEntry = {
        userId: user.uid,
        createdAt: format(now, 'yyyy-MM-dd'),
        createdAtTimestamp: now.getTime(),
        status: 'recovering', // recovering, ready
        recoveryProgress: 0,
        recoveryHistory: [],
        recoveryEndTime: now.getTime() + (entry.recoveryTime * 24 * 60 * 60 * 1000),
        ...entry
      };
      
      // Add to Firestore
      const docRef = await db.collection('muscleEntries').add(newEntry);
      
      // Add to local state with Firestore ID
      const entryWithId = { ...newEntry, id: docRef.id };
      set(state => ({
        muscleEntries: [...state.muscleEntries, entryWithId]
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error adding entry:', error);
      set({ error: 'Failed to add entry' });
      return { success: false, error: 'Failed to add entry' };
    }
  },

  // Update an existing entry
  updateEntry: async (id, updates) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' };
      }
      
      // Get the entry to update
      const entry = get().muscleEntries.find(e => e.id === id);
      
      if (!entry) {
        return { success: false, error: 'Entry not found' };
      }
      
      // Verify ownership
      if (entry.userId !== user.uid) {
        return { success: false, error: 'Not authorized to update this entry' };
      }
      
      // If recovery time was updated, recalculate the end time
      const updatedData = { ...updates };
      if (updates.recoveryTime && updates.recoveryTime !== entry.recoveryTime) {
        updatedData.recoveryEndTime = entry.createdAtTimestamp + (updates.recoveryTime * 24 * 60 * 60 * 1000);
      }
      
      // Update in Firestore
      await db.collection('muscleEntries').doc(id).update(updatedData);
      
      // Update in local state
      set(state => ({
        muscleEntries: state.muscleEntries.map(item => 
          item.id === id ? { ...item, ...updates, ...updatedData } : item
        )
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error updating entry:', error);
      set({ error: 'Failed to update entry' });
      return { success: false, error: 'Failed to update entry' };
    }
  },

  // Delete an entry
  deleteEntry: async (id) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' };
      }
      
      // Get the entry to delete
      const entry = get().muscleEntries.find(e => e.id === id);
      
      if (!entry) {
        return { success: false, error: 'Entry not found' };
      }
      
      // Verify ownership
      if (entry.userId !== user.uid) {
        return { success: false, error: 'Not authorized to delete this entry' };
      }
      
      // Delete from Firestore
      await db.collection('muscleEntries').doc(id).delete();
      
      // Delete from local state
      set(state => ({
        muscleEntries: state.muscleEntries.filter(item => item.id !== id)
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting entry:', error);
      set({ error: 'Failed to delete entry' });
      return { success: false, error: 'Failed to delete entry' };
    }
  },

  // Add a recovery day to an entry
  addRecoveryDay: async (id, note = '') => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' };
      }
      
      // Get the entry to update
      const entry = get().muscleEntries.find(e => e.id === id);
      
      if (!entry) {
        return { success: false, error: 'Entry not found' };
      }
      
      // Verify ownership
      if (entry.userId !== user.uid) {
        return { success: false, error: 'Not authorized to update this entry' };
      }
      
      const newProgress = entry.recoveryProgress + 1;
      const historyEntry = {
        date: format(new Date(), 'yyyy-MM-dd'),
        note
      };
      
      const updatedData = {
        recoveryProgress: newProgress,
        recoveryHistory: firebase.firestore.FieldValue.arrayUnion(historyEntry),
        status: newProgress >= entry.recoveryTime ? 'ready' : 'recovering'
      };
      
      // Update in Firestore
      await db.collection('muscleEntries').doc(id).update(updatedData);
      
      // Update in local state
      set(state => ({
        muscleEntries: state.muscleEntries.map(item => {
          if (item.id === id) {
            return {
              ...item,
              recoveryProgress: newProgress,
              recoveryHistory: [...item.recoveryHistory, historyEntry],
              status: newProgress >= item.recoveryTime ? 'ready' : 'recovering'
            };
          }
          return item;
        })
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error adding recovery day:', error);
      set({ error: 'Failed to add recovery day' });
      return { success: false, error: 'Failed to add recovery day' };
    }
  },

  // Start a new workout cycle for a muscle
  startNewCycle: async (id) => {
    try {
      const { user } = useAuthStore.getState();
      
      if (!user || !user.uid) {
        return { success: false, error: 'User not authenticated' };
      }
      
      // Get the entry to update
      const entry = get().muscleEntries.find(e => e.id === id);
      
      if (!entry) {
        return { success: false, error: 'Entry not found' };
      }
      
      // Verify ownership
      if (entry.userId !== user.uid) {
        return { success: false, error: 'Not authorized to update this entry' };
      }
      
      const now = new Date();
      const updatedData = {
        status: 'recovering',
        recoveryProgress: 0,
        lastWorkout: format(now, 'yyyy-MM-dd'),
        createdAtTimestamp: now.getTime(),
        recoveryEndTime: now.getTime() + (entry.recoveryTime * 24 * 60 * 60 * 1000)
      };
      
      // Update in Firestore
      await db.collection('muscleEntries').doc(id).update(updatedData);
      
      // Update in local state
      set(state => ({
        muscleEntries: state.muscleEntries.map(item => 
          item.id === id ? { ...item, ...updatedData } : item
        )
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Error starting new cycle:', error);
      set({ error: 'Failed to start new cycle' });
      return { success: false, error: 'Failed to start new cycle' };
    }
  }
}));