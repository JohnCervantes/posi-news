import PosiBot from '@/components/PosiBot';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setArticles(data);
        setError(null);
      } catch (e) {
        console.error("Fetching error: ", e);
        setError('Failed to load data. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

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

  const renderItem = ({ item }: { item: { article_id: number; author: string, title: string, description: string, url: string, urltoimage: string, label: string, score: string, publishedat: string } }) => (
    <Pressable onPress={() => { router.navigate({ pathname: "/article", params: { article_id: item.article_id } }) }} style={({ pressed }) => [
      styles.listItem,
      pressed && styles.itemPressed
    ]}>
      <Text style={styles.nameText}><Ionicons name="calendar" size={16} color="blue" /> {new Date(item.publishedat).toLocaleDateString()}</Text>
      <Text style={styles.title}>{item.title}</Text>

      <Image source={{ uri: item.urltoimage }} style={styles.image} />
      <Text style={styles.nameText}>{item.description}</Text>
      <Text style={styles.author}>By {item.author}</Text>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Posi News",
          headerBackTitle: 'Posi News',
        }}
      />
      <PosiBot text={`Hi, I'm Posibot.\nMy purpose is to deliver some uplifting news to you!\nClick on a story to see the full content.`}></PosiBot>
      <View style={styles.container}>
        <Text style={styles.header}>Uplifting Stories</Text>
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={item => item.article_id.toString()}
        />
      </View></>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    marginTop: 10,
    resizeMode: 'cover'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333333'
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  nameText: {
    fontSize: 18,
    marginBottom: 6,
    color: '#333333'
  },
  itemPressed: {
    backgroundColor: '#e0e0e0',
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: '#333333'
  },
  author: {
    fontSize: 14,
    fontWeight: "condensed",
    textAlign: "right",
    color: '#6a6a6aff'
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  }
});
