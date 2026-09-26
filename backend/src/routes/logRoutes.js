const express = require('express');
const router = express.Router();
const {
  toggleLog,
  getLogsForDate,
  getWeeklyGrid,
  getHeatmap,
  getHabitStats,
} = require('../controllers/logController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/toggle', toggleLog);
router.get('/date/:date?', getLogsForDate);
router.get('/grid', getWeeklyGrid);
router.get('/heatmap', getHeatmap);
router.get('/stats', getHabitStats);

module.exports = router;
