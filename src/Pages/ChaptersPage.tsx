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
  const [filterActive, setFilterActive] = useState(false); // состояние панели
  // новые состояния для фильтров
  // новые состояния для фильтров
  const [sortBy, setSortBy] = useState<'deadline' | 'difficulty' | 'priority'>('deadline');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc'); // asc = по возрастанию


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
          <TouchableOpacity
            style={filterActive ? styles.iconFilterActive : styles.iconFilter}
            onPress={() => setFilterActive(!filterActive)}
          >
            <Filter width={30} height={30} />
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

        {/* Панель фильтра */}
        {filterActive && (
          <View style={styles.filterPanel}>
            <Text style={styles.filterTitle}>Сортировать по</Text>
            <View style={styles.containerButtons}>
              {['deadline', 'difficulty', 'priority'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.button,
                    sortBy === key && styles.activeButton,
                  ]}
                  onPress={() => setSortBy(key)}
                >
                  <Text
                    style={[
                      styles.text,
                      sortBy === key && styles.activeText,
                    ]}
                  >
                    {key === 'deadline'
                      ? 'Дедлайну'
                      : key === 'difficulty'
                        ? 'Сложности'
                        : 'Приоритету'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.filterTitle}>Порядок</Text>
            <View style={styles.containerButtons}>
              {['asc', 'desc'].map((key) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.button,
                    order === key && styles.activeButton,
                  ]}
                  onPress={() => setOrder(key)}
                >
                  <Text
                    style={[
                      styles.text,
                      order === key && styles.activeText,
                    ]}
                  >
                    {key === 'asc' ? 'Возрастание' : 'Убывание'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.button, { marginTop: 20, backgroundColor: '#eee', alignSelf: 'flex-start' }]}
              onPress={() => {
                setSortBy('deadline');
                setOrder('asc');
              }}
            >
              <Text style={styles.text}>Сбросить фильтры</Text>
            </TouchableOpacity>
          </View>
        )}

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
            // сортировка
            .sort((a, b) => {
              let aVal: any;
              let bVal: any;

              if (sortBy === 'deadline') {
                aVal = a.datetime ? new Date(a.datetime).getTime() : null;
                bVal = b.datetime ? new Date(b.datetime).getTime() : null;
              } else if (sortBy === 'difficulty') {
                aVal = a.complexity ?? null;
                bVal = b.complexity ?? null;
              } else if (sortBy === 'priority') {
                aVal = a.priority ?? null;
                bVal = b.priority ?? null;
              }

              // если у обоих нет значения — равны
              if (aVal === null && bVal === null) return 0;
              // если у a нет значения — он идёт в конец
              if (aVal === null) return 1;
              // если у b нет значения — он идёт в конец
              if (bVal === null) return -1;

              // сравнение по выбранному порядку
              if (order === 'asc') {
                return aVal - bVal;
              } else {
                return bVal - aVal;
              }
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
    paddingLeft: 6
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
    marginLeft: 4,
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
  iconFilter: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconFilterActive: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  filterPanel: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    // height: 300,
    backgroundColor: '#ffffffff',
    padding: 12,
    zIndex: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
  },
});
