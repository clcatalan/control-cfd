const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');
const problems = require('./problems');
const tts = require('./tts');

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

// Text-to-speech for AI explanation narration
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ success: false, message: 'text is required' });
    }
    const audioBuffer = await tts.synthesize(text.trim(), voice || 'alloy');
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(audioBuffer);
  } catch (err) {
    console.error('TTS error:', err.message);
    res.status(503).json({ success: false, message: 'Text-to-speech unavailable' });
  }
});

// Login endpoint (validates existing users only). If a participant's password_hash is
// still unset, their first submitted password is nominated and stored as their password.
app.post('/api/auth/login', async (req, res) => {
  try {
    const { participantId, password } = req.body;

    // Validate input
    if (!participantId || participantId.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const trimmedId = participantId.trim();

    // Check if user exists
    const existingUser = await db.findUserByParticipantId(trimmedId);

    if (!existingUser) {
      // User doesn't exist - reject login
      return res.status(401).json({
        success: false,
        message: 'Invalid participant ID. Please contact the administrator.'
      });
    }

    let authenticatedUser;
    if (!existingUser.password_hash) {
      // First login for this participant - nominate this password as theirs
      authenticatedUser = await db.setUserPassword(trimmedId, password);
    } else {
      const isValid = db.verifyUserPassword(existingUser, password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }
      authenticatedUser = existingUser;
    }

    return res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: authenticatedUser.id,
        participantId: authenticatedUser.participant_id,
        createdAt: authenticatedUser.created_at,
        studyGroup: authenticatedUser.study_group
      },
      isNewUser: false
    });
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
          createdAt: user.created_at,
          studyGroup: user.study_group
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

// Assign a participant to a study group, "control" or "experimental" (admin use)
app.post('/api/users/:participantId/group', async (req, res) => {
  try {
    const { participantId } = req.params;
    const { group } = req.body;

    if (group !== 'control' && group !== 'experimental' && group !== null) {
      return res.status(400).json({
        success: false,
        message: 'group must be "control", "experimental", or null'
      });
    }

    const user = await db.setUserGroup(participantId, group);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Error setting user group:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting user group'
    });
  }
});

const VALID_COMPLETION_RESPONSES = ['accept', 'reject', 'timeout'];

const VALID_BUG_TYPES = [
  'Syntax Error',
  'Silly Mistake',
  'Missing Corner Cases',
  'Wrong Input Type',
  'Hallucinated Object',
  'Wrong Attribute',
];

const VALID_CERTAINTY_LEVELS = [
  'Very Uncertain',
  'Uncertain',
  'Neither Certain nor Uncertain',
  'Certain',
  'Very Certain',
];

// Record that a participant completed a problem (called by the study frontend)
app.post('/api/users/:participantId/completions', async (req, res) => {
  try {
    const { participantId } = req.params;
    const { problemId, response, code, bugType, certainty } = req.body;

    if (problemId === undefined || problemId === null) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }

    if (response && !VALID_COMPLETION_RESPONSES.includes(response)) {
      return res.status(400).json({ success: false, message: 'Invalid response value' });
    }

    if (code !== undefined && code !== null && typeof code !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid code value' });
    }

    if (bugType && !VALID_BUG_TYPES.includes(bugType)) {
      return res.status(400).json({ success: false, message: 'Invalid bugType value' });
    }

    if (certainty && !VALID_CERTAINTY_LEVELS.includes(certainty)) {
      return res.status(400).json({ success: false, message: 'Invalid certainty value' });
    }

    await db.markProblemCompleted(participantId, problemId, response, code, bugType, certainty);

    // Problem 0 is the sample onboarding problem; finishing it is what unlocks
    // the real scheduled problems, replacing the old "watch a video" gate.
    if (Number(problemId) === 0) {
      await db.markOnboardingCompleted(participantId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error recording completion:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(500).json({
      success: false,
      message: 'Error recording completion'
    });
  }
});

const VALID_LEETCODE_VERIFICATIONS = ['passed', 'failed'];

// Record an admin's manual verification of a submitted solution against LeetCode (admin use)
app.post('/api/users/:participantId/problems/:problemId/leetcode-verification', async (req, res) => {
  try {
    const { participantId, problemId } = req.params;
    const { verification } = req.body;

    if (!VALID_LEETCODE_VERIFICATIONS.includes(verification)) {
      return res.status(400).json({ success: false, message: 'Invalid verification value' });
    }

    await db.setLeetcodeVerification(participantId, problemId, verification);
    res.json({ success: true, verification });
  } catch (error) {
    console.error('Error setting LeetCode verification:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    if (error.message === 'Completion not found') {
      return res.status(404).json({ success: false, message: 'Completion not found' });
    }

    res.status(500).json({
      success: false,
      message: 'Error setting LeetCode verification'
    });
  }
});

// Get a participant's per-problem progress (admin use)
app.get('/api/users/:participantId/progress', async (req, res) => {
  try {
    const { participantId } = req.params;
    const completions = await db.getUserCompletions(participantId);

    if (completions === null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const completionByProblemId = new Map(completions.map((c) => [c.problem_id, c]));
    const progress = problems.map((problem) => {
      const completion = completionByProblemId.get(problem.id);
      return {
        id: problem.id,
        title: problem.title,
        completed: Boolean(completion),
        completedAt: completion?.completed_at || null,
        response: completion?.response || null,
        submittedCode: completion?.submitted_code || null,
        leetcodeVerified: completion?.leetcode_verified || null,
        bugType: completion?.bug_type || null,
        certainty: completion?.certainty || null
      };
    });

    res.json({ success: true, participantId, progress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching progress'
    });
  }
});

// Get whether a participant has completed onboarding (the sample problem 0; gates
// problem availability; called by the study frontend). Onboarding itself is marked
// complete as a side effect of finishing problem 0 in the completions route above.
app.get('/api/users/:participantId/onboarding', async (req, res) => {
  try {
    const { participantId } = req.params;
    const status = await db.getOnboardingStatus(participantId);

    if (status === null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, completed: status.completed, completedAt: status.completedAt });
  } catch (error) {
    console.error('Error fetching onboarding status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching onboarding status'
    });
  }
});

// Get the problem IDs a participant has been individually granted early access to
// (called by the study frontend to unlock problems ahead of their scheduled date)
app.get('/api/users/:participantId/problem-overrides', async (req, res) => {
  try {
    const { participantId } = req.params;
    const problemIds = await db.getProblemOverrides(participantId);

    if (problemIds === null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, problemIds });
  } catch (error) {
    console.error('Error fetching problem overrides:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching problem overrides'
    });
  }
});

// Let a participant open and solve a specific problem regardless of its scheduled
// date (admin "Enable" action in the Problem Configuration page)
app.post('/api/users/:participantId/problem-overrides', async (req, res) => {
  try {
    const { participantId } = req.params;
    const { problemId } = req.body;

    if (problemId === undefined || problemId === null) {
      return res.status(400).json({ success: false, message: 'problemId is required' });
    }

    await db.enableProblemOverride(participantId, problemId);
    res.json({ success: true, participantId, problemId });
  } catch (error) {
    console.error('Error enabling problem override:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(500).json({
      success: false,
      message: 'Error enabling problem override'
    });
  }
});

// Record a generic UI event for a participant (called by the study frontend)
app.post('/api/users/:participantId/events', async (req, res) => {
  try {
    const { participantId } = req.params;
    const { eventName, metadata } = req.body;

    if (!eventName || typeof eventName !== 'string' || !eventName.trim()) {
      return res.status(400).json({ success: false, message: 'eventName is required' });
    }

    await db.logEvent(participantId, eventName.trim(), metadata);
    res.json({ success: true });
  } catch (error) {
    console.error('Error logging event:', error);

    if (error.message === 'User not found') {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(500).json({ success: false, message: 'Error logging event' });
  }
});

// Get a participant's logged events (admin use)
app.get('/api/users/:participantId/events', async (req, res) => {
  try {
    const { participantId } = req.params;
    const events = await db.getUserEvents(participantId);

    if (events === null) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, participantId, events });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ success: false, message: 'Error fetching events' });
  }
});

// Get the full problem availability schedule
// List all problems (id + title), for admin dropdowns
app.get('/api/problems', (req, res) => {
  res.json({ success: true, problems });
});

// Get every participant in a study group with the problem IDs they've completed (admin use)
app.get('/api/groups/:group/progress', async (req, res) => {
  try {
    const { group } = req.params;

    if (group !== 'control' && group !== 'experimental') {
      return res.status(400).json({ success: false, message: 'group must be "control" or "experimental"' });
    }

    const participants = await db.getGroupCompletions(group);
    res.json({ success: true, group, participants });
  } catch (error) {
    console.error('Error fetching group progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching group progress'
    });
  }
});

// Get the admin's own test participants (admin-con / admin-exp), which are excluded from
// /api/groups/:group/progress so they don't skew real study data (admin use)
app.get('/api/admin-test-participants/progress', async (req, res) => {
  try {
    const participants = await db.getAdminTestParticipantsCompletions();
    res.json({ success: true, participants });
  } catch (error) {
    console.error('Error fetching admin test participant progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin test participant progress'
    });
  }
});

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

// Get study-wide settings (e.g. the "enable all problems" testing override)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json({ success: true, allProblemsEnabled: settings.all_problems_enabled });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching settings'
    });
  }
});

// Toggle the "enable all problems" testing override (admin use)
app.post('/api/settings/all-problems-enabled', async (req, res) => {
  try {
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'enabled must be a boolean'
      });
    }

    const settings = await db.setAllProblemsEnabled(enabled);
    res.json({ success: true, allProblemsEnabled: settings.all_problems_enabled });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating settings'
    });
  }
});

// Reset the entire study: clear every participant's completion history and the
// problem schedule, then unlock all problems (admin use, global, irreversible)
app.post('/api/reset-progress', async (req, res) => {
  try {
    const settings = await db.resetAllProgress();
    res.json({ success: true, allProblemsEnabled: settings.all_problems_enabled });
  } catch (error) {
    console.error('Error resetting progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting progress'
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
