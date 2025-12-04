import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants/theme';

const TestInputScreen = ({ navigation }) => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Test Input Screen</Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => {
            Alert.alert('Test', 'Button works! Now try input.');
          }}
        >
          <Text style={styles.buttonText}>Test Touch Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Go to Login Screen</Text>
        </TouchableOpacity>
        
        {/* Simple TextInput - test if basic input works */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Simple Input (Raw):</Text>
          <TextInput
            style={[styles.input, focused && styles.inputFocused]}
            value={text1}
            onChangeText={(text) => {
              console.log('Input 1 changed:', text);
              setText1(text);
            }}
            onFocus={() => {
              console.log('Input 1 focused');
              setFocused(true);
            }}
            onBlur={() => {
              console.log('Input 1 blurred');
              setFocused(false);
            }}
            placeholder="Type here to test..."
            placeholderTextColor={COLORS.textLight}
            autoFocus={false}
          />
          <Text style={styles.debug}>Value: "{text1}" (Length: {text1.length})</Text>
          <Text style={styles.debug}>Focused: {focused ? 'YES' : 'NO'}</Text>
        </View>

        {/* Second input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Second Input:</Text>
          <TextInput
            style={styles.input}
            value={text2}
            onChangeText={(text) => {
              console.log('Input 2 changed:', text);
              setText2(text);
            }}
            placeholder="Another test..."
            placeholderTextColor={COLORS.textLight}
            keyboardType="default"
            returnKeyType="done"
          />
          <Text style={styles.debug}>Value: "{text2}"</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SIZES.padding * 2,
  },
  title: {
    fontSize: SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.padding * 2,
    textAlign: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.padding,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.surface,
    fontSize: SIZES.base,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: SIZES.padding * 2,
  },
  label: {
    fontSize: SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SIZES.padding / 2,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radius,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    fontSize: SIZES.md,
    color: COLORS.text,
    minHeight: 50,
  },
  inputFocused: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  debug: {
    fontSize: SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SIZES.padding / 2,
  },
});

export default TestInputScreen;
