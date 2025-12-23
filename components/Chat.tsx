import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import EventSource from "react-native-sse";
import "react-native-url-polyfill/auto";

const Chat = ({ role, content, url, index, setIsDisabled }: { role: string, content: string, url?: string | undefined, index: number, setIsDisabled: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [aiText, setAiText] = useState<string>();
    const defaultAiText = index === 0 ? content : 'thinking...';
    useEffect(() => {
        if (url) {
            setIsDisabled(true);
            let fullResponse = '';
            const es = new EventSource(url);

            es.addEventListener('message', (event: any) => {
                if (event.data) {
                    try {
                        // Parse the JSON data sent from the Node.js backend
                        const data = JSON.parse(event.data);

                        // Assuming your backend sends the streaming text under a 'content' key
                        if (data.content) {
                            fullResponse += data.content;
                            setAiText(fullResponse); // Update the UI
                        }
                    } catch (e) {
                        console.error("Error parsing message:", e);
                    }
                }
            });

            es.addEventListener('end', () => {
                console.log('Stream finished.');
                es.close();
                setIsDisabled(false);
            });
        }
    }, [url])

    return (<View style={styles.container}>
        {role === 'user' && <View style={styles.containerUser}><Text style={styles.text}>{content}</Text>
        </View>}
        {role === "assistant" && <View style={styles.containerAi}>
            <Image style={styles.image} source={require('@/assets/images/posi.png')}></Image>
            <Text style={styles.textAi}>{aiText || defaultAiText}</Text></View>}
    </View>)
}

const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    containerAi: {
        backgroundColor: "lightblue",
        alignSelf: "baseline",
        flexDirection: "row",
        alignItems: 'center',
        padding: 10,
        borderRadius: 8,
    },
    containerUser: {
        backgroundColor: "#d94848ff",
        alignSelf: "flex-end",
        justifyContent: 'center',
        padding: 5,
        borderRadius: 8
    },
    text: {
        fontSize: 18,
        lineHeight: 27,
        color: 'white',
        padding: 10,
        flexShrink: 1
    },
    textAi: {
        fontSize: 18,
        lineHeight: 27,
        color: '#333333',
        paddingLeft: 10,
        flexShrink: 1
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: 'white',
    }
}
)


export default Chat;