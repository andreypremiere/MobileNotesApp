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
import { DatabaseProvider } from './src/context/databaseContext'

// npx react-native run-android

// создаёт объект навигатора для приложения на React Native
// управляет переходами между экранами (navigation stack)
const Stack = createNativeStackNavigator();


export default function App() {
  const [token, setToken] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  // состояние статуса загрузки данных
  const [isLoading, setIsLoading] = useState(false)

  // пытается получить токен и nickname из локального хранилища
  // asyncstorage лучше заменить на securestorage
  // если успешно, то устанавливает эти значения и меняет статус isLoading
  useEffect(() => {
    const loadData = async () => {
      const savedToken = await AsyncStorage.getItem('jwtToken');
      const savedNickname = await AsyncStorage.getItem('nickname');
      if (savedToken) setToken(savedToken);
      if (savedNickname) setNickname(savedNickname);
      console.log('Token', savedToken)
      setIsLoading(true); // <--- Загрузка завершена
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      // Provider — это специальный компонент‑обёртка из createContext, который передаёт данные 
      // в контекст всем дочерним компонентам. 
      <AuthContext.Provider value={{ token, setToken, nickname, setNickname }}>
        <DatabaseProvider>
          <StatusBar barStyle="light-content" />
          <NavigationContainer>
            <Stack.Navigator initialRouteName="ChaptersPage" screenOptions={{ headerShown: false }}>
              <Stack.Screen name='ChaptersPage' component={ChaptersPage} />
              <Stack.Screen name='ChapterPage' component={ChapterPage} />
              <Stack.Screen name="NotesPage" component={NotesPage} />
              <Stack.Screen name="NotePage" component={NotePage} />
              <Stack.Screen name="MapPage" component={MapPage} />
              <Stack.Screen name="LoginPage" component={LoginPage} />
              <Stack.Screen name="RegisterPage" component={RegisterPage} />
            </Stack.Navigator>
          </NavigationContainer>
        </DatabaseProvider>

      </AuthContext.Provider>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F9FF',
  },
});
