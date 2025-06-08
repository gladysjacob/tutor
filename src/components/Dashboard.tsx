import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Paper,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddIcon from '@mui/icons-material/Add';
import { weeks } from '../types/curriculum';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  teacherCode: string;
}

const Dashboard: React.FC<DashboardProps> = ({ teacherCode }) => {
  const navigate = useNavigate();
  const { accessCode, logout, userProgress, updateProgress } = useAuth();
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const isTeacher = accessCode === teacherCode;

  const calculateProgress = (weekId: number) => {
    const week = weeks.find((w) => w.id === weekId);
    if (!week) return 0;

    const userWeek = userProgress.find((w) => w.id === weekId) || week;
    const totalItems = userWeek.topics.length + userWeek.practice.length;
    const completedItems = 
      userWeek.topics.filter((t) => t.completed).length +
      userWeek.practice.filter((p) => p.completed).length;

    return (completedItems / totalItems) * 100;
  };

  const handleCheckboxClick = (weekId: number, isTopicItem: boolean, index: number) => {
    const week = weeks.find((w) => w.id === weekId);
    if (!week) return;

    const userWeek = userProgress.find((w) => w.id === weekId) || { ...week };
    
    if (isTopicItem) {
      userWeek.topics[index].completed = !userWeek.topics[index].completed;
    } else {
      userWeek.practice[index].completed = !userWeek.practice[index].completed;
    }

    updateProgress(weekId, userWeek);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Algebra 2 Tutoring Curriculum
          </Typography>
          <Typography variant="h6" color="textSecondary">
            8-Week Comprehensive Program
          </Typography>
          <Typography variant="subtitle1" color="primary">
            Access Code: {accessCode}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {isTeacher && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => navigate('/generate-codes')}
            >
              Generate Codes
            </Button>
          )}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={logout}
          >
            Logout
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        {weeks.map((week) => (
          <Box key={week.id} sx={{ width: { xs: '100%', md: 'calc(50% - 12px)' } }}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                },
              }}
              onClick={() => navigate(`/week/${week.id}`)}
              onMouseEnter={() => setHoveredWeek(week.id)}
              onMouseLeave={() => setHoveredWeek(null)}
            >
              <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                  Week {week.id}: {week.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {week.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={calculateProgress(week.id)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="textSecondary" align="right" sx={{ mt: 1 }}>
                    Progress: {Math.round(calculateProgress(week.id))}%
                  </Typography>
                </Box>

                {hoveredWeek === week.id && (
                  <Paper elevation={0} sx={{ mt: 2, bgcolor: 'background.default' }}>
                    <List dense>
                      {week.topics.slice(0, 2).map((topic, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={userProgress.find(w => w.id === week.id)?.topics[index]?.completed ?? topic.completed}
                              tabIndex={-1}
                              disableRipple
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCheckboxClick(week.id, true, index);
                              }}
                            />
                          </ListItemIcon>
                          <ListItemText primary={topic.name} />
                        </ListItem>
                      ))}
                      {week.topics.length > 2 && (
                        <ListItem>
                          <ListItemText
                            primary={`+ ${week.topics.length - 2} more topics...`}
                            sx={{ color: 'text.secondary' }}
                          />
                        </ListItem>
                      )}
                    </List>
                  </Paper>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default Dashboard; 