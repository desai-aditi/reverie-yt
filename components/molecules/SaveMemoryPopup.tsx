import { colors, radius, spacingX, spacingY, typography } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SaveMemoryPopup({ memory, onSave, onDismiss }: any) {
  if (!memory) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>Save this memory?</Text>
        <Text numberOfLines={3} style={styles.preview}>{memory.text}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.secondary} onPress={onDismiss}>
            <Text>Keep chatting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primary} onPress={() => onSave(memory)}>
            <Text style={{ color: colors.neutral[100] }}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', bottom: 100, left: spacingX._20, right: spacingX._20 },
  card: {
    backgroundColor: colors.neutral[100],
    padding: spacingX._20,
    borderRadius: radius._16,
    borderWidth: 1,
    borderColor: colors.brown.light,
  },
  title: { fontFamily: typography.sans, fontWeight: '600', marginBottom: spacingY._8 },
  preview: { fontFamily: typography.sans, marginBottom: spacingY._12 },
  row: { flexDirection: 'row', gap: spacingX._12 },
  primary: { flex: 1, backgroundColor: colors.brown.dark, padding: spacingY._12, borderRadius: radius._8, alignItems: 'center' },
  secondary: { flex: 1, backgroundColor: colors.neutral[200], padding: spacingY._12, borderRadius: radius._8, alignItems: 'center' },
});