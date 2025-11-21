import { View } from 'react-native';

// Simple web MapView fallback: embed Google Maps centered on the given region.
// This avoids importing `react-native-maps` on web which contains native-only modules.
export default function MapViewWeb({ region, style /* children ignored for web */ }) {
  const lat = region?.latitude ?? 37.7749;
  const lng = region?.longitude ?? -122.4194;
  const zoom = 13;
  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <View style={[{ width: '100%', height: '100%' }, style]}> 
      <iframe
        title="Map"
        src={src}
        style={{ border: 0, width: '100%', height: '100%' }}
        loading="lazy"
      />
    </View>
  );
}

// Named exports used by native code; on web they are no-ops/stubs.
export const Marker = ({ children }) => null;
export const PROVIDER_GOOGLE = null;
