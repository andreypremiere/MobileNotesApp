import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import { useNavigation } from '@react-navigation/native';
import Edit from '../assets/icons/edit.svg';
import Delete from '../assets/icons/delete.svg'
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo';
import { deleteSection, getSections } from '../utils/requests';
import { logAction } from '../utils/loggingUtils';


export function Chapter({ chapter, setChapters, chapters,
  // handleUpdateChapter
}) {
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();
  const db = useDatabase();

  const handleDeleteSection = async () => {
    if (db) {
      await SectionRepository.delete(db, chapter.id)
    }

    const updatedChapters = chapters.filter((ch) => ch.id !== chapter.id);
    setChapters(updatedChapters);
  };

  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ChapterPage', { chapter: chapter })}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{chapter.title}</Text>
        <Text style={styles.sub_title}>{chapter.datetime
          ? new Date(chapter.datetime).toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
          : ''}</Text>
      </View>
      <View>
        <Text style={styles.sub_title_right}>Приоритет: {chapter.priority ? chapter.priority : '-'}</Text>
        <Text style={styles.sub_title_right}>Сложность: {chapter.complexity ? chapter.complexity : '-'}</Text>
      </View>
      {/* <View style={styles.elementsContainer}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() =>
            navigation.navigate('ChapterPage', {
              chapter: chapter,
            })
          }
        >
          <Edit />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper} onPress={() => { handleDeleteSection() }}>
          <Delete />
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    width: '96%',
    marginVertical: 4,
  },
  textContainer: {
    flex: 1,
    gap: 3,
  },
  title: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '600',
  },
  sub_title: {
    textAlign: 'left',
    fontSize: 14,
    fontWeight: '400',
  },
  sub_title_right: {
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '400',
  },
  elementsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 2,
  },

});
