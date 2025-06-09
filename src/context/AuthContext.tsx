import React, { createContext, useContext, useState } from 'react';
import { Week } from '../types/curriculum';
import { api } from '../services/api';

interface AuthContextType {
  accessCode: string | null;
  userProgress: Week[];
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  updateProgress: (weekId: number, updatedWeek: Week) => Promise<void>;
  studentName: string | null;
  isTeacher: boolean;
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
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [isTeacher, setIsTeacher] = useState<boolean>(false);
  const [userProgress, setUserProgress] = useState<Week[]>([]);

  const login = async (code: string): Promise<boolean> => {
    try {
      const response = await api.login(code);
      
      setAccessCode(response.email);
      setStudentName(response.name);
      setIsTeacher(response.isTeacher);
      
      if (!response.isTeacher && response.progress) {
        setUserProgress(response.progress);
      }

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setAccessCode(null);
    setStudentName(null);
    setIsTeacher(false);
    setUserProgress([]);
  };

  const updateProgress = async (weekId: number, updatedWeek: Week) => {
    if (!accessCode || isTeacher) return;

    try {
      const updatedProgress = await api.updateProgress(accessCode, weekId, updatedWeek);
      setUserProgress(updatedProgress);
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      accessCode, 
      userProgress, 
      login, 
      logout, 
      updateProgress,
      studentName,
      isTeacher
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 