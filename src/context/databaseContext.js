import React, { createContext, useContext, useEffect, useState } from 'react';
import SQLite from 'react-native-sqlite-storage';

// Отключим лишние логи
SQLite.enablePromise(true);

export const DatabaseContext = createContext(null);

export const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = await SQLite.openDatabase({
          name: 'notesApp.db',
          location: 'default',
        });

        await database.transaction(async tx => {
          await tx.executeSql(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='sections';`,
            [],
            (_, { rows }) => {
              if (rows.length > 0) {
                console.log('Таблица sections уже существует');
              } 
            }
          );
        });


        // Транзакция для включения внешних ключей
        await database.transaction(async tx => {
          await tx.executeSql(
            'PRAGMA foreign_keys = ON;',
            [],
            () => console.log('Внешние ключи включены'),
            (_, error) => {
              console.error('Ошибка включения внешних ключей:', error);
              throw error;
            }
          );
        });

        // Транзакция для создания таблицы sections
        await database.transaction(async tx => {
          await tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS sections (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              subtitle TEXT
            );
            `,
            [],
            () => console.log('Таблица sections создана'),
            (_, error) => {
              console.error('Ошибка создания таблицы sections:', error);
              throw error;
            }
          );
        });

        // Транзакция для создания таблицы notes
        await database.transaction(async tx => {
          await tx.executeSql(
            `
            CREATE TABLE IF NOT EXISTS notes (
              id TEXT PRIMARY KEY,
              section_id TEXT NOT NULL,
              title TEXT NOT NULL,
              subtitle TEXT,
              content TEXT,
              map TEXT,
              FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
            );
            `,
            [],
            () => console.log('Таблица notes создана'),
            (_, error) => {
              console.error('Ошибка создания таблицы notes:', error);
              throw error;
            }
          );
        });

        // Проверка существующих таблиц
        await database.transaction(async tx => {
          await tx.executeSql(
            `SELECT name FROM sqlite_master WHERE type='table';`,
            [],
            (_, { rows }) => {
              console.log('Таблицы в базе данных:', rows.raw());
            },
            (_, error) => {
              console.error('Ошибка проверки таблиц:', error);
              throw error;
            }
          );
        });

        console.log('База данных инициализирована');
        setDb(database);
      } catch (error) {
        console.error('Ошибка инициализации БД:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <DatabaseContext.Provider value={db}>
      {children}
    </DatabaseContext.Provider>
  );
};

// Хук для использования базы данных в любом компоненте
export const useDatabase = () => useContext(DatabaseContext);
