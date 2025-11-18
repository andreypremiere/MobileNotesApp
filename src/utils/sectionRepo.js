import uuid from 'react-native-uuid';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { PermissionsAndroid, Platform } from 'react-native';

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

  static async fillDatabaseFromExport(db, items) {
    // Разделяем на задачи и подзадачи
    const sections = items.filter(item => item.type === 'task');
    const subtasks = items.filter(item => item.type === 'subtask');

    console.log(
      `Импортируем в БД: ${sections.length} sections и ${subtasks.length} subtasks`
    );

    // // ВАЖНО: у тебя включены foreign_keys и ON DELETE CASCADE,
    // // поэтому сначала удалим subtasks, потом sections, чтобы не нарушать зависимости.
    await db.transaction(tx => {
      // Чистим таблицы
      tx.executeSql('DELETE FROM subtasks;', []);
      tx.executeSql('DELETE FROM sections;', []);
    });

    // Вставляем задачи
    await db.transaction(tx => {
      sections.forEach(section => {
        const {
          id,
          title,
          description,
          datetime,
          priority,
          complexity,
        } = section;

        const sectionId = id || uuidv4();

        tx.executeSql(
          `
          INSERT INTO sections (id, title, description, datetime, priority, complexity)
          VALUES (?, ?, ?, ?, ?, ?);
        `,
          [
            sectionId,
            title ?? '',
            description ?? null,
            datetime ?? null,
            priority ?? null,
            complexity ?? null,
          ],
          () => {
            // console.log('Вставлена section', sectionId);
          },
          (_, error) => {
            console.error('Ошибка вставки section', sectionId, error);
            // вернуть false, чтобы не прерывать весь транзакшн, если одна упала
            return false;
          }
        );
      });
    });

    // Вставляем подзадачи
    await db.transaction(tx => {
      subtasks.forEach(subtask => {
        const {
          id,
          title,
          description,
          datetime,
          priority,
          complexity,
          section_id,
          parentId,
        } = subtask;

        // В json есть и section_id, и parentId — берём section_id как основной,
        // а если его нет — используем parentId.
        const linkSectionId = section_id || parentId;

        if (!linkSectionId) {
          console.warn(
            'Подзадача без section_id / parentId, пропускаем:',
            subtask
          );
          return;
        }

        const subtaskId = id || uuidv4();

        tx.executeSql(
          `
          INSERT INTO subtasks (id, section_id, title, description, datetime, priority, complexity)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `,
          [
            subtaskId,
            linkSectionId,
            title ?? '',
            description ?? null,
            datetime ?? null,
            priority ?? null,
            complexity ?? null,
          ],
          () => {
            // console.log('Вставлена subtask', subtaskId);
          },
          (_, error) => {
            console.error('Ошибка вставки subtask', subtaskId, error);
            return false;
          }
        );
      });
    });

    console.log('Импорт в БД завершён');
  }

  static async importFromDownloads(db) {
    try {
    console.log('=== IMPORT START ===');

    // Запрос разрешения только на Android
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Доступ к хранилищу',
          message: 'Приложению нужен доступ к Загрузкам для импорта заметок',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'OK',
        },
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Разрешение не выдано');
        return { ok: false, reason: 'no_permission' };
      }
      
    }

    const path = RNFS.DownloadDirectoryPath + '/notes_export.json';
    console.log('Путь для импорта:', path);

    const exists = await RNFS.exists(path);
    if (!exists) {
      console.log('Файл не найден по пути:', path);
      return { ok: false, reason: 'not_found', path };
    }

    const content = await RNFS.readFile(path, 'utf8');
    console.log('Первые 200 символов файла:', content.slice(0, 200));

    const data = JSON.parse(content);
    console.log('Успешно распарсили JSON. Элементов:', data.length);

    await SectionRepository.fillFromJson(db, data);

    console.log('=== IMPORT OK ===');
    return { ok: true, count: data.length };
  } catch (e) {
    console.error('Ошибка импорта из Загрузок:', e);
    return { ok: false, reason: 'error', error: e.message ?? String(e) };
  }
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

  static async exportTasks(db) {
    try {
      const notes = await SectionRepository.getFlatList(db);
      const json = JSON.stringify(notes, null, 2);

      // путь к папке Загрузки (Android)
      const path = RNFS.DownloadDirectoryPath + '/notes_export.json';

      await RNFS.writeFile(path, json, 'utf8');
      console.log('Файл сохранён:', path);

      await Share.open({
        url: 'file://' + path,
        type: 'application/json',
        title: 'Экспорт заметок',
      });

      return path;
    } catch (err) {
      console.error('Ошибка экспорта:', err);
      throw err;
    }
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