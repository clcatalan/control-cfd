const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

const FRONTEND_DIST = path.join(__dirname, '../frontend/dist');
const ADMIN_DIST = path.join(__dirname, '../admin/dist');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Login endpoint (validates existing users only)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { participantId } = req.body;

    // Validate input
    if (!participantId || participantId.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Participant ID is required' 
      });
    }

    const trimmedId = participantId.trim();

    // Check if user exists
    const existingUser = await db.findUserByParticipantId(trimmedId);

    if (existingUser) {
      // User exists - login successful
      return res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: existingUser.id,
          participantId: existingUser.participant_id,
          createdAt: existingUser.created_at
        },
        isNewUser: false
      });
    } else {
      // User doesn't exist - reject login
      return res.status(401).json({
        success: false,
        message: 'Invalid participant ID. Please contact the administrator.'
      });
    }
  } catch (error) {
    console.error('Login error:', error);

    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Register endpoint (for admin use - creates new users)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { participantId } = req.body;

    // Validate input
    if (!participantId || participantId.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Participant ID is required' 
      });
    }

    const trimmedId = participantId.trim();

    // Check if user already exists
    const existingUser = await db.findUserByParticipantId(trimmedId);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Participant ID already exists'
      });
    }

    // Create new user
    const newUser = await db.createUser(trimmedId);
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        participantId: newUser.participant_id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate participant ID error
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'Participant ID already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Admin login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const admin = await db.verifyAdminCredentials(username.trim(), password);

    if (admin) {
      return res.json({
        success: true,
        message: 'Login successful',
        admin: {
          id: admin.id,
          username: admin.username
        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid username or password'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Get all users (for admin purposes)
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getAllUsers();
    res.json({
      success: true,
      count: users.length,
      users: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Validate participant ID
app.get('/api/auth/validate/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    const user = await db.findUserByParticipantId(participantId);
    
    if (user) {
      res.json({
        success: true,
        valid: true,
        user: {
          id: user.id,
          participantId: user.participant_id,
          createdAt: user.created_at
        }
      });
    } else {
      res.json({
        success: true,
        valid: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating user'
    });
  }
});

// Delete user (for admin purposes)
app.delete('/api/users/:participantId', async (req, res) => {
  try {
    const { participantId } = req.params;
    const result = await db.deleteUser(participantId);
    
    if (result.deleted > 0) {
      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting user'
    });
  }
});

// Get the full problem availability schedule
app.get('/api/schedule', async (req, res) => {
  try {
    const schedule = await db.getSchedule();
    res.json({ success: true, schedule });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule'
    });
  }
});

// Set (or move) the date a problem becomes available (admin use)
app.post('/api/schedule', async (req, res) => {
  try {
    const { problemId, date } = req.body;

    if (!problemId || !date) {
      return res.status(400).json({
        success: false,
        message: 'problemId and date are required'
      });
    }

    const entry = await db.setSchedule(problemId, date);
    res.json({ success: true, schedule: entry });
  } catch (error) {
    console.error('Error setting schedule:', error);

    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({
        success: false,
        message: 'That date is already assigned to another problem'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error setting schedule'
    });
  }
});

// Clear a problem's scheduled date (admin use)
app.delete('/api/schedule/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const result = await db.clearSchedule(problemId);

    if (result.deleted > 0) {
      res.json({ success: true, message: 'Schedule cleared' });
    } else {
      res.status(404).json({ success: false, message: 'No schedule found for that problem' });
    }
  } catch (error) {
    console.error('Error clearing schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing schedule'
    });
  }
});

// Serve the built admin app under /admin, and the built frontend app at the root.
// Both share this same server/database, so the admin panel always reflects live data.
app.use('/admin', express.static(ADMIN_DIST));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(ADMIN_DIST, 'index.html'));
});

app.use(express.static(FRONTEND_DIST));
app.get('*', (req, res) => {
  res.sendFile(path.join(FRONTEND_DIST, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
  console.log(`Frontend available at http://localhost:${PORT}/`);
  console.log(`Admin panel available at http://localhost:${PORT}/admin`);
});
