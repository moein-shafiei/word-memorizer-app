import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Button } from 'react-native';

const WordDetailScreen = ({ route, navigation }) => {
  // This will be replaced with actual data from Firebase later
  const [word, setWord] = useState({
    id: '1',
    word: 'Example',
    meaning: 'A thing characteristic of its kind or illustrating a general rule.',
    example: 'This is an example of how the app will display word details.',
    imageUrl: null,
    learningProgress: 0
  });

  // In a real implementation, we would fetch the word data from Firebase
  useEffect(() => {
    if (route.params?.wordId) {
      // Fetch word data based on wordId
      // This will be implemented later with Firebase
    }
  }, [route.params?.wordId]);

  const handleLearning = () => {
    // Reset learning progress to 0
    // This will be implemented later with Firebase
    alert('Word marked as "Learning"');
  };

  const handleKnown = () => {
    // Increase learning progress by 1
    // This will be implemented later with Firebase
    alert('Word marked as "I Know"');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.wordText}>{word.word}</Text>
      
      <View style={styles.imageContainer}>
        {word.imageUrl ? (
          <Image 
            source={{ uri: word.imageUrl }} 
            style={styles.image} 
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text>Image will be generated</Text>
          </View>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Meaning</Text>
        <Text style={styles.meaningText}>{word.meaning}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Example</Text>
        <Text style={styles.exampleText}>{word.example}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Learning Progress</Text>
        <Text style={styles.progressText}>Level: {word.learningProgress}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button
            title="Learning"
            onPress={handleLearning}
            color="#FF6B6B"
          />
        </View>
        <View style={styles.button}>
          <Button
            title="I Know"
            onPress={handleKnown}
            color="#4ECDC4"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#555',
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
  },
  exampleText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  progressText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
  },
  button: {
    width: '48%',
  },
});

export default WordDetailScreen;
