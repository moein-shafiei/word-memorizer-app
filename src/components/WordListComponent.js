import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getUserWords } from '../services/wordService';

const WordListComponent = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // For demo purposes, using a fixed userId
  // In a real app, this would come from authentication
  const userId = 'demo-user-id';

  const loadWords = async () => {
    try {
      setLoading(true);
      const userWords = await getUserWords(userId);
      setWords(userWords);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadWords();
  };

  const handleWordPress = (word) => {
    navigation.navigate('WordDetail', { wordId: word.id });
  };

  const renderWordItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.wordItem}
      onPress={() => handleWordPress(item)}
    >
      <View style={styles.wordContainer}>
        <Text style={styles.wordText}>{item.word}</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Learning Level: {item.learningProgress || 0}
          </Text>
        </View>
      </View>
      <Text style={styles.meaningText} numberOfLines={2}>
        {item.meaning}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading words...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {words.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't added any words yet.
          </Text>
          <Text style={styles.emptySubText}>
            Tap the "Add New Word" button to get started.
          </Text>
        </View>
      ) : (
        <FlatList
          data={words}
          renderItem={renderWordItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
  },
  wordItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  meaningText: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default WordListComponent;
