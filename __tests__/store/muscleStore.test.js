import { muscleStore } from '../../src/store/muscleStore';

// Mock Firebase firestore
jest.mock('../../src/config/firebase', () => ({
  db: {
    collection: jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(() => ({
        update: jest.fn(),
        delete: jest.fn(),
      })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          onSnapshot: jest.fn(),
        })),
      })),
    })),
  },
}));

describe('MuscleStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    muscleStore.setState({
      entries: [],
      loading: false,
      error: null,
    });
  });

  test('initial state should be correct', () => {
    const state = muscleStore.getState();
    expect(state.entries).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  test('setEntries should update entries', () => {
    const mockEntries = [
      {
        id: '1',
        muscleGroup: 'Chest',
        painLevel: 5,
        date: new Date().toISOString(),
      },
      {
        id: '2',
        muscleGroup: 'Back',
        painLevel: 3,
        date: new Date().toISOString(),
      },
    ];

    muscleStore.getState().setEntries(mockEntries);
    expect(muscleStore.getState().entries).toEqual(mockEntries);
  });

  test('addEntry should add new entry to the list', () => {
    const initialEntries = [
      {
        id: '1',
        muscleGroup: 'Chest',
        painLevel: 5,
        date: new Date().toISOString(),
      },
    ];

    const newEntry = {
      id: '2',
      muscleGroup: 'Back',
      painLevel: 3,
      date: new Date().toISOString(),
    };

    muscleStore.setState({ entries: initialEntries });
    muscleStore.getState().addEntry(newEntry);

    const state = muscleStore.getState();
    expect(state.entries).toHaveLength(2);
    expect(state.entries).toContain(newEntry);
  });

  test('updateEntry should modify existing entry', () => {
    const initialEntries = [
      {
        id: '1',
        muscleGroup: 'Chest',
        painLevel: 5,
        date: new Date().toISOString(),
      },
    ];

    const updatedEntry = {
      id: '1',
      muscleGroup: 'Chest',
      painLevel: 7,
      date: new Date().toISOString(),
    };

    muscleStore.setState({ entries: initialEntries });
    muscleStore.getState().updateEntry('1', updatedEntry);

    const state = muscleStore.getState();
    expect(state.entries[0].painLevel).toBe(7);
  });

  test('deleteEntry should remove entry from list', () => {
    const initialEntries = [
      {
        id: '1',
        muscleGroup: 'Chest',
        painLevel: 5,
        date: new Date().toISOString(),
      },
      {
        id: '2',
        muscleGroup: 'Back',
        painLevel: 3,
        date: new Date().toISOString(),
      },
    ];

    muscleStore.setState({ entries: initialEntries });
    muscleStore.getState().deleteEntry('1');

    const state = muscleStore.getState();
    expect(state.entries).toHaveLength(1);
    expect(state.entries[0].id).toBe('2');
  });

  test('setLoading should update loading state', () => {
    muscleStore.getState().setLoading(true);
    expect(muscleStore.getState().loading).toBe(true);

    muscleStore.getState().setLoading(false);
    expect(muscleStore.getState().loading).toBe(false);
  });

  test('setError should update error state', () => {
    const errorMessage = 'Failed to load entries';
    muscleStore.getState().setError(errorMessage);
    expect(muscleStore.getState().error).toBe(errorMessage);
  });

  test('clearError should reset error state', () => {
    muscleStore.getState().setError('Some error');
    muscleStore.getState().clearError();
    expect(muscleStore.getState().error).toBeNull();
  });

  test('getEntriesByMuscleGroup should filter entries correctly', () => {
    const entries = [
      { id: '1', muscleGroup: 'Chest', painLevel: 5 },
      { id: '2', muscleGroup: 'Back', painLevel: 3 },
      { id: '3', muscleGroup: 'Chest', painLevel: 7 },
    ];

    muscleStore.setState({ entries });
    const chestEntries = muscleStore.getState().getEntriesByMuscleGroup('Chest');
    
    expect(chestEntries).toHaveLength(2);
    expect(chestEntries.every(entry => entry.muscleGroup === 'Chest')).toBe(true);
  });

  test('getRecentEntries should return entries from last 7 days', () => {
    const now = new Date();
    const recentDate = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 days ago
    const oldDate = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000); // 10 days ago

    const entries = [
      { id: '1', muscleGroup: 'Chest', date: recentDate.toISOString() },
      { id: '2', muscleGroup: 'Back', date: oldDate.toISOString() },
    ];

    muscleStore.setState({ entries });
    const recentEntries = muscleStore.getState().getRecentEntries();
    
    expect(recentEntries).toHaveLength(1);
    expect(recentEntries[0].id).toBe('1');
  });
});
