import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function About() {
    const params = useLocalSearchParams();
    const [article, setArticle] = useState<{ author: string, title: string, content: string, publishedat: string, urltoimage: string }>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:3000/article?article_id=${params.article_id}`);

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
            {article && <ScrollView style={styles.container} >
                <Text style={styles.header}>{article.title}</Text>
                <Image source={{ uri: article.urltoimage }} style={styles.image} />
                <Text><Ionicons name="calendar" size={16} color="blue" /> {new Date(article.publishedat).toLocaleDateString()}</Text>
                <Text style={styles.content}>
                    {article.content}
                </Text>
            </ScrollView>}
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
        fontSize: 16,
        lineHeight: 24,
    },
    image: {
        width: '100%',
        height: 150,
        marginBottom: 6
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 18,
    }
});