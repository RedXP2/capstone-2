/**
 * @fileoverview Authentication Store
 * This store manages user authentication state and operations using Firebase Auth.
 * Provides login, registration, logout functionality and auth state management.
 */

import { create } from 'zustand';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

/**
 * Creates a Zustand store for managing authentication state and operations.
 * Integrates with Firebase Authentication for user management.
 * 
 * @typedef {Object} User
 * @property {string} uid - Unique user identifier
 * @property {string} email - User's email address
 * @property {string} displayName - User's display name
 */
export const authStore = create((set, get) => ({
  /** @type {User|null} Current authenticated user */
  user: null,
  /** @type {boolean} Whether user is authenticated */
  isAuthenticated: false,
  /** @type {boolean} Loading state for auth operations */
  loading: false,
  /** @type {string|null} Error message if auth operation fails */
  error: null,

  /**
   * Updates the current user and authentication state
   * @param {User|null} user - User object or null for logout
   */
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),

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
   * Authenticates user with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      get().setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Creates a new user account with email and password
   * @param {string} email - User's email address
   * @param {string} password - User's password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  register: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      get().setUser(userCredential.user);
      return { success: true };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Signs out the current user
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
      return { success: true };
    } catch (error) {
      get().setError(error.message);
      return { success: false, error: error.message };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Sets up authentication state listener
   * @returns {Function} Unsubscribe function to stop listening to auth changes
   */
  initializeAuth: () => {
    return onAuthStateChanged(auth, (user) => {
      get().setUser(user);
      set({ loading: false });
    });
  },
}));
