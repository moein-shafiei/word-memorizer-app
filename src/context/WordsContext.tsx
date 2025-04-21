import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Word, User } from '../types';
import { 
  getWords as fetchWords,
  addWord as addWordToFirebase,
  updateWordLevel as updateWordLevelInFirebase,
  deleteWord as deleteWordFromFirebase
} from '../services/firebase';
import { useAuth } from './AuthContext';

interface WordsContextType {
  words: Word[];
  loading: boolean;
  addWord: (word: Omit<Word, 'id' | 'createdAt' | 'lastShownAt'>) => Promise<string>;
  updateWordLevel: (wordId: string, level: number) => Promise<void>;
  deleteWord: (wordId: string) => Promise<void>;
  refreshWords: () => Promise<void>;
  getNextWordForReview: () => Word | null;
}

const WordsContext = createContext<WordsContextType>({
  words: [],
  loading: true,
  addWord: async () => '',
  updateWordLevel: async () => {},
  deleteWord: async () => {},
  refreshWords: async () => {},
  getNextWordForReview: () => null
});

export const useWords = () => useContext(WordsContext);

interface WordsProviderProps {
  children: ReactNode;
}

export const WordsProvider: React.FC<WordsProviderProps> = ({ children }) => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshWords = async () => {
    if (!user) {
      setWords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedWords = await fetchWords(user.uid);
      setWords(fetchedWords);
    } catch (error) {
      console.error('Error fetching words:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWords();
  }, [user]);

  const addWord = async (wordData: Omit<Word, 'id' | 'createdAt' | 'lastShownAt'>): Promise<string> => {
    try {
      const wordId = await addWordToFirebase(wordData);
      await refreshWords();
      return wordId;
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  };

  const updateWordLevel = async (wordId: string, level: number): Promise<void> => {
    try {
      await updateWordLevelInFirebase(wordId, level);
      
      // Update local state
      setWords(prevWords => 
        prevWords.map(word => 
          word.id === wordId 
            ? { ...word, level, lastShownAt: Date.now() } 
            : word
        )
      );
    } catch (error) {
      console.error('Error updating word level:', error);
      throw error;
    }
  };

  const deleteWord = async (wordId: string): Promise<void> => {
    try {
      await deleteWordFromFirebase(wordId);
      
      // Update local state
      setWords(prevWords => prevWords.filter(word => word.id !== wordId));
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  };

  const getNextWordForReview = (): Word | null => {
    if (words.length === 0) return null;
    
    // Sort words by level (ascending) and last shown time (oldest first)
    const sortedWords = [...words].sort((a, b) => {
      // First prioritize by level
      if (a.level !== b.level) return a.level - b.level;
      
      // Then by last shown time (null values come first)
      if (a.lastShownAt === null) return -1;
      if (b.lastShownAt === null) return 1;
      
      return a.lastShownAt - b.lastShownAt;
    });
    
    return sortedWords[0];
  };

  return (
    <WordsContext.Provider 
      value={{ 
        words, 
        loading, 
        addWord, 
        updateWordLevel, 
        deleteWord, 
        refreshWords,
        getNextWordForReview
      }}
    >
      {children}
    </WordsContext.Provider>
  );
};

export default WordsContext;
