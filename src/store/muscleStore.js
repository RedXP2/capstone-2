import { create } from 'zustand';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

export const muscleStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  setEntries: (entries) => set({ entries }),

  addEntry: (entry) => set((state) => ({ 
    entries: [...state.entries, entry] 
  })),

  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    )
  })),

  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter(entry => entry.id !== id)
  })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  // Firebase operations
  saveEntry: async (entryData) => {
    set({ loading: true, error: null });
    try {
      const docRef = await addDoc(collection(db, 'muscleEntries'), {
        ...entryData,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      const newEntry = { id: docRef.id, ...entryData };
      get().addEntry(newEntry);
      return { success: true, id: docRef.id };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  updateEntryInDB: async (id, updatedData) => {
    set({ loading: true, error: null });
    try {
      const entryRef = doc(db, 'muscleEntries', id);
      await updateDoc(entryRef, {
        ...updatedData,
        updatedAt: new Date(),
      });
      
      get().updateEntry(id, updatedData);
      return { success: true };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  deleteEntryFromDB: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, 'muscleEntries', id));
      get().deleteEntry(id);
      return { success: true };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  subscribeToEntries: (userId) => {
    const q = query(
      collection(db, 'muscleEntries'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const entries = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() });
      });
      get().setEntries(entries);
    }, (error) => {
      get().setError(error.message);
    });
  },

  // Helper methods
  getEntriesByMuscleGroup: (muscleGroup) => {
    return get().entries.filter(entry => entry.muscleGroup === muscleGroup);
  },

  getRecentEntries: (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return get().entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
  },

  getAveragePainLevel: (muscleGroup = null, days = 30) => {
    let entries = get().entries;
    
    if (muscleGroup) {
      entries = entries.filter(entry => entry.muscleGroup === muscleGroup);
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
    
    if (recentEntries.length === 0) return 0;
    
    const totalPain = recentEntries.reduce((sum, entry) => sum + entry.painLevel, 0);
    return totalPain / recentEntries.length;
  },
}));
