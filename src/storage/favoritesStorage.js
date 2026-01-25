import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorite_quotes';

export const getFavorites = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting favorites:', e);
    return [];
  }
};

export const addFavorite = async (quote) => {
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

export const removeFavorite = async (quoteId) => {
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

export const isFavorite = async (quoteId) => {
  try {
    const favorites = await getFavorites();
    return favorites.some((item) => item.id === quoteId);
  } catch (e) {
    console.error('Error checking favorite:', e);
    return false;
  }
};
