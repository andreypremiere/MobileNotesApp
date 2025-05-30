import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import { Chapter } from '../components/Chapter';


export function HomePage({ navigation }) {
  const { setToken } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');


  return (
    <View style={styles.screen}>
        <View style={styles.navbar}>
            <Text style={styles.title}>Войдите для синхронизации</Text>
            <TouchableOpacity style={styles.iconWrapper}>
                <Logo width={32} height={32} fill=''/>
            </TouchableOpacity>
            <Text style={styles.status}>{'online'}</Text>
        </View>
        <Text style={styles.title_2}>Разделы</Text>
        <View style={styles.frame}>
            <Chapter value={{title: 'Все записи', sub_title: 'Содержит все записи'}}/>
            <Chapter value={{title: 'Студенты', sub_title: 'Список студентов'}}/>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',       // элементы в строку
    alignItems: 'center',       // по вертикали по центру
    justifyContent: 'center', // максимальное расстояние между текстом и иконкой
    // paddingHorizontal: 16,
    height: 50,                 // или свой размер
    // backgroundColor: '#555',
  },
  title: {
    flex: 1,                   // текст занимает всё доступное место
    textAlign: 'center',       // текст по центру
    fontSize: 12,
    fontWeight: '400',
  },
  title_2: {
    textAlign: 'center',       // текст по центру
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
  },
  frame: {
    // backgroundColor: '#E9F9FF',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 8,
    // paddingHorizontal: 14,
  },
  buttonEnter: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
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
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
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
  status: {
    position: 'absolute',
    left: 10,
    fontSize: 12,
    fontWeight: '600',
  },
  iconWrapper: {
    position: 'absolute',
    right: 0,

    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  }
});
