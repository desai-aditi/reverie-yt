import { colors, radius, spacingX, spacingY, typography } from "@/constants/theme";
import { scale } from "@/utils/styling";
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, TextInput, View } from "react-native";

export default function Input({ value, onChange, onSend, onMic }: any) {
    const hasText = value.trim().length > 0;

    return (
        <View style={styles.wrapper}>
            <TextInput 
                style={styles.input}
                placeholder="Create a new memory..."
                placeholderTextColor={colors.brown.medium}
                value={value}
                onChangeText={onChange}
                multiline
            />
            <Pressable onPress={hasText ? onSend : onMic} style={styles.button}>
                <Ionicons name={hasText ? 'send' : 'mic'} size={24} color={colors.brown.darkest} />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create ({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(214,196,180,0.2)',
        borderRadius: radius._12,
        paddingHorizontal: spacingX._16,
        paddingVertical: spacingY._10,
        borderWidth: 1,
        borderColor: 'rgba(90,70,60,0.5)',
  },
    input: {
        flex: 1,
        fontFamily: typography.sans,
        fontSize: typography.size.base,
        color: colors.brown.darkest,
    },
        button: {
        width: scale(30),
        height: scale(30),
        borderRadius: radius._6,
        backgroundColor: colors.brown.light,
        justifyContent: 'center',
        alignItems: 'center',
    }
})