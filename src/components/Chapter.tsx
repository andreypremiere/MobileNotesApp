import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import { useNavigation } from '@react-navigation/native';
import Edit from '../assets/icons/edit.svg';
import Delete from '../assets/icons/delete.svg'


export function Chapter({ chapter }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('NotesPage', { chapterId: chapter.id })}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{chapter.title}</Text>
        <Text style={styles.subTitle}>{chapter.subTitle}</Text>
      </View>
      <View style={styles.elementsContainer}>
        <TouchableOpacity style={styles.iconWrapper}>
          <Edit />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Delete />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', // Располагаем содержимое в строку
    justifyContent: 'space-between', // Текст слева, иконки справа
    alignItems: 'center', // Выравнивание по вертикали
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: '96%',
    marginVertical: 4, // Добавлен небольшой отступ между элементами
  },
  textContainer: {
    flex: 1, // Текстовый блок занимает доступное пространство
    gap: 4,
  },
  title: {
    textAlign: 'flex-start',       // текст по центру
    fontSize: 16,
    fontWeight: '600',
  },
  sub_title: {
    textAlign: 'flex-start',       // текст по центру
    fontSize: 12,
    fontWeight: '400',
  },
  elementsContainer: {
    flexDirection: 'row', // Иконки в строку
    alignItems: 'center',
    gap: 10, // Расстояние между иконками
  },
  iconWrapper: {
    backgroundColor: '#fff', // Фон для лучшей видимости тени
    borderRadius: 8, // Скругление углов для иконок
    padding: 6, // Внутренний отступ для увеличения области нажатия
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 3, // Радиус размытия тени
    elevation: 2, // Тень для Android
  },

});
