import uuid from 'react-native-uuid';

class NoteRepository {
  static async create(db, note, sectionId, idSaved) {
    /**
     * Создает новую заметку в разделе.
     * @param {Object} note - Объект с полями title, subtitle, content, map.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<Object>} - Созданная заметка.
     */
    return new Promise((resolve, reject) => {
      const id = idSaved ? idSaved : uuid.v4();
      const serializedMap = note.map ? JSON.stringify(note.map) : null;
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO notes (id, section_id, title, subtitle, content, map) VALUES (?, ?, ?, ?, ?, ?)',
          [id, sectionId, note.title, note.subtitle || null, note.content || null, serializedMap],
          (_, { rows }) => resolve({
            id: note.id,
            section_id: sectionId,
            title: note.title,
            subtitle: note.subtitle,
            content: note.content,
            map: note.map
          }),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async update(db, noteId, note, sectionId) {
    /**
     * Обновляет заметку.
     * @param {string} noteId - UUID заметки.
     * @param {Object} note - Объект с полями title, subtitle, content, map.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<Object>} - Обновленная заметка.
     */
    return new Promise((resolve, reject) => {
      const serializedMap = note.map ? JSON.stringify(note.map) : null;
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE notes SET title = ?, subtitle = ?, content = ?, map = ? WHERE id = ? AND section_id = ?',
          [note.title, note.subtitle || null, note.content || null, serializedMap, noteId, sectionId],
          (_, { rowsAffected }) => {
            if (rowsAffected === 0) {
              reject(new Error('Заметка не найдена'));
            } else {
              resolve({
                id: noteId,
                section_id: sectionId,
                title: note.title,
                subtitle: note.subtitle,
                content: note.content,
                map: note.map
              });
            }
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async getAll(db, sectionId) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM notes WHERE section_id = ?',
          [sectionId],
          (_, { rows }) => {
            // console.log('Raw rows:', rows);

            const notes = rows.raw().map(note => ({
              ...note,
              map: note.map ? JSON.parse(note.map) : null
            }));
            resolve(notes);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }


  static async get(db, noteId, sectionId) {
    /**
     * Получает заметку по ID.
     * @param {string} noteId - UUID заметки.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<Object>} - Найденная заметка или null.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM notes WHERE id = ? AND section_id = ?',
          [noteId, sectionId],
          (_, { rows }) => {
            if (rows.length > 0) {
              const note = rows.item(0);
              resolve({
                ...note,
                map: note.map ? JSON.parse(note.map) : null
              });
            } else {
              resolve(null);
            }
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async delete(db, noteId, sectionId) {
    /**
     * Удаляет заметку.
     * @param {string} noteId - UUID заметки.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<number>} - Количество удаленных строк.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM notes WHERE id = ? AND section_id = ?',
          [noteId, sectionId],
          (_, { rowsAffected }) => resolve(rowsAffected),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async getAllByUserId(db) {
    /**
     * Получает все заметки пользователя (в оффлайн-режиме все заметки в базе).
     * @returns {Promise<Array>} - Список всех заметок.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM notes',
          [],
          (_, { rows }) => {
            const notes = rows.raw().map(note => ({
              ...note,
              map: note.map ? JSON.parse(note.map) : null
            }));
            resolve(notes);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }
}

export default NoteRepository;