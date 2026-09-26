const express = require('express');
const router = express.Router();
const {
  getMorningMotivation,
  generateWeeklyReport,
  generateHabitSuggestions,
  getStreakRecoveryPlan,
  chatHabitAnalysis,
} = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/morning-motivation', getMorningMotivation);
router.post('/weekly-report', generateWeeklyReport);
router.post('/suggestions', generateHabitSuggestions);
router.post('/streak-recovery', getStreakRecoveryPlan);
router.post('/chat', chatHabitAnalysis);

module.exports = router;
