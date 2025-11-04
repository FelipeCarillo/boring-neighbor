import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { theme } from '../../theme/theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
  ...props
}) => {
  const buttonStyle: ViewStyle[] = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.fullWidth,
    { backgroundColor: variant === 'contained' ? theme.colors[color] : 'transparent' },
    variant === 'outlined' && { borderColor: theme.colors[color], borderWidth: 1.5 },
    (disabled || loading) && styles.disabled,
    style,
  ];

  const textStyleCombined: TextStyle[] = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
    { color: variant === 'contained' ? '#FFFFFF' : theme.colors[color] },
    (disabled || loading) && styles.textDisabled,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'contained' ? '#FFFFFF' : theme.colors[color]} />
      ) : (
        <Text style={textStyleCombined}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  button_contained: {
    ...theme.shadows.sm,
  },
  button_outlined: {
    backgroundColor: 'transparent',
  },
  button_text: {
    backgroundColor: 'transparent',
  },
  button_small: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    minHeight: theme.dimensions.buttonHeightSmall,
  },
  button_medium: {
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.lg,
    minHeight: theme.dimensions.buttonHeight,
  },
  button_large: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    minHeight: theme.dimensions.buttonHeightLarge,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: theme.opacity.disabled,
  },
  text: {
    ...theme.textVariants.button,
  },
  text_contained: {},
  text_outlined: {},
  text_text: {},
  text_small: {
    fontSize: theme.typography.fontSize.sm,
  },
  text_medium: {
    fontSize: theme.typography.fontSize.md,
  },
  text_large: {
    fontSize: theme.typography.fontSize.md,
  },
  textDisabled: {},
});

export default Button;

