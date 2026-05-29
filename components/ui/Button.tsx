import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Colors } from '../../constants/colors';
import { ThemedText } from './ThemedText';

export type ButtonVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'muted';

export type ButtonSize =
  | 'default'
  | 'sm'
  | 'lg'
  | 'icon'
  | 'icon-sm'
  | 'icon-lg';

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  children?: React.ReactNode;
  iconName?: IconName;
  iconPosition?: 'start' | 'end';
  contentColor?: string;
  loading?: boolean;
  size?: ButtonSize;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  variant?: ButtonVariant;
};

const VARIANT_STYLES: Record<ButtonVariant, { container: ViewStyle; content: string }> = {
  default: {
    container: {
      backgroundColor: Colors.primary,
      borderColor: Colors.primary,
    },
    content: Colors.primaryForeground,
  },
  secondary: {
    container: {
      backgroundColor: Colors.secondary,
      borderColor: Colors.secondary,
    },
    content: Colors.primaryForeground,
  },
  destructive: {
    container: {
      backgroundColor: Colors.destructive,
      borderColor: Colors.destructive,
    },
    content: Colors.destructiveForeground,
  },
  outline: {
    container: {
      backgroundColor: 'transparent',
      borderColor: Colors.primary,
    },
    content: Colors.primary,
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    content: Colors.foreground,
  },
  link: {
    container: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
    },
    content: Colors.primary,
  },
  muted: {
    container: {
      backgroundColor: Colors.disabled,
      borderColor: Colors.disabled,
    },
    content: Colors.cardForeground,
  },
};

export default function Button({
  accessibilityRole = 'button',
  children,
  contentColor: contentColorOverride,
  disabled = false,
  iconName,
  iconPosition = 'start',
  loading = false,
  size = 'default',
  style,
  textStyle,
  variant = 'default',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const hasContent = children !== undefined && children !== null;
  const iconOnly = !hasContent;
  const variantStyle = VARIANT_STYLES[variant];
  const contentColor = isDisabled
    ? Colors.disabledForeground
    : contentColorOverride || variantStyle.content;
  const iconSize = getIconSize(size);
  const icon = loading ? (
    <ActivityIndicator color={contentColor} size="small" style={!iconOnly && styles.inlineIcon} />
  ) : iconName ? (
    <MaterialCommunityIcons
      name={iconName}
      size={iconSize}
      color={contentColor}
      style={!iconOnly && styles.inlineIcon}
    />
  ) : null;

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        getSizeStyle(size),
        variant === 'link' && styles.link,
        iconOnly && styles.iconOnly,
        isDisabled && getDisabledContainerStyle(variant),
        pressed && styles.pressed,
        style,
      ]}
      {...rest}
    >
      {iconPosition === 'start' ? icon : null}
      {hasContent ? (
        <ThemedText
          style={[
            styles.text,
            getSizeTextStyle(size),
            variant === 'link' && styles.linkText,
            { color: contentColor },
            textStyle,
          ]}
        >
          {children}
        </ThemedText>
      ) : null}
      {iconPosition === 'end' ? icon : null}
    </Pressable>
  );
}

function getDisabledContainerStyle(variant: ButtonVariant): ViewStyle {
  if (variant === 'ghost' || variant === 'link') {
    return styles.disabledTransparent;
  }

  return styles.disabled;
}

function getIconSize(size: ButtonSize): number {
  if (size === 'icon-sm' || size === 'sm') {
    return 18;
  }

  if (size === 'icon-lg' || size === 'lg') {
    return 28;
  }

  return 24;
}

function getSizeStyle(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return styles.sm;
    case 'lg':
      return styles.lg;
    case 'icon':
      return styles.icon;
    case 'icon-sm':
      return styles.iconSm;
    case 'icon-lg':
      return styles.iconLg;
    case 'default':
    default:
      return styles.default;
  }
}

function getSizeTextStyle(size: ButtonSize) {
  switch (size) {
    case 'sm':
      return styles.smText;
    case 'lg':
      return styles.lgText;
    case 'icon':
      return styles.iconText;
    case 'icon-sm':
      return styles.iconSmText;
    case 'icon-lg':
      return styles.iconLgText;
    case 'default':
    default:
      return styles.defaultText;
  }
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  default: {
    height: 46,
    paddingHorizontal: 14
  },
  sm: {
    height: 38,
    paddingHorizontal: 12
  },
  lg: {
    height: 50,
    paddingHorizontal: 14
  },
  icon: {
    height: 42,
    paddingHorizontal: 0,
    width: 42
  },
  iconSm: {
    height: 34,
    paddingHorizontal: 0,
    width: 34
  },
  iconLg: {
    height: 52,
    paddingHorizontal: 0,
    width: 52
  },
  iconOnly: {
    paddingHorizontal: 0
  },
  link: {
    borderWidth: 0,
    height: 'auto',
    paddingHorizontal: 0
  },
  disabled: {
    backgroundColor: Colors.disabled,
    borderColor: Colors.disabled,
  },
  disabledTransparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  pressed: {
    opacity: 0.72
  },
  inlineIcon: {
    marginRight: 8
  },
  text: {
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center'
  },
  defaultText: {
    fontSize: 15,
    lineHeight: 20
  },
  smText: {
    fontSize: 14,
    lineHeight: 18
  },
  lgText: {
    fontSize: 19,
    lineHeight: 24
  },
  iconText: {
    fontSize: 15,
    lineHeight: 20
  },
  iconSmText: {
    fontSize: 14,
    lineHeight: 18
  },
  iconLgText: {
    fontSize: 18,
    lineHeight: 22
  },
  linkText: {
    textDecorationLine: 'underline'
  },
});
