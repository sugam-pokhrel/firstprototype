import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export default function MachineMarker({ machine, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(machine)} style={styles.marker}>
      <View style={styles.markerContainer}>
        <Ionicons name="water" size={20} color={colors.white} />
        <Text style={styles.priceText}>${machine.pricePerHour}/hr</Text>
      </View>
      <View style={styles.markerArrow} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  marker: {
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  priceText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: colors.primary,
    marginTop: -1,
  },
});

