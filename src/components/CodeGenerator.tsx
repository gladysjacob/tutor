import React, { useState } from 'react';
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

interface GeneratedCode {
  code: string;
  studentName: string;
  studentEmail: string;
  timestamp: number;
}

const CodeGenerator: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>(() => {
    const saved = localStorage.getItem('generatedCodes');
    return saved ? JSON.parse(saved) : [];
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const generateCode = () => {
    if (!studentName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a student name' });
      return;
    }

    if (!studentEmail.trim()) {
      setSnackbar({ open: true, message: 'Please enter a student email' });
      return;
    }

    if (!validateEmail(studentEmail)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address' });
      return;
    }

    // Check if email is already used
    if (generatedCodes.some(code => code.code === studentEmail)) {
      setSnackbar({ open: true, message: 'This email is already registered' });
      return;
    }

    const newCode: GeneratedCode = {
      code: studentEmail.toLowerCase(),
      studentName: studentName.trim(),
      studentEmail: studentEmail.toLowerCase(),
      timestamp: Date.now(),
    };

    const updatedCodes = [...generatedCodes, newCode];
    setGeneratedCodes(updatedCodes);
    localStorage.setItem('generatedCodes', JSON.stringify(updatedCodes));
    setStudentName('');
    setStudentEmail('');
    setSnackbar({ open: true, message: 'Access code generated successfully' });
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setSnackbar({ open: true, message: 'Code copied to clipboard' });
  };

  const deleteCode = (timestamp: number) => {
    const updatedCodes = generatedCodes.filter(code => code.timestamp !== timestamp);
    setGeneratedCodes(updatedCodes);
    localStorage.setItem('generatedCodes', JSON.stringify(updatedCodes));
    setSnackbar({ open: true, message: 'Code deleted successfully' });
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
            onClick={generateCode}
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
          {generatedCodes.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No students registered yet"
                secondary="Register your first student above"
              />
            </ListItem>
          ) : (
            generatedCodes.map((item, index) => (
              <React.Fragment key={item.timestamp}>
                {index > 0 && <Divider />}
                <ListItem
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="copy"
                        onClick={() => copyCode(item.code)}
                      >
                        <ContentCopyIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => deleteCode(item.timestamp)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={item.studentName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {item.studentEmail}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Registered: {new Date(item.timestamp).toLocaleString()}
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
          severity="info"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CodeGenerator; 