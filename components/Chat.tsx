import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import EventSource from "react-native-sse";
import "react-native-url-polyfill/auto";

const Chat = ({ role, content, url, index, setIsDisabled }: { role: string, content: string, url?: string | undefined, index?: number, setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const [aiText, setAiText] = useState<string>("thinking...");
    const safetyBlacklist = [
        /(ignore|bypass|override|reset|system|forget)\s+(all|previous|instructions|rules|directives)/gi,
        /(act as|pretend|roleplay|persona|assume the role)\s+(unrestricted|DAN|jailbroken|evil|bot)/gi,
        /(developer|maintenance|debug|sudo|root|emergency|bypass)\s+(mode|access|override|command)/gi,
        /(repeat|show|list|output)\s+(your|initial|system|internal)\s+(prompt|instructions|config)/gi
    ];

    function isSafe(input: string): boolean {
        return !safetyBlacklist.some(regex => regex.test(input));
    }

    useEffect(() => {
        if (!isSafe(content)) {
            setAiText("Your message contains language that triggered our safety filters. Please rephrase your message.");
            setIsDisabled!(false);
            return;
        }

        if (url && isSafe(content)) {
            setIsDisabled!(true);
            let fullResponse = '';
            const es = new EventSource(url);

            es.addEventListener('message', (event: any) => {
                if (event.data) {
                    try {
                        const data = JSON.parse(event.data);
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
                setIsDisabled!(false);
            });
        }
    }, [url, content])

    return (
        <View style={styles.container}>
            {role === "init" && <View style={styles.containerAi}>
                <Image style={styles.image} source={require('@/assets/images/posi.png')}></Image>
                <Text style={styles.textAi}>{content}</Text></View>}
            {role === 'user' && <View style={styles.containerUser}><Text style={styles.text}>{content}</Text>
            </View>}
            {role === "assistant" && <View style={styles.containerAi}>
                <Image style={styles.image} source={require('@/assets/images/posi.png')}></Image>
                <Text style={styles.textAi}>{aiText}</Text></View>}
        </View>
    )
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