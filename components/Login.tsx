import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function HeaderLoginButton() {
    const router = useRouter();

    return (
        <TouchableOpacity
            onPress={() => router.push('/login')}
            style={styles.button}
        >
            <Text style={styles.text}>Login</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    text: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 14,
    },
});