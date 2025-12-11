import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options:{
        data: {
            full_name: name,
        }
      }
    });

    if (error) Alert.alert("Sign Up Error", error.message);
    setLoading(false);
  }

  return (
    <View>
      <View>
        <TextInput
          onChangeText={(text) => setName(text)}
          value={name}
          placeholder="Your full name"
          autoCapitalize={"words"}
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
          <Text>SIGN Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}