import { GameLevel, UserCharacter, User } from './types';
import { INITIAL_CHARACTER } from './constants';

const STORAGE_KEYS = {
  CHARACTER: 'toryloria_character',
  LEVELS: 'toryloria_levels',
  USERS: 'toryloria_users',
  SESSION: 'toryloria_session',
};

export const storage = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  },
  saveUser: (user: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) users[index] = user;
    else users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },
  getSession: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },
  setSession: (user: User | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },
  getCharacter: (): UserCharacter => {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTER);
    return data ? JSON.parse(data) : INITIAL_CHARACTER;
  },
  saveCharacter: (character: UserCharacter) => {
    localStorage.setItem(STORAGE_KEYS.CHARACTER, JSON.stringify(character));
  },
  getLevels: (): GameLevel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.LEVELS);
    return data ? JSON.parse(data) : [];
  },
  saveLevels: (levels: GameLevel[]) => {
    localStorage.setItem(STORAGE_KEYS.LEVELS, JSON.stringify(levels));
  },
  saveLevel: (level: GameLevel) => {
    const levels = storage.getLevels();
    const index = levels.findIndex(l => l.id === level.id);
    if (index >= 0) {
      levels[index] = level;
    } else {
      levels.push(level);
    }
    storage.saveLevels(levels);
  },
  deleteLevel: (id: string) => {
    const levels = storage.getLevels();
    storage.saveLevels(levels.filter(l => l.id !== id));
  }
};
