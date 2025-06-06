import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Switch, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { getUserSettings, setUserSettings } from '../services/settingsService';
import { requestNotificationPermissions, scheduleWordNotifications } from '../services/notificationService';

const SettingsScreen = () => {
  const [notificationInterval, setNotificationInterval] = useState('60');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [nightModeEnabled, setNightModeEnabled] = useState(false);
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
      setNightModeEnabled(settings.nightMode || false);
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
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
        notificationInterval: interval,
        nightMode: nightModeEnabled
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
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        keyboardType="numeric"
        placeholder="60"
        editable={!saving && notificationsEnabled}
      />
      <Text style={styles.helpText}>
        Set how often you want to receive word notifications (minimum 15 minutes)
      </Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Night Mode</Text>
        <Switch
          value={nightModeEnabled}
          onValueChange={setNightModeEnabled}
          disabled={saving}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title={saving ? "Saving..." : "Save Settings"}
          onPress={saveSettings}
          disabled={saving}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
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
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SettingsScreen;
    fontWeight: 'bold',
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  settingLabel: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  helpText: {
    color: '#666',
    fontSize: 12,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default SettingsScreen;
