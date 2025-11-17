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
import { WidgetUniversal } from '../components/WidgetUniversal';
import CloseIcon from '../assets/icons/Close.svg';

export function ChaptersPage() {
  // Локальное состояние: список разделов (chapters)
  const [chapters, setChapters] = useState([])
  // Хук навигации для перехода между страницами
  const navigation = useNavigation();
  // Получаем объект базы данных из контекста
  const db = useDatabase();
  const [text, setText] = useState('');
  const [active, setActive] = useState('all'); // "all" | "tasks" | "subtasks"

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (db) {
          try {
            const data = await SectionRepository.getFlatList(db);
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


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.screen}>
        {/* Первая панель */}
        <View style={styles.navbar}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              placeholder="Поиск"
              placeholderTextColor="#888"
              value={text}
              onChangeText={setText}
            />
            {text.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setText('');
                  Keyboard.dismiss(); // убираем фокус
                }}
              >
                <CloseIcon width={20} height={20} fill="#888" />
              </TouchableOpacity>
            )}
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
          <TouchableOpacity style={styles.iconWrapper} onPress={() => { }}>
            <Filter width={30} height={30} fill='' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconPlus} onPress={() => navigation.navigate('ChapterPage', { chapter: null })}>
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
          {chapters
            // фильтрация по режиму
            .filter(obj => {
              if (active === 'tasks') return obj.type === 'task';
              if (active === 'subtasks') return obj.type === 'subtask';
              return true; // для режима "all" показываем всё
            })
            // фильтрация по поиску
            .filter(obj => {
              if (!text.trim()) return true; // если строка поиска пустая — показываем всё
              const query = text.toLowerCase();
              const title = (obj.title || '').toLowerCase();
              const desc = (obj.description || '').toLowerCase();
              return title.includes(query) || desc.includes(query);
            })
            // рендер
            .map((obj) => (
              <WidgetUniversal
                key={obj.id}
                chapter={obj}
                setChapters={setChapters}
                chapters={chapters}
              />
            ))}
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
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
    paddingRight: 2,
    paddingLeft: 6,
  },
  navbar2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 50,
  },
  frame: {
    gap: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlus: {
    position: 'absolute',
    right: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    elevation: 4,
  },
  text: {
    fontSize: 14,
    color: '#2c2c2cff',
  },
  activeText: {
    fontWeight: '600',
    color: '#000000ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 8,
    flex: 1,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 6,
  },
});
