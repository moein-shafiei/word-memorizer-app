import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';
import { User, Word } from '../types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Authentication functions
export const registerUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  const user = auth.currentUser;
  if (!user) return null;
  
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName
  };
};

export const onAuthStateChange = (callback: (user: User | null) => void): () => void => {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      callback({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });
    } else {
      callback(null);
    }
  });
};

// Word management functions
export const addWord = async (wordData: Omit<Word, 'id' | 'createdAt' | 'lastShownAt'>): Promise<string> => {
  try {
    const wordRef = await addDoc(collection(db, 'words'), {
      ...wordData,
      createdAt: serverTimestamp(),
      lastShownAt: null
    });
    return wordRef.id;
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

export const getWords = async (userId: string): Promise<Word[]> => {
  try {
    const q = query(
      collection(db, 'words'),
      where('userId', '==', userId),
      orderBy('level', 'asc'),
      orderBy('lastShownAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    const words: Word[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      words.push({
        id: doc.id,
        word: data.word,
        meaning: data.meaning,
        example: data.example,
        imageUrl: data.imageUrl,
        level: data.level,
        userId: data.userId,
        createdAt: data.createdAt?.toMillis() || Date.now(),
        lastShownAt: data.lastShownAt?.toMillis() || null
      });
    });
    
    return words;
  } catch (error) {
    console.error('Error getting words:', error);
    throw error;
  }
};

export const updateWordLevel = async (wordId: string, level: number): Promise<void> => {
  try {
    const wordRef = doc(db, 'words', wordId);
    await updateDoc(wordRef, { 
      level,
      lastShownAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating word level:', error);
    throw error;
  }
};

export const deleteWord = async (wordId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'words', wordId));
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Image upload function
export const uploadWordImage = async (uri: string, wordId: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const storageRef = ref(storage, `word-images/${wordId}`);
    await uploadBytes(storageRef, blob);
    
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// User settings functions
export const saveUserSettings = async (userId: string, notificationInterval: number): Promise<void> => {
  try {
    const settingsRef = doc(db, 'settings', userId);
    const settingsDoc = await getDoc(settingsRef);
    
    if (settingsDoc.exists()) {
      await updateDoc(settingsRef, { notificationInterval });
    } else {
      await addDoc(collection(db, 'settings'), {
        userId,
        notificationInterval
      });
    }
  } catch (error) {
    console.error('Error saving user settings:', error);
    throw error;
  }
};

export const getUserSettings = async (userId: string): Promise<{ notificationInterval: number }> => {
  try {
    const q = query(collection(db, 'settings'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return {
        notificationInterval: data.notificationInterval || 60 // Default to 60 minutes
      };
    }
    
    // Return default settings if none found
    return { notificationInterval: 60 };
  } catch (error) {
    console.error('Error getting user settings:', error);
    throw error;
  }
};

export default {
  auth,
  db,
  storage,
  registerUser,
  loginUser,
  signOut,
  getCurrentUser,
  onAuthStateChange,
  addWord,
  getWords,
  updateWordLevel,
  deleteWord,
  uploadWordImage,
  saveUserSettings,
  getUserSettings
};
