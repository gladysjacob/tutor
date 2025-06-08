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
  timestamp: number;
}

const CodeGenerator: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [generatedCodes, setGeneratedCodes] = useState<GeneratedCode[]>(() => {
    const saved = localStorage.getItem('generatedCodes');
    return saved ? JSON.parse(saved) : [];
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();

  const generateCode = () => {
    if (!studentName.trim()) {
      setSnackbar({ open: true, message: 'Please enter a student name' });
      return;
    }

    // Generate a unique code based on student name and timestamp
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const code = `${studentName.substring(0, 3).toUpperCase()}-${randomNum}-${timestamp.toString().slice(-4)}`;

    const newCode: GeneratedCode = {
      code,
      studentName: studentName.trim(),
      timestamp,
    };

    const updatedCodes = [...generatedCodes, newCode];
    setGeneratedCodes(updatedCodes);
    localStorage.setItem('generatedCodes', JSON.stringify(updatedCodes));
    setStudentName('');
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
          Access Code Generator
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Generate unique access codes for your students
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            label="Student Name"
            variant="outlined"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter student's name"
          />
          <Button
            variant="contained"
            onClick={generateCode}
            sx={{ minWidth: '200px' }}
          >
            Generate Code
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Generated Access Codes
        </Typography>
        <List>
          {generatedCodes.length === 0 ? (
            <ListItem>
              <ListItemText
                primary="No codes generated yet"
                secondary="Generate your first code above"
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
                          {item.code}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Generated: {new Date(item.timestamp).toLocaleString()}
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
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity="success"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CodeGenerator; 