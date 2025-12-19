import { colors, radius, spacingX, spacingY, typography } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChatBubble({ role, text }: { role: 'user' | 'assistant'; text: string }) {
    const isUser = role === 'user';

  return (
    <View style={[styles.container, isUser ? styles.user : styles.assistant]}>
        <View style={[styles.bubble, isUser && styles.userBubble]}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { marginVertical: spacingY._8 },
  user: { alignItems: 'flex-end' },
  assistant: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacingX._16,
    paddingVertical: spacingY._10,
    borderRadius: radius._6,
  },
  userBubble: {
    backgroundColor: colors.brown.light,
    borderWidth: 1,
    borderColor: colors.brown.medium,
  },
  text: {
    fontFamily: typography.sans,
    fontSize: typography.size.base,
    color: colors.brown.darkest,
  },
})