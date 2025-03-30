import { Platform } from 'react-native';

export const theme = {
  colors: Platform.select({
    ios: {
      primary: '#007AFF',
      background: '#f2f2f7',
      card: '#ffffff',
      text: '#000000',
      secondaryText: '#8e8e93',
      border: '#c5c5c7',
      success: '#34c759',
      error: '#ff3b30',
    },
    android: {
      primary: '#6200ee',
      background: '#f5f5f5',
      card: '#ffffff',
      text: '#000000',
      secondaryText: '#666666',
      border: '#e0e0e0',
      success: '#4caf50',
      error: '#f44336',
    },
    web: {
      primary: '#007AFF',
      background: '#f2f2f7',
      card: '#ffffff',
      text: '#000000',
      secondaryText: '#8e8e93',
      border: '#c5c5c7',
      success: '#34c759',
      error: '#ff3b30',
    },
  }),
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: Platform.select({
    ios: {
      small: 8,
      medium: 12,
      large: 16,
    },
    android: {
      small: 4,
      medium: 8,
      large: 12,
    },
    web: {
      small: 8,
      medium: 12,
      large: 16,
    },
  }),
  typography: Platform.select({
    ios: {
      title: {
        fontSize: 28,
        fontWeight: '700',
      },
      subtitle: {
        fontSize: 22,
        fontWeight: '600',
      },
      body: {
        fontSize: 17,
        fontWeight: '400',
      },
      caption: {
        fontSize: 13,
        fontWeight: '400',
      },
    },
    android: {
      title: {
        fontSize: 24,
        fontWeight: '500',
      },
      subtitle: {
        fontSize: 20,
        fontWeight: '500',
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
      },
      caption: {
        fontSize: 12,
        fontWeight: '400',
      },
    },
    web: {
      title: {
        fontSize: 28,
        fontWeight: '700',
      },
      subtitle: {
        fontSize: 22,
        fontWeight: '600',
      },
      body: {
        fontSize: 17,
        fontWeight: '400',
      },
      caption: {
        fontSize: 13,
        fontWeight: '400',
      },
    },
  }),
  elevation: Platform.select({
    ios: (level: number) => ({
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: level * 2,
      },
      shadowOpacity: 0.1 + level * 0.05,
      shadowRadius: level * 2,
    }),
    android: (level: number) => ({
      elevation: level * 2,
    }),
    web: (level: number) => ({
      boxShadow: `0px ${level}px ${level * 2}px rgba(0, 0, 0, 0.1)`,
    }),
  }),
};