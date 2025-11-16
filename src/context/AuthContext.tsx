// createContext позволяет создать "контекст" — глобальное хранилище данных,
// доступное для любых компонентов в дереве без передачи через props.
import React, { createContext } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
};

// Создаём сам контекст.
// createContext принимает "значение по умолчанию".
// Здесь мы указываем объект, соответствующий AuthContextType:
// - token и nickname изначально равны null,
// - setToken и setNickname — пустые функции-заглушки (чтобы не было ошибок,
//   если кто-то вызовет их вне провайдера).
export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => { },
  nickname: null,
  setNickname: () => { },
});
