import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { Note } from '../components/Note';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createSection, updateSection } from '../utils/requests';
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo'
import { logAction } from '../utils/loggingUtils';


export function ChapterPage() {
  const { token } = useContext(AuthContext)
  const navigation = useNavigation();
  const db = useDatabase();
  const route = useRoute();
  const { chapter } = route.params || {};

  const isCreating = !chapter;

  const [localChapter, setLocalChapter] = useState({
    title: chapter?.title || '',
    subtitle: chapter?.subtitle || '',
  });

  const handleSave = async () => {
    if (isCreating) {
      if (token) {
        const newChapter = await createSection({ title: localChapter.title, subtitle: localChapter.subtitle },
          token)
      }
      else {
        await logAction({
          operation: 'createSection',
          payload: { title: localChapter.title, subtitle: localChapter.subtitle }
        })
        // В файл
      }

      if (db) {
        try {
          await SectionRepository.create(db, { title: localChapter.title, subtitle: localChapter.subtitle })
        }
        catch (error) {
          console.log('Ошибка при добавлении в sqlite', error)
        }

      }

      // console.log('Созданный раздел', newChapter)
      // handleAddChapter();
    }
    navigation.goBack();
  };

  const handleUpdate = async () => {
    // Здесь можно вызвать метод обновления в SQLite
    // console.log('Обновление раздела', localChapter);
    if (token) {
      await updateSection(chapter.id, {
        title: localChapter.title,
        subtitle: localChapter.subtitle
      }, token)
    }
    else {
      await logAction({
          operation: 'updateSection',
          sectionId: chapter.id,
          payload: { title: localChapter.title, subtitle: localChapter.subtitle }
        })
        // В файл
    }
    if (db) {
      try {
        await SectionRepository.update(db, chapter.id, { title: localChapter.title, subtitle: localChapter.subtitle })
      }
      catch (error) {
        console.log('Ошибка при добавлении в sqlite', error)
      }

    }

    // handleAddChapter();

    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.statusBar}>
          <Text style={styles.title_2}>
            {isCreating ? 'Создание раздела' : 'Редактирование раздела'}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconWrapperLeft}>
          <Back width={32} height={32} fill="" onPress={() => navigation.goBack()} />
        </TouchableOpacity>
      </View>

      <View style={styles.frame}>
        <View style={styles.component}>
          <TextInput
            style={styles.input}
            placeholder="Заголовок"
            placeholderTextColor="#888888"
            value={localChapter.title}
            onChangeText={(text) =>
              setLocalChapter((prev) => ({ ...prev, title: text }))
            }
          />

          <TextInput
            style={styles.input}
            placeholder="Подзаголовок (до 150 символов)"
            placeholderTextColor="#888888"
            value={localChapter.subtitle}
            onChangeText={(text) => {
              if (text.length <= 150) {
                setLocalChapter((prev) => ({ ...prev, subtitle: text }));
              }
            }}
          />
        </View>

        <View style={styles.buttonRow}>
          {/* {!isCreating && (
            <TouchableOpacity style={styles.buttonMap} onPress={() => console.log('Удалить')}>
              <Text style={styles.buttonText}>Удалить</Text>
            </TouchableOpacity>
          )} */}

          <TouchableOpacity
            style={styles.buttonMap}
            onPress={isCreating ? handleSave : handleUpdate}
          >
            <Text style={styles.buttonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  buttonMap: {
    backgroundColor: '#f9f9f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
  },
  component: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  suggestionItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f0f0f0',
  },
  statusBar: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
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
    // flex: 1,                   // текст занимает всё доступное место
    // textAlign: 'center',       // текст по центру
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
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  status: {
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
  },
  iconWrapperLeft: {
    position: 'absolute',
    left: 0,

    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',
  },
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
    height: 200,
    borderColor: '#ccc',
    color: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  mapContainer: {
    height: 200,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 6,
    flex: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    // color: '',
    textAlign: 'center',
    fontWeight: '600',
  },
});
