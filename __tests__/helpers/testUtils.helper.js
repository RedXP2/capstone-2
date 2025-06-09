import React from 'react';
import { render } from '@testing-library/react-native';
import { ThemeProvider } from '../../srccontext/ThemeContext';

/**
 * Custom render function that includes providers
 * @param {React.Component} ui - Component to render
 * @param {Object} options - Render options
 * @returns {Object} Render result with providers
 */
const customRender = (ui, options = {}) => {
  const AllTheProviders = ({ children }) => {
    return (
      <ThemeProvider>
        {children}
      </ThemeProvider>
    );
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

/**
 * Mock navigation object for testing
 */
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  reset: jest.fn(),
  setParams: jest.fn(),
  dispatch: jest.fn(),
  setOptions: jest.fn(),
  isFocused: jest.fn(() => true),
  addListener: jest.fn(() => jest.fn()),
};

/**
 * Mock muscle entry data for testing
 */
export const mockMuscleEntry = {
  id: '1',
  muscleName: 'Chest',
  intensity: 'High',
  weight: '100kg',
  sets: 3,
  reps: 10,
  status: 'recovering',
  recoveryProgress: 2,
  recoveryTime: 5,
  createdAt: '2024-01-01',
  userId: 'user123',
};

/**
 * Mock muscle entries array for testing
 */
export const mockMuscleEntries = [
  mockMuscleEntry,
  {
    ...mockMuscleEntry,
    id: '2',
    muscleName: 'Back',
    status: 'ready',
    recoveryProgress: 5,
  },
];

// Re-export everything from testing library
export * from '@testing-library/react-native';

// Override render method
export { customRender as render };
