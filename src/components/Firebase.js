import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';

// Configure Firebase.
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);
    this.firebase = firebase;
    this.auth = firebase.auth();
    this.db = firebase.firestore();
  }

  login(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async createAccount(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  async signInWithProvider(provider) {
    return this.auth.signInWithPopup(provider);
  }

  async signInAnonymously() {
    return this.auth.signInAnonymously();
  }

  resetPasswordEmail(emailAddress) {
    return this.auth.sendPasswordResetEmail(emailAddress);
  }

  getCurrentUser() {
    return this.isInitialized();
  }

  getGoogleProvider() {
    const newProvider = new this.firebase.auth.GoogleAuthProvider();
    return newProvider;
  }

  async initEmailProfile(name) {
    const user = await this.getCurrentUser();
    try {
      await user.updateProfile({
        displayName: name,
      });
      await this.addUserAccount(user);
      await user.sendEmailVerification();
    } catch (error) {
      console.log(error);
    }
  }

  addUserAccount(user) {
    if (!user) {
      return null;
    }

    return this.db.doc(`users/${user.uid}`).set({
      uid: user.uid,
      email: user.email,
    });
  }

  isInitialized() {
    return new Promise(resolve => {
      this.auth.onAuthStateChanged(resolve);
    });
  }

  getCurrentUserName() {
    return this.auth.currentUser && this.auth.currentUser.userName;
  }
}

export default new Firebase();
