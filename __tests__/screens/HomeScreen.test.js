import React from 'react';
import { Alert } from 'react-native';
import { render, mockNavigation, mockMuscleEntries, fireEvent, waitFor } from '../helpers/testUtils.helper';
import HomeScreen from '../../srcscreens/HomeScreen';
import { useMuscleStore } from '../../srcstore/muscleStore';

// Mock the store
jest.mock('../../srcstore/muscleStore', () => ({
  useMuscleStore: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

describe('HomeScreen', () => {
  // Default mock implementation
  const defaultMockStore = {
    muscleEntries: mockMuscleEntries,
    loadEntries: jest.fn().mockResolvedValue(),
    isLoading: false,
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useMuscleStore.mockImplementation(() => defaultMockStore);
  });

  it('renders loading state correctly', () => {
    useMuscleStore.mockImplementation(() => ({
      ...defaultMockStore,
      isLoading: true,
    }));

    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });

  it('renders empty state when no entries exist', () => {
    useMuscleStore.mockImplementation(() => ({
      ...defaultMockStore,
      muscleEntries: [],
    }));

    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    expect(getByText('No muscle entries yet')).toBeTruthy();
  });

  it('renders muscle entries correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    // Check if entries are rendered
    expect(getByText('Chest')).toBeTruthy();
    expect(getByText('Back')).toBeTruthy();
  });

  it('handles entry press correctly', () => {
    const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
    
    fireEvent.press(getByText('Chest'));
    
    expect(mockNavigation.navigate).toHaveBeenCalledWith('EntryDetail', {
      entryId: mockMuscleEntries[0].id,
    });
  });

  it('handles refresh correctly', async () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    
    const flatList = getByTestId('muscle-entries-list');
    fireEvent(flatList, 'refresh');
    
    await waitFor(() => {
      expect(defaultMockStore.loadEntries).toHaveBeenCalled();
    });
  });

  it('handles load entries error correctly', async () => {
    const errorMessage = 'Failed to load muscle entries';
    useMuscleStore.mockImplementation(() => ({
      ...defaultMockStore,
      loadEntries: jest.fn().mockRejectedValue(new Error(errorMessage)),
    }));

    render(<HomeScreen navigation={mockNavigation} />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Error',
        errorMessage,
        [{ text: 'OK' }]
      );
    });
  });

  it('displays correct status colors', () => {
    const { getByTestId } = render(<HomeScreen navigation={mockNavigation} />);
    
    // Check recovering status (first entry)
    const recoveringEntry = getByTestId('status-badge-1');
    expect(recoveringEntry.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: expect.any(String),
      })
    );

    // Check ready status (second entry)
    const readyEntry = getByTestId('status-badge-2');
    expect(readyEntry.props.style).toContainEqual(
      expect.objectContaining({
        backgroundColor: '#4CAF50',
      })
    );
  });
});
