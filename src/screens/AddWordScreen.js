import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button, ScrollView, Alert } from 'react-native';

const AddWordScreen = ({ navigation }) => {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddWord = async () => {
    // Validate inputs
    if (!word.trim() || !meaning.trim() || !example.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // This will be implemented later with Firebase and ChatGPT API
      // 1. Save word to Firebase
      // 2. Generate image using ChatGPT API
      // 3. Upload image to Firebase Storage
      // 4. Update word document with image URL

      // For now, just show success message and navigate back
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('Success', 'Word added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'Failed to add word. Please try again.');
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
      
      <Text style={styles.infoText}>
        An image will be automatically generated for this word using AI.
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={isLoading ? "Adding..." : "Add Word"}
          onPress={handleAddWord}
          disabled={isLoading}
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  infoText: {
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 15,
  },
  buttonContainer: {
    marginVertical: 20,
  },
});

export default AddWordScreen;
