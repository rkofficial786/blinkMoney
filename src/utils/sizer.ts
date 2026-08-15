

import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const fontFamily = {
  thin: 'Roboto-Thin',
  light: 'Roboto-Light',
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
  semiBold: 'Roboto-SemiBold',
  extraBold: 'Roboto-ExtraBold',
  italic: 'Roboto-Italic',
};

// Base dimensions 
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

//TABLET DETECTION AND LIMITS
const IS_TABLET = SCREEN_WIDTH >= 768;
const MAX_WIDTH_SCALE = 1.4;
const MAX_HEIGHT_SCALE = 1.4;
const MAX_FONT_SCALE = 1.25;
const MAX_MODERATE_SCALE = 1.3;

// Helper to limit scaling on tablets
const limitTabletScale = (value: number, baseValue: number, maxScale: number): number => {
  if (!IS_TABLET) return value;
  const maxAllowed = baseValue * maxScale;
  return Math.min(value, maxAllowed);
};

/**
 * Scales a value based on screen width
 */
export const scaleWidth = (size: number): number => {
  const scaled = (SCREEN_WIDTH / BASE_WIDTH) * size;
  return limitTabletScale(scaled, size, MAX_WIDTH_SCALE);
};

/**
 * Scales a value based on screen height
 * Automatically limited on tablets
 */
export const scaleHeight = (size: number): number => {
  const scaled = (SCREEN_HEIGHT / BASE_HEIGHT) * size;
  return limitTabletScale(scaled, size, MAX_HEIGHT_SCALE);
};

/**
 * Scales font size with a moderate factor
 * Automatically limited on tablets
 */
export const scaleFont = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  const rounded = Math.round(newSize * 100) / 100;
  return limitTabletScale(rounded, size, MAX_FONT_SCALE);
};

/**
 * Moderately scales size (good for spacing, padding, margins)
 * Automatically limited on tablets with adjusted factor
 */
export const moderateScale = (size: number, factor: number = 0.5): number => {
  // Use smaller factor on tablets
  const adjustedFactor = IS_TABLET ? factor * 0.65 : factor;
  const scaled = size + (scaleWidth(size) - size) * adjustedFactor;
  return limitTabletScale(scaled, size, MAX_MODERATE_SCALE);
};

/**
 * Get responsive padding/margin values
 * Automatically optimized for tablets
 */
export const spacing = {
  xs: moderateScale(4),
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  xxxl: moderateScale(32),
};

/**
 * Get responsive font sizes
 * Automatically limited for tablets
 */
export const fontSize = {
  xs: scaleFont(10),
  sm: scaleFont(12),
  md: scaleFont(14),
  lg: scaleFont(16),
  xl: scaleFont(18),
  xxl: scaleFont(20),
  xxxl: scaleFont(24),
  heading: scaleFont(28),
  title: scaleFont(22),
};

/**
 * Typography styles combining font size and family
 */
export const typography = {
  xs: { fontSize: fontSize.xs, fontFamily: fontFamily.regular },
  sm: { fontSize: fontSize.sm, fontFamily: fontFamily.regular },
  md: { fontSize: fontSize.md, fontFamily: fontFamily.regular },
  lg: { fontSize: fontSize.lg, fontFamily: fontFamily.regular },
  xl: { fontSize: fontSize.xl, fontFamily: fontFamily.regular },
  xxl: { fontSize: fontSize.xxl, fontFamily: fontFamily.medium },
  xxxl: { fontSize: fontSize.xxxl, fontFamily: fontFamily.medium },
  heading: { fontSize: fontSize.heading, fontFamily: fontFamily.bold },
  title: { fontSize: fontSize.title, fontFamily: fontFamily.medium },
  
  // Specific use cases
  button: { fontSize: fontSize.lg, fontFamily: fontFamily.medium },
  caption: { fontSize: fontSize.xs, fontFamily: fontFamily.light },
  subtitle: { fontSize: fontSize.lg, fontFamily: fontFamily.light },
  body: { fontSize: fontSize.md, fontFamily: fontFamily.regular },
};

/**
 * Get responsive border radius
 * Automatically optimized for tablets
 */
export const borderRadius = {
  sm: moderateScale(8),
  md: moderateScale(12),
  lg: moderateScale(16),
  xl: moderateScale(20),
  xxl: moderateScale(24),
  round: moderateScale(999),
};

/**
 * Get responsive icon sizes
 * Automatically limited for tablets
 */
export const iconSize = {
  xs: scaleWidth(16),
  sm: scaleWidth(20),
  md: scaleWidth(24),
  lg: scaleWidth(28),
  xl: scaleWidth(32),
  xxl: scaleWidth(54),
};

/**
 * Check if device is small (width < 375)
 */
export const isSmallDevice = SCREEN_WIDTH < 375;

/**
 * Check if device is tablet
 */
export const isTablet = IS_TABLET;

/**
 * Get safe percentage of screen width
 */
export const wp = (percentage: number): number => {
  return (SCREEN_WIDTH * percentage) / 100;
};

/**
 * Get safe percentage of screen height
 */
export const hp = (percentage: number): number => {
  return (SCREEN_HEIGHT * percentage) / 100;
};

/**
 * Get status bar height
 */
export const getStatusBarHeight = (): number => {
  return Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;
};

/**
 * Dimensions object for easy access
 */
export const dimensions = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmall: isSmallDevice,
  isTablet: isTablet,
};

export default {
  scaleWidth,
  scaleHeight,
  scaleFont,
  moderateScale,
  spacing,
  fontSize,
  fontFamily,
  typography,
  borderRadius,
  iconSize,
  wp,
  hp,
  dimensions,
  getStatusBarHeight,
  isTablet,
  isSmallDevice,
};
