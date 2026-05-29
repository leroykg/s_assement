import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { FREE_DELIVERY_MINIMUM, formatCurrency } from '../../helpers/basket';
import { ThemedText } from '../ui/ThemedText';

type FreeDeliveryToastProps = {
  visible: boolean;
  onDismiss: () => void;
  topOffset: number;
};

const TOAST_DURATION = 3600;

export default function FreeDeliveryToast({
  visible,
  onDismiss,
  topOffset,
}: FreeDeliveryToastProps) {
  const progress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    let dismissTimer: ReturnType<typeof setTimeout> | undefined;

    if (visible) {
      Animated.spring(progress, {
        damping: 18,
        mass: 0.8,
        stiffness: 180,
        toValue: 1,
        useNativeDriver: true,
      }).start();

      dismissTimer = setTimeout(onDismiss, TOAST_DURATION);
    } else {
      Animated.timing(progress, {
        duration: 180,
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }

    return () => {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    };
  }, [onDismiss, progress, visible]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-18, 0],
  });

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      style={[
        styles.wrap,
        {
          opacity: progress,
          top: topOffset,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name="truck-delivery"
          size={23}
          color={Colors.primaryForeground}
        />
      </View>
      <View style={styles.copyWrap}>
        <ThemedText style={styles.title}>Free delivery unlocked</ThemedText>
        <ThemedText style={styles.copy}>
          You hit {formatCurrency(FREE_DELIVERY_MINIMUM)}. Your order now qualifies.
        </ThemedText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    elevation: 8,
    flexDirection: 'row',
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    position: 'absolute',
    right: 16,
    shadowColor: Colors.shadow,
    shadowOffset: {
      height: 8,
      width: 0,
    },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    zIndex: 20,
  },
  iconWrap: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 42,
    justifyContent: 'center',
    marginRight: 11,
    width: 42,
  },
  copyWrap: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    color: Colors.cardForeground,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 19,
  },
  copy: {
    color: Colors.mutedForeground,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 1,
  },
});
