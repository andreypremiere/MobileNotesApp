const URL_PATH = 'http://localhost:8000';
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0ZGZiNTc1YS05YWQ0LTRlYjUtYjYzNC1jMjg2MTI3Mjg0ZGEiLCJleHAiOjE3NDg4Njk2NDF9.DaFQCq6tTwyNeIvh2G492IEkgXf9wQqK4H_REKAocsk


export default async function registerUser(nickname, password) {
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

export default async function loginUser(nickname, password) {
    try {
        const response = await fetch(`${URL_PATH}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, password })
        });
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('Ошибка:', error);
    }
}

export default async function getSections(accessToken) {
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

export default async function getSection(sectionId, accessToken) {
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

export default async function createSection(sectionData, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sectionData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании раздела:', error);
    }
}

export default async function updateSection(sectionId, sectionData, accessToken) {
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

export default async function deleteSection(sectionId, accessToken) {
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

export default async function createNote(sectionId, noteData, accessToken) {
    try {
        const response = await fetch(`${URL_PATH}/sections/${sectionId}/notes`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при создании заметки:', error);
    }
}

export default async function getNotes(sectionId, accessToken) {
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

export default async function getNote(sectionId, noteId, accessToken) {
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

export default async function updateNote(sectionId, noteId, noteData, accessToken) {
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

export default async function deleteNote(sectionId, noteId, accessToken) {
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

export default async function getAllUserNotes(accessToken) {
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
