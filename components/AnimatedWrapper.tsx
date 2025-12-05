import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';

const AnimatedWrapper = ({ TOOLTIP_KEY, children, duration = 500 }: {TOOLTIP_KEY:string, children: React.ReactNode, duration?: number }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [renderContent, setRenderContent] = useState<boolean>(isVisible);
    const AUTO_DISMISS_DELAY = 7000;

    const markAsSeen = async () => {
        try {
            await AsyncStorage.setItem(TOOLTIP_KEY, 'true');
        } catch (e) {
            console.error("Error writing to AsyncStorage:", e);
        }
    };

    const checkIfSeen = async () => {
        try {
            const seen = await AsyncStorage.getItem(TOOLTIP_KEY);
            if (seen !== null) {
                setRenderContent(false);
            }
        } catch (e) {
            console.error("Error reading AsyncStorage:", e);
        }
    };

    useEffect(() => {
        checkIfSeen();
    }, []);

    useEffect(() => {
        if (isVisible) {
            setRenderContent(true);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: duration,
                useNativeDriver: true,
            }).start();

        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: duration,
                useNativeDriver: true,
            }).start(() => {
                setRenderContent(false);
            });
        }

    }, [isVisible, fadeAnim, duration]);

    useEffect(() => {
        let timer: number;
        if (isVisible) {
            timer = setTimeout(() => {
                setIsVisible(false);
                markAsSeen()
            }, AUTO_DISMISS_DELAY)
        }

        return () => clearTimeout(timer);
    }, [isVisible]);

    if (!renderContent) {
        return null;
    }

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
            }}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedWrapper;