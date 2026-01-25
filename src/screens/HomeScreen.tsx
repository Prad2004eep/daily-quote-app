// HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Share, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import { addFavorite, removeFavorite, isFavorite, Quote as QuoteType } from '../storage/favoritesStorage';

const { height, width } = Dimensions.get('window');

interface Quote extends QuoteType {
  _id: string;
  content: string;
  text: string;
  author: string;
  tags: string[];
}

const quotes: Quote[] = [
  {
    id: '1',
    _id: '1',
    text: "The only way to do great work is to love what you do.",
    content: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    tags: [],
  },
  {
    id: '2',
    _id: '2',
    text: "Life is what happens when you're busy making other plans.",
    content: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
    tags: [],
  },
  {
    id: '3',
    _id: '3',
    text: "The future belongs to those who believe in the beauty of their dreams.",
    content: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    tags: [],
  },
  {
    id: '4',
    _id: '4',
    text: "It is during our darkest moments that we must focus to see the light.",
    content: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle",
    tags: [],
  },
  {
    id: '5',
    _id: '5',
    text: "Believe you can and you're halfway there.",
    content: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    tags: [],
  },
  {
    id: '6',
    _id: '6',
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    content: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    tags: [],
  },
  {
    id: '7',
    _id: '7',
    text: "Your time is limited, don't waste it living someone else's life.",
    content: "Your time is limited, don't waste it living someone else's life.",
    author: "Steve Jobs",
    tags: [],
  },
  {
    id: '8',
    _id: '8',
    text: "The only impossible journey is the one you never begin.",
    content: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins",
    tags: [],
  }
];

const HomeScreen = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const slideAnimation = useState(new Animated.Value(height))[0];

  const getLocalQuote = (): Quote => {
    const randomQuote = quotes[currentQuoteIndex];
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    return randomQuote;
  };

  const fetchRandomQuote = async (): Promise<Quote> => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      if (!response.ok) throw new Error('Failed to fetch quote');
      const data = await response.json();
      return {
        id: Date.now().toString(),
        _id: Date.now().toString(),
        text: data[0].q,
        content: data[0].q,
        author: data[0].a || 'Unknown',
        tags: [],
      };
    } catch (error) {
      console.error('Error fetching quote:', error);
      return getLocalQuote();
    }
  };

  const slideInFromBottom = () => {
    slideAnimation.setValue(height);
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();
  };

  const loadRandomQuote = async () => {
    try {
      setIsLoading(true);
      const randomQuote = await fetchRandomQuote();
      setQuote(randomQuote);
      const favorited = await isFavorite(randomQuote.id);
      setIsFavorited(favorited);
      slideInFromBottom();
    } catch (error) {
      console.error('Error loading quote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoritePress = async () => {
    if (!quote) return;
    try {
      if (isFavorited) {
        await removeFavorite(quote.id);
      } else {
        await addFavorite(quote);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  const handleShare = async () => {
    if (!quote) return;
    try {
      await Share.share({
        message: `"${quote.content}" - ${quote.author}`,
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  const handleSpeak = async () => {
    if (!quote) return;
    
    try {
      if (isSpeaking) {
        // Stop speaking
        Speech.stop();
        setIsSpeaking(false);
      } else {
        // Start speaking
        const textToSpeak = `${quote.content}. By ${quote.author}`;
        setIsSpeaking(true);
        
        Speech.speak(textToSpeak, {
          language: 'en',
          pitch: 1.0,
          rate: 0.8,
          onStart: () => {
            setIsSpeaking(true);
          },
          onDone: () => {
            setIsSpeaking(false);
          },
          onError: (error) => {
            console.error('Speech error:', error);
            setIsSpeaking(false);
          },
        });
      }
    } catch (error) {
      console.error('Error speaking quote:', error);
      setIsSpeaking(false);
    }
  };

  const slideAnimatedStyle = {
    transform: [{ translateY: slideAnimation }],
  };

  useEffect(() => {
    loadRandomQuote();
  }, []);

  if (isLoading || !quote) {
    return (
      <LinearGradient 
        colors={['#9333EA', '#EC4899']} 
        style={styles.loadingContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['#9333EA', '#EC4899']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <TouchableOpacity
        style={[styles.speakButtonTop, isSpeaking && styles.speakingButtonTop]}
        onPress={handleSpeak}
      >
        <Ionicons
          name={isSpeaking ? "volume-high" : "volume-medium"}
          size={24}
          color="#FFFFFF"
        />
      </TouchableOpacity>
      
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.card, slideAnimatedStyle]}>
          <View style={styles.quoteContainer}>
            <Text style={styles.quoteText}>"{quote.content}"</Text>
            <Text style={styles.authorText}>— {quote.author}</Text>
          </View>
        </Animated.View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.circularButton, isFavorited && styles.favoritedButton]}
            onPress={handleFavoritePress}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorited ? '#FFFFFF' : '#374151'}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.circularButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Ionicons
              name="share-social-outline"
              size={24}
              color="#374151"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.newQuoteButton]}
            onPress={loadRandomQuote}
            disabled={isLoading}
          >
            <Ionicons
              name="refresh"
              size={20}
              color="#FFFFFF"
              style={isLoading ? styles.refreshing : null}
            />
            <Text style={styles.newQuoteButtonText}>
              {isLoading ? 'Loading...' : 'New Quote'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width - 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 40,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  quoteContainer: {
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#1F2937',
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  authorText: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 40,
    marginBottom: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  circularButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritedButton: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  speakButtonTop: {
    position: 'absolute',
    top: 50,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#9333EA',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  speakingButtonTop: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
    shadowColor: '#10B981',
  },
  newQuoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    backgroundColor: '#9333EA',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  newQuoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  refreshing: {
    transform: [{ rotate: '360deg' }],
  },
});

// ... (rest of the code remains the same)
export default HomeScreen;