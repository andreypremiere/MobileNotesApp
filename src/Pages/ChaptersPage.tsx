import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Logo from '../assets/icons/account.svg';
import { Chapter } from '../components/Chapter';
import Plus from '../assets/icons/Plus.svg';
import Logout from '../assets/icons/exit.svg'
import Calendar from '../assets/icons/Calendar.svg'
import Settings from '../assets/icons/settings-svgrepo-com 1.svg'
import Filter from '../assets/icons/Filters.svg'
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSections } from '../utils/requests';
import { syncActions } from '../utils/syncUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export function ChaptersPage() {
  // Локальное состояние: список разделов (chapters)
  const [chapters, setChapters] = useState([])
  // Хук навигации для перехода между страницами
  const navigation = useNavigation();
  // Получаем объект базы данных из контекста
  const db = useDatabase();
  const [text, setText] = useState('');
  const [active, setActive] = useState('tasks'); // "all" | "tasks" | "subtasks"

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (db) {
          try {
            const data = await SectionRepository.getAll(db);
            setChapters(data);
            console.log('Получены категории через SQLite:', data);
          } catch (error) {
            console.error('Ошибка при получении данных:', error);
          }
        }
      }

      fetchData();

      return () => {
        // cleanup при уходе с экрана (необязательно)
      };
    }, [db])
  );

  const handleCreateSection = () => {
    navigation.navigate('ChapterPage', {
      chapter: null,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        {/* Первая панель */}
        <View style={styles.navbar}>
          <View style={styles.container}>
            <TextInput
              style={styles.input}
              placeholder="Поиск"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
            />
          </View>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => { }}>
            <Calendar width={30} height={30} fill='' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => { }}>
            <Settings width={32} height={32} fill='' />
          </TouchableOpacity>
        </View>
        {/* Вторая панель панель */}
        <View style={styles.navbar2}>
          <TouchableOpacity style={styles.iconWrapper} onPress={() => {}}>
            <Filter width={30} height={30} fill=''/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconPlus} onPress={() => navigation.navigate('ChapterPage', {chapter: null})}>
            <Plus />
          </TouchableOpacity>
          <View style={styles.containerButtons}>
      {['tasks', 'all', 'subtasks'].map((key) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.button,
            active === key && styles.activeButton, // применяем стиль активной
          ]}
          onPress={() => setActive(key)}
        >
          <Text
            style={[
              styles.text,
              active === key && styles.activeText, // цвет текста для активной
            ]}
          >
            {key === 'all' ? 'Все' : key === 'tasks' ? 'Задачи' : 'Подзадачи'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
        </View>
        {/* Задачи */}
        <ScrollView contentContainerStyle={styles.frame}>
          {chapters.map((obj) => (
            <Chapter
              key={obj.id}
              chapter={obj}
              setChapters={setChapters}
              chapters={chapters}
            // handleUpdateChapter={addSection}
            />
          ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',          // ширина поля (можно фиксированную, например 300)
    height: 40,            // высота поля
    paddingHorizontal: 12, // внутренний отступ слева/справа
    paddingVertical: 8,    // внутренний отступ сверху/снизу
    borderWidth: 1,        // толщина рамки
    borderColor: '#ccc',   // цвет рамки
    borderRadius: 10,      // скругление углов
    fontSize: 16,          // размер текста
    backgroundColor: 'transparent', // фон поля
  },
  container: {
    paddingHorizontal: 10,
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    paddingRight: 2
  },
  navbar2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
    // paddingHorizontal: 12,
    // paddingRight: 2,

  },
  title: {
    fontSize: 12,
    fontWeight: '400',
  },
  title_2: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 6
  },
  frame: {
    gap: 1,
    alignItems: 'center'
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
  },
  iconWrapper: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapperLeft: {
    position: 'absolute',
    left: 0,

    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlus: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#fff', // Фон для лучшей видимости тени
    borderRadius: 8, // Скругление углов для иконок
    padding: 6, // Внутренний отступ для увеличения области нажатия
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 3, // Радиус размытия тени
    elevation: 4, // Тень для Android
  },
  containerButtons: {
    flexDirection: 'row', // кнопки в строку
    justifyContent: 'space-around',
    // marginVertical: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4, // тень для Android
  },
  text: {
    fontSize: 14,
    color: '#2c2c2cff',
  },
  activeText: {
    fontWeight: '600',
    color: '#000000ff',
  },
});
