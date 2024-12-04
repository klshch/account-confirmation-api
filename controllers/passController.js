//reset-password

const { getFirestore, doc, setDoc, getDoc, deleteDoc, query, where, collection, getDocs } = require('firebase/firestore');
const transporter = require('../config/email');
const generateToken = require('../utils/generateToken');
const hashToken = require('../utils/hashToken');
const bcrypt = require('bcryptjs');

const db = getFirestore();

exports.sendPasswordResetLink = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const resetToken = generateToken();
  const hashedToken = hashToken(resetToken);

  try {
    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const tokenRef = doc(db, 'tokens', hashedToken);
    await setDoc(tokenRef, {
      email,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 1 * 60 * 60 * 1000), 
    });

    const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Reset your password by clicking this link: ${resetLink}`,
    });

    res.status(200).json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const token = req.query.token;
  const { newPassword } = req.body;

  if (!token) return res.status(400).json({ message: 'Token is required' });
  if (!newPassword) return res.status(400).json({ message: 'New password is required' });

  const hashedToken = hashToken(token);

  try {
    const tokenRef = doc(db, 'tokens', hashedToken);
    const tokenSnapshot = await getDoc(tokenRef);

    if (!tokenSnapshot.exists()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { email, expires_at } = tokenSnapshot.data();

    if (new Date() > expires_at.toDate()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    const usersCollection = collection(db, 'users');
    const userQuery = query(usersCollection, where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await setDoc(userRef, { passwordHash: hashedPassword }, { merge: true });

    await deleteDoc(tokenRef);

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};