import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = '',
  icon = null,
  maxLength = null,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  style = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View 
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {icon && (
          <View style={styles.iconContainer} pointerEvents="none">
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            multiline && styles.inputMultiline,
          ]}
          value={value}
          onChangeText={(text) => {
            if (onChangeText) {
              onChangeText(text);
            }
          }}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          autoCorrect={false}
          returnKeyType="done"
          underlineColorAndroid="transparent"
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
              size={24}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.padding,
    minHeight: SIZES.inputHeight,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: COLORS.error,
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.6,
  },
  iconContainer: {
    marginRight: SIZES.padding / 2,
  },
  input: {
    flex: 1,
    fontSize: SIZES.md,
    color: COLORS.text,
    paddingVertical: SIZES.padding,
    minHeight: 48,
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: SIZES.padding,
  },
  eyeIcon: {
    padding: SIZES.padding / 2,
  },
  errorText: {
    fontSize: SIZES.sm,
    color: COLORS.error,
    marginTop: SIZES.padding / 2,
  },
});

export default Input;
