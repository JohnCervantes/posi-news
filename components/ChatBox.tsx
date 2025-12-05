import Chat from '@/components/Chat';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';


const ChatBox = ({ article_id }: { article_id: number }) => {
    const [text, setText] = useState('');
    const [chatList, setChatList] = useState<{ role: string, content: string, url?: string | undefined }[]>([{ role: "assistant", content: "What do you think about this article?" }]);
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const handleButtonPress = () => {
        setChatList(prevState => [...prevState, { role: "user", content: text }])
        const url = process.env.EXPO_PUBLIC_API_URL + '/chat?' + `article_id=${article_id}&` + `userPrompt=${text}`;
        setChatList(prevState => [...prevState, { role: "assistant", content: text, url: url }])
        setText('');
    };

    return (
        <View style={styles.container}>
            {chatList.map((chat, index) => {
                return (<Chat key={index} role={chat.role} content={chat.content} url={chat.url} index={index} setIsDisabled={setIsDisabled}></Chat>)
            })}

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your message here...."
                    placeholderTextColor="#6a6a6aff"
                    onChangeText={setText}
                    value={text}
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        pressed && styles.buttonPressed,
                        (!text.trim() || isDisabled) && styles.buttonDisabled,
                    ]}
                    onPress={handleButtonPress}
                    // disabled={!text.trim() || isDisabled}
                ><Ionicons name="send" size={16} color="white" />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
        gap: 15,
        marginTop: 30
    },
    buttonPressed: {
        opacity: 0.7,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 4,
        width: '100%',
    },
    textInput: {
        flex: 1,
        height: 40,
        marginRight: 10,
        paddingHorizontal: 10
    },
    button: {
        borderRadius: '50%',
        padding: 10,
        backgroundColor: '#4A90E2',
        zIndex: 10
    }
});

export default ChatBox;