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
  serverTimestamp
} from 'firebase/firestore';

const WORDS_COLLECTION = 'words';

// Add a new word to the database
export const addWord = async (wordData) => {
  try {
    const wordWithTimestamp = {
      ...wordData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      learningProgress: 0
    };
    
    const docRef = await addDoc(collection(db, WORDS_COLLECTION), wordWithTimestamp);
    return { id: docRef.id, ...wordWithTimestamp };
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Get a word by ID
export const getWordById = async (wordId) => {
  try {
    const docRef = doc(db, WORDS_COLLECTION, wordId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Word not found');
    }
  } catch (error) {
    console.error('Error getting word:', error);
    throw error;
  }
};

// Get all words for a user
export const getUserWords = async (userId) => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const words = [];
    
    querySnapshot.forEach((doc) => {
      words.push({ id: doc.id, ...doc.data() });
    });
    
    return words;
  } catch (error) {
    console.error('Error getting user words:', error);
    throw error;
  }
};

// Get words with lower learning progress first (for notifications)
export const getWordsForLearning = async (userId, limit = 10) => {
  try {
    const q = query(
      collection(db, WORDS_COLLECTION),
      where('userId', '==', userId),
      orderBy('learningProgress', 'asc'),
      limit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    const words = [];
    
    querySnapshot.forEach((doc) => {
      words.push({ id: doc.id, ...doc.data() });
    });
    
    return words;
  } catch (error) {
    console.error('Error getting words for learning:', error);
    throw error;
  }
};

// Update a word
export const updateWord = async (wordId, wordData) => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    
    const updatedData = {
      ...wordData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(wordRef, updatedData);
    return { id: wordId, ...updatedData };
  } catch (error) {
    console.error('Error updating word:', error);
    throw error;
  }
};

// Delete a word
export const deleteWord = async (wordId) => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    await deleteDoc(wordRef);
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Update word image URL
export const updateWordImageUrl = async (wordId, imageUrl) => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    await updateDoc(wordRef, { 
      imageUrl,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating word image URL:', error);
    throw error;
  }
};

// Reset word learning progress (when user clicks "Learning" button)
export const resetWordLearningProgress = async (wordId) => {
  try {
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    await updateDoc(wordRef, { 
      learningProgress: 0,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error resetting word learning progress:', error);
    throw error;
  }
};

// Increment word learning progress (when user clicks "I Know" button)
export const incrementWordLearningProgress = async (wordId) => {
  try {
    // First get the current progress
    const wordRef = doc(db, WORDS_COLLECTION, wordId);
    const wordSnap = await getDoc(wordRef);
    
    if (wordSnap.exists()) {
      const currentProgress = wordSnap.data().learningProgress || 0;
      
      await updateDoc(wordRef, { 
        learningProgress: currentProgress + 1,
        updatedAt: serverTimestamp()
      });
      
      return true;
    } else {
      throw new Error('Word not found');
    }
  } catch (error) {
    console.error('Error incrementing word learning progress:', error);
    throw error;
  }
};
