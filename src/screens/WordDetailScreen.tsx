import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../navigation/AppNavigator';
import { useWords } from '../context/WordsContext';
import { Word } from '../types';

type WordDetailScreenRouteProp = RouteProp<HomeStackParamList, 'WordDetail'>;
type WordDetailScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'WordDetail'>;

interface WordDetailScreenProps {
  route: WordDetailScreenRouteProp;
  navigation: WordDetailScreenNavigationProp;
}

const WordDetailScreen: React.FC<WordDetailScreenProps> = ({ route, navigation }) => {
  const { wordId } = route.params;
  const { words, updateWordLevel, deleteWord } = useWords();
  const [word, setWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const foundWord = words.find(w => w.id === wordId);
    if (foundWord) {
      setWord(foundWord);
      navigation.setOptions({ title: foundWord.word });
    } else {
      Alert.alert('Error', 'Word not found');
      navigation.goBack();
    }
  }, [wordId, words]);

  const handleUpdateLevel = async (newLevel: number) => {
    if (!word) return;
    
    try {
      setLoading(true);
      await updateWordLevel(word.id, newLevel);
      setWord(prev => prev ? { ...prev, level: newLevel } : null);
      Alert.alert('Success', `Word level updated to ${newLevel}`);
    } catch (error) {
      console.error('Error updating word level:', error);
      Alert.alert('Error', 'Failed to update word level');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWord = async () => {
    if (!word) return;
    
    Alert.alert(
      'Delete Word',
      `Are you sure you want to delete "${word.word}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteWord(word.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting word:', error);
              Alert.alert('Error', 'Failed to delete word');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!word) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.wordHeader}>
        <Text style={styles.wordText}>{word.word}</Text>
        <View style={[styles.levelBadge, { backgroundColor: getLevelColor(word.level) }]}>
          <Text style={styles.levelText}>Level {word.level}</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: word.imageUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Meaning</Text>
        <Text style={styles.meaningText}>{word.meaning}</Text>

        <Text style={styles.sectionTitle}>Example</Text>
        <Text style={styles.exampleText}>{word.example}</Text>
      </View>

      <View style={styles.actionsContainer}>
        <Text style={styles.actionTitle}>Update Learning Progress</Text>
        
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.learningButton]}
            onPress={() => handleUpdateLevel(1)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Still Learning</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.knownButton]}
            onPress={() => handleUpdateLevel(Math.min(word.level + 1, 20))}
            disabled={loading || word.level >= 20}
          >
            <Text style={styles.buttonText}>I Know This</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, styles.masteredButton]}
          onPress={() => handleUpdateLevel(20)}
          disabled={loading || word.level === 20}
        >
          <Text style={styles.buttonText}>Mastered</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteWord}
          disabled={loading}
        >
          <Text style={styles.deleteButtonText}>Delete Word</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const getLevelColor = (level: number) => {
  if (level <= 5) return '#FF6B6B'; // Red for beginner levels
  if (level <= 10) return '#FFD166'; // Yellow for intermediate levels
  if (level <= 15) return '#06D6A0'; // Green for advanced levels
  return '#118AB2'; // Blue for mastered levels
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  wordText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  meaningText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    lineHeight: 22,
  },
  exampleText: {
    fontSize: 16,
    color: '#333',
    fontStyle: 'italic',
    lineHeight: 22,
  },
  actionsContainer: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  actionButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  learningButton: {
    backgroundColor: '#FF6B6B',
    flex: 1,
    marginRight: 5,
  },
  knownButton: {
    backgroundColor: '#06D6A0',
    flex: 1,
    marginLeft: 5,
  },
  masteredButton: {
    backgroundColor: '#118AB2',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#EA4335',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButtonText: {
    color: '#EA4335',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WordDetailScreen;
