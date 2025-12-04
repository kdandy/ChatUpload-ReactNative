import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { getAvatarColor, getInitials } from '../../utils/helpers';

const Avatar = ({ 
  name, 
  size = 40, 
  imageUrl = null, 
  showOnlineStatus = false,
  isOnline = false,
  style = {},
}) => {
  const backgroundColor = getAvatarColor(name);
  const initials = getInitials(name);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <View style={[
        styles.avatar,
        { 
          width: size, 
          height: size, 
          borderRadius: size / 2,
          backgroundColor: backgroundColor,
        }
      ]}>
        <Text style={[styles.initials, { fontSize: size / 2.5 }]}>
          {initials}
        </Text>
      </View>

      {showOnlineStatus && (
        <View style={[
          styles.onlineIndicator,
          { 
            width: size / 4, 
            height: size / 4,
            borderRadius: size / 8,
            backgroundColor: isOnline ? COLORS.online : COLORS.offline,
          }
        ]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  initials: {
    color: COLORS.surface,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
});

export default Avatar;
