import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from '../context/AuthContext';
import { WordsProvider } from '../context/WordsContext';
import { SettingsProvider } from '../context/SettingsContext';

// Import screens (to be created)
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddWordScreen from '../screens/AddWordScreen';
import WordDetailScreen from '../screens/WordDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Define navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  AddWord: undefined;
  Settings: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  WordDetail: { wordId: string };
};

// Create navigators
const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();

// Auth navigator
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Home stack navigator (for nested navigation)
const HomeNavigator = () => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'My Words' }} />
    <HomeStack.Screen name="WordDetail" component={WordDetailScreen} options={{ title: 'Word Details' }} />
  </HomeStack.Navigator>
);

// Main tab navigator
const MainNavigator = () => (
  <MainTab.Navigator>
    <MainTab.Screen 
      name="Home" 
      component={HomeNavigator} 
      options={{ headerShown: false }}
    />
    <MainTab.Screen 
      name="AddWord" 
      component={AddWordScreen} 
      options={{ title: 'Add Word' }}
    />
    <MainTab.Screen 
      name="Settings" 
      component={SettingsScreen} 
      options={{ title: 'Settings' }}
    />
  </MainTab.Navigator>
);

// Root navigator with context providers
const AppNavigator = () => {
  return (
    <AuthProvider>
      <WordsProvider>
        <SettingsProvider>
          <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name="Auth" component={AuthNavigator} />
              <RootStack.Screen name="Main" component={MainNavigator} />
            </RootStack.Navigator>
          </NavigationContainer>
        </SettingsProvider>
      </WordsProvider>
    </AuthProvider>
  );
};

export default AppNavigator;
