import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  deleteDoc,
  serverTimestamp,
  deleteObject
} from 'firebase/firestore';

// Settings collection name
const SETTINGS_COLLECTION = 'settings';

// Get user settings
export const getUserSettings = async (userId) => {
  try {
    const q = query(
      collection(db, SETTINGS_COLLECTION),
      where('userId', '==', userId),
      limit(1)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const settingsDoc = querySnapshot.docs[0];
      return { id: settingsDoc.id, ...settingsDoc.data() };
    } else {
      // Create default settings if none exist
      const defaultSettings = {
        userId,
        notificationsEnabled: true,
        notificationInterval: 60, // minutes
        nightMode: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, SETTINGS_COLLECTION), defaultSettings);
      return { id: docRef.id, ...defaultSettings };
    }
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

// Update user settings
export const setUserSettings = async (userId, settings) => {
  try {
    // First get the current settings
    const currentSettings = await getUserSettings(userId);
    
    const settingsRef = doc(db, SETTINGS_COLLECTION, currentSettings.id);
    
    const updatedSettings = {
      ...settings,
      userId,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(settingsRef, updatedSettings);
    return { id: currentSettings.id, ...updatedSettings };
  } catch (error) {
    console.error('Error updating user settings:', error);
    throw error;
  }
};
