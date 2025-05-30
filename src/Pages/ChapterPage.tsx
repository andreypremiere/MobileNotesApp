import React, { Component, useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Logo from '../assets/icons/account.svg';
import Back from '../assets/icons/button-back.svg';
import { Chapter } from '../components/Chapter';
import { Note } from '../components/Note';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation, useRoute } from '@react-navigation/native';


export function ChapterPage() {
    const navigation = useNavigation();
    const route = useRoute();
    //   const { note } = route.params;
    const [note, setNote] = useState({})


    useEffect(() => {
        // console.log(note)
    }, [])

    return (
        <View style={styles.screen}>
            <View style={styles.navbar}>
                <View style={styles.statusBar}>
                    {/* <Text style={styles.title}>Войдите для синхронизации</Text>
                    <Text style={styles.status}>offline</Text> */}
                    <Text style={styles.title_2}>Создание раздела</Text>
                </View>
                {/* <TouchableOpacity style={styles.iconWrapper}>
                    <Logo width={32} height={32} fill='' />
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.iconWrapperLeft}>
                    <Back width={32} height={32} fill=''
                        onPress={() => navigation.goBack()} />
                </TouchableOpacity>
            </View>
            <View style={styles.frame}>

                <View style={styles.component}>
                    <TextInput
                        style={styles.input}
                        placeholder="Заголовок"
                        placeholderTextColor="#888888"

                        value={note.title}
                        onChangeText={() => { }}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Подзаголовок (до 150 символов)"
                        placeholderTextColor="#888888"
                        value={note.subtitle}
                        onChangeText={(text) => {
                            if (text.length <= 150) () => { };
                        }}
                    />
                </View>


                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.buttonMap} onPress={() => console.log('Удалить')}>
                        <Text style={styles.buttonText}>Удалить</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonMap} onPress={() => console.log('Сохранить')}>
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
