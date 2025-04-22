import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { WordsProvider } from './src/context/WordsContext';
import { SettingsProvider } from './src/context/SettingsContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthProvider>
        <WordsProvider>
          <SettingsProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </SettingsProvider>
        </WordsProvider>
      </AuthProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
