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

  /**
   * Получить все подзадачи для раздела по его id
   * @param {Object} db - база данных
   * @param {string} sectionId - id раздела
   * @returns {Promise<Array>} - список подзадач
   */
  static async getAllSubtasksById(db, sectionId) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM subtasks WHERE section_id = ?`,
          [sectionId],
          (_, { rows }) => {
            const data = [];
            for (let i = 0; i < rows.length; i++) {
              data.push(rows.item(i));
            }
            resolve(data);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  /**
   * Получить все задачи вместе с их подзадачами
   * @param {Object} db - база данных
   * @returns {Promise<Array>} - список задач с массивом subtasks внутри
   */
  static async getAllSectionsWithSubtasks(db) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM sections`,
          [],
          async (_, { rows }) => {
            const sections = [];

            for (let i = 0; i < rows.length; i++) {
              const section = rows.item(i);

              // получаем подзадачи для каждой задачи
              const subtasks = await new Promise((res, rej) => {
                db.transaction(tx2 => {
                  tx2.executeSql(
                    `SELECT * FROM subtasks WHERE section_id = ?`,
                    [section.id],
                    (_, { rows }) => {
                      const subs = [];
                      for (let j = 0; j < rows.length; j++) {
                        subs.push(rows.item(j));
                      }
                      res(subs);
                    },
                    (_, error) => rej(error)
                  );
                });
              });

              sections.push({
                ...section,
                subtasks, // добавляем массив подзадач внутрь объекта задачи
              });
            }

            resolve(sections);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  // новый метод: получить задачи за конкретный день
  static async getTasksByDate(db, date) {
    try {
      const all = await SectionRepository.getFlatList(db);

      const filtered = all.filter(ch => {
        if (ch.type !== 'task' || !ch.datetime) return false;
        const d = new Date(ch.datetime);
        return (
          d.getFullYear() === date.getFullYear() &&
          d.getMonth() === date.getMonth() &&
          d.getDate() === date.getDate()
        );
      });

      return filtered;
    } catch (err) {
      console.error('Ошибка при получении задач за день:', err);
      return [];
    }
  }

  /**
   * Получить одномерный список задач и подзадач
   * @param {Object} db - база данных
   * @returns {Promise<Array>} - список элементов {id, title, ..., type: 'task' | 'subtask'}
   */
  static async getFlatList(db) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM sections`,
          [],
          async (_, { rows }) => {
            const flatList = [];

            for (let i = 0; i < rows.length; i++) {
              const section = rows.item(i);

              // добавляем задачу
              flatList.push({
                ...section,
                type: 'task',
              });

              // получаем подзадачи для этой задачи
              const subtasks = await new Promise((res, rej) => {
                db.transaction(tx2 => {
                  tx2.executeSql(
                    `SELECT * FROM subtasks WHERE section_id = ?`,
                    [section.id],
                    (_, { rows }) => {
                      const subs = [];
                      for (let j = 0; j < rows.length; j++) {
                        subs.push(rows.item(j));
                      }
                      res(subs);
                    },
                    (_, error) => rej(error)
                  );
                });
              });

              // добавляем подзадачи в общий список
              subtasks.forEach(sub => {
                flatList.push({
                  ...sub,
                  type: 'subtask',
                  parentId: section.id,
                });
              });
            }

            resolve(flatList);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  /**
   * Получить все подзадачи без фильтрации
   * @param {Object} db - база данных
   * @returns {Promise<Array>} - список всех подзадач
   */
  static async getAllSubtasks(db) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `SELECT * FROM subtasks`,
          [],
          (_, { rows }) => {
            const data = [];
            for (let i = 0; i < rows.length; i++) {
              data.push(rows.item(i));
            }
            resolve(data);
          },
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  static async createSubtask(db, sectionId, subtask) {
    return new Promise((resolve, reject) => {
      const id = uuid.v4();
      db.transaction(tx => {
        tx.executeSql(
          `INSERT INTO subtasks (id, section_id, title, description, datetime, priority, complexity)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            id,
            sectionId,
            subtask.title,
            subtask.description || null,
            subtask.datetime || null,
            subtask.priority || null,
            subtask.complexity || null,
          ],
          () =>
            resolve({
              id,
              section_id: sectionId,
              ...subtask,
            }),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  // --- обновление подзадачи ---
  static async updateSubtask(db, subtaskId, subtask) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `UPDATE subtasks
           SET title = ?, description = ?, datetime = ?, priority = ?, complexity = ?
           WHERE id = ?`,
          [
            subtask.title,
            subtask.description || null,
            subtask.datetime || null,
            subtask.priority || null,
            subtask.complexity || null,
            subtaskId,
          ],
          () => resolve(true),
          (_, error) => reject(error)
        );
      }, reject);
    });
  }

  // --- удаление подзадачи ---
  static async deleteSubtask(db, subtaskId) {
    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          `DELETE FROM subtasks WHERE id = ?`,
          [subtaskId],
          () => resolve(true),
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