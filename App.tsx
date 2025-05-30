import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './src/context/AuthContext';
import { LoginPage } from './src/Pages/LoginPage'
import { RegisterPage } from './src/Pages/RegisterPage';
import { HomePage } from './src/Pages/HomePage';
import { NotesPage } from './src/Pages/NotesPage';
import { NotePage } from './src/Pages/NotePage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MapPage } from './src/Pages/MapPage';
import { ChaptersPage } from './src/Pages/ChaptersPage';
import { ChapterPage } from './src/Pages/ChapterPage';




// emulator -avd Medium_Phone_API_36.0
// npx react-native run-android

const Stack = createNativeStackNavigator();


export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentScreen, setCurrentScreen] = useState('home');

  useEffect(() => {
    AsyncStorage.getItem('jwtToken').then(savedToken => {
      if (savedToken) {
        setToken(savedToken);
      }
    });
  }, []);

  useEffect(() => {
    // Сохраняем токен при изменении
    if (token) {
      AsyncStorage.setItem('jwtToken', token);
    } else {
      AsyncStorage.removeItem('jwtToken');
    }
  }, [token]);


  return (
    <AuthContext.Provider value={{ token, setToken }}>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChapterPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name='ChaptersPage' component={ChaptersPage} />
          <Stack.Screen name='ChapterPage' component={ChapterPage} />
          <Stack.Screen name="NotesPage" component={NotesPage} />
          <Stack.Screen name="NotePage" component={NotePage} />
          <Stack.Screen name="MapPage" component={MapPage} />
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="RegisterPage" component={RegisterPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F9FF',
  },
});
