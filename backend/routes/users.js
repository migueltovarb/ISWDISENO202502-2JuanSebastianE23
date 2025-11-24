const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/', auth, role(['Administrador']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get user details
router.get('/:id', auth, role(['Administrador']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update user status
router.put('/:id', auth, role(['Administrador']), async (req, res) => {
  const { isActive } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    user.isActive = isActive;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;