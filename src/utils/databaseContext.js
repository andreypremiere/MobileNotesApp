import SQLite from 'react-native-sqlite-storage';


const db = SQLite.openDatabase(
  {
    name: 'notesApp.db',
    location: 'default',
  },
  () => console.log('База данных открыта'),
  error => console.error('Ошибка открытия базы данных:', error)
);


// Создание таблиц
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      // Создание таблицы sections
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS sections (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          subtitle TEXT
        );`,
        [],
        () => console.log('Таблица sections создана'),
        (_, error) => reject(error)
      );

      // Создание таблицы notes
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          section_id TEXT NOT NULL,
          title TEXT NOT NULL,
          subtitle TEXT,
          content TEXT,
          map TEXT,
          FOREIGN KEY (section_id) REFERENCES sections(id) ON DELETE CASCADE
        );`,
        [],
        () => console.log('Таблица notes создана'),
        (_, error) => reject(error)
      );
    }, reject, resolve);
  });
};

// Вызов инициализации при старте приложения
initDatabase().catch(error => console.error('Ошибка инициализации базы данных:', error));

export default db;