//registration

const { getFirestore, doc, setDoc, getDoc, deleteDoc, query, where, collection, getDocs } = require('firebase/firestore');
const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { name, email, password } = req.body;
  
    const existingUser = await User.findByEmail(email);  
    if (existingUser) {
      return res.status(400).json({ msg: 'The user already exists' });
    }
  
    try {

      const userId = await User.create(email, name, password);
      res.status(201).json({ msg: 'User has been successfully registered', userId });
    } catch (error) {
      res.status(500).json({ msg: 'There was an error during registration', error: error.message });
    }
  };  