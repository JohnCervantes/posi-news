import React, { useEffect, useRef } from 'react';
import { Animated, DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';

type SkeletonProps = {
    width: DimensionValue;
    height: DimensionValue;
    style?: ViewStyle;
}

const Skeleton = ({ width, height, style }: SkeletonProps) => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.5,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [opacity]);

    return (
        <Animated.View
            style={[
                styles.skeleton,
                { width, height, opacity },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    skeleton: {
        // A slightly darker grey for better visibility in light mode
        backgroundColor: '#BDBDBD',
        borderRadius: 8,
        marginVertical: 5,
        // Optional: add a tiny border if it's still hard to see
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    feedContainer: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textMetadata: {
        marginLeft: 10,
    },
});


export const NewsFeedLoading = () => {
    return (
        <View style={styles.feedContainer}>
            {/* Header Section: Avatar + Name/Date lines */}
            <View style={styles.headerRow}>
                <Skeleton width={25} height={25} style={{ borderRadius: 25 }} />
                <View style={styles.textMetadata}>
                    <Skeleton width={80} height={10} />
                </View>
            </View>
            <Skeleton width={330} height={15} />
            <Skeleton width={200} height={15} />

            <Skeleton width="100%" height={150} style={{ marginVertical: 20 }} />
            <View >
                <Skeleton width={330} height={15} />
                 <Skeleton width={270} height={15} />
                 <Skeleton width={250} height={15} />
                <Skeleton width={90} height={10} />
            </View>
            <Skeleton style={{ alignSelf: 'flex-end' }} width={80} height={15} />
        </View>
    );
};