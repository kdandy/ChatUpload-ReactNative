import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const Button = ({ 
  title, 
  onPress, 
  disabled = false, 
  loading = false,
  variant = 'primary', // primary, secondary, outline, danger
  size = 'medium', // small, medium, large
  icon = null,
  fullWidth = false,
  style = {},
  textStyle = {},
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button];

    // Size variants
    if (size === 'small') baseStyle.push(styles.buttonSmall);
    if (size === 'large') baseStyle.push(styles.buttonLarge);

    // Color variants
    if (variant === 'primary') baseStyle.push(styles.buttonPrimary);
    if (variant === 'secondary') baseStyle.push(styles.buttonSecondary);
    if (variant === 'outline') baseStyle.push(styles.buttonOutline);
    if (variant === 'danger') baseStyle.push(styles.buttonDanger);

    // Full width
    if (fullWidth) baseStyle.push(styles.buttonFullWidth);

    // Disabled state
    if (disabled) baseStyle.push(styles.buttonDisabled);

    return baseStyle;
  };

  const getTextStyle = () => {
    const baseStyle = [styles.buttonText];

    // Size variants
    if (size === 'small') baseStyle.push(styles.buttonTextSmall);
    if (size === 'large') baseStyle.push(styles.buttonTextLarge);

    // Color variants
    if (variant === 'outline') baseStyle.push(styles.buttonTextOutline);
    if (disabled) baseStyle.push(styles.buttonTextDisabled);

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? COLORS.primary : COLORS.surface} 
          size="small"
        />
      ) : (
        <View style={styles.buttonContent}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: SIZES.buttonHeight,
    borderRadius: SIZES.radius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 2,
    ...SHADOWS.small,
  },
  buttonSmall: {
    height: 36,
    paddingHorizontal: SIZES.padding,
  },
  buttonLarge: {
    height: 56,
    paddingHorizontal: SIZES.padding * 3,
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonSecondary: {
    backgroundColor: COLORS.secondary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  buttonDanger: {
    backgroundColor: COLORS.error,
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: SIZES.padding / 2,
  },
  buttonText: {
    fontSize: SIZES.md,
    fontWeight: '600',
    color: COLORS.surface,
  },
  buttonTextSmall: {
    fontSize: SIZES.sm,
  },
  buttonTextLarge: {
    fontSize: SIZES.lg,
  },
  buttonTextOutline: {
    color: COLORS.primary,
  },
  buttonTextDisabled: {
    color: COLORS.textSecondary,
  },
});

export default Button;
