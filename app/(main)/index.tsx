import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { Stack } from 'expo-router';
import { Button, Text, View } from 'react-native';
export default function HomeScreen() {
  const {profile} = useAuthContext();

  async function onSignOutButtonPress () { 
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.log('Error signing out:', error.message);
    }
  }

  return (
    <View>
      <Stack.Screen options={{ headerShown: true, title: 'Home' }} />
      <Text>{profile?.full_name}</Text>
      <Button title='Sign out' onPress={onSignOutButtonPress}/>
    </View>
  );
}
