import { v4 as uuidv4 } from 'uuid';
import db from './database';

class SectionRepository {
  static async create(section) {
    /**
     * Создает новый раздел.
     * @param {Object} section - Объект с полями title и subtitle.
     * @returns {Promise<Object>} - Созданный раздел.
     */
    return new Promise((resolve, reject) => {
      const id = uuidv4();
      db.transaction(tx => {
        tx.executeSql(
          'INSERT INTO sections (id, title, subtitle) VALUES (?, ?, ?)',
          [id, section.title, section.subtitle || null],
          (_, { rows }) => resolve({ id, title: section.title, subtitle: section.subtitle }),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async getAll() {
    /**
     * Получает все разделы.
     * @returns {Promise<Array>} - Список разделов.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM sections',
          [],
          (_, { rows }) => resolve(rows.raw()),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async get(sectionId) {
    /**
     * Получает раздел по ID.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<Object>} - Найденный раздел или null.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM sections WHERE id = ?',
          [sectionId],
          (_, { rows }) => resolve(rows.length > 0 ? rows.item(0) : null),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async update(sectionId, section) {
    /**
     * Обновляет раздел.
     * @param {string} sectionId - UUID раздела.
     * @param {Object} section - Объект с полями title и subtitle.
     * @returns {Promise<Object>} - Обновленный раздел.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'UPDATE sections SET title = ?, subtitle = ? WHERE id = ?',
          [section.title, section.subtitle || null, sectionId],
          (_, { rowsAffected }) => {
            if (rowsAffected === 0) {
              reject(new Error('Раздел не найден'));
            } else {
              resolve({ id: sectionId, title: section.title, subtitle: section.subtitle });
            }
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async delete(sectionId) {
    /**
     * Удаляет раздел.
     * @param {string} sectionId - UUID раздела.
     * @returns {Promise<number>} - Количество удаленных строк.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          'DELETE FROM sections WHERE id = ?',
          [sectionId],
          (_, { rowsAffected }) => resolve(rowsAffected),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }
}

export default SectionRepository;