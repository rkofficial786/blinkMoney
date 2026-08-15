import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';

const LOGO_ASPECT_RATIO = 336 / 869;

type Props = {
  width: number;
  style?: StyleProp<ImageStyle>;
};

export function Logo({ width, style }: Props) {
  return (
    <Image
      source={require('../assets/logo.png')}
      style={[{ width, height: width * LOGO_ASPECT_RATIO }, style]}
      resizeMode="contain"
      accessibilityLabel="BlinkMoney"
    />
  );
}
