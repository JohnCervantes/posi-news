import AnimatedWrapper from '@/components/AnimatedWrapper';
import ChatBox from '@/components/ChatBox';
import PosiBot from '@/components/PosiBot';
import shareArticle from '@/components/Share';
import Spinner from '@/components/Spinner';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import Speech from '@mhpdev/react-native-speech';
import { User } from '@supabase/supabase-js';
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { KeyboardAvoidingView, KeyboardProvider } from 'react-native-keyboard-controller';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1272636370557269/6655900426';

export default function About() {
    const params = useLocalSearchParams();
    const [article, setArticle] = useState<{ creator: string, title: string, content: string, publishedat: string, image_url: string, url: string, country: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const apiUrl = process.env.EXPO_PUBLIC_API_URL;
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const router = useRouter();
    const [user, setUser] = useState<User | undefined>(undefined);

    const posiSpeak = () => {
        setIsSpeaking(true)
        setIsPaused(false)
        Speech.speakWithOptions(article!.content, {
            pitch: 1.35,
            rate: 1.10,
            volume: 1.0,
            voice: undefined,
            //onDone: () => setIsSpeaking(false)
        });
    }

    const pauseSpeech = async () => {
        if (isSpeaking && !isPaused) {
            await Speech.pause();
            setIsPaused(true);
        }
    };

    const resumeSpeech = async () => {
        if (isSpeaking && isPaused) {
            await Speech.resume();
            setIsPaused(false);
        }
    };

    const stopSpeech = async () => {
        await Speech.stop();
    };

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user)
                setUser(user);
        }
        getUser();
    }, []);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`${apiUrl}/article?article_id=${params.article_id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setArticle(data);
                setError(undefined);
            } catch (e) {
                console.error("Fetching error: ", e);
                setError('Failed to load data. Please check your connection.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticle();
    }, [params.article_id]);

    useEffect(() => {
        return () => {
            stopSpeech();
        }
    }, [])

    if (isLoading) {
        return (
            <Spinner text="Loading article..." />
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
                    headerRight: () => {
                        return <View style={{ marginRight: 15 }}>
                            <Pressable onPress={() => shareArticle(article!.url)}>
                                <Ionicons name='share-social' size={24} />
                            </Pressable>
                        </View>
                    }
                }
                }
            />
            <BannerAd
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
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
                                <Image source={article.image_url === "" ? require("@/assets/images/default-article.png") : { uri: article.image_url }} style={styles.image} transition={1000} contentFit='cover' placeholder={{ blurhash: "|fF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[" }} />
                                {!isSpeaking && !isPaused && <Pressable onPress={() => posiSpeak()}>
                                    <View style={styles.speech}>
                                        <Ionicons name='volume-medium' size={24} color={'#4343dcff'} />
                                        <Text style={styles.speechText}> Listen to article</Text>
                                    </View>
                                </Pressable>}
                                {isSpeaking && !isPaused &&
                                    <Pressable onPress={() => pauseSpeech()}>
                                        <View style={styles.speech}>
                                            <Ionicons name='pause-outline' size={24} color={'#4343dcff'} />
                                            <Text style={styles.speechText}> Pause article</Text>
                                        </View>
                                    </Pressable>}
                                {isSpeaking && isPaused &&
                                    <Pressable onPress={() => resumeSpeech()}>
                                        <View style={styles.speech}>
                                            <Ionicons name='volume-medium' size={24} color={'#4343dcff'} />
                                            <Text style={styles.speechText}> Resume listening</Text>
                                        </View>
                                    </Pressable>}
                                <View style={styles.dateAndAuthor}>
                                    <Text><Ionicons name="calendar" size={16} color="blue" /> {new Date(article.publishedat).toLocaleDateString()}</Text>
                                    <Text style={styles.author}>{!article.creator ? "Anonymous" : article.creator}</Text>
                                </View>
                                <Text style={styles.content}>
                                    {article.content}
                                </Text>
                                {user ?
                                    <ChatBox article_id={params.article_id}></ChatBox> :
                                    <View style={{ alignSelf: 'center', marginVertical: 8, padding: 8, justifyContent: 'center', alignItems: 'center', borderRadius: 8, borderWidth: 0.5 }}>
                                        <Ionicons style={{ marginVertical: 16 }} name="lock-closed" size={32}></Ionicons>
                                        <Text style={styles.header}>Join the conversation</Text>
                                        <Text style={[styles.content, { textAlign: 'center' }]}>This AI chat feature is only available to logged-in users.</Text>
                                        <View style={{ flexDirection: "row", justifyContent: 'center', margin: 16 }}>
                                            <Pressable onPress={() => { router.push('/login') }} style={{ padding: 16, backgroundColor: "#0000ff", borderRadius: 8, borderWidth: 1, marginRight: 8 }}><Text style={{ color: 'white', fontWeight: 'bold' }}>Log in</Text></Pressable>
                                        </View>
                                    </View>}

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
        marginBottom: 8,
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
    speech: {
        backgroundColor: '#e6e6ffff',
        padding: 12,
        borderRadius: 16,
        flexDirection: 'row',
        marginVertical: 15,
        alignSelf: 'flex-start'
    },
    speechText: {
        color: '#4f4fefff',
        fontWeight: 'bold',
        fontSize: 18,
    }
});