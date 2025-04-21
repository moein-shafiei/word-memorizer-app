import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNotifications } from '../hooks/useNotifications';
import { AuthProvider } from '../context/AuthContext';
import { WordsProvider } from '../context/WordsContext';
import { SettingsProvider } from '../context/SettingsContext';
import AppNavigator from '../navigation/AppNavigator';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WordsProvider>
        <SettingsProvider>
          <NotificationManager />
          <AppNavigator />
        </SettingsProvider>
      </WordsProvider>
    </AuthProvider>
  );
};

// Component to manage notifications without rendering UI
const NotificationManager: React.FC = () => {
  // Initialize the notifications system
  useNotifications();
  
  // This component doesn't render anything visible
  return null;
};

export default App;
