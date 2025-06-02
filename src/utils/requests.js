const URL_PATH = 'https://web-production-d616.up.railway.app';


export async function registerUser(nickname, password) {
    try {
        const response = await fetch(`${URL_PATH}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, password })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export async function loginUser(nickname, password) {
    try {
        const response = await fetch(`${URL_PATH}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, password })
        });
        const data = await response.json();
        console.log('data', data)
        return data;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export async function getSections(accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении секций:', error);
    }
}

export async function getSection(sectionId, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении раздела:', error);
    }
}

export async function createSection(sectionData, accessToken, idSaved) {
    try {
        const response = await fetch(`${URL_PATH}/sections`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...sectionData, id: idSaved})
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании раздела:', error);
    }
}

export async function updateSection(sectionId, sectionData, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sectionData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении раздела:', error);
    }
}

export async function deleteSection(sectionId, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken.trim()}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении раздела:', error);
        return false;
    }
}

export async function createNote(sectionId, noteData, accessToken, id) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...noteData, id: id})
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании заметки:', error);
    }
}

export async function getNotes(sectionId, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении заметок:', error);
    }
}

export async function getNote(sectionId, noteId, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes/${noteId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении заметки:', error);
    }
}

export async function updateNote(sectionId, noteId, noteData, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes/${noteId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при обновлении заметки:', error);
    }
}

export async function deleteNote(sectionId, noteId, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes/${noteId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${accessToken.trim()}` }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return true;
    } catch (error) {
        console.error('Ошибка при удалении заметки:', error);
        return false;
    }
}

export async function getAllUserNotes(accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/notes`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при получении всех заметок пользователя:', error);
    }
}
