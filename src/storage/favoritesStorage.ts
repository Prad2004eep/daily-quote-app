import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Quote {
  id: string | number;
  text: string;
  author?: string;
  [key: string]: any;
}

const FAVORITES_KEY = '@favorite_quotes';

export const getFavorites = async (): Promise<Quote[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting favorites:', e);
    return [];
  }
};

export const addFavorite = async (quote: Quote): Promise<Quote[]> => {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some((item) => item.id === quote.id);
    
    if (!exists) {
      const newFavorites = [...favorites, quote];
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    }
    return favorites;
  } catch (e) {
    console.error('Error adding favorite:', e);
    throw e;
  }
};

export const removeFavorite = async (quoteId: string | number): Promise<Quote[]> => {
  try {
    const favorites = await getFavorites();
    const newFavorites = favorites.filter((item) => item.id !== quoteId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    return newFavorites;
  } catch (e) {
    console.error('Error removing favorite:', e);
    throw e;
  }
};

export const isFavorite = async (quoteId: string | number): Promise<boolean> => {
  try {
    const favorites = await getFavorites();
    return favorites.some((item) => item.id === quoteId);
  } catch (e) {
    console.error('Error checking if favorite:', e);
    return false;
  }
};
