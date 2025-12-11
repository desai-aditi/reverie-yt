import { useAuthContext } from '@/hooks/use-auth-context';
import AuthProvider from '@/providers/auth-provider';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    console.log('🧭 Navigation check:', { 
      isLoggedIn, 
      inAuthGroup, 
      segments 
    });

    if (!isLoggedIn && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (isLoggedIn && inAuthGroup) {
      // Redirect to main if authenticated
      router.replace('/(main)');
    }
  }, [isLoggedIn, isLoading, segments]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <Stack>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}