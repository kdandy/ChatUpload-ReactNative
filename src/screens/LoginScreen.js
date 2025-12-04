import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import Button from '../components/common/Button';
import SimpleInput from '../components/common/SimpleInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AuthService from '../services/authService';
import { validateUsername, validatePassword } from '../utils/helpers';

const LoginScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Errors
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [displayNameError, setDisplayNameError] = useState('');

  useEffect(() => {
    // Disable auto-login for debugging
    // checkAutoLogin();
    setLoading(false);
  }, []);

  const checkAutoLogin = async () => {
    try {
      const result = await AuthService.autoLogin();
      if (result) {
        navigation.replace('ChatRoom');
      }
    } catch (error) {
      console.error('Auto login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;

    // Validate username
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      setUsernameError(usernameValidation.message);
      isValid = false;
    } else {
      setUsernameError('');
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.message);
      isValid = false;
    } else {
      setPasswordError('');
    }

    // Validate display name (only for register)
    if (!isLogin) {
      if (!displayName.trim()) {
        setDisplayNameError('Nama lengkap tidak boleh kosong');
        isValid = false;
      } else if (displayName.trim().length < 3) {
        setDisplayNameError('Nama lengkap minimal 3 karakter');
        isValid = false;
      } else {
        setDisplayNameError('');
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setFormLoading(true);

    try {
      if (isLogin) {
        await AuthService.login(username, password);
        navigation.replace('ChatRoom');
      } else {
        await AuthService.register(username, password, displayName);
        Alert.alert(
          'Berhasil!',
          'Akun berhasil dibuat. Silakan login.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsLogin(true);
                setDisplayName('');
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsernameError('');
    setPasswordError('');
    setDisplayNameError('');
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark || '#0066cc', COLORS.background]}
      style={styles.gradient}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/id/9/9b/UNDIPOfficial.png' }}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>UNDIPintar</Text>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome back!' : 'Create your account'}
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.form}>
              {!isLogin && (
                <SimpleInput
                  label="Nama Lengkap"
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Masukkan nama lengkap"
                  error={displayNameError}
                />
              )}

              <SimpleInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Masukkan username"
                error={usernameError}
              />

              <SimpleInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Masukkan password"
                error={passwordError}
                secureTextEntry
              />

              <Button
                title={isLogin ? 'Sign In' : 'Sign Up'}
                onPress={handleSubmit}
                loading={formLoading}
                fullWidth
                style={styles.submitButton}
              />

              {/* Toggle Mode */}
              <View style={styles.toggleContainer}>
                <Text style={styles.toggleText}>
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}
                </Text>
                <TouchableOpacity onPress={toggleMode}>
                  <Text style={styles.toggleButton}>
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="sparkles" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.featureText}>AI-Powered Chat</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="flash" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.featureText}>Real-time</Text>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.featureText}>Secure</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.padding * 2,
    paddingVertical: SIZES.padding * 2,
  },
  header: {
    alignItems: 'center',
    marginBottom: SIZES.padding * 3,
    marginTop: SIZES.padding * 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding * 1.5,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.surface,
    marginBottom: SIZES.padding / 2,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: SIZES.md,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: SIZES.padding * 2,
    ...SHADOWS.large,
    marginBottom: SIZES.padding * 2,
  },
  form: {
    gap: SIZES.padding,
  },
  submitButton: {
    marginTop: SIZES.padding,
    borderRadius: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.padding * 1.5,
  },
  toggleText: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginRight: SIZES.padding / 2,
  },
  toggleButton: {
    fontSize: SIZES.sm,
    color: COLORS.primary,
    fontWeight: '700',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 'auto',
    paddingTop: SIZES.padding * 2,
    paddingBottom: SIZES.padding,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding / 2,
  },
  featureText: {
    fontSize: SIZES.xs,
    color: COLORS.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default LoginScreen;
