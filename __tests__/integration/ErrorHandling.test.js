import React from 'react';
import { Text } from 'react-native';
import { render, waitFor } from '../helpers/testUtils.helper';
import ErrorBoundary from '../../srccomponents/ErrorBoundary';
import useErrorHandler from '../../srchooks/useErrorHandler';

// Prevent console.error noise in tests
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

const TestComponent = ({ shouldThrow, errorMessage }) => {
  const { handleAsync } = useErrorHandler();

  React.useEffect(() => {
    if (shouldThrow) {
      // Throw error synchronously to be caught by error boundary
      throw new Error(errorMessage || 'Test error');
    }
  }, [shouldThrow, errorMessage]);

  return <Text>Test Component</Text>;
};

describe('Error Handling Integration', () => {
  it('should handle null errors gracefully', async () => {
    const { getByText } = render(
      <ErrorBoundary>
        <TestComponent shouldThrow={true} errorMessage={null} />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(getByText('Something went wrong')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('should handle undefined error messages', async () => {
    const { getByText } = render(
      <ErrorBoundary>
        <TestComponent shouldThrow={true} errorMessage={undefined} />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(getByText('Something went wrong')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('should properly integrate ErrorBoundary with useErrorHandler', async () => {
    const { getByText } = render(
      <ErrorBoundary>
        <TestComponent shouldThrow={true} errorMessage="Test Integration Error" />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(getByText('Something went wrong')).toBeTruthy();
    }, { timeout: 2000 });
  });

  it('should not show error UI when no error occurs', async () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <TestComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    await waitFor(() => {
      expect(getByText('Test Component')).toBeTruthy();
      expect(queryByText('Something went wrong')).toBeNull();
    }, { timeout: 2000 });
  });
});
