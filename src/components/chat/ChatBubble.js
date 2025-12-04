import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { formatTime } from '../../utils/helpers';
import Avatar from '../common/Avatar';

const ChatBubble = ({ 
  message, 
  isCurrentUser, 
  showAvatar = true,
  onImagePress = null,
}) => {
  const { text, imageUrl, timestamp, senderName, status, isAI } = message;

  const renderStatus = () => {
    if (!isCurrentUser) return null;

    let iconName = 'checkmark';
    let iconColor = COLORS.textLight;

    if (status === 'sent' || status === 'delivered') {
      iconName = 'checkmark-done';
      iconColor = COLORS.textLight;
    } else if (status === 'read') {
      iconName = 'checkmark-done';
      iconColor = COLORS.primary;
    } else if (status === 'pending') {
      iconName = 'time-outline';
      iconColor = COLORS.warning;
    } else if (status === 'failed') {
      iconName = 'alert-circle-outline';
      iconColor = COLORS.error;
    }

    return (
      <Ionicons 
        name={iconName} 
        size={14} 
        color={iconColor} 
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View style={[
      styles.container,
      isCurrentUser ? styles.containerRight : styles.containerLeft,
    ]}>
      {!isCurrentUser && showAvatar && !isAI && (
        <Avatar name={senderName} size={32} style={styles.avatar} />
      )}
      
      {isAI && showAvatar && (
        <View style={styles.aiAvatarContainer}>
          <Image 
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/id/9/9b/UNDIPOfficial.png' }}
            style={styles.aiAvatarImage}
            resizeMode="contain"
          />
        </View>
      )}

      <View style={[
        styles.bubble,
        isCurrentUser ? styles.bubbleSent : styles.bubbleReceived,
        isAI && styles.bubbleAI,
        !showAvatar && !isCurrentUser && !isAI && styles.bubbleNoAvatar,
      ]}>
        {!isCurrentUser && (
          <Text style={[styles.senderName, isAI && styles.senderNameAI]}>
            {senderName}
          </Text>
        )}

        {imageUrl && (
          <TouchableOpacity 
            onPress={() => onImagePress && onImagePress(imageUrl)}
            activeOpacity={0.9}
          >
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}

        {text && (
          <Text style={[
            styles.text,
            isCurrentUser ? styles.textSent : styles.textReceived,
          ]}>
            {text}
          </Text>
        )}

        <View style={styles.footer}>
          <Text style={[
            styles.timestamp,
            isCurrentUser ? styles.timestampSent : styles.timestampReceived,
          ]}>
            {formatTime(timestamp)}
          </Text>
          {renderStatus()}
        </View>
      </View>

      {isCurrentUser && showAvatar && (
        <View style={styles.avatarPlaceholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: SIZES.padding,
  },
  containerLeft: {
    justifyContent: 'flex-start',
  },
  containerRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    marginRight: SIZES.padding / 2,
    alignSelf: 'flex-end',
    marginBottom: 2,
  },
  aiAvatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.padding / 2,
    alignSelf: 'flex-end',
    marginBottom: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  aiAvatarImage: {
    width: 24,
    height: 24,
  },
  avatarPlaceholder: {
    width: 32,
    marginLeft: SIZES.padding / 2,
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: SIZES.padding * 1.2,
    paddingVertical: SIZES.padding * 0.8,
    ...SHADOWS.small,
  },
  bubbleSent: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  bubbleReceived: {
    backgroundColor: COLORS.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  bubbleAI: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderBottomLeftRadius: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    maxWidth: '85%',
  },
  bubbleNoAvatar: {
    marginLeft: 40,
  },
  senderName: {
    fontSize: SIZES.xs,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  senderNameAI: {
    color: '#8B5CF6',
    fontSize: SIZES.sm,
    textTransform: 'none',
    letterSpacing: 0,
  },
  text: {
    fontSize: SIZES.md,
    lineHeight: 22,
  },
  textSent: {
    color: COLORS.surface,
  },
  textReceived: {
    color: COLORS.text,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 6,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 10,
    marginRight: 4,
    fontWeight: '500',
  },
  timestampSent: {
    color: COLORS.surface,
    opacity: 0.75,
  },
  timestampReceived: {
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
  statusIcon: {
    marginLeft: 2,
  },
});

export default ChatBubble;
