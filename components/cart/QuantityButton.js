import React from 'react';
import { StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import Button from '../../components/ui/Button';

export default function QuantityButton({
  disabled = false,
  icon,
  label,
  onPress,
}) {
  return (
    <Button
      accessibilityLabel={label}
      contentColor={Colors.primary}
      disabled={disabled}
      iconName={icon}
      onPress={onPress}
      size="icon-sm"
      style={styles.quantityButton}
      variant="muted"
    />
  );
}

const styles = StyleSheet.create({
  quantityButton: {
    backgroundColor: Colors.muted,
    borderWidth: 0,
  },
});
