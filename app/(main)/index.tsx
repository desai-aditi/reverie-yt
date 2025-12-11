import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import React from 'react';
import { Button, Text, View } from 'react-native';

async function onSignOutButtonPress() {
    const { error} = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    }
}

export default function index() {
    const { profile } = useAuthContext();

  return (
    <View>
      
      <Text>Home</Text>
      <Text>{profile?.full_name}</Text>
      <Button title='Sign Out' onPress={onSignOutButtonPress}/>
    </View>
  )
}