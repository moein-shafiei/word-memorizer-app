import React, { useEffect, useRef } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useWords } from '../context/WordsContext';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const { words, getNextWordForReview, updateWordLevel } = useWords();
  const { settings } = useSettings();
  const { user } = useAuth();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const appState = useRef(AppState.currentState);
  const notificationTimer = useRef<NodeJS.Timeout | null>(null);

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('word-reminders', {
        name: 'Word Reminders',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4285F4',
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  // Schedule next word notification
  const scheduleNextWordNotification = async () => {
    if (!user || !settings) return;
    
    // Clear any existing timer
    if (notificationTimer.current) {
      clearTimeout(notificationTimer.current);
    }

    // Get the next word to review
    const nextWord = getNextWordForReview();
    if (!nextWord) return;

    // Calculate notification delay based on settings
    const delayInMinutes = settings.notificationInterval;
    const delayInMs = delayInMinutes * 60 * 1000;

    // Schedule the notification
    notificationTimer.current = setTimeout(async () => {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Time to review: ${nextWord.word}`,
          body: nextWord.example,
          data: { wordId: nextWord.id },
        },
        trigger: null, // Send immediately
      });
    }, delayInMs);
  };

  // Handle notification response
  const handleNotificationResponse = async (response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as { wordId: string };
    
    if (!data || !data.wordId) return;
    
    // Get the action identifier
    const actionId = response.actionIdentifier;
    
    switch (actionId) {
      case 'KNOW_ACTION':
        // Increase level by 1 (max 20)
        const word = words.find(w => w.id === data.wordId);
        if (word) {
          const newLevel = Math.min(word.level + 1, 20);
          await updateWordLevel(data.wordId, newLevel);
        }
        break;
        
      case 'LEARNING_ACTION':
        // Reset to level 0 and open word detail screen
        await updateWordLevel(data.wordId, 0);
        // Navigation to word detail would happen here in a real implementation
        break;
        
      case 'LEARNED_ACTION':
        // Set to highest level (20)
        await updateWordLevel(data.wordId, 20);
        break;
        
      default:
        // Default action (e.g., tapping the notification) - open word detail
        // Navigation to word detail would happen here in a real implementation
        break;
    }
    
    // Schedule the next notification
    scheduleNextWordNotification();
  };

  // Handle app state changes
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) && 
      nextAppState === 'active'
    ) {
      // App has come to the foreground
      scheduleNextWordNotification();
    }
    
    appState.current = nextAppState;
  };

  // Set up notification categories with actions
  const setNotificationCategories = async () => {
    await Notifications.setNotificationCategoryAsync('word_review', [
      {
        identifier: 'KNOW_ACTION',
        buttonTitle: 'I Know',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: 'LEARNING_ACTION',
        buttonTitle: 'Learning',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: 'LEARNED_ACTION',
        buttonTitle: 'Learned',
        options: {
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);
  };

  // Initialize notifications
  const initializeNotifications = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    await setNotificationCategories();
    scheduleNextWordNotification();
  };

  useEffect(() => {
    // Initialize notifications when component mounts
    initializeNotifications();
    
    // Listen for notification responses
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });
    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);
    
    // Listen for app state changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Clean up
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
      subscription.remove();
      if (notificationTimer.current) {
        clearTimeout(notificationTimer.current);
      }
    };
  }, [user, settings, words]);

  // Reschedule notifications when settings or words change
  useEffect(() => {
    if (user && settings) {
      scheduleNextWordNotification();
    }
  }, [settings?.notificationInterval, words.length]);

  return {
    scheduleNextWordNotification,
  };
};

export default useNotifications;
