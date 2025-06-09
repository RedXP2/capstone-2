import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Config values would go here in production
  apiKey: "test-api-key",
  authDomain: "test-auth-domain",
  projectId: "test-project-id",
  storageBucket: "test-storage-bucket",
  messagingSenderId: "test-messaging-sender-id",
  appId: "test-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
