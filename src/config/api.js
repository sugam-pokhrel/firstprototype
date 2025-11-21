import { Platform } from 'react-native';

// Get the API URL based on platform
// For physical devices, use your computer's IP address
// For web/emulator, localhost works
const getApiUrl = () => {
  // Check if we have an environment variable
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // For web, use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000/api';
  }

  // For physical devices (iOS/Android), you need to use your computer's IP
  // Your hotspot IP is: 192.168.137.1 (Windows Mobile Hotspot)
  // If using Wi-Fi hotspot, it might be: 172.20.20.20
  // Change this to match your actual hotspot IP
  return 'http://192.168.137.1:3000/api'; // Windows Mobile Hotspot IP
};

export const API_BASE_URL = getApiUrl();

