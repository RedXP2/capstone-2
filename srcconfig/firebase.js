import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9ZjvO-LMM4xKtjZBVgPI7htjybXcX37U",
  authDomain: "muscle-recovery-app.firebaseapp.com",
  projectId: "muscle-recovery-app",
  storageBucket: "muscle-recovery-app.appspot.com",
  messagingSenderId: "403902209599",
  appId: "1:403902209599:android:778d72f03a1f851e99228a"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

export { firebase, auth, db };