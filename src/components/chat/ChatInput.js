import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';

const ChatInput = ({ 
  onSend, 
  onImagePress,
  placeholder = 'Type a message...',
  loading = false,
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      await onSend(message.trim());
      setMessage('');
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim pesan');
    } finally {
      setIsSending(false);
    }
  };

  const handleImagePress = async () => {
    if (isSending) return;
    
    try {
      await onImagePress();
    } catch (error) {
      Alert.alert('Error', 'Gagal memilih gambar');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={handleImagePress}
          disabled={isSending}
        >
          <Ionicons 
            name="image-outline" 
            size={24} 
            color={isSending ? COLORS.textLight : COLORS.primary} 
          />
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          multiline
          maxLength={1000}
          editable={!isSending}
        />

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!message.trim() || isSending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color={COLORS.surface} />
          ) : (
            <Ionicons 
              name="send" 
              size={20} 
              color={COLORS.surface} 
            />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding * 0.8,
    backgroundColor: COLORS.surface,
    borderTopWidth: 0,
    ...SHADOWS.small,
  },
  imageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding / 2,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: SIZES.padding * 1.2,
    paddingVertical: SIZES.padding * 0.7,
    fontSize: SIZES.md,
    color: COLORS.text,
    borderWidth: 0,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.padding / 2,
    ...SHADOWS.small,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textLight,
    opacity: 0.5,
  },
});

export default ChatInput;
