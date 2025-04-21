import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, Switch } from 'react-native';

const SettingsScreen = () => {
  const [notificationInterval, setNotificationInterval] = useState('60');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [nightModeEnabled, setNightModeEnabled] = useState(false);

  const saveSettings = () => {
    // This will be implemented later with Firebase
    alert('Settings saved!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>
      
      <Text style={styles.settingLabel}>Notification Interval (minutes)</Text>
      <TextInput
        style={styles.input}
        value={notificationInterval}
        onChangeText={setNotificationInterval}
        keyboardType="numeric"
        placeholder="60"
      />
      <Text style={styles.helpText}>
        Set how often you want to receive word notifications (in minutes)
      </Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Night Mode</Text>
        <Switch
          value={nightModeEnabled}
          onValueChange={setNightModeEnabled}
        />
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Save Settings"
          onPress={saveSettings}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
