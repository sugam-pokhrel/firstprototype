const express = require('express');
const router = express.Router();

// Test route to verify routing works
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'Machine routes are working!' });
});

module.exports = router;

