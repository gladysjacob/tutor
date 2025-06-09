import React, { createContext, useContext, useState, useEffect } from 'react';
import { Week } from '../types/curriculum';

interface AuthContextType {
  accessCode: string | null;
  userProgress: Week[];
  login: (code: string) => boolean;
  logout: () => void;
  updateProgress: (weekId: number, updatedWeek: Week) => void;
  studentName: string | null;
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

  const [studentName, setStudentName] = useState<string | null>(() => {
    const saved = localStorage.getItem('studentName');
    return saved || null;
  });

  const [userProgress, setUserProgress] = useState<Week[]>(() => {
    if (!accessCode) return [];
    const saved = localStorage.getItem(`progress_${accessCode}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (accessCode) {
      localStorage.setItem('accessCode', accessCode);
      localStorage.setItem(`progress_${accessCode}`, JSON.stringify(userProgress));
    }
  }, [accessCode, userProgress]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const login = (code: string) => {
    // Check if this is the teacher code
    if (code === 'TEACHER-2024') {
      setAccessCode(code);
      setStudentName('Teacher');
      localStorage.setItem('accessCode', code);
      localStorage.setItem('studentName', 'Teacher');
      return true;
    }

    // Validate that the code is an email
    if (!validateEmail(code)) {
      return false;
    }

    // Check if this is a registered student
    const generatedCodes = JSON.parse(localStorage.getItem('generatedCodes') || '[]');
    const student = generatedCodes.find((c: any) => c.code === code.toLowerCase());
    
    if (!student) {
      return false;
    }

    const email = code.toLowerCase();
    setAccessCode(email);
    setStudentName(student.studentName);
    localStorage.setItem('accessCode', email);
    localStorage.setItem('studentName', student.studentName);

    // Load existing progress for this student
    const savedProgress = localStorage.getItem(`progress_${email}`);
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    } else {
      setUserProgress([]);
    }

    return true;
  };

  const logout = () => {
    setAccessCode(null);
    setStudentName(null);
    setUserProgress([]);
    localStorage.removeItem('accessCode');
    localStorage.removeItem('studentName');
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
    <AuthContext.Provider value={{ 
      accessCode, 
      userProgress, 
      login, 
      logout, 
      updateProgress,
      studentName 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 