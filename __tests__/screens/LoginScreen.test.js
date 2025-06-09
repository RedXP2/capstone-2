import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import LoginScreen from '../../srcscreens/LoginScreen';
import { useAuthStore } from '../../src/store/authStore';
import { useTheme } from '../../srccontext/ThemeContext';

// Mock the navigation prop
const mockNavigation = {
  navigate: jest.fn(),
};

// Mock the auth store
jest.mock('../../src/store/authStore', () => ({
  useAuthStore: jest.fn(),
}));

// Mock the theme context
jest.mock('../../srccontext/ThemeContext', () => ({
  useTheme: jest.fn(),
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('LoginScreen', () => {
  const mockLogin = jest.fn();
  
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      login: mockLogin,
    });
    
    useTheme.mockReturnValue({
      theme: {
        background: '#ffffff',
        primary: '#4CAF50',
        text: '#000000',
        textSecondary: '#666666',
        border: '#dddddd',
        inputBackground: '#ffffff',
      },
    });
    
    mockNavigation.navigate.mockClear();
    mockLogin.mockClear();
  });

  it('renders correctly with all elements', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    expect(getByText('Muscle Recovery')).toBeTruthy();
    expect(getByText('Track your recovery, maximize your gains')).toBeTruthy();
    expect(getByPlaceholderText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Password')).toBeTruthy();
    expect(getByText('Login')).toBeTruthy();
    expect(getByText("Don't have an account? Register")).toBeTruthy();
  });

  it('shows validation error when email is empty', async () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const loginButton = getByText('Login');
    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(getByText('Please enter your email address')).toBeTruthy();
  });

  it('shows validation error when password is empty', async () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const emailInput = getByPlaceholderText('Email');
    await act(async () => {
      fireEvent.changeText(emailInput, 'test@example.com');
    });

    const loginButton = getByText('Login');
    await act(async () => {
      fireEvent.press(loginButton);
    });

    expect(getByText('Please enter your password')).toBeTruthy();
  });

  it('navigates to register screen when register link is pressed', () => {
    const { getByText } = render(
      <LoginScreen navigation={mockNavigation} />
    );

    const registerLink = getByText("Don't have an account? Register");
    fireEvent.press(registerLink);

    expect(mockNavigation.navigate).toHaveBeenCalledWith('Register');
  });
});
