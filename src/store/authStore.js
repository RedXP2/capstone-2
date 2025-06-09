import { create } from 'zustand';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

export const authStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    error: null 
  }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

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

  initializeAuth: () => {
    return onAuthStateChanged(auth, (user) => {
      get().setUser(user);
      set({ loading: false });
    });
  },
}));
