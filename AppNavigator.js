import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens from src/screens
import SplashScreen from './src/screens/SplashScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Define your screens */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ title: 'Spalsh' }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: 'Signup' }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login '}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
