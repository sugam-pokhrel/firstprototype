import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import MachineMarker from '../../components/map/MachineMarker';
import machinesData from '../../data/machines.json';
import { calculateDistance, getAddressFromCoordinates, getCurrentLocation } from '../../services/location';
import { colors } from '../../theme/colors';
import MapView, { Marker, PROVIDER_GOOGLE } from './MapView';

const INITIAL_REGION = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [region, setRegion] = useState(INITIAL_REGION);

  useEffect(() => {
    loadLocationAndMachines();
  }, []);

  const loadLocationAndMachines = async () => {
    try {
      setLoading(true);
      
      // Get user location
      const location = await getCurrentLocation();
      setUserLocation(location);
      
      // Get address
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      setUserAddress(address);
      
      // Update map region to user location
      setRegion({
        ...region,
        latitude: location.latitude,
        longitude: location.longitude,
      });
      
      // Try to fetch from API first, fallback to JSON data
      try {
        const { machineAPI } = await import('../../services/api');
        const response = await machineAPI.getNearby(
          location.latitude,
          location.longitude,
          10
        );
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setMachines(response.data.data);
        } else {
          // No machines from API, use JSON data
          console.log('No machines from API, using JSON data');
          const machinesWithDistance = machinesData.map((machine) => ({
            ...machine,
            distance: calculateDistance(
              location.latitude,
              location.longitude,
              machine.latitude,
              machine.longitude
            ),
          }));
          
          const nearbyMachines = machinesWithDistance
            .filter((m) => m.distance <= 10)
            .sort((a, b) => a.distance - b.distance);
          
          setMachines(nearbyMachines);
        }
      } catch (apiError) {
        // Fallback to JSON data if API fails
        console.log('API not available, using JSON data:', apiError.message || apiError);
        const machinesWithDistance = machinesData.map((machine) => ({
          ...machine,
          distance: calculateDistance(
            location.latitude,
            location.longitude,
            machine.latitude,
            machine.longitude
          ),
        }));
        
        const nearbyMachines = machinesWithDistance
          .filter((m) => m.distance <= 10)
          .sort((a, b) => a.distance - b.distance);
        
        setMachines(nearbyMachines);
      }
    } catch (error) {
      Alert.alert(
        'Location Error',
        'Unable to get your location. Showing default area.',
        [{ text: 'OK' }]
      );
      // Use default machines if location fails
      setMachines(machinesData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  const handleMachinePress = (machine) => {
    setSelectedMachine(machine);
  };

  const handleBookMachine = () => {
    if (selectedMachine) {
      router.push({
        pathname: '/booking',
        params: { machineId: selectedMachine.id },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  // Web fallback - show list view instead of map
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.webHeader}>
          <Text style={styles.webTitle}>Nearby Laundry Machines</Text>
          <Text style={styles.webSubtitle}>{userAddress || 'Getting your location...'}</Text>
        </View>
        
        <ScrollView style={styles.webList}>
          {machines.map((machine) => (
            <TouchableOpacity
              key={machine.id}
              style={styles.webMachineCard}
              onPress={() => handleMachinePress(machine)}
            >
              <View style={styles.webMachineHeader}>
                <Ionicons name="water" size={24} color={colors.primary} />
                <View style={styles.webMachineInfo}>
                  <Text style={styles.webMachineType}>{machine.machineType}</Text>
                  <Text style={styles.webMachineOwner}>by {machine.ownerName || machine.owner?.name}</Text>
                </View>
                <Text style={styles.webMachinePrice}>${machine.pricePerHour}/hr</Text>
              </View>
              <Text style={styles.webMachineAddress}>{machine.address}</Text>
              {machine.distance && (
                <Text style={styles.webMachineDistance}>
                  {machine.distance.toFixed(1)} km away
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.rentButton}
          onPress={() => router.push('/rent-machine')}
        >
          <Ionicons name="add-circle" size={24} color={colors.white} />
          <Text style={styles.rentButtonText}>Rent Your Machine</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {MapView && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          mapPadding={{ bottom: 120, top: 0, left: 0, right: 0 }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="Your Location"
              description={userAddress}
            >
              <View style={styles.userMarker}>
                <Ionicons name="person" size={24} color={colors.primary} />
              </View>
            </Marker>
          )}

          {/* Machine markers */}
          {machines.map((machine) => (
            <Marker
              key={machine.id}
              coordinate={{
                latitude: machine.latitude,
                longitude: machine.longitude,
              }}
              onPress={() => handleMachinePress(machine)}
            >
              <MachineMarker machine={machine} onPress={handleMachinePress} />
            </Marker>
          ))}
        </MapView>
      )}

      {/* Address bar */}
      <View style={styles.addressBar}>
        <Ionicons name="location" size={20} color={colors.primary} />
        <Text style={styles.addressText} numberOfLines={1}>
          {userAddress || 'Getting your location...'}
        </Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={loadLocationAndMachines}
        >
          <Ionicons name="refresh" size={18} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Machines list below map (for better responsiveness) */}
      {!selectedMachine && machines.length > 0 && (
        <View style={styles.machinesList}>
          <Text style={styles.listTitle}>
            {machines.length} Machine{machines.length !== 1 ? 's' : ''} Nearby
          </Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
            contentContainerStyle={styles.scrollContent}
          >
            {machines.slice(0, 5).map((machine) => (
              <TouchableOpacity
                key={machine.id}
                style={styles.machineCardSmall}
                onPress={() => handleMachinePress(machine)}
              >
                <View style={styles.cardHeader}>
                  <Ionicons name="water" size={20} color={colors.primary} />
                  <Text style={styles.cardPrice}>${machine.pricePerHour}/hr</Text>
                </View>
                <Text style={styles.cardType} numberOfLines={1}>
                  {machine.machineType}
                </Text>
                <Text style={styles.cardOwner} numberOfLines={1}>
                  {machine.ownerName || machine.owner?.name}
                </Text>
                {machine.distance && (
                  <Text style={styles.cardDistance}>
                    {machine.distance.toFixed(1)} km away
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Selected machine card */}
      {selectedMachine && (
        <View style={styles.machineCard}>
          <ScrollView>
            <View style={styles.machineHeader}>
              <View>
                <Text style={styles.machineTitle}>{selectedMachine.machineType}</Text>
                <Text style={styles.machineOwner}>by {selectedMachine.ownerName}</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedMachine(null)}>
                <Ionicons name="close" size={24} color={colors.textGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.machineDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color={colors.textGray} />
                <Text style={styles.detailText}>{selectedMachine.address}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="cash-outline" size={16} color={colors.textGray} />
                <Text style={styles.detailText}>
                  ${selectedMachine.pricePerHour}/hour • {selectedMachine.machineCount} machine(s)
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="star" size={16} color={colors.secondary} />
                <Text style={styles.detailText}>
                  {selectedMachine.rating} ({selectedMachine.reviews} reviews)
                </Text>
              </View>
              {selectedMachine.distance && (
                <View style={styles.detailRow}>
                  <Ionicons name="navigate-outline" size={16} color={colors.textGray} />
                  <Text style={styles.detailText}>
                    {selectedMachine.distance.toFixed(1)} km away
                  </Text>
                </View>
              )}
            </View>

            <Text style={styles.machineDescription}>{selectedMachine.description}</Text>

            <TouchableOpacity style={styles.bookButton} onPress={handleBookMachine}>
              <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.rentButton]}
          onPress={() => router.push('/rent-machine')}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>Rent Your Machine</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.findButton]}
          onPress={() => {
            // Refresh nearby machines
            loadLocationAndMachines();
          }}
        >
          <Ionicons name="search" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>Find Machines</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: Platform.OS === 'web' ? '60%' : '65%', // Responsive height - smaller map
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundGray,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textGray,
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
  },
  refreshButton: {
    padding: 4,
  },
  machinesList: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: 150,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  horizontalScroll: {
    paddingHorizontal: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  machineCardSmall: {
    backgroundColor: colors.backgroundGray,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    width: 160,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  cardType: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  cardOwner: {
    fontSize: 12,
    color: colors.textGray,
    marginBottom: 4,
  },
  cardDistance: {
    fontSize: 11,
    color: colors.textGray,
  },
  userMarker: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 4,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  machineCard: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    maxHeight: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  machineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  machineTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  machineOwner: {
    fontSize: 14,
    color: colors.textGray,
  },
  machineDetails: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  machineDescription: {
    fontSize: 14,
    color: colors.textGray,
    marginBottom: 16,
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rentButton: {
    backgroundColor: colors.primary,
  },
  findButton: {
    backgroundColor: colors.secondary,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  // Web styles
  webHeader: {
    backgroundColor: colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  webTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  webSubtitle: {
    fontSize: 14,
    color: colors.textGray,
  },
  webList: {
    flex: 1,
    padding: 16,
  },
  webMachineCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  webMachineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 12,
  },
  webMachineInfo: {
    flex: 1,
  },
  webMachineType: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  webMachineOwner: {
    fontSize: 14,
    color: colors.textGray,
  },
  webMachinePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  webMachineAddress: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  webMachineDistance: {
    fontSize: 12,
    color: colors.textGray,
  },
});

