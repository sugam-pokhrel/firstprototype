import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for mobile networks
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log API URL for debugging (remove in production)
console.log('API Base URL:', API_BASE_URL);

// Request interceptor to add token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token to:', config.url);
    } else {
      console.warn('No token found for request to:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    if (error.response) {
      // Server responded with error
      console.error('Response error:', error.response.status, error.response.data);
      if (error.response.status === 401) {
        // Token expired or invalid
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
      }
    } else if (error.request) {
      // Request made but no response
      console.error('Network error - no response:', error.message);
    } else {
      // Something else
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    if (response.data.success) {
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  },
  getMe: () => api.get('/auth/me'),
};

export const machineAPI = {
  getNearby: (latitude, longitude, radius) => 
    api.get('/machines/nearby', { params: { latitude, longitude, radius } }),
  getById: (id) => api.get(`/machines/${id}`),
  create: (machineData) => api.post('/machines', machineData),
  getMyMachines: () => api.get('/machines/my/machines'),
  search: (query) => api.get('/machines/search', { params: query }),
};

export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my'),
  cancel: (id) => api.delete(`/bookings/${id}`),
};

