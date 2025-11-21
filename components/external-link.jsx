import { Linking, TouchableOpacity } from 'react-native';

export function ExternalLink({ href, children }) {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(href)}>
      {children}
    </TouchableOpacity>
  );
}
