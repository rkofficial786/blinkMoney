import { Platform } from 'react-native';
import { scaleFont } from '../utils/sizer';

const fontFamily = Platform.select({
  android: 'sans-serif',
  default: undefined,
});

const fontFamilyBold = Platform.select({
  android: 'sans-serif-black',
  default: undefined,
});

export const typography = {
  display: {
    fontFamily: fontFamilyBold,
    fontWeight: '900' as const,
    fontSize: scaleFont(40),
    lineHeight: scaleFont(46),
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamilyBold,
    fontWeight: '800' as const,
    fontSize: scaleFont(28),
    lineHeight: scaleFont(34),
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamilyBold,
    fontWeight: '700' as const,
    fontSize: scaleFont(20),
    lineHeight: scaleFont(26),
  },
  body: {
    fontFamily,
    fontWeight: '400' as const,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(23),
  },
  bodyStrong: {
    fontFamily,
    fontWeight: '600' as const,
    fontSize: scaleFont(16),
    lineHeight: scaleFont(23),
  },
  caption: {
    fontFamily,
    fontWeight: '500' as const,
    fontSize: scaleFont(13),
    lineHeight: scaleFont(18),
  },
  stat: {
    fontFamily: fontFamilyBold,
    fontWeight: '900' as const,
    fontSize: scaleFont(56),
    lineHeight: scaleFont(60),
    letterSpacing: -1,
  },
} as const;
