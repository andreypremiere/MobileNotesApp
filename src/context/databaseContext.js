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
          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS sections (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              subtitle TEXT
            );
          `);

          await tx.executeSql(`
            CREATE TABLE IF NOT EXISTS notes (
              id TEXT PRIMARY KEY,
              section_id TEXT NOT NULL,
              title TEXT NOT NULL,
              subtitle TEXT,
              content TEXT,
              map TEXT,
              FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
            );
          `);
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
