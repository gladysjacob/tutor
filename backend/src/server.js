require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./models/Student');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/algebra2tutoring')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes

// Login route
app.post('/api/login', async (req, res) => {
  const { code } = req.body;

  // Check for teacher access code
  if (code === process.env.TEACHER_ACCESS_CODE || code === 'TEACHER-2024') {
    return res.json({
      isTeacher: true,
      name: 'Teacher',
      email: code
    });
  }

  try {
    const student = await Student.findOne({ email: code.toLowerCase() });
    if (!student) {
      return res.status(401).json({ error: 'Invalid email or unregistered student' });
    }

    res.json({
      isTeacher: false,
      name: student.name,
      email: student.email,
      progress: student.progress
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Register student route
app.post('/api/students', async (req, res) => {
  const { name, email } = req.body;

  try {
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const student = new Student({
      name,
      email: email.toLowerCase(),
      progress: []
    });

    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all students (teacher only)
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find({}, 'name email registeredAt');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update student progress
app.put('/api/students/:email/progress', async (req, res) => {
  const { email } = req.params;
  const { weekId, updatedWeek } = req.body;

  try {
    const student = await Student.findOne({ email: email.toLowerCase() });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Find and update or add the week progress
    const weekIndex = student.progress.findIndex(w => w.weekId === weekId);
    if (weekIndex >= 0) {
      student.progress[weekIndex] = { weekId, ...updatedWeek };
    } else {
      student.progress.push({ weekId, ...updatedWeek });
    }

    await student.save();
    res.json(student.progress);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete student
app.delete('/api/students/:email', async (req, res) => {
  const { email } = req.params;

  try {
    await Student.findOneAndDelete({ email: email.toLowerCase() });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 