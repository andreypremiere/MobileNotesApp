import RNFS from 'react-native-fs';

export const actionsFilePath = `${RNFS.DocumentDirectoryPath}/actions.json`;

export async function logAction(action) {
  try {
    const exists = await RNFS.exists(actionsFilePath);
    let actions = [];

    if (exists) {
      const content = await RNFS.readFile(actionsFilePath);
      actions = JSON.parse(content);
    }

    actions.push(action);
    await RNFS.writeFile(actionsFilePath, JSON.stringify(actions, null, 2));
  } catch (error) {
    console.error('Ошибка при логировании действия:', error);
  }
}

// остановился тут