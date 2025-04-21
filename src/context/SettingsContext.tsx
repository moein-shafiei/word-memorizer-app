import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { AppSettings, User } from '../types';
import { 
  saveUserSettings as saveSettingsToFirebase,
  getUserSettings as getSettingsFromFirebase
} from '../services/firebase';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: AppSettings | null;
  loading: boolean;
  saveSettings: (notificationInterval: number) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  saveSettings: async () => {}
});

export const useSettings = () => useContext(SettingsContext);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const loadSettings = async () => {
    if (!user) {
      setSettings(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userSettings = await getSettingsFromFirebase(user.uid);
      setSettings({
        notificationInterval: userSettings.notificationInterval,
        userId: user.uid
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      // Set default settings
      setSettings({
        notificationInterval: 60, // Default to 60 minutes
        userId: user.uid
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [user]);

  const saveSettings = async (notificationInterval: number): Promise<void> => {
    if (!user) return;

    try {
      await saveSettingsToFirebase(user.uid, notificationInterval);
      setSettings(prev => prev ? {
        ...prev,
        notificationInterval
      } : {
        notificationInterval,
        userId: user.uid
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
