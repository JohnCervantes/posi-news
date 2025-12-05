import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

export default function PosiBot({ text }: { text: string }) {
    const floatAnim = useRef(new Animated.Value(0)).current;
    const FLOAT_DISTANCE = -10;
    const ANIMATION_DURATION = 1500;

    const shadowOpacity = floatAnim.interpolate({
        inputRange: [FLOAT_DISTANCE, 0], 
        outputRange: [0.2, 0.4], 
        extrapolate: 'clamp',
    });

    const shadowScale = floatAnim.interpolate({
        inputRange: [FLOAT_DISTANCE, 0],
        outputRange: [0.8, 1.0],
    });

    const startFloating = () => {
        const sequenceAnimation = Animated.sequence([
            // Move UP
            Animated.timing(floatAnim, {
                toValue: FLOAT_DISTANCE,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
            // Move DOWN (back to the starting position)
            Animated.timing(floatAnim, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
            }),
        ]);

        Animated.loop(
            sequenceAnimation
        ).start();
    };

    // Start the animation when the component mounts
    useEffect(() => {
        startFloating();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.botContainer}><Animated.View
                style={[

                    {
                        transform: [
                            {
                                translateY: floatAnim, // Control the vertical movement
                            },
                        ],
                    },
                ]}
            >
                <Image source={require('@/assets/images/posi.png')} style={styles.image} />
            </Animated.View>
                <Animated.View
                    style={[
                        styles.shadow,
                        {
                            opacity: shadowOpacity,
                            transform: [
                                { scaleX: shadowScale },  // Control horizontal scale
                                { scaleY: shadowScale },  // Control vertical scale
                            ],
                        },
                    ]}
                />
            </View>
            <View style={styles.bubble}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 100,
    },
    container: {
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: 'lightblue',
        padding: 20,
        justifyContent: "center"
    },
    bubble: {
        borderRadius: 20,
        backgroundColor: '#d94848ff',
        padding: 14,
        width: '80%',
    },
    text: {
        color: 'white',
        fontSize: 16
    },
    shadow: {
        backgroundColor: '#000',
        width: 50,
        height: 10,
        borderRadius: 20,
        marginTop: -5
    },
    botContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});