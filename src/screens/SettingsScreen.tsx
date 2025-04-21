import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Switch, 
  Alert,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';

const SettingsScreen: React.FC = () => {
  const { settings, saveSettings } = useSettings();
  const { user, signOut } = useAuth();
  
  const [notificationInterval, setNotificationInterval] = useState(
    settings?.notificationInterval.toString() || '60'
  );
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    const interval = parseInt(notificationInterval);
    
    if (isNaN(interval) || interval < 15) {
      Alert.alert('Invalid Input', 'Please enter a valid number of minutes (minimum 15)');
      return;
    }
    
    try {
      setLoading(true);
      await saveSettings(interval);
      Alert.alert('Success', 'Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notification Interval (minutes)</Text>
          <TextInput
            style={styles.input}
            value={notificationInterval}
            onChangeText={setNotificationInterval}
            keyboardType="number-pad"
            placeholder="60"
          />
          <Text style={styles.helperText}>
            Minimum: 15 minutes
          </Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Email</Text>
          <Text style={styles.settingValue}>{user?.email || 'Not logged in'}</Text>
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.saveButton, loading && styles.disabledButton]} 
        onPress={handleSaveSettings}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Settings</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.logoutButton} 
        onPress={signOut}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 20,
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EA4335',
    padding: 15,
    margin: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#EA4335',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SettingsScreen;
