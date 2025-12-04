import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';

const SimpleInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error = '',
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        secureTextEntry={secureTextEntry}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
  },
  label: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.padding / 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.md,
    color: COLORS.text,
    minHeight: 50,
  },
  error: {
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginTop: SIZES.padding / 2,
  },
});

export default SimpleInput;
