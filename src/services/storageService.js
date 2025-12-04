import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/theme';

class StorageService {
  // Save data securely
  async saveSecure(key, value) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error saving secure data:', error);
      return false;
    }
  }

  // Get secure data
  async getSecure(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting secure data:', error);
      return null;
    }
  }

  // Delete secure data
  async deleteSecure(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error('Error deleting secure data:', error);
      return false;
    }
  }

  // User token management
  async saveUserToken(token) {
    return await this.saveSecure(STORAGE_KEYS.USER_TOKEN, token);
  }

  async getUserToken() {
    return await this.getSecure(STORAGE_KEYS.USER_TOKEN);
  }

  async deleteUserToken() {
    return await this.deleteSecure(STORAGE_KEYS.USER_TOKEN);
  }

  // User data management
  async saveUserData(userData) {
    return await this.saveSecure(STORAGE_KEYS.USER_DATA, userData);
  }

  async getUserData() {
    return await this.getSecure(STORAGE_KEYS.USER_DATA);
  }

  async deleteUserData() {
    return await this.deleteSecure(STORAGE_KEYS.USER_DATA);
  }

  // Chat history management (offline mode) - Use AsyncStorage for large data
  async saveChatHistory(chatHistory) {
    try {
      // Limit history to last 100 messages to prevent size issues
      const limitedHistory = chatHistory.slice(-100);
      await AsyncStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(limitedHistory));
      return true;
    } catch (error) {
      console.error('Error saving chat history:', error);
      return false;
    }
  }

  async getChatHistory() {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEYS.CHAT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting chat history:', error);
      return [];
    }
  }

  async addMessageToHistory(message) {
    const history = await this.getChatHistory();
    history.push(message);
    return await this.saveChatHistory(history);
  }

  async clearChatHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
      return true;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      return false;
    }
  }

  // Offline messages queue - Use AsyncStorage for large data
  async saveOfflineMessages(messages) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_MESSAGES, JSON.stringify(messages));
      return true;
    } catch (error) {
      console.error('Error saving offline messages:', error);
      return false;
    }
  }

  async getOfflineMessages() {
    try {
      const messages = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_MESSAGES);
      return messages ? JSON.parse(messages) : [];
    } catch (error) {
      console.error('Error getting offline messages:', error);
      return [];
    }
  }

  async addOfflineMessage(message) {
    const messages = await this.getOfflineMessages();
    messages.push(message);
    return await this.saveOfflineMessages(messages);
  }

  async clearOfflineMessages() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_MESSAGES);
      return true;
    } catch (error) {
      console.error('Error clearing offline messages:', error);
      return false;
    }
  }

  // Clear chat history only
  async clearChatHistory() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
      await this.clearOfflineMessages();
      return true;
    } catch (error) {
      console.error('Error clearing chat history:', error);
      return false;
    }
  }

  // Clear all data
  async clearAllData() {
    await this.deleteUserToken();
    await this.deleteUserData();
    await this.saveSecure(STORAGE_KEYS.CHAT_HISTORY, []);
    await this.saveSecure(STORAGE_KEYS.OFFLINE_MESSAGES, []);
  }
}

export default new StorageService();
