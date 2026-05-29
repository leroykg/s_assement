import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

export default function QuantityButton({
  disabled = false,
  icon,
  label,
  onPress,
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.quantityButton,
        disabled && styles.quantityButtonDisabled,
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons
        name={icon}
        size={18}
        color={disabled ? Colors.disabledForeground : Colors.primary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  quantityButton: {
    alignItems: 'center',
    backgroundColor: Colors.muted,
    borderRadius: 8,
    height: 34,
    justifyContent: 'center',
    width: 34,
  },
  quantityButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  pressed: {
    opacity: 0.74,
  },
});
