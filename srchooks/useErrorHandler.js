import { useState, useCallback } from 'react';

/**
 * Custom hook for handling errors in async operations
 * @param {Object} options - Configuration options
 * @param {Function} options.onError - Optional callback for error handling
 * @returns {Object} Error handling utilities
 */
const useErrorHandler = ({ onError } = {}) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Wraps an async function with error handling
   * @param {Function} asyncFn - Async function to execute
   * @param {Object} options - Options for error handling
   * @param {string} options.errorMessage - Custom error message
   * @returns {Function} Wrapped function with error handling
   */
  const handleAsync = useCallback((asyncFn, { errorMessage } = {}) => {
    return async (...args) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFn(...args);
        return result;
      } catch (err) {
        const finalError = {
          message: errorMessage || err.message,
          originalError: err,
        };
        setError(finalError);
        if (onError) {
          onError(finalError);
        }
        throw finalError;
      } finally {
        setIsLoading(false);
      }
    };
  }, [onError]);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isLoading,
    handleAsync,
    clearError,
  };
};

export default useErrorHandler;
