const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');
const router = express.Router();

// Create claim
router.post('/', auth, async (req, res) => {
  const { title, description, type } = req.body;
  console.log('Creating claim:', { title, description, type, user: req.user.id });
  try {
    const claim = new Claim({ title, description, type, user: req.user.id });
    await claim.save();
    console.log('Claim created successfully:', claim._id);
    res.json(claim);
  } catch (err) {
    console.error('Claim creation error:', err);
    res.status(500).send('Server error');
  }
});

// Get claims based on role
router.get('/', auth, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'Administrador') {
      // Admins see all claims
      filter = {};
    } else if (req.user.role === 'Empleado') {
      // Employees see assigned claims
      filter.assignedTo = req.user.id;
    } else {
      // Clients see their own claims
      filter.user = req.user.id;
    }
    const claims = await Claim.find(filter).populate('user', 'name').populate('assignedTo', 'name').sort({ createdAt: -1 });
    res.json(claims);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update status (admin only)
router.put('/:id/status', auth, role(['Administrador']), async (req, res) => {
  const { status } = req.body;
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ msg: 'Claim not found' });
    claim.status = status;
    claim.updatedAt = Date.now();
    await claim.save();
    // Send notification
    const notification = new Notification({
      user: claim.user,
      message: `Your claim status has been updated to ${status}`
    });
    await notification.save();
    res.json(claim);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Assign to employee (admin)
router.put('/:id/assign', auth, role(['Administrador']), async (req, res) => {
  const { assignedTo } = req.body;
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ msg: 'Reclamo no encontrado' });

    // Check daily limit (20 claims per day per employee)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayAssigned = await Claim.countDocuments({
      assignedTo: assignedTo,
      assignedAt: { $gte: today, $lt: tomorrow }
    });

    if (todayAssigned >= 20) {
      return res.status(400).json({ msg: 'El empleado ya tiene 20 reclamos asignados hoy' });
    }

    claim.assignedTo = assignedTo;
    claim.assignedAt = new Date();
    await claim.save();
    res.json(claim);
  } catch (err) {
    res.status(500).send('Error del servidor');
  }
});

// Delete old claims (admin, >1 year)
router.delete('/:id', auth, role(['Administrador']), async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) return res.status(404).json({ msg: 'Claim not found' });
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (claim.createdAt > oneYearAgo) return res.status(400).json({ msg: 'Cannot delete recent claims' });
    await Claim.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Claim deleted' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Add comment to claim
router.post('/:id/comments', auth, async (req, res) => {
  const { text, isInternal } = req.body;
  try {
    const claim = await Claim.findById(req.params.id);
    if (!claim) {
      return res.status(404).json({ msg: 'Claim not found' });
    }

    // Check permissions
    if (req.user.role === 'Cliente' && (!claim.user || claim.user._id.toString() !== req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    if (req.user.role === 'Empleado' && (!claim.assignedTo || claim.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ msg: 'Access denied' });
    }

    if (isInternal && req.user.role === 'Cliente') {
      return res.status(403).json({ msg: 'Clients cannot add internal comments' });
    }

    const newComment = {
      text,
      isInternal: isInternal || false,
      author: req.user.id,
      authorName: req.user.name,
      authorRole: req.user.role,
      createdAt: new Date()
    };

    claim.comments.push(newComment);
    await claim.save();

    res.json(claim.comments);
  } catch (err) {
    console.error('Add comment error:', err);
    res.status(500).send('Server error');
  }
});

// Get old claims (>1 year) for deletion
router.get('/old', auth, role(['Administrador']), async (req, res) => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const oldClaims = await Claim.find({
      createdAt: { $lt: oneYearAgo }
    }).populate('user', 'name email');

    res.json(oldClaims);
  } catch (err) {
    console.error('Get old claims error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;