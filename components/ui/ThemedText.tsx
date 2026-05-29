import { StyleSheet, Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';
import { Colors } from '../../constants/colors';

type ThemedTextProps = TextProps & {
  darkColor?: string;
  lightColor?: string;
  style?: StyleProp<TextStyle>;
  type?: 'default' | 'defaultSemiBold' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        styles.mainFont,
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  mainFont: {
    fontFamily: 'NotoSans_400Regular'
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: Colors.primary,
  },
});
