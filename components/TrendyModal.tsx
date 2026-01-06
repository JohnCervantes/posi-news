import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Dimensions, Modal, Pressable, StyleSheet, View } from 'react-native';

interface TrendyModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode
}

export default function TrendyModal({ visible, onClose, children }: TrendyModalProps) {
    const [isSuccess, setIsSuccess] = useState(false);
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
            statusBarTranslucent={true}
        >
            <BlurView
                intensity={30}
                style={StyleSheet.absoluteFill}
                experimentalBlurMethod="dimezisBlurView"
            />
            <View style={styles.overlay}>
                <Pressable style={styles.dismissArea} onPress={onClose} />
                <View style={[styles.modalContainer, { backgroundColor: 'white' }]}>

                    <View style={styles.handle} />

                    <View style={styles.content}>
                        {children}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    dismissArea: {
        flex: 1,
    },
    modalContainer: {
        height: height * 0.45,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        overflow: 'hidden',
        alignItems: 'center',
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: 'rgba(0,0,0,0.1)',
        borderRadius: 3,
        marginBottom: 20,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    iconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(0, 122, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
        marginBottom: 32,
        lineHeight: 22,
    },
    primaryButton: {
        backgroundColor: '#007AFF',
        width: '100%',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        marginTop: 16,
        padding: 8,
    },
    secondaryButtonText: {
        color: '#8E8E93',
        fontSize: 16,
        fontWeight: '600',
    },
});