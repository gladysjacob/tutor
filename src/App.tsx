import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CodeGenerator from './components/CodeGenerator';
import { AuthProvider, useAuth } from './context/AuthContext';
import WeekView from './components/WeekView';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessCode } = useAuth();
  
  if (!accessCode) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Special route for teachers/admins
const TEACHER_ACCESS_CODE = 'TEACHER-2024'; // You can change this to any code you want

const TeacherRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accessCode } = useAuth();
  
  if (accessCode !== TEACHER_ACCESS_CODE) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function AppContent() {
  const { login } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={login} />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard teacherCode={TEACHER_ACCESS_CODE} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/generate-codes"
        element={
          <TeacherRoute>
            <CodeGenerator />
          </TeacherRoute>
        }
      />
      <Route
        path="/week/:weekId"
        element={
          <ProtectedRoute>
            <WeekView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 