import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { Note } from '../components/Note';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createNote, deleteNote, updateNote } from '../utils/requests';
import NoteRepository from '../utils/noteRepo';
import { useDatabase } from '../context/databaseContext';
import { logAction } from '../utils/loggingUtils';


export function NotePage() {
  const { token } = useContext(AuthContext)
  const navigation = useNavigation();
  const route = useRoute();
  const db = useDatabase();
  const { note, sectionId } = route.params;

  const [localNote, setLocalNote] = useState(note || {
    section_id: sectionId,
    title: '',
    subtitle: '',
    content: '',
    map: {}
  });

  const handleDelete = async () => {
    if (token) {
      await deleteNote(sectionId, note.id, token)
    }
    else {
      await logAction({
        operation: 'deleteNote',
        sectionId: sectionId,
        noteId: note.id
      })
      // В файл
    }
    if (db) {
      try {
        await NoteRepository.delete(db, note.id, note.section_id)
        console.log('Заметка удалена')
      }
      catch (error) {
        console.log('Ошибка при получении в sqlite', error)
      }
    }
    navigation.goBack()
  };

  // const updateMap = (newNote) => {
  //   setLocalNote(newNote)
  // }

  const handleUpdate = async () => {
    const noteData = {
      title: localNote.title,
      subtitle: localNote.subtitle,
      content: localNote.content,
      map: localNote.map
    }

    if (token) {
      await updateNote(localNote.section_id, note.id, noteData, token)
    }
    else {
      await logAction({
        operation: 'updateNote',
        sectionId: localNote.section_id,
        payload: noteData,
        noteId: note.id
      })
      // В файл
    }
    if (db) {
      try {
        await NoteRepository.update(db, note.id, noteData, note.section_id)
        console.log('Заметка обновлена')
      }
      catch (error) {
        console.log('Ошибка при получении в sqlite', error)
      }
    }

    navigation.goBack()
  }

  const handleSave = async () => {
    let newNoteAPI = null
    console.log('Операция сохранения')
    const noteData = {
      title: localNote.title,
      subtitle: localNote.subtitle,
      content: localNote.content,
      map: localNote.map
    }
    if (token) {
      newNoteAPI = await createNote(localNote.section_id, noteData, token, null)
    }
    if (db) {
      console.log('section_id перед добавлением: ', localNote.section_id)
      try {
        const newNote = await NoteRepository.create(db, noteData, localNote.section_id, newNoteAPI ? newNoteAPI.id : null)
        if (!token) {
          await logAction({
            operation: 'createNote',
            sectionId: localNote.section_id,
            payload: noteData,
            id: newNote ? newNote.id : null
          })
        }
        console.log('Заметка создана')
      }
      catch (error) {
        console.log('Ошибка при получении в sqlite', error)
      }
    }
    navigation.goBack()
  }

  useEffect(() => {
    console.log(note)
  }, [])



  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.statusBar}>
          <Text style={styles.title_2}>{note ? 'Редактирование заметки' : 'Создание заметки'}</Text>
        </View>
        <TouchableOpacity style={styles.iconWrapperLeft} onPress={() => navigation.goBack()}>
          <Back width={32} height={32} fill='' />
        </TouchableOpacity>
      </View>
      <View style={styles.frame}>

        <View style={styles.component}>
          <TextInput
            style={styles.input}
            placeholder="Заголовок"
            placeholderTextColor="#888888"

            value={localNote.title}
            onChangeText={(text) => setLocalNote({ ...localNote, title: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Подзаголовок (до 150 символов)"
            placeholderTextColor="#888888"
            value={localNote.subtitle}
            onChangeText={(text) => {
              if (text.length <= 150) {
                setLocalNote({ ...localNote, subtitle: text });
              }
            }}
          />

          <TextInput
            style={styles.textArea}
            placeholder="Текст заметки"
            placeholderTextColor="#888888"
            value={localNote.content}
            onChangeText={(text) => setLocalNote({ ...localNote, content: text })}
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.label}>{localNote.map.address !== undefined ? localNote.map.address : 'Метка на карте не выбрана'}</Text>

          <TouchableOpacity style={styles.buttonMap}
            onPress={() => navigation.navigate('MapPage', { note: localNote })}>
            <Text>Открыть карту</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.buttonRow}>
          {note && <TouchableOpacity style={styles.buttonMap} onPress={() => handleDelete()}>
            <Text style={styles.buttonText}>Удалить</Text>
          </TouchableOpacity>}

          <TouchableOpacity style={styles.buttonMap} onPress={note?.id !== undefined ? handleUpdate : handleSave}>
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
    height: 60,                 // или свой размер
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
    paddingTop: 4
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
    justifyContent: 'space-between',
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
