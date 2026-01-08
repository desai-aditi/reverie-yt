import { Platform } from 'react-native';

export const generateAPIUrl = (relativePath: string) => {
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;

  // Prefer explicit environment variable (useful on physical devices)
  const envBase = process.env.EXPO_PUBLIC_API_BASE_URL;
  if (envBase) {
    return envBase.replace(/\/$/, '').concat(path);
  }

  // When running in a browser, use the current origin
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin.concat(path);
  }

  // Fallbacks for native development:
  // Android emulator -> 10.0.2.2, iOS simulator -> localhost
  const defaultHost = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  return defaultHost.concat(path);
};
