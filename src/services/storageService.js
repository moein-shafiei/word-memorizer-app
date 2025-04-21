import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Upload an image to Firebase Storage
export const uploadWordImage = async (userId, wordId, imageBlob) => {
  try {
    // Create a reference to the file location
    const imageRef = ref(storage, `word-images/${userId}/${wordId}.jpg`);
    
    // Upload the file
    const snapshot = await uploadBytes(imageRef, imageBlob);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Convert base64 image to blob for storage
export const base64ToBlob = async (base64String) => {
  // Remove data URL prefix if it exists
  const base64WithoutPrefix = base64String.includes('base64,') 
    ? base64String.split('base64,')[1] 
    : base64String;
  
  // Convert base64 to blob
  const response = await fetch(`data:image/jpeg;base64,${base64WithoutPrefix}`);
  const blob = await response.blob();
  
  return blob;
};

// Delete an image from Firebase Storage
export const deleteWordImage = async (userId, wordId) => {
  try {
    const imageRef = ref(storage, `word-images/${userId}/${wordId}.jpg`);
    await deleteObject(imageRef);
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};
