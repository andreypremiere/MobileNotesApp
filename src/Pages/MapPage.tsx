import { CommonActions, StackActions, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export function MapPage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { note } = route.params;
    const defaultMap = {
        location: null,
        address: '',
        mapRegion: {
            latitude: 56.0153,
            longitude: 92.8932,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        },
    };
    const [localNote, setLocalNote] = useState(() => ({
        ...note,
        map: { ...defaultMap, ...note.map },
    }));
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const apiKey = '92ffc45c-74ae-4f7d-abd7-86b87b31bcc1';

    const fetchSuggestions = async (searchText) => {
        try {
            const response = await fetch(
                `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${encodeURIComponent(searchText)}`
            );
            const data = await response.json();
            const results = data.response.GeoObjectCollection.featureMember.map((item) => {
                const obj = item.GeoObject;
                return {
                    address: obj.metaDataProperty.GeocoderMetaData.text,
                    coords: obj.Point.pos.split(' ').reverse().map(Number),
                };
            });
            console.log('Результат fetchSuggestion', results)
            setSuggestions(results.slice(0, 5));
        } catch (err) {
            console.error('Ошибка подсказки адреса:', err);
        }
    };

    const getAddressFromCoords = async (lat, lon) => {
        const url = `https://geocode-maps.yandex.ru/1.x/?format=json&apikey=${apiKey}&geocode=${lon},${lat}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.response?.GeoObjectCollection?.featureMember.length > 0) {
                const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;
                return geoObject.metaDataProperty.GeocoderMetaData.text;
            } else {
                console.warn('Не удалось найти адрес по координатам');
                return null;
            }
        } catch (err) {
            console.error('Ошибка при запросе к Яндекс Геокодеру:', err);
            return null;
        }
    };

    const handleUpdateMap = (key, value) => {
        setLocalNote(prev => ({ ...prev, map: { ...prev.map, [key]: value } }));
    };

    const onSelectSuggestion = (s) => {
        handleUpdateMap('location', { latitude: s.coords[0], longitude: s.coords[1] });
        handleUpdateMap('address', s.address);
        handleUpdateMap('mapRegion', {
            latitude: s.coords[0],
            longitude: s.coords[1],
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        setQuery('');
        setSuggestions([]);
    };

    const handleMapPress = async (e) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        handleUpdateMap('location', { latitude, longitude });
        handleUpdateMap('mapRegion', {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
        const address = await getAddressFromCoords(latitude, longitude);
        if (address) {
            handleUpdateMap('address', address);
        }
    };

    const handleSave = () => {
        navigation.dispatch(state => {
            // Получаем текущие маршруты
            const routes = state.routes.slice(0, -2); // убираем 2 последних

            // Добавляем нужный новый экран в стек
            routes.push({
                name: 'NotePage',
                params: { note: localNote, sectionId: localNote.section_id }
            });

            return CommonActions.reset({
                ...state,
                routes,
                index: routes.length - 1, // ставим индекс на новый последний экран
            });
        });
    };

    const handleCancel = () => {
        navigation.goBack()
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.length > 2) {
                fetchSuggestions(query);
            } else {
                setSuggestions([]);
            }
        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <View style={styles.frame}>
            <View style={{ flex: 1 }}>
                <Text style={styles.label}>{localNote?.map.address || 'Адрес не выбран'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Введите адрес"
                    placeholderTextColor="#888888"
                    value={query}
                    onChangeText={setQuery}
                />
                {suggestions.map((s, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.suggestionItem}
                        onPress={() => onSelectSuggestion(s)}
                    >
                        <Text>{s.address}</Text>
                    </TouchableOpacity>
                ))}
                <MapView
                    style={{ flex: 1 }}
                    region={localNote.map.mapRegion}
                    onPress={handleMapPress}
                >
                    {localNote?.map.location && (
                        <Marker coordinate={localNote.map.location} title="Выбранная точка" />
                    )}
                </MapView>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.buttonMap} onPress={() => handleCancel()}>
                        <Text style={styles.buttonText}>Отмена</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonMap} onPress={() => handleSave()}>
                        <Text style={styles.buttonText}>Сохранить</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    buttonMap: {
        backgroundColor: '#f9f9f9',
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    //   button: {
    //     backgroundColor: '#007BFF',
    //     paddingVertical: 10,
    //     paddingHorizontal: 14,
    //     borderRadius: 6,
    //     flex: 1,
    //     marginHorizontal: 4,
    //   },
    buttonText: {
        // color: '',
        textAlign: 'center',
        fontWeight: '600',
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
        height: 120,
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
});



