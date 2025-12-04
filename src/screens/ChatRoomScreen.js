import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import ChatBubble from '../components/chat/ChatBubble';
import ChatInput from '../components/chat/ChatInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthService from '../services/authService';
import ChatService from '../services/chatService';
import CloudinaryService from '../services/cloudinaryService';
import StorageService from '../services/storageService';
import NetworkService from '../utils/networkService';
import GeminiService from '../services/geminiService';

const { width, height } = Dimensions.get('window');

const ChatRoomScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const flatListRef = useRef(null);
  const unsubscribeRef = useRef(null);

  useEffect(() => {
    initializeChat();
    setupNetworkListener();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      ChatService.unsubscribeAll();
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Get current user data
      const userData = await StorageService.getUserData();
      setCurrentUser(userData);

      // Subscribe to real-time messages
      const unsubscribe = ChatService.subscribeToMessages((newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      });

      unsubscribeRef.current = unsubscribe;

      // Try to sync offline messages
      if (await NetworkService.isOnline()) {
        await ChatService.syncOfflineMessages();
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
      Alert.alert('Error', 'Gagal memuat pesan');
      setLoading(false);
    }
  };

  const setupNetworkListener = () => {
    NetworkService.addListener((status) => {
      setIsOnline(status.isConnected);
      if (status.isConnected) {
        // Sync offline messages when back online
        ChatService.syncOfflineMessages();
      }
    });
  };

  const handleSendMessage = async (text) => {
    if (!currentUser) return;

    try {
      // Check if this is an AI question
      const isAIQuestion = GeminiService.isAIQuestion(text);
      
      // Send user message
      await ChatService.sendMessage({
        text,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        isAI: false,
      });

      // If it's an AI question, generate AI response
      if (isAIQuestion && GeminiService.isAvailable()) {
        // Show typing indicator (optional)
        setTimeout(async () => {
          try {
            const aiResponse = await GeminiService.generateResponse(text, messages);
            
            if (aiResponse.success) {
              // Send AI response as a message
              await ChatService.sendMessage({
                text: aiResponse.text,
                senderId: 'gemini-ai',
                senderName: 'UNDIPintar',
                isAI: true,
              });
            } else {
              // Send error message
              await ChatService.sendMessage({
                text: aiResponse.text || 'Maaf, terjadi kesalahan.',
                senderId: 'gemini-ai',
                senderName: 'UNDIPintar',
                isAI: true,
              });
            }
          } catch (error) {
            await ChatService.sendMessage({
              text: 'Maaf, saya mengalami kesalahan teknis. Silakan coba lagi.',
              senderId: 'gemini-ai',
              senderName: 'UNDIPintar',
              isAI: true,
            });
          }
        }, 800); // Delay to show natural conversation flow
      } else if (isAIQuestion && !GeminiService.isAvailable()) {
        // AI not available
        setTimeout(async () => {
          await ChatService.sendMessage({
            text: 'Maaf, AI sedang tidak tersedia. Silakan hubungi admin.',
            senderId: 'gemini-ai',
            senderName: 'UNDIPintar',
            isAI: true,
          });
        }, 500);
      }

      // Scroll to bottom after sending
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert(
        'Error',
        'Gagal mengirim pesan. Pesan akan dikirim otomatis saat online.'
      );
    }
  };

  const handleImagePress = async () => {
    Alert.alert(
      'Pilih Gambar',
      'Pilih sumber gambar',
      [
        {
          text: 'Kamera',
          onPress: handleTakePhoto,
        },
        {
          text: 'Galeri',
          onPress: handlePickImage,
        },
        {
          text: 'Batal',
          style: 'cancel',
        },
      ]
    );
  };

  const handlePickImage = async () => {
    try {
      const image = await CloudinaryService.pickImage();
      if (image) {
        await uploadAndSendImage(image.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', error.message || 'Gagal memilih gambar');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const photo = await CloudinaryService.takePhoto();
      if (photo) {
        await uploadAndSendImage(photo.uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', error.message || 'Gagal mengambil foto');
    }
  };

  const uploadAndSendImage = async (imageUri) => {
    if (!currentUser) return;

    setUploadingImage(true);

    try {
      // Upload to Cloudinary
      const result = await CloudinaryService.uploadImage(imageUri);

      // Send message with image
      await ChatService.sendMessage({
        text: '',
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        imageUrl: result.url,
      });

      // Note: AI image analysis disabled - requires base64 conversion
      // To enable: convert image to base64 before sending to Gemini API

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Gagal mengunggah gambar. Coba lagi nanti.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageBubblePress = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Chat History',
      'Are you sure you want to delete all messages? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await ChatService.clearAllMessages();
              if (success) {
                Alert.alert('Success', 'Chat history cleared successfully');
              } else {
                Alert.alert('Error', 'Failed to clear chat history');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to clear chat history');
            }
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            try {
              await AuthService.logout();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'Gagal logout');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item, index }) => {
    const isCurrentUser = item.senderId === currentUser?.uid;
    const previousMessage = index > 0 ? messages[index - 1] : null;
    const showAvatar = !previousMessage || previousMessage.senderId !== item.senderId;

    return (
      <ChatBubble
        message={item}
        isCurrentUser={isCurrentUser}
        showAvatar={showAvatar}
        onImagePress={handleImageBubblePress}
      />
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.headerIconContainer}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/id/9/9b/UNDIPOfficial.png' }}
            style={styles.headerLogoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>UNDIPintar</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isOnline ? COLORS.online : COLORS.offline }
            ]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Connected' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity onPress={handleClearChat} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/id/9/9b/UNDIPOfficial.png' }}
          style={styles.emptyLogoImage}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.emptyStateText}>No messages yet</Text>
      <Text style={styles.emptyStateSubtext}>Start a conversation or ask AI anything!</Text>
    </View>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.messageList,
          messages.length === 0 && styles.messageListEmpty,
        ]}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={false}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
        }}
        onContentSizeChange={() => {
          if (messages.length > 0) {
            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          }
        }}
        onLayout={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      {uploadingImage && (
        <View style={styles.uploadingContainer}>
          <LoadingSpinner size="small" color={COLORS.primary} />
          <Text style={styles.uploadingText}>Uploading image...</Text>
        </View>
      )}

      <ChatInput
        onSend={handleSendMessage}
        onImagePress={handleImagePress}
        loading={uploadingImage}
      />

      {/* Image Preview Modal */}
      <Modal
        visible={selectedImage !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={32} color={COLORS.surface} />
          </TouchableOpacity>
          <Image
            source={{ uri: selectedImage }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding * 1.5,
    paddingVertical: SIZES.padding * 1.2,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 0,
    ...SHADOWS.small,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.padding / 2,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  headerLogoImage: {
    width: 30,
    height: 30,
  },
  headerTitle: {
    marginLeft: SIZES.padding,
  },
  headerTitleText: {
    fontSize: SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  statusText: {
    fontSize: SIZES.xs,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    paddingVertical: SIZES.padding,
    paddingHorizontal: 0,
    flexGrow: 1,
  },
  messageListEmpty: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding * 2,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding * 2,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  emptyLogoImage: {
    width: 80,
    height: 80,
  },
  emptyStateText: {
    fontSize: SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SIZES.padding / 2,
  },
  emptyStateSubtext: {
    fontSize: SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.padding,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  uploadingText: {
    fontSize: SIZES.base,
    color: COLORS.textSecondary,
    marginLeft: SIZES.padding,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: SIZES.padding,
  },
  modalImage: {
    width: width,
    height: height * 0.8,
  },
});

export default ChatRoomScreen;
