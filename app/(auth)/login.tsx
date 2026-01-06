import { supabase } from '@/lib/supabase';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function OTPAuth() {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [step, setStep] = useState<'request' | 'verify'>('request');

    const inputRef = useRef<TextInput>(null);
    const codeDigitsArray = new Array(6).fill(0);

    useEffect(() => {
        return () => {
            setToken('');
        }
    }, [])

    const handlePress = () => {
        inputRef.current?.focus();
    };

    const handleChangeText = (text: string) => {
        setToken(text);
    };

    async function verifyOTP(token: string) {
        const { data: { session }, error } = await supabase.auth.verifyOtp({
            email: email,
            token: token,
            type: 'email',
        });

        if (error) {
            Alert.alert("Invalid Code", error.message);
        } else if (session) {

        }
    }

    async function sendOTP() {
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
                shouldCreateUser: true,
            },
        });

        if (!error) {
            setStep('verify');
        } else {
            Alert.alert("Error", error.message);
        }
    }

    return (
        <View style={{ flex: 1, }}>
            {step === 'request' ? (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    style={{ flex: 1 }}

                >
                    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
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
                    </View>
                </KeyboardAvoidingView>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
                    style={{ flex: 1 }}

                >
                    <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
                        <Text style={styles.title}>Enter the 6-digit code</Text>
                        <Text style={styles.subtitle}>{`We've send a 6-digit code to`} </Text>
                        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                            <Text style={styles.label}>{email}
                            </Text>
                            <Pressable onPress={() => setStep('request')}>
                                <Text style={styles.linkText}> Edit</Text>
                            </Pressable>
                        </View>
                        <View style={styles.container}>
                            <Pressable style={styles.inputsContainer} onPress={handlePress}>
                                {codeDigitsArray.map((_, index) => {
                                    const char = token[index] || '';
                                    const isFocused = token.length === index;

                                    return (
                                        <View
                                            key={index}
                                            style={[styles.inputBox, isFocused && styles.inputBoxFocused]}
                                        >
                                            <Text style={styles.inputText}>{char}</Text>
                                        </View>
                                    );
                                })}
                            </Pressable>

                            <TextInput
                                ref={inputRef}
                                value={token}
                                onChangeText={handleChangeText}
                                maxLength={6}
                                keyboardType="number-pad"
                                textContentType="oneTimeCode" // Enables iOS "Auto-fill from SMS"
                                style={styles.hiddenInput}
                            />
                        </View>
                        <Pressable style={({ pressed }) => [
                            styles.button,
                            {
                                transform: [{ scale: pressed ? 0.98 : 1 }],
                                opacity: pressed ? 0.5 : 1
                            },
                        ]} onPress={() => verifyOTP(token)}>
                            <Text style={styles.buttonText}>Verify & Login</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            )
            }
        </View >
    );
}


const styles = StyleSheet.create({
    container: { height: 60, position: 'relative', justifyContent: "center", padding: 16, marginBottom: 16 },
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
    inputsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputBox: {
        width: 45,
        height: 50,
        borderWidth: 2,
        borderColor: '#b3b3b3ff',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F6F6',
    },
    inputBoxFocused: {
        borderColor: '#007AFF', // Highlight color when typing
    },
    inputText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    hiddenInput: {
        ...StyleSheet.absoluteFillObject, // Stretch to fill the whole container
        opacity: 0.01, // Some OS versions ignore 0 opacity, 0.01 is safer
        zIndex: 1,
    },
});