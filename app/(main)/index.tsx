import Input from '@/components/atoms/Input';
import ChatMessages from '@/components/molecules/ChatMessages';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useChatMemory } from '@/hooks/use-chat-memory';
import { supabase } from '@/lib/supabase';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
export default function HomeScreen() {
  const {profile} = useAuthContext();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: generateAPIUrl('/api/chat'),
    }),
    onError: error => console.error(error, 'ERROR'),
  });

  if (error) return <Text>{error.message}</Text>;

  const { pendingMemory, stripMemoryData } = useChatMemory(messages);

  async function onSignOutButtonPress () { 
    const {error} = await supabase.auth.signOut();
    if (error) {
      console.log('Error signing out:', error.message);
    }
  }

  return (
    <View>
      <ScrollView ref={scrollRef} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true})}> 
        <ChatMessages messages={messages} stripMemoryData={stripMemoryData}/>
      </ScrollView>
      {/* <Button title='Sign out' onPress={onSignOutButtonPress}/> */}

      <Input value={input} onChange={setInput} onSend={() => { sendMessage({ text: input}); setInput('')}} />
    </View>
  );
}
