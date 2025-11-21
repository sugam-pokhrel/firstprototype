import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { colors } from '../../theme/colors';
import { getCurrentLocation, getAddressFromCoordinates } from '../../services/location';

export default function RentMachineScreen() {
  const [formData, setFormData] = useState({
    machineType: '',
    machineCount: '',
    pricePerHour: '',
    address: '',
    description: '',
  });
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' });
  };

  const handleGetLocation = async () => {
    try {
      setGettingLocation(true);
      const userLocation = await getCurrentLocation();
      const address = await getAddressFromCoordinates(
        userLocation.latitude,
        userLocation.longitude
      );
      
      setLocation(userLocation);
      setFormData({ ...formData, address });
    } catch (error) {
      Alert.alert('Error', 'Unable to get your location. Please enter address manually.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    
    if (!formData.machineType) newErrors.machineType = 'Machine type is required';
    if (!formData.machineCount) newErrors.machineCount = 'Number of machines is required';
    if (!formData.pricePerHour) newErrors.pricePerHour = 'Price per hour is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Validate location - try to get it if not available
    let finalLocation = location;
    if (!finalLocation) {
      try {
        setGettingLocation(true);
        finalLocation = await getCurrentLocation();
        setLocation(finalLocation);
      } catch (locError) {
        Alert.alert(
          'Location Required',
          'Please get your location or enter coordinates manually. The address will be used for display, but coordinates are required.',
          [{ text: 'OK' }]
        );
        setGettingLocation(false);
        return;
      } finally {
        setGettingLocation(false);
      }
    }

    setLoading(true);
    try {
      const { machineAPI } = await import('../../services/api');
      
      const machineData = {
        machineType: formData.machineType,
        machineCount: parseInt(formData.machineCount),
        pricePerHour: parseFloat(formData.pricePerHour),
        address: formData.address,
        latitude: finalLocation.latitude,
        longitude: finalLocation.longitude,
        description: formData.description || '',
      };

      console.log('Submitting machine data:', machineData);
      
      // Check if user is logged in
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert(
          'Authentication Required',
          'Please log in first to list your machine.',
          [
            {
              text: 'Login',
              onPress: () => router.replace('/login'),
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
        setLoading(false);
        return;
      }
      
      console.log('Token found, making API request...');
      const response = await machineAPI.create(machineData);
      
      if (response.data.success) {
        Alert.alert(
          'Success',
          'Your machine has been listed successfully!',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      }
    } catch (error) {
      let errorMessage = 'Failed to list machine. Please try again.';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot reach server. Make sure backend is running at http://192.168.137.1:3000';
        console.error('No response received:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred';
        console.error('Error:', error);
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Rent Your Machine</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Machine Type"
            value={formData.machineType}
            onChangeText={(text) => handleChange('machineType', text)}
            placeholder="e.g., Washer, Dryer, Washer & Dryer"
            error={errors.machineType}
          />

          <Input
            label="Number of Machines"
            value={formData.machineCount}
            onChangeText={(text) => handleChange('machineCount', text)}
            placeholder="e.g., 1, 2, 3"
            keyboardType="numeric"
            error={errors.machineCount}
          />

          <Input
            label="Price Per Hour ($)"
            value={formData.pricePerHour}
            onChangeText={(text) => handleChange('pricePerHour', text)}
            placeholder="e.g., 5"
            keyboardType="decimal-pad"
            error={errors.pricePerHour}
          />

          <View style={styles.locationSection}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.addressRow}>
              <Input
                value={formData.address}
                onChangeText={(text) => handleChange('address', text)}
                placeholder="Enter your address"
                error={errors.address}
                style={styles.addressInput}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleGetLocation}
                disabled={gettingLocation}
              >
                <Ionicons
                  name="location"
                  size={20}
                  color={gettingLocation ? colors.textGray : colors.primary}
                />
              </TouchableOpacity>
            </View>
            {gettingLocation && (
              <Text style={styles.locationText}>Getting your location...</Text>
            )}
          </View>

          <View style={styles.descriptionSection}>
            <Text style={styles.label}>Description (Optional)</Text>
            <Input
              value={formData.description}
              onChangeText={(text) => handleChange('description', text)}
              placeholder="Describe your machines, availability, etc."
              multiline
              numberOfLines={4}
              style={styles.descriptionInput}
            />
          </View>

          <Button
            title="List Machine"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundGray,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    marginBottom: 24,
  },
  locationSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  addressInput: {
    flex: 1,
  },
  locationButton: {
    padding: 14,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  locationText: {
    fontSize: 12,
    color: colors.textGray,
    marginTop: 4,
    fontStyle: 'italic',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 8,
  },
});

