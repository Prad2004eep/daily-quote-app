import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SlidingTabNavigator from '../components/SlidingTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { View } from 'react-native';

const AppNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'favorites'>('home');

  const handleTabChange = (tab: 'home' | 'favorites') => {
    setCurrentScreen(tab);
  };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {currentScreen === 'home' ? <HomeScreen /> : <FavoritesScreen />}
        <SlidingTabNavigator onTabChange={handleTabChange} />
      </View>
    </NavigationContainer>
  );
};

export default AppNavigator;
