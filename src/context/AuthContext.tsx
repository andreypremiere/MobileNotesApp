import React, { createContext } from 'react';

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  nickname: string | null;
  setNickname: (nickname: string | null) => void;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  nickname: null,
  setNickname: () => {},
});
