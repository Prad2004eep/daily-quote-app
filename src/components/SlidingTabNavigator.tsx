import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface SlidingTabNavigatorProps {
  onTabChange: (tab: 'home' | 'favorites') => void;
}

const SlidingTabNavigator: React.FC<SlidingTabNavigatorProps> = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'favorites'>('home');
  const slideAnimation = useState(new Animated.Value(0))[0];

  const handleTabPress = (tab: 'home' | 'favorites') => {
    setActiveTab(tab);
    onTabChange(tab);
    
    Animated.timing(slideAnimation, {
      toValue: tab === 'home' ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideStyle = {
    transform: [
      {
        translateX: slideAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (width - 40) / 2], // width of sliding square
        }),
      },
    ],
  };

  const homeTabStyle = [
    styles.tabButton,
    activeTab === 'home' && styles.activeTabButton,
  ];

  const favoritesTabStyle = [
    styles.tabButton,
    activeTab === 'favorites' && styles.activeTabButton,
  ];

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <Animated.View style={[styles.slidingSquare, slideStyle]} />
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('home')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="home" 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.tabText}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress('favorites')}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="heart" 
            size={24} 
            color="#FFFFFF" 
          />
          <Text style={styles.tabText}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabContainer: {
    width: width - 40,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    position: 'relative',
    flexDirection: 'row',
  },
  slidingSquare: {
    width: (width - 40) / 2,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(147, 51, 234, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'absolute',
    top: 5,
    left: 0,
    shadowColor: '#9333EA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTabButton: {
    backgroundColor: 'rgba(147, 51, 234, 1)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
    color: '#FFFFFF',
  },
});

export default SlidingTabNavigator;
