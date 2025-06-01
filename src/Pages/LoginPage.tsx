import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/Home.svg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loginUser} from '../utils/requests'

export function LoginPage() {
  const { setToken, setNickname } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [chapters, setChapters] = useState([])
  const navigation = useNavigation();

  const handleEnter = async () => {
    const data = await loginUser(userName, password);
    if (data !== undefined) {
      console.log('Вход выполнен', data.access_token)
      setToken(data.access_token)
      console.log('Nickname', data.nickname)
      setNickname(data.nickname)
      navigation.navigate('ChaptersPage')
    }
  }

  return (
    <View style={styles.screen}>
      <View style={styles.frame}>
      <TouchableOpacity style={styles.iconWrapper} onPress={() => {navigation.navigate('ChaptersPage')}}>
        <Logo width={32} height={32} fill=''/>
      </TouchableOpacity>
      <Text style={styles.title}>Вход</Text>
      <TextInput
        style={styles.input}
        placeholder="Никнейм"
        value={userName}
        onChangeText={setUserName}
        placeholderTextColor="#888888"
      />
      <TextInput
        style={styles.input}
        placeholder="Пароль"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888888"
      />
      <TouchableOpacity style={styles.buttonEnter} onPress={() => handleEnter()}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity> 
      <View style={styles.container}>
      <Text style={styles.text}>
        У вас нет аккаунта?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('RegisterPage')}>
          Регистрация
        </Text>
      </Text>
    </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#fff',
  },
  frame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buttonEnter: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    // alignSelf: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, 
    color: 'black'
  },
  buttonText: {
    // color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
  },
  link: {
    textDecorationLine: 'underline',
  },
  iconWrapper: {
    position: 'absolute',
    top: 20,
    left: 20,

    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#fff', // Фон для лучшей видимости тени
    borderRadius: 8, // Скругление углов для иконок
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 3, // Радиус размытия тени
    elevation: 4, // Тень для Android
  }
});
