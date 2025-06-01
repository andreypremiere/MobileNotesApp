import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Logo from '../assets/icons/account.svg';
import { Note } from '../components/Note';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Plus from '../assets/icons/Plus.svg';
import Logout from '../assets/icons/exit.svg'
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSections } from '../utils/requests';
import { syncActions } from '../utils/syncUtils';

export function ChaptersPage() {
  const [chapters, setChapters] = useState([])
  const navigation = useNavigation();
  const db = useDatabase();
  const { token, setToken } = useContext(AuthContext);
  const [handleFunctionAccount, setHandleFunctionAccount] = useState(() => { })
  const { nickname, setNickname } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      AsyncStorage.setItem('jwtToken', token);
    } else {
      AsyncStorage.removeItem('jwtToken'); // Удаляет токен, если он отсутствует
    }
  }, [token]);

  useEffect(() => {
    if (nickname) {
      AsyncStorage.setItem('nickname', nickname);
      setHandleFunctionAccount(() => () => {
        setToken(null);
        setNickname(null);
      })

    } else {
      AsyncStorage.removeItem('nickname'); // Удаляет токен, если он отсутствует
      setHandleFunctionAccount(() => () => navigation.navigate('LoginPage'))
    }
  }, [nickname]);

  const fetchData = async () => {
    await syncActions(token)
    if (token) {
      try {
        const sections = await getSections(token);
        setChapters(sections)
        console.log('Полученные разделы по api:', sections);
      } catch (error) {
        console.error('Ошибка при получении разделов:', error);
      }
    } else {
      if (db) {
        try {
          const data = await SectionRepository.getAll(db);
          if (!token) {
            setChapters(data);
          }
          console.log('Записи получены через SQLite:', data);
        } catch (error) {
          console.error('Ошибка при получении данных:', error);
        }
      }

    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, [nickname, db]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [token, db])
  );

  const handleCreateSection = () => {
    navigation.navigate('ChapterPage', {
      // handleAddChapter: addSection,
      chapter: null,
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.statusBar}>
          <Text style={styles.title}>{nickname ? nickname : 'Войдите для синхронизации'}</Text>
          {/* <Text style={styles.status}>offline</Text> */}
        </View>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleFunctionAccount}>
          {!nickname ?
            <Logo width={32} height={32} fill='' /> :
            <Logout width={32} height={32} fill='' />
          }
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title_2}>Разделы</Text>
        <TouchableOpacity style={styles.iconPlus} onPress={() => handleCreateSection()}>
          <Plus />
        </TouchableOpacity>
      </View>
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
    height: 50,
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
    position: 'absolute',
    left: 0,

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
