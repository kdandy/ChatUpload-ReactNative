import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import StorageService from './storageService';

class AuthService {
  constructor() {
    this.currentUser = null;
    this.authStateListener = null;
  }

  // Generate token (using Firebase UID as token)
  async generateToken(user) {
    try {
      const token = await user.getIdToken();
      await StorageService.saveUserToken(token);
      return token;
    } catch (error) {
      console.error('Error generating token:', error);
      throw error;
    }
  }

  // Register with username and password
  async register(username, password, displayName) {
    try {
      // Create email from username (for Firebase Auth)
      const email = `${username.toLowerCase().replace(/\s/g, '')}@chatapp.local`;
      
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with display name
      await updateProfile(user, {
        displayName: displayName || username,
      });

      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        username: username,
        displayName: displayName || username,
        email: email,
        createdAt: serverTimestamp(),
        isOnline: true,
        lastSeen: serverTimestamp(),
      });

      // Generate and save token
      const token = await this.generateToken(user);

      // Save user data locally
      const userData = {
        uid: user.uid,
        username: username,
        displayName: displayName || username,
        email: email,
      };
      await StorageService.saveUserData(userData);

      return { user: userData, token };
    } catch (error) {
      console.error('Registration error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Login with username and password
  async login(username, password) {
    try {
      // Convert username to email format
      const email = `${username.toLowerCase().replace(/\s/g, '')}@chatapp.local`;
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user online status
      await setDoc(doc(db, 'users', user.uid), {
        isOnline: true,
        lastSeen: serverTimestamp(),
      }, { merge: true });

      // Generate and save token
      const token = await this.generateToken(user);

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      // Save user data locally
      await StorageService.saveUserData(userData);

      return { user: userData, token };
    } catch (error) {
      console.error('Login error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Auto login with saved token
  async autoLogin() {
    try {
      const token = await StorageService.getUserToken();
      const userData = await StorageService.getUserData();

      if (!token || !userData) {
        return null;
      }

      // Verify token is still valid
      const user = auth.currentUser;
      if (user) {
        // Update online status
        await setDoc(doc(db, 'users', user.uid), {
          isOnline: true,
          lastSeen: serverTimestamp(),
        }, { merge: true });

        return { user: userData, token };
      }

      return null;
    } catch (error) {
      console.error('Auto login error:', error);
      return null;
    }
  }

  // Logout
  async logout() {
    try {
      const user = auth.currentUser;
      
      if (user) {
        // Update user online status
        await setDoc(doc(db, 'users', user.uid), {
          isOnline: false,
          lastSeen: serverTimestamp(),
        }, { merge: true });
      }

      // Sign out from Firebase
      await signOut(auth);

      // Clear local storage
      await StorageService.clearAllData();

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  onAuthStateChange(callback) {
    this.authStateListener = onAuthStateChanged(auth, callback);
    return this.authStateListener;
  }

  // Unsubscribe from auth state changes
  unsubscribeAuthState() {
    if (this.authStateListener) {
      this.authStateListener();
    }
  }

  // Handle auth errors
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Username sudah digunakan');
      case 'auth/invalid-email':
        return new Error('Username tidak valid');
      case 'auth/weak-password':
        return new Error('Password terlalu lemah (minimal 6 karakter)');
      case 'auth/user-not-found':
        return new Error('Username tidak ditemukan');
      case 'auth/wrong-password':
        return new Error('Password salah');
      case 'auth/too-many-requests':
        return new Error('Terlalu banyak percobaan. Coba lagi nanti');
      case 'auth/network-request-failed':
        return new Error('Koneksi internet bermasalah');
      default:
        return new Error(error.message || 'Terjadi kesalahan');
    }
  }
}

export default new AuthService();
