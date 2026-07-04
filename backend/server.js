const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});
