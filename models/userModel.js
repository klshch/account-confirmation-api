const { getFirestore, collection, addDoc, getDoc, query, where, updateDoc, doc } = require('firebase/firestore');
const db = require('../config/db'); // Імпортуємо Firestore

const User = {
  create: async (email) => {
    try {
      const usersCollection = collection(db, 'users'); 
      const docRef = await addDoc(usersCollection, {
        email,
        isVerified: false, 
      });
      console.log('User created with ID:', docRef.id);
      return docRef.id;
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
};

module.exports = User;