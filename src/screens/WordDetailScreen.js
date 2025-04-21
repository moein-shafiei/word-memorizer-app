import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { getWordById } from '../services/wordService';
import LearningProgressTracker from '../components/LearningProgressTracker';

const WordDetailScreen = ({ route, navigation }) => {
  const { wordId } = route.params;
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWordDetails();
  }, [wordId]);

  const loadWordDetails = async () => {
    try {
      setLoading(true);
      const wordData = await getWordById(wordId);
      setWord(wordData);
      setError(null);
    } catch (error) {
      console.error('Error loading word details:', error);
      setError('Failed to load word details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProgressChange = (newProgress) => {
    // Update local state to reflect the change immediately
    setWord(prevWord => ({
      ...prevWord,
      learningProgress: newProgress
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading word details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWordDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!word) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Word not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.wordText}>{word.word}</Text>
      
      {word.imageUrl ? (
        <Image
          source={{ uri: word.imageUrl }}
          style={styles.wordImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      )}
      
      <View style={styles.detailsContainer}>
        <Text style={styles.sectionTitle}>Meaning</Text>
        <Text style={styles.meaningText}>{word.meaning}</Text>
        
        <Text style={styles.sectionTitle}>Example</Text>
        <Text style={styles.exampleText}>{word.example}</Text>
      </View>
      
      <LearningProgressTracker
        wordId={wordId}
        initialProgress={word.learningProgress || 0}
        onProgressChange={handleProgressChange}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  wordText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  wordImage: {
    width: '100%',
    height: 250,
    marginBottom: 20,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  meaningText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    color: '#333',
  },
  exampleText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default WordDetailScreen;
