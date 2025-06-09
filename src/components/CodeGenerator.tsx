import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface Student {
  name: string;
  email: string;
  registeredAt: string;
}

const CodeGenerator: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' as 'info' | 'error' | 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const loadedStudents = await api.getStudents();
      setStudents(loadedStudents);
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to load students',
        severity: 'error'
      });
    }
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async () => {
    if (!studentName.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a student name',
        severity: 'error'
      });
      return;
    }

    if (!studentEmail.trim()) {
      setSnackbar({
        open: true,
        message: 'Please enter a student email',
        severity: 'error'
      });
      return;
    }

    if (!validateEmail(studentEmail)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    try {
      await api.registerStudent(studentName.trim(), studentEmail.toLowerCase());
      await loadStudents();
      setStudentName('');
      setStudentEmail('');
      setSnackbar({
        open: true,
        message: 'Student registered successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Failed to register student',
        severity: 'error'
      });
    }
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setSnackbar({
      open: true,
      message: 'Email copied to clipboard',
      severity: 'success'
    });
  };

  const handleDelete = async (email: string) => {
    try {
      await api.deleteStudent(email);
      await loadStudents();
      setSnackbar({
        open: true,
        message: 'Student deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete student',
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button variant="outlined" onClick={() => navigate('/')} sx={{ mb: 2 }}>
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          Student Access Management
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Register students using their email addresses as access codes
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Student Name"
            variant="outlined"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student's full name"
          />
          <TextField
            fullWidth
            label="Student Email"
            variant="outlined"
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            placeholder="Enter student's email address"
          />
          <Button
            variant="contained"
            onClick={handleRegister}
            sx={{ minWidth: '200px' }}
          >
            Register Student
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Registered Students
        </Typography>
        <List>
          {students.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No students registered yet"
                secondary="Register your first student above"
              />
            </ListItem>
          ) : (
            students.map((student, index) => (
              <React.Fragment key={student.email}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => copyEmail(student.email)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(student.email)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={student.name}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {student.email}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Registered: {new Date(student.registeredAt).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CodeGenerator; 