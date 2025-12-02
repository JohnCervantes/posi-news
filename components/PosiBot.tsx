import { Image, StyleSheet, Text, View } from "react-native";

export default function PosiBot({ text }: { text: string }) {
    return (
        <View style={styles.container}>
            <Image source={require('@/assets/images/posi.png')} style={styles.image} />
            <View style={styles.bubble}>
                <Text style={styles.text}>{text}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 100,
        width: 100
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
        backgroundColor: '#F87171',
        padding: 14,
        width: '80%',
    },
    text: {
        color: 'white',
        fontSize: 16
    }
});