import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { firebase, auth, db } from '../srcconfig/firebase';

export const useAuthStore = create((set, get) => ({
  isAuthenticated: false,
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Firebase authentication
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Get additional user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};
      
      // Store user ID in secure storage
      await SecureStore.setItemAsync('userId', user.uid);
      
      set({ 
        isAuthenticated: true, 
        user: { 
          uid: user.uid, 
          email: user.email, 
          displayName: user.displayName || userData.name || email.split('@')[0],
          ...userData
        },
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Authentication failed' 
      });
      return { 
        success: false, 
        error: error.message || 'Authentication failed' 
      };
    }
  },
  
  register: async (name, email, password) => {
    try {
      set({ isLoading: true, error: null });
      
      // Firebase authentication
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update profile with name
      await user.updateProfile({ displayName: name });
      
      // Create user document in Firestore
      await db.collection('users').doc(user.uid).set({
        name,
        email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Store user ID in secure storage
      await SecureStore.setItemAsync('userId', user.uid);
      
      set({ 
        isAuthenticated: true, 
        user: { 
          uid: user.uid, 
          email: user.email, 
          displayName: name 
        },
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Registration failed' 
      });
      return { 
        success: false, 
        error: error.message || 'Registration failed' 
      };
    }
  },
  
  updateProfile: async (data) => {
    try {
      set({ isLoading: true, error: null });
      
      const { user } = get();
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      
      const updates = {};
      
      // Update name if provided
      if (data.name) {
        // Update Firebase Auth profile
        await auth.currentUser.updateProfile({ displayName: data.name });
        updates.name = data.name;
      }
      
      // Update password if provided
      if (data.currentPassword && data.newPassword) {
        // Reauthenticate user first
        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email, 
          data.currentPassword
        );
        await auth.currentUser.reauthenticateWithCredential(credential);
        
        // Update password
        await auth.currentUser.updatePassword(data.newPassword);
      }
      
      // Update Firestore user document if we have updates
      if (Object.keys(updates).length > 0) {
        // Check if document exists first
        const docRef = db.collection('users').doc(user.uid);
        const docSnapshot = await docRef.get();
        
        if (docSnapshot.exists) {
          // Update existing document
          await docRef.update(updates);
        } else {
          // Create new document if it doesn't exist
          await docRef.set({
            ...updates,
            email: user.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });
        }
      }
      
      // Get updated user data
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.exists ? userDoc.data() : {};
      
      // Update local state
      set({ 
        user: { 
          ...user, 
          ...updates,
          displayName: data.name || user.displayName,
          ...userData
        },
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update profile' 
      });
      return { 
        success: false, 
        error: error.message || 'Failed to update profile' 
      };
    }
  },
  
  logout: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Firebase sign out
      await auth.signOut();
      
      // Clear secure storage
      await SecureStore.deleteItemAsync('userId');
      
      set({ 
        isAuthenticated: false, 
        user: null,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      set({ 
        isLoading: false, 
        error: error.message || 'Logout failed' 
      });
      return { 
        success: false, 
        error: error.message || 'Logout failed' 
      };
    }
  },
  
  checkAuth: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Set up auth state listener
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          unsubscribe(); // Unsubscribe immediately after first response
          
          if (user) {
            // Get additional user data from Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            
            set({ 
              isAuthenticated: true, 
              user: { 
                uid: user.uid, 
                email: user.email, 
                displayName: user.displayName || userData.name || user.email.split('@')[0],
                ...userData
              },
              isLoading: false
            });
            
            resolve(true);
          } else {
            // Check secure storage as fallback
            const userId = await SecureStore.getItemAsync('userId');
            
            if (userId) {
              // Token exists but Firebase session expired
              // We'll need to re-authenticate the user
              await SecureStore.deleteItemAsync('userId');
            }
            
            set({ isAuthenticated: false, user: null, isLoading: false });
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Auth check error:', error);
      set({ 
        isAuthenticated: false, 
        user: null, 
        isLoading: false,
        error: error.message || 'Authentication check failed'
      });
      return false;
    }
  },
}));