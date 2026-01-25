// FavoritesScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Share, Alert, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFavorites, removeFavorite as removeFavoriteFromStorage, Quote as QuoteType } from '../storage/favoritesStorage';

type Quote = QuoteType & {
  _id: string;
  content: string;
  text: string;
  author: string;
  tags: string[];
};

const { width } = Dimensions.get('window');

const FavoritesScreen = () => {
  const isFocused = useIsFocused();
  const [favorites, setFavorites] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({});

  const loadFavorites = async () => {
    try {
      const savedFavorites = await getFavorites();
      const formattedFavorites = savedFavorites.map(fav => ({
        ...fav,
        content: fav.content || fav.text || '',
        author: fav.author || 'Unknown',
        id: fav.id || fav._id,
        _id: fav._id || fav.id || '',
        text: fav.text || fav.content || '',
        tags: fav.tags || [],
      }));
      setFavorites(formattedFavorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
      Alert.alert('Error', 'Failed to load favorites');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, [isFocused]);

  useEffect(() => {
    // Trigger entry animations for all favorites
    favorites.forEach((item, index) => {
      const quoteId = item.id || item._id;
      if (!animatedValues.current[quoteId]) {
        animatedValues.current[quoteId] = new Animated.Value(width);
      }
      
      Animated.timing(animatedValues.current[quoteId], {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    });
  }, [favorites]);

  const handleRemoveFavorite = async (id: string) => {
    setRemovingId(id);
    const animatedValue = animatedValues.current[id];
    
    Animated.timing(animatedValue, {
      toValue: -width,
      duration: 500,
      useNativeDriver: true,
    }).start(async () => {
      try {
        await removeFavoriteFromStorage(id);
        setFavorites(prev => prev.filter(quote => (quote.id || quote._id) !== id));
        Alert.alert(
          'Removed',
          'Quote removed from favorites',
          [{ text: 'OK', style: 'default' }],
          { cancelable: false }
        );
      } catch (error) {
        console.error('Error removing favorite:', error);
        Alert.alert(
          'Error',
          'Failed to remove quote from favorites',
          [{ text: 'OK', style: 'default' }],
          { cancelable: false }
        );
      } finally {
        setRemovingId(null);
      }
    });
  };

  const handleShare = async (quote: Quote) => {
    try {
      const quoteText = quote.content || quote.text || '';
      const author = quote.author || 'Unknown';
      await Share.share({
        message: `"${quoteText}" - ${author}`,
      });
    } catch (error) {
      console.error('Error sharing quote:', error);
      Alert.alert(
        'Error',
        'Failed to share quote',
        [{ text: 'OK', style: 'default' }],
        { cancelable: false }
      );
    }
  };

  const renderQuote = ({ item, index }: { item: Quote; index: number }) => {
    const quoteText = item.content || item.text || '';
    const author = item.author || 'Unknown';
    const quoteId = item.id || item._id;
    
    if (!animatedValues.current[quoteId]) {
      animatedValues.current[quoteId] = new Animated.Value(width);
    }
    
    const animatedStyle = {
      transform: [{ translateX: animatedValues.current[quoteId] }],
      opacity: animatedValues.current[quoteId].interpolate({
        inputRange: [-width, 0, width],
        outputRange: [0, 1, 0],
      }),
    };
    
    return (
      <Animated.View style={[styles.quoteCard, animatedStyle]}>
        <Text style={styles.quoteText}>"{quoteText}"</Text>
        <Text style={styles.authorText}>— {author}</Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => handleRemoveFavorite(String(quoteId))}
            disabled={removingId === quoteId}
          >
            <Ionicons name="heart" size={20} color="#FFFFFF" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={() => handleShare({ ...item, content: quoteText, author })}
          >
            <Ionicons name="share-social-outline" size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <LinearGradient colors={['#A855F7', '#EC4899', '#F97316']} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient 
      colors={['#A855F7', '#EC4899', '#F97316']} 
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Favorites</Text>
        <Text style={styles.subHeaderText}>
          {favorites.length} {favorites.length === 1 ? 'quote' : 'quotes'} saved
        </Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={40} color="rgba(255, 255, 255, 0.6)" />
          </View>
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the heart icon to save your favorite quotes
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderQuote}
          keyExtractor={(item) => String(item.id || item._id)}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  header: {
    marginTop: 50,
    marginBottom: 24,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  quoteCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0,
  },
  quoteText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F2937',
    marginBottom: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    fontWeight: '500',
  },
  authorText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  removeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default FavoritesScreen;