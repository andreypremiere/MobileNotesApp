import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { WidgetUniversal } from '../components/WidgetUniversal';
import { useDatabase } from '../context/databaseContext';
import SectionRepository from '../utils/sectionRepo';
import Back from '../assets/icons/button-back.svg';


export function DayTasksPage() {
    const route = useRoute();
    const navigation = useNavigation();
    const { date } = route.params; // ISO строка
    const selectedDate = new Date(date);

    const db = useDatabase();
    const [tasksForDay, setTasksForDay] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchTasks = async () => {
                if (db) {
                    try {
                        const data = await SectionRepository.getTasksByDate(db, selectedDate);
                        setTasksForDay(data);
                        console.log('Задачи на день:', data);
                    } catch (error) {
                        console.error('Ошибка при получении задач на день:', error);
                    }
                }
            };

            fetchTasks();

            return () => {
                // cleanup при уходе со страницы (если нужно)
            };
        }, [db, date])
    );

    return (
        <View style={styles.screen}>
            <TouchableOpacity style={styles.iconWrapperLeft} onPress={() => navigation.goBack()}>
                <Back width={32} height={32} />
            </TouchableOpacity>
            <Text style={styles.header}>
                {selectedDate.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                })}
            </Text>
            <ScrollView contentContainerStyle={styles.frame}>
                {tasksForDay.map(task => (
                    <WidgetUniversal
                        key={task.id}
                        chapter={task}
                        chapters={tasksForDay}
                        setChapters={setTasksForDay}
                    />
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: { flex: 1, backgroundColor: '#fff' },
    header: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginVertical: 12,
    },
    frame: {
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    iconWrapperLeft: {
        position: 'absolute',
        left: 0,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    }

});
