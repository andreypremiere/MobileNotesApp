import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, Button, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
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
  return (
    // Provider — это специальный компонент‑обёртка из createContext, который передаёт данные 
    // в контекст всем дочерним компонентам. 
    <DatabaseProvider>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="ChaptersPage" screenOptions={{ headerShown: false }}>
          <Stack.Screen name='ChaptersPage' component={ChaptersPage} />
          <Stack.Screen name='ChapterPage' component={ChapterPage} />
          {/* <Stack.Screen name="NotesPage" component={NotesPage} />
              <Stack.Screen name="NotePage" component={NotePage} />
              <Stack.Screen name="MapPage" component={MapPage} /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F9FF',
  },
});
