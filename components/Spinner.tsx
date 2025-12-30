import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const Spinner = ({ text }: { text: string }) => {
    return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})


export default Spinner;