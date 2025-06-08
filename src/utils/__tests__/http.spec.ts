import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import apiClient from '../http'; // Import the actual instance we want to test

// Mock the entire axios library
vi.mock('axios');
import axios from 'axios'; // Import after vi.mock to get the mocked version
const mockedAxios = axios as vi.Mocked<typeof axios>;

// Mock the Pinia store used by the interceptor
import { useAuthStore } from '@/stores/authStore';
vi.mock('@/stores/authStore');
const mockUseAuthStore = useAuthStore as vi.MockedFunction<typeof useAuthStore>;

describe('Axios Interceptor in apiClient', () => {
  let mockAuthStoreInstance: {
    getToken: string | null;
    // If other store getters/state were used by interceptor, they'd be here
  };

  beforeEach(() => {
    // Reset call history and any specific implementations for mocks
    mockedAxios.request.mockReset();
    mockUseAuthStore.mockReset();

    // Setup default mock for the auth store instance
    mockAuthStoreInstance = {
      getToken: null, // Default to no token
    };
    mockUseAuthStore.mockReturnValue(mockAuthStoreInstance as any);

    // Provide a default successful response for any requests made by apiClient
    // This allows us to focus on the interceptor's behavior on the request config
    mockedAxios.request.mockResolvedValue({ status: 200, data: { message: 'success' } });
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Restore original implementations and clear mocks
  });

  it('should add Authorization header if token is present in authStore', async () => {
    mockAuthStoreInstance.getToken = 'test_jwt_token_from_store';

    // Make a request using the actual apiClient instance
    await apiClient.get('/api/protected-resource');

    // Check that useAuthStore was called by the interceptor
    expect(mockUseAuthStore).toHaveBeenCalledTimes(1);

    // Check that axios.request (which apiClient uses internally) was called
    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    // Inspect the config object received by the mocked axios.request
    const configSentToAxios = mockedAxios.request.mock.calls[0][0];
    expect(configSentToAxios.headers).toBeDefined();
    expect(configSentToAxios.headers!.Authorization).toBe('Bearer test_jwt_token_from_store');
  });

  it('should not add Authorization header if token is NOT present in authStore', async () => {
    mockAuthStoreInstance.getToken = null; // Explicitly set to null (already default)

    await apiClient.get('/api/public-resource');

    expect(mockUseAuthStore).toHaveBeenCalledTimes(1);
    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    const configSentToAxios = mockedAxios.request.mock.calls[0][0];
    expect(configSentToAxios.headers).toBeDefined();
    expect(configSentToAxios.headers!.Authorization).toBeUndefined();
  });

  it('should preserve other default headers like Content-Type', async () => {
    mockAuthStoreInstance.getToken = 'another_token_for_this_test'; // Token presence shouldn't affect other headers

    // Simulate a POST request which might have specific default headers
    await apiClient.post('/api/post-data', { some: 'data' });

    expect(mockUseAuthStore).toHaveBeenCalledTimes(1);
    expect(mockedAxios.request).toHaveBeenCalledTimes(1);

    const configSentToAxios = mockedAxios.request.mock.calls[0][0];
    expect(configSentToAxios.headers).toBeDefined();
    // Check for a default header defined in http.ts (e.g., Content-Type)
    expect(configSentToAxios.headers!['Content-Type']).toBe('application/json');
    // Ensure Authorization header is also present if token was set
    expect(configSentToAxios.headers!.Authorization).toBe('Bearer another_token_for_this_test');
  });

  it('should not add Authorization header if useAuthStore throws an error, and request should fail', async () => {
    const storeError = new Error("Simulated Pinia store error");
    // Configure the mock to throw an error when useAuthStore is called
    mockUseAuthStore.mockImplementation(() => {
      throw storeError;
    });

    // We expect the call to apiClient.get (or any other method) to reject
    // because the error from useAuthStore in the interceptor should propagate
    await expect(apiClient.get('/api/resource-when-store-fails')).rejects.toThrow(storeError);

    // Ensure useAuthStore was attempted
    expect(mockUseAuthStore).toHaveBeenCalledTimes(1);

    // In this case, axios.request should NOT have been called because the interceptor failed
    expect(mockedAxios.request).not.toHaveBeenCalled();
  });
});
