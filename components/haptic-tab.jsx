import * as Haptics from 'expo-haptics';
import { TouchableOpacity } from 'react-native';

export default function HapticTab({ children, onPress }) {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.selectionAsync();
        if (onPress) onPress();
      }}
    >
      {children}
    </TouchableOpacity>
  );
}
