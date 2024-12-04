const { getFirestore, collection, doc, setDoc, getDocs, query, where, updateDoc } = require('firebase/firestore');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

const User = {
  create: async (email, name, password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);

      const usersCollection = collection(db, 'users');
      const userDocRef = doc(usersCollection); 
      const id = userDocRef.id;

      await setDoc(userDocRef, {
        id, 
        email,
        name,
        passwordHash,
        isVerified: false,
      });

      console.log('User created with ID:', id);
      return id;
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  updateStatus: async (email, isVerified) => {
    try {
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(userDoc.ref, { isVerified });
        console.log('User verification status updated');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user verification status:', error.message);
      throw error;
    }
  },

  findByEmail: async (email) => {
    try {
      const usersCollection = collection(db, 'users');
      const userQuery = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error finding user:', error.message);
      throw error;
    }
  },

  validatePassword: async (email, password) => {
    try {
      const user = await User.findByEmail(email);
      if (user) {
        const isValid = await bcrypt.compare(password, user.passwordHash);
        return isValid;
      }
      return false;
    } catch (error) {
      console.error('Error validating password:', error.message);
      throw error;
    }
  },
};

module.exports = User;