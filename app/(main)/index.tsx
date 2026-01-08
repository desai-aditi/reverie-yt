import Input from '@/components/atoms/Input';
import ChatMessages from '@/components/molecules/ChatMessages';
import SaveMemoryPopup from '@/components/molecules/SaveMemoryPopup';
import { spacingX, spacingY } from '@/constants/theme';
import { useAuthContext } from '@/hooks/use-auth-context';
import { useChatMemory } from '@/hooks/use-chat-memory';
import { generateAPIUrl } from '@/utils';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { fetch as expoFetch } from 'expo/fetch';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { profile, session } = useAuthContext();
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { messages, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof fetch,
      api: generateAPIUrl('/api/chat'),
    }),
  });

  const { parseMemoryData, stripMemoryData } = useChatMemory(messages);

    const [pendingMemory, setPendingMemory] = useState<{
      text: string;
      category: string;
      title: string,
      people: string[];
      isContinuation: boolean;
      parentMemoryId?: string | null;
      embedding?: string;
      location?: string | null;
      dateOfMemory?: string | null;
    } | null>(null);

    const [showSavePopup, setShowSavePopup] = useState(true);

    // Scan messages (newest-first) and set the first valid MEMORY_DATA as pending
    useEffect(() => {
      if (messages.length === 0) {
        setPendingMemory(null);
        return;
      }

      for (let i = messages.length - 1; i >= 0; i--) {
        const msg = messages[i];
        if (msg?.role !== 'assistant') continue;
        const combined = (msg.parts || []).map((p: any) => p.text).join('');
        const parsed = parseMemoryData(combined);
        if (parsed) {
          setPendingMemory(parsed);
          setShowSavePopup(true);
          return;
        }
      }

      // No memory found
      setPendingMemory(null);
    }, [messages]);

    const saveMemory = async (memory: any) => {
      const payload = {
        text: memory?.text,
        category: memory?.category ?? 'general',
        title: memory?.title ?? undefined,
        people: Array.isArray(memory?.people) ? memory?.people : [],
        isContinuation: Boolean(memory?.isContinuation),
        parentMemoryId: memory?.parentMemoryId ?? null,
        location: memory?.location ?? null,
        dateOfMemory: memory?.dateOfMemory ?? null,
      } as const;

      console.log('Posting memory to API:', payload);

      try {
        const res = await fetch(generateAPIUrl('/api/memories'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(payload),
        });

        const body = await res.json().catch(() => null);
        if (!res.ok) {
          console.error('Failed to save memory', res.status, body);
          return;
        }

        console.log('Saved memory', res.status, body);
        // Clear pending memory on success
        setPendingMemory(null);
        setShowSavePopup(false);
      } catch (err) {
        console.error('Error saving memory', err);
      }
    }

  if (error) return <Text>{error.message}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        <ChatMessages messages={messages} stripMemoryData={stripMemoryData} />
      </ScrollView>

      {pendingMemory && showSavePopup && (
        <SaveMemoryPopup 
          memory={pendingMemory}
          onSave={(m:any) => saveMemory(m)}
          onDismiss={() => {setShowSavePopup(false)}}
        />
      )}

      <Input
        value={input}
        onChange={setInput}
        onSend={() => {
          sendMessage({ text: input });
          setInput('');
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._24,
  },
});