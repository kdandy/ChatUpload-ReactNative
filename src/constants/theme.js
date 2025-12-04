export const COLORS = {
  primary: '#4A90E2',
  primaryDark: '#2E5C8A',
  primaryLight: '#7AB8F5',
  secondary: '#50C878',
  accent: '#FF6B6B',
  
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  textLight: '#BDC3C7',
  
  border: '#E1E8ED',
  divider: '#ECF0F1',
  
  success: '#27AE60',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  
  chatBubbleSent: '#4A90E2',
  chatBubbleReceived: '#ECF0F1',
  chatTextSent: '#FFFFFF',
  chatTextReceived: '#2C3E50',
  
  online: '#27AE60',
  offline: '#95A5A6',
  
  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const SIZES = {
  // Font sizes
  xs: 10,
  sm: 12,
  base: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  
  // Spacing
  padding: 16,
  margin: 16,
  radius: 8,
  radiusLarge: 16,
  
  // Component sizes
  buttonHeight: 48,
  inputHeight: 50,
  iconSize: 24,
  avatarSize: 40,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
};

export const STORAGE_KEYS = {
  USER_TOKEN: 'chat_user_token',
  USER_DATA: 'chat_user_data',
  CHAT_HISTORY: 'chat_history',
  OFFLINE_MESSAGES: 'offline_messages',
};

export const API_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  REQUEST_TIMEOUT: 30000,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
};

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.CLOUDINARY_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  uploadPreset: 'ml_default', // Default unsigned preset
};

export const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY,
  projectName: process.env.GEMINI_PROJECT_NAME,
  projectNumber: process.env.GEMINI_PROJECT_NUMBER,
};
