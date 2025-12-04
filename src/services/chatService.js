import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  where,
  getDocs,
  limit,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';
import StorageService from './storageService';
import NetInfo from '@react-native-community/netinfo';

class ChatService {
  constructor() {
    this.listeners = [];
    this.isOnline = true;
    this.setupNetworkListener();
  }

  // Setup network status listener
  setupNetworkListener() {
    NetInfo.addEventListener(state => {
      this.isOnline = state.isConnected;
      if (this.isOnline) {
        this.syncOfflineMessages();
      }
    });
  }

  // Send message
  async sendMessage(messageData, retryCount = 0) {
    const { text, senderId, senderName, imageUrl = null, isAI = false } = messageData;

    const message = {
      text,
      senderId,
      senderName,
      imageUrl,
      isAI,
      timestamp: serverTimestamp(),
      createdAt: new Date().toISOString(),
      status: 'sent',
      isRead: false,
    };

    try {
      // Check network status
      if (!this.isOnline) {
        // Save to offline queue
        await StorageService.addOfflineMessage(message);
        // Save to local history
        await StorageService.addMessageToHistory({
          ...message,
          status: 'pending',
        });
        return { ...message, id: Date.now().toString(), status: 'pending' };
      }

      // Send to Firestore
      const docRef = await addDoc(collection(db, 'messages'), message);
      
      // Save to local history
      const savedMessage = { ...message, id: docRef.id };
      await StorageService.addMessageToHistory(savedMessage);

      return savedMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Retry mechanism
      if (retryCount < 3) {
        console.log(`Retrying... Attempt ${retryCount + 1}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.sendMessage(messageData, retryCount + 1);
      }

      // Save to offline queue if all retries fail
      await StorageService.addOfflineMessage(message);
      await StorageService.addMessageToHistory({
        ...message,
        status: 'failed',
      });

      throw error;
    }
  }

  // Sync offline messages
  async syncOfflineMessages() {
    try {
      const offlineMessages = await StorageService.getOfflineMessages();
      
      if (offlineMessages.length === 0) return;

      console.log(`Syncing ${offlineMessages.length} offline messages...`);

      for (const message of offlineMessages) {
        try {
          await addDoc(collection(db, 'messages'), {
            ...message,
            timestamp: serverTimestamp(),
          });
        } catch (error) {
          console.error('Error syncing message:', error);
        }
      }

      // Clear offline messages after successful sync
      await StorageService.clearOfflineMessages();
      console.log('Offline messages synced successfully');
    } catch (error) {
      console.error('Error syncing offline messages:', error);
    }
  }

  // Listen to messages in real-time
  subscribeToMessages(callback) {
    try {
      const q = query(
        collection(db, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(
        q,
        async (snapshot) => {
          const messages = [];
          snapshot.forEach((doc) => {
            messages.push({
              id: doc.id,
              ...doc.data(),
            });
          });

          // Update local history
          await StorageService.saveChatHistory(messages);

          callback(messages);
        },
        (error) => {
          console.error('Error listening to messages:', error);
          // Fallback to local history on error
          this.loadLocalHistory(callback);
        }
      );

      this.listeners.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('Error subscribing to messages:', error);
      // Load from local storage if Firestore fails
      this.loadLocalHistory(callback);
      return () => {};
    }
  }

  // Load local history (offline mode)
  async loadLocalHistory(callback) {
    try {
      const history = await StorageService.getChatHistory();
      callback(history);
    } catch (error) {
      console.error('Error loading local history:', error);
      callback([]);
    }
  }

  // Mark message as read
  async markAsRead(messageId) {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        isRead: true,
        readAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  // Get unread messages count
  async getUnreadCount(userId) {
    try {
      const q = query(
        collection(db, 'messages'),
        where('isRead', '==', false),
        where('senderId', '!=', userId)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Delete message
  async deleteMessage(messageId) {
    try {
      const messageRef = doc(db, 'messages', messageId);
      await updateDoc(messageRef, {
        deleted: true,
        deletedAt: serverTimestamp(),
      });
      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  // Clear all chat history
  async clearAllMessages() {
    try {
      const q = query(collection(db, 'messages'));
      const snapshot = await getDocs(q);
      
      // Use batch delete for better performance
      const batch = writeBatch(db);
      snapshot.docs.forEach((document) => {
        batch.delete(document.ref);
      });
      
      await batch.commit();
      
      // Also clear local storage
      await StorageService.clearChatHistory();
      
      return true;
    } catch (error) {
      console.error('Error clearing messages:', error);
      return false;
    }
  }

  // Unsubscribe from all listeners
  unsubscribeAll() {
    this.listeners.forEach(unsubscribe => unsubscribe());
    this.listeners = [];
  }

  // Get network status
  async getNetworkStatus() {
    const state = await NetInfo.fetch();
    return state.isConnected;
  }
}

export default new ChatService();
