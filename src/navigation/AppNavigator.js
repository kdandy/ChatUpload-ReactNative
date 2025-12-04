import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import ChatRoomScreen from '../screens/ChatRoomScreen';
import TestInputScreen from '../screens/TestInputScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="TestInput" component={TestInputScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ChatRoom" component={ChatRoomScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
