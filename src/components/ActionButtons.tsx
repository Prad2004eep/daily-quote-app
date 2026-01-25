import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionButtonsProps {
  isFavorited: boolean;
  onFavoritePress: () => void;
  onSharePress: () => void;
  onNewQuotePress: () => void;
  isLoading: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isFavorited,
  onFavoritePress,
  onSharePress,
  onNewQuotePress,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftButtons}>
        <TouchableOpacity
          style={[
            styles.circularButton,
            isFavorited && styles.favoritedButton
          ]}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorited ? '#FFFFFF' : '#374151'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.circularButton, styles.shareButton]}
          onPress={onSharePress}
        >
          <Ionicons
            name="share-social-outline"
            size={24}
            color="#374151"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.newQuoteButton}
        onPress={onNewQuotePress}
        disabled={isLoading}
      >
        <LinearGradient
          colors={['#6366F1', '#A855F7', '#EC4899']}
          style={styles.newQuoteButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
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
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 100,
  },
  leftButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  circularButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritedButton: {
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  shareButton: {
    backgroundColor: '#FFFFFF',
  },
  newQuoteButton: {
    borderRadius: 28,
    shadowColor: '#6366F1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  newQuoteButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 28,
    minWidth: 140,
  },
  newQuoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshing: {
    transform: [{ rotate: '360deg' }],
  },
});

export default ActionButtons;
