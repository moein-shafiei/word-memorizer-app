import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert, ActivityIndicator, Image } from 'react-native';
import { addWord, updateWordImageUrl } from '../services/wordService';
import { base64ToBlob, uploadWordImage } from '../services/storageService';
import { generateWordImage, generateWordDefinition } from '../services/openaiService';

const AddWordForm = ({ navigation }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingDefinition, setIsGeneratingDefinition] = useState(false);

  // For demo purposes, using a fixed userId
  // In a real app, this would come from authentication
  const userId = 'demo-user-id';

  const validateInputs = () => {
    if (!word.trim()) {
      Alert.alert('Error', 'Please enter a word');
      return false;
    }
    if (!meaning.trim()) {
      Alert.alert('Error', 'Please enter the meaning');
      return false;
    }
    if (!example.trim()) {
      Alert.alert('Error', 'Please enter an example');
      return false;
    }
    return true;
  };

  const handleAddWord = async () => {
    if (!validateInputs()) return;

    setIsLoading(true);

    try {
      // Add word to Firestore
      const newWord = {
        userId,
        word: word.trim(),
        meaning: meaning.trim(),
        example: example.trim(),
        learningProgress: 0,
        imageUrl: null // Will be updated after image generation
      };

      const addedWord = await addWord(newWord);

      try {
        // Generate image using ChatGPT API
        const imageBase64 = await generateWordImage(word, meaning);
        
        // Convert base64 to blob
        const imageBlob = await base64ToBlob(imageBase64);
        
        // Upload to Firebase Storage
        const imageUrl = await uploadWordImage(userId, addedWord.id, imageBlob);
        
        // Update the word document with the image URL
        await updateWordImageUrl(addedWord.id, imageUrl);
      } catch (imageError) {
        console.error('Error generating/uploading image:', imageError);
        // If image generation fails, we still keep the word, just without an image
      }
      
      Alert.alert(
        'Success',
        'Word added successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error adding word:', error);
      Alert.alert('Error', 'Failed to add word. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateDefinition = async () => {
    if (!word.trim()) {
      Alert.alert('Error', 'Please enter a word first');
      return;
    }

    setIsGeneratingDefinition(true);

    try {
      const definition = await generateWordDefinition(word.trim());
      setMeaning(definition.meaning || '');
      setExample(definition.example || '');
    } catch (error) {
      console.error('Error generating definition:', error);
      Alert.alert('Error', 'Failed to generate definition. Please try again.');
    } finally {
      setIsGeneratingDefinition(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Word</Text>
      
      <Text style={styles.label}>Word</Text>
      <TextInput
        style={styles.input}
        value={word}
        onChangeText={setWord}
        placeholder="Enter a word"
      />
      
      <Text style={styles.label}>Meaning</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={meaning}
        onChangeText={setMeaning}
        placeholder="Enter the meaning"
        multiline
        numberOfLines={3}
      />
      
      <Text style={styles.label}>Example</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={example}
        onChangeText={setExample}
        placeholder="Enter an example sentence"
        multiline
        numberOfLines={3}
      />
      
      <View style={styles.buttonContainer}>
        {isGeneratingDefinition ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#555" />
            <Text style={styles.loadingText}>Generating definition...</Text>
          </View>
        ) : (
          <Button
            title="Generate Definition"
            onPress={handleGenerateDefinition}
            color="#555"
          />
        )}
      </View>
      
      <Text style={styles.infoText}>
        An image will be automatically generated for this word using AI.
      </Text>
      
      <View style={styles.buttonContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
            <Text style={styles.loadingText}>Adding word...</Text>
          </View>
        ) : (
          <Button
            title="Add Word"
            onPress={handleAddWord}
            color="#007AFF"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  infoText: {
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 15,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#007AFF',
  },
});

export default AddWordForm;
