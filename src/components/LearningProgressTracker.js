import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { resetWordLearningProgress, incrementWordLearningProgress, getWordById } from '../services/wordService';

const LearningProgressTracker = ({ wordId, initialProgress = 0, onProgressChange }) => {
  const [progress, setProgress] = useState(initialProgress);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  const handleLearning = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await resetWordLearningProgress(wordId);
      setProgress(0);
      if (onProgressChange) {
        onProgressChange(0);
      }
    } catch (error) {
      console.error('Error resetting learning progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKnown = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await incrementWordLearningProgress(wordId);
      const newProgress = progress + 1;
      setProgress(newProgress);
      if (onProgressChange) {
        onProgressChange(newProgress);
      }
    } catch (error) {
      console.error('Error incrementing learning progress:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Progress</Text>
      <Text style={styles.progressText}>Level: {progress}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.learningButton]}
          onPress={handleLearning}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Learning</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.knownButton]}
          onPress={handleKnown}
          disabled={loading}
        >
          <Text style={styles.buttonText}>I Know</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.helpText}>
        "Learning" resets progress to 0.
        "I Know" increases progress by 1.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  learningButton: {
    backgroundColor: '#FF6B6B',
  },
  knownButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helpText: {
    marginTop: 12,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default LearningProgressTracker;
