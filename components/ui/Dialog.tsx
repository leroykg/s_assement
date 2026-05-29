import React from 'react';
import {
  Animated,
  Modal,
  StyleSheet,
  View,
} from 'react-native';

import { Colors } from '../../constants/colors';
import Button, { type ButtonVariant } from './Button';
import { ThemedText } from './ThemedText';

export type DialogButtonStyle = 'default' | 'cancel' | 'destructive';

export type DialogButton = {
  text: string;
  onPress?: () => void;
  style?: DialogButtonStyle;
};

type DialogProps = {
  buttons: DialogButton[];
  description: string;
  onRequestClose?: () => void;
  title: string;
  visible: boolean;
};

export default function Dialog({
  buttons,
  description,
  onRequestClose,
  title,
  visible,
}: DialogProps) {
  const progress = React.useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = React.useState(visible);
  const [content, setContent] = React.useState({
    buttons,
    description,
    title,
  });

  React.useEffect(() => {
    if (visible) {
      setContent({
        buttons,
        description,
        title,
      });
      setMounted(true);
      Animated.spring(progress, {
        damping: 20,
        mass: 0.9,
        stiffness: 220,
        toValue: 1,
        useNativeDriver: true,
      }).start();
      return;
    }

    Animated.timing(progress, {
      duration: 160,
      toValue: 0,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setMounted(false);
      }
    });
  }, [buttons, description, progress, title, visible]);

  if (!mounted) {
    return null;
  }

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0.94, 1],
  });

  const useStackedButtons = content.buttons.length > 2;

  return (
    <Modal
      animationType="none"
      onRequestClose={onRequestClose}
      transparent
      visible={mounted}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: progress,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.dialog,
            {
              opacity: progress,
              transform: [{ scale }],
            },
          ]}
        >
          <ThemedText style={styles.title}>{content.title}</ThemedText>
          <ThemedText style={styles.description}>{content.description}</ThemedText>

          <View style={[styles.buttonRow, useStackedButtons && styles.buttonStack]}>
            {content.buttons.map((button, index) => {
              const variant: ButtonVariant = button.style === 'destructive'
                ? 'destructive'
                : button.style === 'cancel'
                  ? 'muted'
                  : 'default';

              return (
                <Button
                  accessibilityLabel={button.text}
                  key={`${button.text}-${index}`}
                  onPress={button.onPress}
                  variant={variant}
                  style={!useStackedButtons ? styles.inlineButton : undefined}
                >
                  {button.text}
                </Button>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(18, 33, 26, 0.48)',
  },
  dialog: {
    backgroundColor: Colors.card,
    borderColor: Colors.border,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 420,
    padding: 18,
    shadowColor: Colors.shadow,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    width: '100%',
  },
  title: {
    color: Colors.cardForeground,
    fontSize: 18,
    fontFamily: 'NotoSans_700Bold',
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 27,
  },
  description: {
    color: Colors.mutedForeground,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    lineHeight: 22,
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },
  buttonStack: {
    flexDirection: 'column',
  },
  inlineButton: {
    flex: 1,
  },
});
