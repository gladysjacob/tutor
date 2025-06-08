import React, { createContext, useContext, useState, useEffect } from 'react';
import { Week } from '../types/curriculum';

interface AuthContextType {
  accessCode: string | null;
  userProgress: Week[];
  login: (code: string) => void;
  logout: () => void;
  updateProgress: (weekId: number, updatedWeek: Week) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessCode, setAccessCode] = useState<string | null>(() => {
    const saved = localStorage.getItem('accessCode');
    return saved || null;
  });

  const [userProgress, setUserProgress] = useState<Week[]>(() => {
    const saved = localStorage.getItem(`progress_${accessCode}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (accessCode) {
      localStorage.setItem('accessCode', accessCode);
      localStorage.setItem(`progress_${accessCode}`, JSON.stringify(userProgress));
    }
  }, [accessCode, userProgress]);

  const login = (code: string) => {
    setAccessCode(code);
    const savedProgress = localStorage.getItem(`progress_${code}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  };

  const logout = () => {
    setAccessCode(null);
    setUserProgress([]);
    localStorage.removeItem('accessCode');
  };

  const updateProgress = (weekId: number, updatedWeek: Week) => {
    setUserProgress(prev => {
      const newProgress = prev.map(week => 
        week.id === weekId ? updatedWeek : week
      );
      if (!prev.find(w => w.id === weekId)) {
        newProgress.push(updatedWeek);
      }
      return newProgress;
    });
  };

  return (
    <AuthContext.Provider value={{ accessCode, userProgress, login, logout, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}; 