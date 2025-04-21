import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { getWordsForLearning, resetWordLearningProgress, incrementWordLearningProgress } from './wordService';
import { getUserSettings } from './settingsService';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    return false;
  }
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('word-reminders', {
      name: 'Word Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  
  return true;
};

// Schedule notifications for words
export const scheduleWordNotifications = async () => {
  try {
    // First, cancel any existing notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    
    // Get user settings
    const userId = 'demo-user-id'; // In a real app, this would come from authentication
    const settings = await getUserSettings(userId);
    
    // If notifications are disabled, don't schedule any
    if (!settings.notificationsEnabled) {
      return;
    }
    
    // Get words for learning, prioritizing those with lower learning progress
    const words = await getWordsForLearning(userId, 10);
    
    if (words.length === 0) {
      // No words to schedule notifications for
      return;
    }
    
    // Get notification interval from settings (in minutes)
    const intervalMinutes = settings.notificationInterval || 60;
    
    // Schedule notifications for each word
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      
      // Schedule notification at intervals
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Word: ${word.word}`,
          body: `Example: ${word.example}`,
          data: { wordId: word.id },
        },
        trigger: {
          seconds: intervalMinutes * 60 * (i + 1), // Stagger notifications
          repeats: false,
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return false;
  }
};

// Handle notification response (when user taps on notification)
export const handleNotificationResponse = (response, navigation) => {
  const data = response.notification.request.content.data;
  
  if (data?.wordId) {
    // Navigate to word detail screen
    navigation.navigate('WordDetail', { wordId: data.wordId });
  }
};

// Handle notification action (when user taps on action button)
export const handleNotificationAction = async (response) => {
  const { actionId, notification } = response;
  const data = notification.request.content.data;
  
  if (!data?.wordId) return;
  
  const wordId = data.wordId;
  
  try {
    if (actionId === 'learning') {
      // Reset learning progress
      await resetWordLearningProgress(wordId);
    } else if (actionId === 'known') {
      // Increment learning progress
      await incrementWordLearningProgress(wordId);
    }
  } catch (error) {
    console.error('Error handling notification action:', error);
  }
};

// Set up notification categories with action buttons
export const setNotificationCategories = async () => {
  await Notifications.setNotificationCategoryAsync('word', [
    {
      identifier: 'learning',
      buttonTitle: 'Learning',
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      },
    },
    {
      identifier: 'known',
      buttonTitle: 'I Know',
      options: {
        isDestructive: false,
        isAuthenticationRequired: false,
      },
    },
  ]);
};
