import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, Button, Alert } from 'react-native';
import { getUserSettings, setUserSettings } from '../services/settingsService';
import { requestNotificationPermissions, scheduleWordNotifications } from '../services/notificationService';

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationInterval, setNotificationInterval] = useState('60');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For demo purposes, using a fixed userId
  // In a real app, this would come from authentication
  const userId = 'demo-user-id';

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await getUserSettings(userId);
      
      setNotificationsEnabled(settings.notificationsEnabled);
      setNotificationInterval(settings.notificationInterval.toString());
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // Validate interval
      const interval = parseInt(notificationInterval);
      if (isNaN(interval) || interval < 15) {
        Alert.alert('Invalid Interval', 'Please enter a valid interval (minimum 15 minutes)');
        return;
      }
      
      // Request permissions if notifications are enabled
      if (notificationsEnabled) {
        const permissionsGranted = await requestNotificationPermissions();
        if (!permissionsGranted) {
          Alert.alert(
            'Notification Permissions',
            'Notification permissions are required to send word reminders'
          );
          setNotificationsEnabled(false);
          return;
        }
      }
      
      // Save settings
      await setUserSettings(userId, {
        notificationsEnabled,
        notificationInterval: interval
      });
      
      // Schedule notifications if enabled
      if (notificationsEnabled) {
        await scheduleWordNotifications();
      }
      
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
          disabled={saving}
        />
      </View>
      
      <Text style={styles.settingLabel}>Notification Interval (minutes)</Text>
      <TextInput
        style={styles.input}
        value={notificationInterval}
        onChangeText={setNotificationInterval}
        keyboardType="number-pad"
        editable={!saving && notificationsEnabled}
        placeholder="Enter interval in minutes (minimum 15)"
      />
      
      <Text style={styles.helpText}>
        You will receive word notifications at this interval.
        Default is 60 minutes (1 hour).
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={saving ? "Saving..." : "Save Settings"}
          onPress={handleSaveSettings}
          disabled={saving}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  helpText: {
    color: '#666',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default NotificationSettings;
