const { getFirestore, collection, addDoc, getDoc, query, where, deleteDoc } = require('firebase/firestore');
const db = require('../config/db'); // Імпортуємо Firestore

const Token = {
  create: async (email, token) => {
    try {
      const tokensCollection = collection(db, 'tokens'); // Колекція "tokens"
      const docRef = await addDoc(tokensCollection, {
        email,
        token,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 день
      });
      console.log('Token created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating token:', error.message);
      throw error;
    }
  },
  findByToken: async (token) => {
    try {
      const tokensCollection = collection(db, 'tokens');
      const tokenQuery = query(tokensCollection, where('token', '==', token), where('expires_at', '>', new Date().toISOString()));
      const querySnapshot = await getDocs(tokenQuery);
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error('Error finding token:', error.message);
      throw error;
    }
  },
  deleteByToken: async (token) => {
    try {
      const tokensCollection = collection(db, 'tokens');
      const tokenQuery = query(tokensCollection, where('token', '==', token));
      const querySnapshot = await getDocs(tokenQuery);
      if (!querySnapshot.empty) {
        await deleteDoc(querySnapshot.docs[0].ref);
        console.log('Token deleted');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting token:', error.message);
      throw error;
    }
  },
};

module.exports = Token;
