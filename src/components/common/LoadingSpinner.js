import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/theme';

const LoadingSpinner = ({ size = 'large', color = COLORS.primary, overlay = false }) => {
  if (overlay) {
    return (
      <View style={styles.overlay}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size={size} color={color} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  spinnerContainer: {
    backgroundColor: COLORS.surface,
    padding: 20,
    borderRadius: 10,
  },
});

export default LoadingSpinner;
