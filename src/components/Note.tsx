import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';


export function Note({ note, updateNotes }) {
  const { setToken } = useContext(AuthContext);
  const navigation = useNavigation();


  return (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('NotePage', {
        note: note,
        sectionId: note.section_id,
        updateNotes: updateNotes,
      })}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.sub_title}>{note.subtitle}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: 4,
    paddingLeft: 10,
    gap: 4,
    borderWidth: 1,     
    borderColor: 'black',
    borderRadius: 8, 
    marginTop: 4,
    marginBottom: 1,
    width: '96%',
  },
  title: {
    textAlign: 'left',    
    fontSize: 16,
    fontWeight: '600',
  },
  sub_title: {
    textAlign: 'left',     
    fontSize: 12,
    fontWeight: '400',
  }
});
