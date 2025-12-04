import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const firebaseConfig = {
  apiKey: process.env.PUBLIC_FIREBASE_API_KEY || Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: process.env.PUBLIC_FIREBASE_AUTH_DOMAIN || Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: process.env.PUBLIC_FIREBASE_PROJECT_ID || Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: process.env.PUBLIC_FIREBASE_STORAGE_BUCKET || Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: process.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: process.env.PUBLIC_FIREBASE_APP_ID || Constants.expoConfig?.extra?.firebaseAppId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export default app;
