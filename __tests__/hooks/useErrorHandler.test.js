import { renderHook, act } from '@testing-library/react-native';
import useErrorHandler from '../../srchooks/useErrorHandler';

describe('useErrorHandler', () => {
  it('initializes with no error and not loading', () => {
    const { result } = renderHook(() => useErrorHandler());

    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it('clears error when clearError is called', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockAsyncFn = jest.fn().mockRejectedValue(new Error('Test error'));

    // First cause an error
    const wrappedFn = result.current.handleAsync(mockAsyncFn);
    
    await act(async () => {
      try {
        await wrappedFn();
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('handles async function with success', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const mockAsyncFn = jest.fn().mockResolvedValue('success');

    const wrappedFn = result.current.handleAsync(mockAsyncFn);
    
    let resultValue;
    await act(async () => {
      resultValue = await wrappedFn();
    });

    expect(mockAsyncFn).toHaveBeenCalled();
    expect(resultValue).toBe('success');
    expect(result.current.error).toBeNull();
  });

  it('handles async function with error and calls onError', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useErrorHandler({ onError }));
    const testError = new Error('Async error');
    const mockAsyncFn = jest.fn().mockRejectedValue(testError);

    const wrappedFn = result.current.handleAsync(mockAsyncFn, {
      errorMessage: 'Custom error message'
    });

    await act(async () => {
      try {
        await wrappedFn();
      } catch (error) {
        expect(error).toEqual(expect.objectContaining({
          message: 'Custom error message',
          originalError: testError
        }));
      }
    });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Custom error message',
      originalError: testError
    }));
  });

  it('uses default error message when none provided', async () => {
    const onError = jest.fn();
    const { result } = renderHook(() => useErrorHandler({ onError }));
    const testError = new Error('Original error');
    const mockAsyncFn = jest.fn().mockRejectedValue(testError);

    const wrappedFn = result.current.handleAsync(mockAsyncFn);

    await act(async () => {
      try {
        await wrappedFn();
      } catch (error) {
        expect(error).toEqual(expect.objectContaining({
          message: 'Original error',
          originalError: testError
        }));
      }
    });

    expect(onError).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Original error',
      originalError: testError
    }));
  });

  it('sets loading state during async operations', async () => {
    const { result } = renderHook(() => useErrorHandler());
    let resolvePromise;
    const mockAsyncFn = jest.fn().mockImplementation(() => 
      new Promise(resolve => {
        resolvePromise = resolve;
      })
    );

    const wrappedFn = result.current.handleAsync(mockAsyncFn);
    
    // Start the async operation
    let promise;
    act(() => {
      promise = wrappedFn();
    });

    // Should be loading
    expect(result.current.isLoading).toBe(true);

    // Complete the async operation
    await act(async () => {
      resolvePromise('success');
      await promise;
    });

    // Should not be loading anymore
    expect(result.current.isLoading).toBe(false);
  });

  it('sets error state when async function fails', async () => {
    const { result } = renderHook(() => useErrorHandler());
    const testError = new Error('Test error');
    const mockAsyncFn = jest.fn().mockRejectedValue(testError);

    const wrappedFn = result.current.handleAsync(mockAsyncFn);

    await act(async () => {
      try {
        await wrappedFn();
      } catch (e) {
        // Expected to throw
      }
    });

    expect(result.current.error).toEqual(expect.objectContaining({
      message: 'Test error',
      originalError: testError
    }));
  });
});
