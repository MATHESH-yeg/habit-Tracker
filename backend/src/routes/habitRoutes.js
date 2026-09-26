const express = require('express');
const router = express.Router();
const {
  getHabits,
  getArchivedHabits,
  createHabit,
  updateHabit,
  archiveHabit,
  deleteHabit,
  reorderHabits,
} = require('../controllers/habitController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getHabits)
  .post(createHabit);

router.get('/archived', getArchivedHabits);
router.put('/reorder', reorderHabits);

router.route('/:id')
  .put(updateHabit)
  .delete(deleteHabit);

router.patch('/:id/archive', archiveHabit);

module.exports = router;
