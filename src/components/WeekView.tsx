import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Button,
  Paper,
  IconButton,
  Link,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { weeks, CurriculumWeek } from '../types/curriculum';
import { useAuth } from '../context/AuthContext';

const WeekView = () => {
  const { weekId } = useParams();
  const navigate = useNavigate();
  const { userProgress, updateProgress } = useAuth();
  const weekData = weeks.find((w) => w.id === Number(weekId));
  const userWeek = userProgress.find((w) => w.id === Number(weekId));
  const week = (userWeek || weekData) as CurriculumWeek;

  if (!week) {
    return (
      <Container>
        <Typography variant="h4">Week not found</Typography>
        <Button onClick={() => navigate('/')}>Go back to Dashboard</Button>
      </Container>
    );
  }

  const handleTopicToggle = (index: number) => {
    const updatedWeek = { ...week };
    updatedWeek.topics[index].completed = !updatedWeek.topics[index].completed;
    updateProgress(week.id, updatedWeek);
  };

  const handlePracticeToggle = (index: number) => {
    const updatedWeek = { ...week };
    updatedWeek.practice[index].completed = !updatedWeek.practice[index].completed;
    updateProgress(week.id, updatedWeek);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          Week {week.id}: {week.title}
        </Typography>
      </Box>

      <Typography variant="body1" color="textSecondary" paragraph>
        {week.description}
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Topics
        </Typography>
        <List>
          {week.topics.map((topic, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={topic.completed}
                  onChange={() => handleTopicToggle(index)}
                />
              </ListItemIcon>
              <ListItemText 
                primary={topic.name}
                secondary={
                  topic.ixlLink && (
                    <Link
                      href={topic.ixlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                    >
                      Practice on IXL <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </Link>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Practice Exercises
        </Typography>
        <List>
          {week.practice.map((practice, index) => (
            <ListItem key={index} sx={{ py: 1 }}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={practice.completed}
                  onChange={() => handlePracticeToggle(index)}
                />
              </ListItemIcon>
              <ListItemText 
                primary={practice.description}
                secondary={
                  practice.ixlLink && (
                    <Link
                      href={practice.ixlLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}
                    >
                      Practice on IXL <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </Link>
                  )
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => navigate(`/week/${Math.max(1, week.id - 1)}`)}
          disabled={week.id === 1}
        >
          Previous Week
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate(`/week/${Math.min(8, week.id + 1)}`)}
          disabled={week.id === 8}
        >
          Next Week
        </Button>
      </Box>
    </Container>
  );
};

export default WeekView; 