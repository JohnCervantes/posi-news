import AnimatedWrapper from '@/components/AnimatedWrapper';
import ChatBox from '@/components/ChatBox';
import PosiBot from '@/components/PosiBot';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';

export default function About() {
    const params = useLocalSearchParams();
    const [article, setArticle] = useState<{ author: string, title: string, content: string, publishedat: string, urltoimage: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const scrollViewRef = useRef(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${apiUrl}/article?article_id=${params.article_id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setArticle(data);
                setError(null);
            } catch (e) {
                console.error("Fetching error: ", e);
                setError('Failed to load data. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [params.article_id]);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading articles...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: "Back to Uplifting Stories",
                    headerBackTitle: 'Back to Uplifting Stories',
                }}
            />
            <AnimatedWrapper TOOLTIP_KEY='@PosiNews:FeatureBTooltipSeen'>
                <PosiBot text={`Finished the read? Let's process the good stuff! Let's chat about your insights below.`}></PosiBot>
            </AnimatedWrapper>
            {article &&
                <KeyboardProvider>
                    <KeyboardAvoidingView
                        behavior="padding" // or "height", "position"
                        keyboardVerticalOffset={100}
                        style={{ flex: 1 }}
                    >
                        <View style={styles.container}>
                            <ScrollView keyboardShouldPersistTaps="always">
                                <Text style={styles.header}>{article.title}</Text>
                                <Image source={{ uri: article.urltoimage }} style={styles.image} />
                                <View style={styles.dateAndAuthor}>
                                    <Text><Ionicons name="calendar" size={16} color="blue" /> {new Date(article.publishedat).toLocaleDateString()}</Text>
                                    <Text style={styles.author}>By {article.author}</Text>
                                </View>
                                <Text style={styles.content}>
                                    {article.content}
                                </Text>
                                <ChatBox article_id={params.article_id}></ChatBox>
                            </ScrollView >
                        </View>
                    </KeyboardAvoidingView>
                </KeyboardProvider>
            }
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    content: {
        fontSize: 18,
        lineHeight: 27,
        color: '#333333'
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 6,
        resizeMode: 'cover'
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    },
    dateAndAuthor: {
        marginBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    author: {
        fontSize: 14,
        fontWeight: "condensed",
        textAlign: "right",
        color: '#6a6a6aff'
    },
});