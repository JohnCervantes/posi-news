import AnimatedWrapper from '@/components/AnimatedWrapper';
import PosiBot from '@/components/PosiBot';
import { NewsFeedLoading } from '@/components/Skeleton';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-1272636370557269/6655900426';

type ArticleType = { article_id: number; creator: string, country: string, title: string, description: string, url: string, image_url: string, label: string, score: string, publishedat: string, category: string[] }

export default function Index() {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.EXPO_PUBLIC_API_URL as string;
  const [category, setCategory] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => article.category.includes(category))
  }, [category])

  useEffect(() => {
    //AsyncStorage.clear();
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


  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ArticleType }) => (
    <Pressable onPress={() => { router.navigate({ pathname: "/article", params: { article_id: item.article_id } }) }} style={({ pressed }) => [
      styles.listItem,
      pressed && styles.itemPressed
    ]}>
      <Text style={styles.nameText}><Ionicons name="calendar" size={16} color="blue" /> {new Date(item.publishedat).toLocaleDateString()}</Text>
      <Text style={styles.title}>{item.title}</Text>

      <Image source={item.image_url === "" ? require("@/assets/images/default-article.png") : { uri: item.image_url }} style={styles.image} transition={1000} contentFit='cover' placeholder={{ blurhash: "|fF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[" }} />
      <Text numberOfLines={5} ellipsizeMode='tail' style={styles.nameText}>{item.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={[styles.button, { paddingVertical: 4, paddingHorizontal: 8 }]}><Text>{item.country[0].toUpperCase() + item.country.substring(1)}</Text></View>
        <Text style={styles.author}>{item.creator && `By ${item.creator}`}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
      <AnimatedWrapper TOOLTIP_KEY='@PosiNews:FeatureATooltipSeen'>
        <PosiBot text={`Hi, I'm Posibot.\nI'm here to deliver some uplifting news to you!\nClick on a story to see the full content.`}></PosiBot>
      </AnimatedWrapper>
      <View style={[styles.container]}>
        <Text style={styles.header}>Uplifting Stories</Text>
        <ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal: 16, marginBottom: 16, alignItems: 'baseline', columnGap: 8, minHeight: 60 }}>

          {["all", "business", "health", "science", "technology", "environment"].map((category) => {
            return <Pressable key={category} style={({ pressed }) => [styles.button, {
              backgroundColor: activeCategory === category ? "darkblue" : "gray",
              opacity: pressed ? 0.5 : 1
            }]}
              onPress={() => { setCategory(category); setActiveCategory(category) }}><Text style={styles.buttonText}>{category}</Text></Pressable>
          })}

        </ScrollView>


        {isLoading ? <View style={{ marginTop: 60 }}><NewsFeedLoading /><NewsFeedLoading /><NewsFeedLoading /></View> :
          <FlatList
            data={category === 'all' ? articles : filteredArticles}
            renderItem={renderItem}
            keyExtractor={item => item.article_id.toString()}
          />}
      </View ></>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f5f5f5',
  },
  button: {
    paddingVertical: 8, paddingHorizontal: 16, borderWidth: 0.8, borderColor: "lightgray", borderRadius: 8
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
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
    marginBottom: 8,
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
