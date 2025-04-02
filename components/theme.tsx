import { Platform } from 'react-native';

const defaultColors = {
  primary: '#007AFF',
  background: '#f2f2f7',
  card: '#ffffff',
  text: '#000000',
  secondaryText: '#8e8e93',
  border: '#c5c5c7',
  success: '#34c759',
  error: '#ff3b30',
};

const defaultTypography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: Platform.select({
      web: 'Inter-Bold, system-ui, -apple-system, sans-serif',
      default: 'Inter-Bold',
    }),
  },
  subtitle: {
    fontSize: 22,
    fontWeight: '600' as const,
    fontFamily: Platform.select({
      web: 'Inter-Bold, system-ui, -apple-system, sans-serif',
      default: 'Inter-Bold',
    }),
  },
  body: {
    fontSize: 17,
    fontWeight: '400' as const,
    fontFamily: Platform.select({
      web: 'Inter-Regular, system-ui, -apple-system, sans-serif',
      default: 'Inter-Regular',
    }),
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    fontFamily: Platform.select({
      web: 'Inter-Regular, system-ui, -apple-system, sans-serif',
      default: 'Inter-Regular',
    }),
  },
};

const defaultBorderRadius = {
  small: 8,
  medium: 12,
  large: 16,
};

const defaultSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const theme = {
  colors: Platform.select({
    ios: defaultColors,
    android: {
      ...defaultColors,
      primary: '#6200ee',
    },
    default: defaultColors,
  }),
  spacing: defaultSpacing,
  borderRadius: Platform.select({
    ios: defaultBorderRadius,
    android: {
      small: 4,
      medium: 8,
      large: 12,
    },
    default: defaultBorderRadius,
  }),
  typography: Platform.select({
    ios: defaultTypography,
    android: {
      ...defaultTypography,
      title: {
        ...defaultTypography.title,
        fontSize: 24,
        fontWeight: '500' as const,
      },
      subtitle: {
        ...defaultTypography.subtitle,
        fontSize: 20,
        fontWeight: '500' as const,
      },
    },
    default: defaultTypography,
  }),
  elevation: (level: number) => Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: level * 2,
      },
      shadowOpacity: 0.1 + level * 0.05,
      shadowRadius: level * 2,
    },
    android: {
      elevation: level * 2,
    },
    default: {
      boxShadow: `0px ${level}px ${level * 2}px rgba(0, 0, 0, 0.1)`,
    },
  }),
};