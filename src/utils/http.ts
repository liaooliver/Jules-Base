import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';
import { useAuthStore } from '../stores/authStore'; // Import the auth store

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://api.example.com', // Replace with your actual API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Access the store inside the interceptor
    // This ensures Pinia is initialized before the store is used.
    const authStore = useAuthStore();
    const token = authStore.getToken; // Accessing the getter

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // console.log('Request Interceptor with token:', config.headers.Authorization); // For demonstration
    return config;
  },
  (error) => {
    // Handle request error
    console.error('Request Interceptor Error:', error); // For demonstration
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log('Response Interceptor:', response); // For demonstration
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.error('Response Interceptor Error:', error.response || error.message); // For demonstration

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      switch (error.response.status) {
        case 401:
          // Handle unauthorized errors (e.g., redirect to login)
          console.error('Unauthorized access - 401');
          // window.location.href = '/login';
          break;
        case 403:
          // Handle forbidden errors
          console.error('Forbidden access - 403');
          break;
        case 404:
          // Handle not found errors
          console.error('Resource not found - 404');
          break;
        case 500:
          // Handle server errors
          console.error('Server error - 500');
          break;
        default:
          // Handle other errors
          console.error(`Error ${error.response.status}: ${error.response.data}`);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
