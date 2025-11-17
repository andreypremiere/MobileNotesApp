import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { Note } from '../components/Note';
import MapView, { Marker } from 'react-native-maps';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { createSection, updateSection } from '../utils/requests';
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo'
import { logAction } from '../utils/loggingUtils';
import { TextInputMask } from 'react-native-masked-text';
import Plus from '../assets/icons/Plus.svg';
import { Subtask } from '../components/Subtask';


export function ChapterPage() {
  const navigation = useNavigation();
  const db = useDatabase();
  const route = useRoute();
  const { chapter } = route.params || {};
  const [subtasks, setSubtasks] = useState<any[]>([]);

  const isCreating = !chapter;

  const [localChapter, setLocalChapter] = useState({
    title: chapter?.title || '',
    description: chapter?.description || '',
    datetime: chapter?.datetime || '',
    priority: chapter?.priority?.toString() || '',
    complexity: chapter?.complexity?.toString() || ''
  });

  // Здесь подгрузка подзадач для задачи, если это редактирование
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (db) {
          try {
            const data = await SectionRepository.getAllSubtasksById(db, chapter.id);
            setSubtasks(data);
            console.log('Получены подзадачи через SQLite:', data);
          } catch (error) {
            console.error('Ошибка при получении данных:', error);
          }
        }
      }

      if (!isCreating) {
        fetchData();
      }

      return () => {
        // cleanup при уходе с экрана (необязательно)
      };
    }, [db])
  );

  const handleSave = async () => {
    if (isCreating && db) {
      try {
        const newSection = await SectionRepository.create(db, {
          title: localChapter.title,
          description: localChapter.description,
          datetime: localChapter.datetime,
          priority: parseInt(localChapter.priority) || 0,
          complexity: parseInt(localChapter.complexity) || 0,
        });
        console.log('Созданный раздел', newSection);
      } catch (error) {
        console.log('Ошибка при добавлении в sqlite', error);
      }
    }
    navigation.goBack();
  };

  const handleUpdate = async () => {
    if (db && chapter) {
      try {
        await SectionRepository.update(db, chapter.id, {
          title: localChapter.title,
          description: localChapter.description,
          datetime: localChapter.datetime,
          priority: parseInt(localChapter.priority) || 0,
          complexity: parseInt(localChapter.complexity) || 0,
        });
      } catch (error) {
        console.log('Ошибка при обновлении в sqlite', error);
      }
    }
    navigation.goBack();
  };

  const handleDelete = async () => {
    if (db && chapter) {
      try {
        await SectionRepository.delete(db, chapter.id);
      } catch (error) {
        console.log('Ошибка при удалении в sqlite', error);
      }
    }
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <Text style={styles.title_2}>
          {isCreating ? 'Создание задачи' : 'Редактирование задачи'}
        </Text>
        <TouchableOpacity style={styles.iconWrapperLeft} onPress={() => navigation.goBack()}>
          <Back width={32} height={32} />
        </TouchableOpacity>
      </View>

      <View style={styles.frame}>
        <View>
          <TextInput
            style={styles.input}
            placeholder="Заголовок"
            placeholderTextColor="#888"
            value={localChapter.title}
            onChangeText={(text) => setLocalChapter((prev) => ({ ...prev, title: text }))}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Описание"
            placeholderTextColor="#888"
            multiline
            value={localChapter.description}
            onChangeText={(text) => setLocalChapter((prev) => ({ ...prev, description: text }))}
          />

          <TextInputMask
            type={'datetime'}
            options={{
              format: 'YYYY-MM-DD HH:mm' // формат даты/времени
            }}
            value={localChapter.datetime}
            onChangeText={(text) =>
              setLocalChapter((prev) => ({ ...prev, datetime: text }))
            }
            style={styles.input}
            placeholder="Дата и время (YYYY-MM-DD HH:mm)"
            placeholderTextColor="#888"
          />

          <TextInput
            style={styles.input}
            placeholder="Приоритет (число)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={localChapter.priority}
            onChangeText={(text) => setLocalChapter((prev) => ({ ...prev, priority: text }))}
          />

          <TextInput
            style={styles.input}
            placeholder="Сложность (число)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={localChapter.complexity}
            onChangeText={(text) => setLocalChapter((prev) => ({ ...prev, complexity: text }))}
          />
        </View>

        {!isCreating && (
          <>
            <View style={styles.navbarTasks}>
              <Text style={styles.titleSubtasks}>Подзадачи</Text>
              <TouchableOpacity style={styles.iconPlus} onPress={() => navigation.navigate('SubtaskPage', {chapter: null, parentId: chapter.id})}>
                <Plus />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.subTasksView}>
              {subtasks.map((obj) => (
                <Subtask
                  key={obj.id}
                  chapter={obj}
                  setChapters={() => { }} // заглушка
                  chapters={subtasks}
                />
              ))}
            </ScrollView>
          </>
        )}

        <View style={{
          flex: 1,
          // backgroundColor: '#a47f7fff' 
        }} />

        <View style={isCreating ? styles.buttonRow : styles.buttonRow2}>
          {!isCreating && (
            <TouchableOpacity
              style={styles.buttonMapDel}
              onPress={handleDelete} // или отдельный handleDelete
            >
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.buttonMap}
            onPress={isCreating ? handleSave : handleUpdate}
          >
            <Text style={styles.buttonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>

    </View >
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  subTasksView: {
    // backgroundColor: '#ec9696ff',
    // borderRadius: 8,
    paddingVertical: 2,
  },
  navbarTasks: {
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleSubtasks: {
    fontSize: 16,
    fontWeight: '600',
  },
  iconPlus: {
    // position: 'absolute',
    // right: 12,
    backgroundColor: '#fff', // Фон для лучшей видимости тени
    borderRadius: 8, // Скругление углов для иконок
    padding: 6, // Внутренний отступ для увеличения области нажатия
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 3, // Радиус размытия тени
    elevation: 4, // Тень для Android
  },
  statusBar: { alignItems: 'center', justifyContent: 'center' },
  title_2: { textAlign: 'center', fontSize: 16, fontWeight: '500' },
  frame: { flex: 1, padding: 1, backgroundColor: '#fff', paddingHorizontal: 8 },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    textAlignVertical: 'top',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    color: 'black',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 2
  },
  buttonRow2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2
  },
  buttonMap: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonMapDel: {
    backgroundColor: '#ffd4d4ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: '#ff9292ff',
    borderWidth: 1,
    borderRadius: 8,
  },
  buttonText: { textAlign: 'center', fontWeight: '600' },
  iconWrapperLeft: {
    position: 'absolute',
    left: 0,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});