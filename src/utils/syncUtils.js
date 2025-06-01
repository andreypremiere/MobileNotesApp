import { createNote, deleteNote, updateNote, createSection, updateSection, deleteSection } from './requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { actionsFilePath } from './loggingUtils';
import RNFS from 'react-native-fs';
import { act } from 'react';


export async function syncActions(token) {
  await RNFS.writeFile(actionsFilePath, JSON.stringify([], null, 2));
  const content = await RNFS.readFile(actionsFilePath);
  const actions = JSON.parse(content);
  console.log(actions)
  if (!token) return;

  try {
    const exists = await RNFS.exists(actionsFilePath);
    if (!exists) {
      console.log('Файл логов отсутствует — синхронизация не требуется');
      return;
    }
  }
  catch (error) {
    console.log(error)
    return
  }

  try {
    const content = await RNFS.readFile(actionsFilePath);
    const actions = JSON.parse(content);

    for (const action of actions) {
      console.log(action)
      switch (action.operation) {
        case 'createNote':
          await createNote(action.sectionId, action.payload, token);
          break;
        case 'updateNote':
          await updateNote(action.sectionId, action.noteId, action.payload, token);
          break;
        case 'deleteNote':
          await deleteNote(action.sectionId, action.noteId, token);
          break;
        case 'createSection':
          await createSection(action.payload, token);
          break;
        case 'updateSection':
          await updateSection(action.sectionId, action.payload, token);
          break;
        case 'deleteSection':
          await deleteSection(action.sectionId, token);
          break;
        default:
          console.warn('Неизвестная операция:', action.operation);
      }
    }

    // Очистить файл после успешной синхронизации
    await RNFS.writeFile(actionsFilePath, '[]');
    console.log('Синхронизация выполнена')
  } catch (error) {
    console.error('Ошибка при синхронизации:', error);
  }
}
