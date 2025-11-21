const express = require('express');
const router = express.Router();
const {
  getNearby,
  createMachine,
  getMyMachines,
  getMachineById,
} = require('../controllers/machineController');
const { protect } = require('../middleware/auth');

// Specific routes must come before parameterized routes
router.get('/nearby', getNearby);
router.get('/my/machines', protect, getMyMachines);
router.post('/', protect, createMachine);
// Parameterized route must be last
router.get('/:id', getMachineById);

module.exports = router;

