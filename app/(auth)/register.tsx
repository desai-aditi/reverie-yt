import { supabase } from '@/lib/supabase';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function login() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    async function signUpWithEmail() {
        setLoading(true);
        const {error} = await supabase.auth.signUp({
            email: email,
            password: password,
            options:{
                data: {
                    full_name: name
                }
            }
        });
        if (error) {
            console.log('Error signing up:', error.message);
        }
        setLoading(false);
    }

  return (
    <View>
        <View>
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Name"
        />
      </View>
       <View>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View>
        <TouchableOpacity
          disabled={loading}
          onPress={() => signUpWithEmail()}
        >
          <Text>SIGN UP</Text>
        </TouchableOpacity>
        <Link href="/(auth)/login">
          <Text>Have an account? Sign in</Text>
        </Link>
      </View>
    </View>
  )
}