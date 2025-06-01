import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Logo from '../assets/icons/account.svg';
import { Note } from '../components/Note';
import Back from '../assets/icons/button-back.svg';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Plus from '../assets/icons/Plus.svg';
import { AuthContext } from '../context/AuthContext';
import { getNotes, updateNote } from '../utils/requests';
import { useDatabase } from '../context/databaseContext';
import NoteRepository from '../utils/noteRepo';


export function NotesPage() {
  const { token } = useContext(AuthContext)
  const route = useRoute();
  const { chapterId } = route.params;
  const db = useDatabase();

  // const [notes, setNotes] = useState([])
  const [notes, setNotes] = useState([]);
  const navigation = useNavigation();

  const updateNotes = async () => {
    if (token) {
      const result = await getNotes(chapterId, token)
      setNotes(result)
    }
    if (db) {
      try {
        console.log('chapterId', chapterId)
        const result = await NoteRepository.getAll(db, chapterId)
        console.log('Получены заметки', result)
        if (!token) {
          setNotes(result)
        }
      }
      catch (error) {
        console.log('Ошибка при получении в sqlite', error)
      }
    }

  }

  useFocusEffect(
    useCallback(() => {
      updateNotes();
    }, [token, db])
  );


  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.statusBar}>
          {/* <Text style={styles.title}>Войдите для синхронизации</Text>
          <Text style={styles.status}>offline</Text> */}
          <Text style={styles.title_2}>Заметки</Text>
        </View>
        {/* <TouchableOpacity style={styles.iconWrapper}>
          <Logo width={32} height={32} fill='' />
        </TouchableOpacity> */}
        <TouchableOpacity style={styles.iconWrapperLeft} onPress={() => navigation.goBack()}>
          <Back width={32} height={32} fill='' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconPlus} onPress={() => navigation.navigate('NotePage', { note: null, sectionId: chapterId })}>
          <Plus />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.frame}>
        {notes.map((obj) => (
          <Note
            key={obj.id}
            note={obj}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
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
    gap: 4,
    alignItems: 'center'
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
  iconPlus: {
    position: 'absolute',
    right: 10,
    backgroundColor: '#fff', // Фон для лучшей видимости тени
    borderRadius: 8, // Скругление углов для иконок
    padding: 6, // Внутренний отступ для увеличения области нажатия
    shadowColor: '#000', // Цвет тени
    shadowOffset: { width: 0, height: 2 }, // Смещение тени
    shadowOpacity: 0.3, // Прозрачность тени
    shadowRadius: 3, // Радиус размытия тени
    elevation: 4, // Тень для Android
  },
});
