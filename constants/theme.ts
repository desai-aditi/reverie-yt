import { moderateScale, scale, verticalScale } from '../utils/styling';

export const colors = {
  // Primary palette - Browns and Beiges
  brown: {
    darkest: '#3B2A22',
    dark: '#5A463C',
    medium: '#8A766C',
    light: '#E8E3DC',
  },
  
  // Neutrals - Warm whites and creams
  neutral: {
    white: '#FFFFFF',
    100: '#FDFCF7',
    200: '#FAF7ED',
    300: '#F9F5E9',
    400: '#F8F2E5',
  },
  
  // Accent colors
  accent: {
    sage: '#A7B8A8',
    sageDark: '#344635',
    gold: '#E6C98D',
    goldDark: '#504120',
    terracotta: '#D9A282',
    terracottaDark: '#5B321B',
    lavender: '#D4C0ED',
    lavenderDark: '#44256A',
  },
};

export const spacingX = {
  _3: scale(3),
  _5: scale(5),
  _7: scale(7),
  _8: scale(8),
  _10: scale(10),
  _12: scale(12),
  _15: scale(15),
  _16: scale(16),
  _20: scale(20),
  _24: scale(24),
  _25: scale(25),
  _30: scale(30),
  _35: scale(35),
  _40: scale(40),
};

export const spacingY = {
  _5: verticalScale(5),
  _7: verticalScale(7),
  _8: verticalScale(8),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _16: verticalScale(16),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _24: verticalScale(24),
  _25: verticalScale(25),
  _30: verticalScale(30),
  _35: verticalScale(35),
  _40: verticalScale(40),
  _50: verticalScale(50),
  _60: verticalScale(60),
};

export const radius = {
  _3: verticalScale(3),
  _6: verticalScale(6),
  _8: verticalScale(8),
  _10: verticalScale(10),
  _12: verticalScale(12),
  _15: verticalScale(15),
  _16: verticalScale(16),
  _17: verticalScale(17),
  _20: verticalScale(20),
  _24: verticalScale(24),
  _30: verticalScale(30),
};

export const typography = {
  // Font families
  serif: 'Lora_400Regular',
  serifBold: 'Lora_700Bold',
  sans: 'WorkSans_400Regular',
  sansMedium: 'WorkSans_500Medium',
  sansSemiBold: 'WorkSans_600SemiBold',
  sansBold: 'WorkSans_700Bold',
  
  // Font sizes using moderate scale
  size: {
    xs: moderateScale(10),
    sm: moderateScale(12),
    base: moderateScale(14),
    md: moderateScale(16),
    lg: moderateScale(18),
    xl: moderateScale(20),
    xxl: moderateScale(24),
    xxxl: moderateScale(32),
    huge: moderateScale(40),
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};