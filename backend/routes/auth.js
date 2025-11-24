const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('Register attempt:', { name, email, password: '***' });
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format');
      return res.status(400).json({ msg: 'Formato de correo inválido' });
    }

    // Validate password
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      console.log('Invalid password');
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres con letras y números' });
    }

    // Determine role based on email domain
    let role = 'Cliente';
    if (email.endsWith('@empleado.com')) {
      role = 'Empleado';
    }

    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists');
      return res.status(400).json({ msg: 'El usuario ya existe' });
    }
    console.log('Creating new user with role:', role);
    user = new User({ name, email, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    console.log('Saving user');
    await user.save();
    console.log('User saved successfully');
    const payload = { user: { id: user.id, role: user.role, name: user.name, email: user.email } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Error del servidor');
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password: '***' });
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user ? { id: user._id, email: user.email, role: user.role } : 'No user found');
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
    const payload = { user: { id: user.id, role: user.role, name: user.name, email: user.email } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      console.log('Login successful for user:', user.email, 'role:', user.role);
      res.json({ token, role: user.role });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
});

// Password recovery
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'No user found with this email' });
    }

    // Generate reset token (simple implementation)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } // 15 minutes
    );

    // In a real application, you would send this via email
    // For now, we'll return it in the response for testing
    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    // Log the reset link (in production, send via email)
    console.log(`Password reset link for ${email}: ${resetLink}`);

    // Here you would integrate with nodemailer to send the email
    // const nodemailer = require('nodemailer');
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({...});

    res.json({
      msg: 'Password reset link sent to your email',
      resetLink: resetLink // Remove this in production
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).send('Server error');
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.type !== 'password_reset') {
      return res.status(400).json({ msg: 'Invalid token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Validate new password
    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/\d/.test(newPassword)) {
      return res.status(400).json({ msg: 'La contraseña debe tener al menos 8 caracteres con letras y números' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // Log the reset
    console.log(`Password reset for user ${user.email} at ${new Date().toISOString()}`);

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(400).json({ msg: 'Reset link has expired' });
    }
    console.error('Reset password error:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;