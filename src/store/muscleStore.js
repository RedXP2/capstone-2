/**
 * @fileoverview Muscle Recovery Tracking Store
 * This store manages the state and operations for muscle recovery tracking,
 * including CRUD operations with Firebase integration and data analysis features.
 */

import { create } from 'zustand';
import { db } from '../config/firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy, onSnapshot } from 'firebase/firestore';

/**
 * Creates a Zustand store for managing muscle recovery tracking data.
 * Includes state management, Firebase operations, and data analysis features.
 * 
 * @typedef {Object} MuscleEntry
 * @property {string} id - Unique identifier for the entry
 * @property {string} muscleGroup - Name of the muscle group
 * @property {number} painLevel - Pain level (typically 1-10)
 * @property {Date} date - Date of the entry
 * @property {string} userId - ID of the user who created the entry
 */
export const muscleStore = create((set, get) => ({
  /** @type {MuscleEntry[]} Array of muscle recovery entries */
  entries: [],
  /** @type {boolean} Loading state for async operations */
  loading: false,
  /** @type {string|null} Error message if operation fails */
  error: null,

  /**
   * Updates the entries array in the store
   * @param {MuscleEntry[]} entries - New array of entries to set
   */
  setEntries: (entries) => set({ entries }),

  /**
   * Adds a new entry to the local state
   * @param {MuscleEntry} entry - Entry to add
   */
  addEntry: (entry) => set((state) => ({ 
    entries: [...state.entries, entry] 
  })),

  /**
   * Updates an existing entry in the local state
   * @param {string} id - ID of the entry to update
   * @param {Partial<MuscleEntry>} updatedEntry - Updated entry data
   */
  updateEntry: (id, updatedEntry) => set((state) => ({
    entries: state.entries.map(entry => 
      entry.id === id ? { ...entry, ...updatedEntry } : entry
    )
  })),

  /**
   * Removes an entry from the local state
   * @param {string} id - ID of the entry to delete
   */
  deleteEntry: (id) => set((state) => ({
    entries: state.entries.filter(entry => entry.id !== id)
  })),

  /**
   * Updates the loading state
   * @param {boolean} loading - New loading state
   */
  setLoading: (loading) => set({ loading }),

  /**
   * Sets an error message
   * @param {string} error - Error message to set
   */
  setError: (error) => set({ error }),

  /**
   * Clears any existing error message
   */
  clearError: () => set({ error: null }),

  /**
   * Saves a new entry to Firebase and updates local state
   * @param {Omit<MuscleEntry, 'id'>} entryData - Entry data to save
   * @returns {Promise<{success: boolean, id?: string, error?: string}>}
   */
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

  /**
   * Updates an existing entry in Firebase and local state
   * @param {string} id - ID of the entry to update
   * @param {Partial<MuscleEntry>} updatedData - Updated entry data
   * @returns {Promise<{success: boolean, error?: string}>}
   */
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

  /**
   * Deletes an entry from Firebase and local state
   * @param {string} id - ID of the entry to delete
   * @returns {Promise<{success: boolean, error?: string}>}
   */
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

  /**
   * Sets up a real-time subscription to Firebase for user's entries
   * @param {string} userId - ID of the user whose entries to subscribe to
   * @returns {Function} Unsubscribe function
   */
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

  /**
   * Filters entries by muscle group
   * @param {string} muscleGroup - Muscle group to filter by
   * @returns {MuscleEntry[]} Filtered entries
   */
  getEntriesByMuscleGroup: (muscleGroup) => {
    return get().entries.filter(entry => entry.muscleGroup === muscleGroup);
  },

  /**
   * Gets entries from the last specified number of days
   * @param {number} [days=7] - Number of days to look back
   * @returns {MuscleEntry[]} Recent entries
   */
  getRecentEntries: (days = 7) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return get().entries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= cutoffDate;
    });
  },

  /**
   * Calculates average pain level for specified muscle group and time period
   * @param {string|null} [muscleGroup=null] - Muscle group to calculate for (null for all)
   * @param {number} [days=30] - Number of days to include in calculation
   * @returns {number} Average pain level (0 if no entries found)
   */
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
