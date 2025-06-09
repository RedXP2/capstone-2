import { create } from 'zustand';
import { authStore } from '../../src/store/authStore';

// Mock Firebase auth
jest.mock('../../src/config/firebase', () => ({
  auth: {
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
  },
}));

describe('AuthStore', () => {
  let store;

  beforeEach(() => {
    // Reset store state before each test
    store = authStore.getState();
    authStore.setState({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });
  });

  test('initial state should be correct', () => {
    const state = authStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('setUser should update user and authentication state', () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
      displayName: 'Test User',
    };

    authStore.getState().setUser(mockUser);
    const state = authStore.getState();

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('setLoading should update loading state', () => {
    authStore.getState().setLoading(true);
    expect(authStore.getState().loading).toBe(true);

    authStore.getState().setLoading(false);
    expect(authStore.getState().loading).toBe(false);
  });

  test('setError should update error state', () => {
    const errorMessage = 'Authentication failed';
    authStore.getState().setError(errorMessage);
    expect(authStore.getState().error).toBe(errorMessage);
  });

  test('clearError should reset error state', () => {
    authStore.getState().setError('Some error');
    authStore.getState().clearError();
    expect(authStore.getState().error).toBeNull();
  });

  test('logout should reset user state', async () => {
    const mockUser = {
      uid: '123',
      email: 'test@example.com',
    };

    // Set user first
    authStore.getState().setUser(mockUser);
    expect(authStore.getState().isAuthenticated).toBe(true);

    // Then logout
    await authStore.getState().logout();
    const state = authStore.getState();

    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
