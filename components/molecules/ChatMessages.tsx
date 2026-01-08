import React from 'react';
import { StyleSheet, View } from 'react-native';
import ChatBubble from '../atoms/ChatBubble';

export default function ChatMessages({ messages, stripMemoryData}: any) {
  return (
    <View>
      {messages.map((m: any) => {
        const text = m.parts.filter((p: any) => p.type=== 'text').map((p: any) => p.text).join('');
        const display = m.role === 'assistant' && typeof stripMemoryData === 'function' ? stripMemoryData(text) : text;
        return <ChatBubble key={m.id} role={m.role} text={display} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({})