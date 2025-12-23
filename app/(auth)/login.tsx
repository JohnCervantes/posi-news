import { supabase } from '@/lib/supabase';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function OTPAuth() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [step, setStep] = useState<'request' | 'verify'>('request');

    async function verifyOTP(token: string) {
        const { data: { session }, error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'email', // Use 'email' for OTP codes
        });

        if (error) {
            Alert.alert("Invalid Code", error.message);
        } else if (session) {
            // SUCCESS! 
            // Your root layout listener will see the session and 
            // automatically run router.replace('/(app)')
        }
    }

    async function sendOTP() {
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                // This tells Supabase NOT to expect a deep link redirect
                shouldCreateUser: true,
            },
        });

        if (!error) {
            setStep('verify'); // Move to the screen where they type the code
        } else {
            Alert.alert("Error", error.message);
        }
    }

    return (
        <View style={styles.container}>
            {step === 'request' ? (
                <>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Unlock AI Chat & personalized news. Enter your email to receive a one-time secure code.</Text>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        placeholderTextColor={'gray'}
                    />
                    <Pressable style={({ pressed }) => [
                        styles.button,
                        {
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            opacity: pressed ? 0.5 : 1
                        },
                    ]} onPress={sendOTP}>
                        <Text style={styles.buttonText}>Send OTP</Text>
                    </Pressable>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Enter the 6-digit code</Text>
                    <Text style={styles.subtitle}>{`We've send a 6-digit code to`} </Text>
                    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                        <Text style={styles.label}>{email}
                        </Text>
                        <Pressable onPress={() => setStep('request')}>
                            <Text style={styles.linkText}> Edit</Text>
                        </Pressable>
                    </View>
                    <TextInput
                        placeholder="000000"
                        value={token}
                        onChangeText={setToken}
                        keyboardType="number-pad"
                        style={styles.input}
                        placeholderTextColor={'gray'}
                        maxLength={6}
                    />
                    <Pressable style={({ pressed }) => [
                        styles.button,
                        {
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                            opacity: pressed ? 0.5 : 1
                        },
                    ]} onPress={() => verifyOTP(token)}>
                        <Text style={styles.buttonText}>Verify & Login</Text>
                    </Pressable>
                </>
            )
            }
        </View >
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', padding: 16 },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', padding: 20 },
    header: { marginBottom: 30 },
    title: {
        marginBottom: 16,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333333'
    },
    subtitle: { fontSize: 16, color: '#666', marginBottom: 16 },
    form: { width: '100%' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 16, color: '#444' },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 10,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 18,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: { backgroundColor: '#a0cfff' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 30,
    },
    linkText: { color: '#007AFF', fontWeight: 'bold' },
});