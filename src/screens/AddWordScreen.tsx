import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { useWords } from '../context/WordsContext';
import { useAuth } from '../context/AuthContext';
import { generateWordContent, generateImagePrompt, generateWordImage } from '../services/openai';
import { uploadWordImage } from '../services/firebase';

const AddWordScreen: React.FC = () => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  const { addWord } = useWords();
  const { user } = useAuth();

  const handleGenerateContent = async () => {
    if (!word.trim()) {
      Alert.alert('Error', 'Please enter a word first');
      return;
    }

    try {
      setGenerating(true);
      
      // Generate meaning and example
      const content = await generateWordContent(word.trim());
      setMeaning(content.meaning);
      setExample(content.example);
      
      // Generate image prompt based on word and meaning
      const imagePrompt = await generateImagePrompt(word.trim(), content.meaning);
      
      // Generate image using DALL-E
      const imageUrl = await generateWordImage(imagePrompt);
      setImageUrl(imageUrl);
      
    } catch (error) {
      console.error('Error generating content:', error);
      Alert.alert('Error', 'Failed to generate content. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleAddWord = async () => {
    if (!word.trim() || !meaning.trim() || !example.trim() || !imageUrl) {
      Alert.alert('Error', 'Please fill in all fields and generate an image');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to add words');
      return;
    }

    try {
      setLoading(true);
      
      // Create a temporary ID for the word
      const tempId = Date.now().toString();
      
      // Upload the image to Firebase Storage
      const uploadedImageUrl = await uploadWordImage(imageUrl, tempId);
      
      // Add the word to Firestore
      await addWord({
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        imageUrl: uploadedImageUrl,
        level: 1, // Start at level 1
        userId: user.uid
      });
      
      // Reset form
      setWord('');
      setMeaning('');
      setExample('');
      setImageUrl('');
      
      Alert.alert('Success', 'Word added successfully!');
    } catch (error) {
      console.error('Error adding word:', error);
      Alert.alert('Error', 'Failed to add word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Add New Word</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Word</Text>
        <TextInput
          style={styles.input}
          value={word}
          onChangeText={setWord}
          placeholder="Enter a word to memorize"
          autoCapitalize="none"
        />
        
        <TouchableOpacity 
          style={[styles.generateButton, generating && styles.disabledButton]} 
          onPress={handleGenerateContent}
          disabled={generating || !word.trim()}
        >
          {generating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.generateButtonText}>Generate Content</Text>
          )}
        </TouchableOpacity>
        
        <Text style={styles.label}>Meaning</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={meaning}
          onChangeText={setMeaning}
          placeholder="Word definition"
          multiline
        />
        
        <Text style={styles.label}>Example</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={example}
          onChangeText={setExample}
          placeholder="Example sentence"
          multiline
        />
        
        {imageUrl ? (
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Image</Text>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        ) : null}
      </View>
      
      <TouchableOpacity 
        style={[styles.addButton, loading && styles.disabledButton]} 
        onPress={handleAddWord}
        disabled={loading || !word.trim() || !meaning.trim() || !example.trim() || !imageUrl}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.addButtonText}>Add Word</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  generateButton: {
    backgroundColor: '#34A853',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  imageContainer: {
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 5,
    backgroundColor: '#ddd',
  },
});

export default AddWordScreen;
