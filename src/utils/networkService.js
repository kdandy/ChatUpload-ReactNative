import NetInfo from '@react-native-community/netinfo';

class NetworkService {
  constructor() {
    this.isConnected = true;
    this.listeners = [];
    this.initialize();
  }

  initialize() {
    // Check initial network status
    NetInfo.fetch().then(state => {
      this.isConnected = state.isConnected;
    });

    // Subscribe to network status changes
    NetInfo.addEventListener(state => {
      this.isConnected = state.isConnected;
      this.notifyListeners(state);
    });
  }

  // Get current network status
  async getNetworkStatus() {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      type: state.type,
      isInternetReachable: state.isInternetReachable,
    };
  }

  // Check if device is online
  isOnline() {
    return this.isConnected;
  }

  // Add network status listener
  addListener(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notify all listeners
  notifyListeners(state) {
    this.listeners.forEach(callback => {
      callback({
        isConnected: state.isConnected,
        type: state.type,
        isInternetReachable: state.isInternetReachable,
      });
    });
  }

  // Remove all listeners
  removeAllListeners() {
    this.listeners = [];
  }
}

export default new NetworkService();
