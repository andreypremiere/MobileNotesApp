import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import Logo from '../assets/icons/account.svg';
import { Note } from '../components/Note';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { useNavigation } from '@react-navigation/native';
import Plus from '../assets/icons/Plus.svg';


export function ChaptersPage() {
  const [chapters, setChapters] = useState([])
  const navigation = useNavigation();

  useEffect(() => {
    // Запрос к бд на получение заметок, будет список объектов со значениями {id, title, subtitle, text, map}
  }, [])

  return (
    <View style={styles.screen}>
      <View style={styles.navbar}>
        <View style={styles.statusBar}>
          <Text style={styles.title}>Войдите для синхронизации</Text>
          <Text style={styles.status}>offline</Text>
        </View>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => navigation.navigate('LoginPage')}>
          <Logo width={32} height={32} fill='' />
        </TouchableOpacity>
      </View>
      <View>
        <Text style={styles.title_2}>Разделы</Text>
        <TouchableOpacity style={styles.iconPlus} onPress={() => { }}>
          <Plus />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.frame}>
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}
        <Chapter chapter={{ id: '1111', title: 'Все записи', subTitle: 'Содержит все записи' }} />  {/* По умолчанию */}

        {chapters.map((obj) => (
          <Chapter
            key={obj.id}
            chapter={obj}
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
