import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import your screens from src/screens
import SplashScreen from './src/screens/SplashScreen';
import SignupScreen from './src/screens/SignupScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import SpeedAlert from './src/screens/SpeedAlert';

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
          <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title : 'Home'}}
          />
          <Stack.Screen
          name="SpeedAlert"
          component={SpeedAlert}
          options={{ title: 'SpeedAlert'}}
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
