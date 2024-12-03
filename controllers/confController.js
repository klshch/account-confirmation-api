const { getFirestore, doc, setDoc, getDoc, deleteDoc, query, where, collection, getDocs } = require('firebase/firestore');
const transporter = require('../config/email');
const generateToken = require('../utils/generateToken');
const hashToken = require('../utils/hashToken');

const db = getFirestore(); 

exports.sendActivationLink = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  const activationToken = generateToken();
  const hashedToken = hashToken(activationToken);

  try {

    const userRef = doc(db, 'users', email);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
 
      await setDoc(userRef, { email, status: 'inactive' });
    }


    const tokenRef = doc(db, 'tokens', hashedToken);
    await setDoc(tokenRef, {
      email,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // Додаємо 1 день
    });

    const activationLink = `http://localhost:3000/activate-account?token=${activationToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Activate your account',
      text: `Activate your account by clicking this link: ${activationLink}`,
    });

    res.status(200).json({ message: 'Activation link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};

exports.activateAccount = async (req, res) => {
  const { token } = req.query;

  if (!token) return res.status(400).json({ message: 'Token is required' });

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

    const userRef = doc(db, 'users', email);
    await setDoc(userRef, { status: 'active' }, { merge: true });

    await deleteDoc(tokenRef);

    res.status(200).json({ message: 'Account activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
};
