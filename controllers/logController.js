//login

const { getFirestore, doc, setDoc, getDoc, deleteDoc, query, where, collection, getDocs } = require('firebase/firestore');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const isPasswordValid = await User.validatePassword(email, password);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ msg: 'Please verify your email before logging in' });
    }

    res.status(200).json({ msg: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error.message);
    res.status(500).json({ msg: 'Internal server error', error: error.message });
  }
};
