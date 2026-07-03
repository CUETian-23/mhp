const express = require('express');
const router = express.Router();
const mentalHealthController = require('../controllers/mentalHealthController');
const { authenticate } = require('../middleware/authMiddleware');
const { moodRecordValidation, journalEntryValidation, idValidation } = require('../middleware/requestValidator');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply rate limiter to all mental health routes
router.use(apiLimiter);

// Mood routes
router.post('/mood', authenticate, moodRecordValidation, mentalHealthController.createMoodRecord);
router.get('/mood', authenticate, mentalHealthController.getMoodRecords);
router.get('/mood/stats', authenticate, mentalHealthController.getMoodStats);
router.delete('/mood/:id', authenticate, idValidation, mentalHealthController.deleteMoodRecord);

// Journal routes
router.post('/journal', authenticate, journalEntryValidation, mentalHealthController.createJournalEntry);
router.get('/journal', authenticate, mentalHealthController.getJournalEntries);
router.get('/journal/:id', authenticate, idValidation, mentalHealthController.getJournalEntry);
router.put('/journal/:id', authenticate, idValidation, journalEntryValidation, mentalHealthController.updateJournalEntry);
router.delete('/journal/:id', authenticate, idValidation, mentalHealthController.deleteJournalEntry);

module.exports = router;
