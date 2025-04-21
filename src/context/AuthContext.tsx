import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from '../types';
import { 
  registerUser as firebaseRegisterUser,
  loginUser as firebaseLoginUser,
  signOut as firebaseSignOut,
  getCurrentUser,
  onAuthStateChange
} from '../services/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  registerUser: (email: string, password: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  registerUser: async () => {},
  loginUser: async () => {},
  signOut: async () => {}
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const registerUser = async (email: string, password: string) => {
    try {
      const user = await firebaseRegisterUser(email, password);
      setUser(user);
    } catch (error) {
      console.error('Error in register:', error);
      throw error;
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const user = await firebaseLoginUser(email, password);
      setUser(user);
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, registerUser, loginUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
