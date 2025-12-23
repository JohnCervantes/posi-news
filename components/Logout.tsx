import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { supabase } from '../lib/supabase';

export default function HeaderLogoutButton() {
    const router = useRouter();


    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            Alert.alert('Error', error.message);
        } else {
            router.replace('/');
        }
    };


    return (
        <Pressable onPress={handleLogout} style={styles.button}>
            <Text style={styles.text}>Logout</Text>
            <Ionicons size={28} name="log-out-outline" color={'#ff0d00ff'}></Ionicons>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        marginRight: 15,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderColor: '#ff0d00ff',
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        color: "#ff0d00ff",
        fontWeight: '600',
        fontSize: 14,
    },
});