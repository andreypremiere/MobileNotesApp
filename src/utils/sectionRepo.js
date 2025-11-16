import uuid from 'react-native-uuid';

class SectionRepository {
  static async create(db, section, savedId) {
    /**
     * Создает новый раздел.
     * @param {Object} section - Объект с полями title, description, datetime, priority, complexity.
     * @returns {Promise<Object>} - Созданный раздел.
     */
    return new Promise((resolve, reject) => {
      const id = savedId ? savedId : uuid.v4();
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO sections (id, title, description, datetime, priority, complexity)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            id,
            section.title,
            section.description || null,
            section.datetime || null,
            section.priority || null,
            section.complexity || null,
          ],
          () =>
            resolve({
              id,
              title: section.title,
              description: section.description,
              datetime: section.datetime,
              priority: section.priority,
              complexity: section.complexity,
            }),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async getAll(db) {
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

  static async update(db, sectionId, section) {
    /**
     * Обновляет раздел.
     * @param {string} sectionId - UUID раздела.
     * @param {Object} section - Объект с полями title, description, datetime, priority, complexity.
     * @returns {Promise<Object>} - Обновленный раздел.
     */
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE sections
           SET title = ?, description = ?, datetime = ?, priority = ?, complexity = ?
           WHERE id = ?`,
          [
            section.title,
            section.description || null,
            section.datetime || null,
            section.priority || null,
            section.complexity || null,
            sectionId,
          ],
          (_, { rowsAffected }) => {
            if (rowsAffected === 0) {
              reject(new Error('Раздел не найден'));
            } else {
              resolve({
                id: sectionId,
                title: section.title,
                description: section.description,
                datetime: section.datetime,
                priority: section.priority,
                complexity: section.complexity,
              });
            }
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async get(db, sectionId) {
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

  static async delete(db, sectionId) {
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