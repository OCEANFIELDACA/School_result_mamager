import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import StudentListScreen from './src/screens/StudentListScreen';
import ResultEntryScreen from './src/screens/ResultEntryScreen';
import AttendanceScreen from './src/screens/AttendanceScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a237e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen}
          options={{ title: 'OCEANFIELD ACADEMY' }}
        />
        <Stack.Screen 
          name="Students" 
          component={StudentListScreen}
          options={{ title: 'Student Management' }}
        />
        <Stack.Screen 
          name="ResultEntry" 
          component={ResultEntryScreen}
          options={{ title: 'Enter Results' }}
        />
        <Stack.Screen 
          name="Attendance" 
          component={AttendanceScreen}
          options={{ title: 'Attendance' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
