/**
 * @fileoverview Error Boundary Component
 * A React component that catches JavaScript errors anywhere in its child component tree,
 * logs those errors, and displays a fallback UI instead of the component tree that crashed.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from '../srccontext/ThemeContext';

/**
 * Class component that implements error boundary functionality
 * @class
 * @extends {React.Component}
 */
class ErrorBoundaryClass extends React.Component {
  /**
   * Initialize error boundary state
   * @param {Object} props - Component props
   * @param {Object} props.theme - Theme object for styling
   * @param {Function} [props.onReset] - Optional callback for reset action
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Update state when an error occurs
   * @static
   * @param {Error} error - The error that was caught
   * @returns {Object} New state with error information
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called when an error is caught
   * @param {Error} error - The error that was caught
   * @param {React.ErrorInfo} errorInfo - Additional error information
   */
  componentDidCatch(error, errorInfo) {
    // Log error to your preferred logging service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  /**
   * Render either the error UI or the children
   * @returns {React.ReactNode} The rendered component
   */
  render() {
    const { hasError, error } = this.state;
    const { theme } = this.props;

    if (hasError) {
      return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <Text style={[styles.title, { color: theme.text }]}>Something went wrong</Text>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            {error?.message || 'An unexpected error occurred'}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) {
                this.props.onReset();
              }
            }}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

ErrorBoundaryClass.propTypes = {
  children: PropTypes.node.isRequired,
  theme: PropTypes.object.isRequired,
  onReset: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Wrapper component to provide theme context
const ErrorBoundary = (props) => {
  const { theme } = useTheme();
  return <ErrorBoundaryClass {...props} theme={theme} />;
};

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};

export default ErrorBoundary;
