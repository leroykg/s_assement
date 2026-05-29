import React from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { Colors } from '../../constants/colors';

import {
  FREE_DELIVERY_MINIMUM,
  formatCurrency,
} from '../../helpers/basket'

export default function BasketPromo() {
  const iconBounce = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const iconAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(iconBounce, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(iconBounce, {
          toValue: 0,
          duration: 520,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ]),
    );

    iconAnimation.start();

    return () => {
      iconAnimation.stop();
    };
  }, [iconBounce]);

  const iconTranslateY = iconBounce.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -4],
  });

  return (
    <View style={styles.summaryPanel}>
      <View style={styles.summaryIcon}>
        <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>
          <MaterialCommunityIcons name="truck-fast-outline" size={26} color={Colors.secondaryForeground} />
        </Animated.View>
      </View>
      <View style={styles.summaryTextWrap}>
        <ThemedText style={styles.summaryTitle} type={"title"}>Today's special promo</ThemedText>
        <ThemedText style={styles.summaryCopy}>
           Spend {formatCurrency(FREE_DELIVERY_MINIMUM)} for free delivery.
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryPanel: {
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginVertical: 12,
    padding: 8,
    shadowColor: Colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 1,
  },
  summaryIcon: {
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    marginRight: 12,
    width: 48,
  },
  summaryTextWrap: {
    flex: 1,
  },
  summaryTitle: {
    color: Colors.cardForeground,
    fontSize: 16,
    letterSpacing: 0,
    marginBottom: 0,
  },
  summaryCopy: {
    color: Colors.mutedForeground,
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
  },
});
