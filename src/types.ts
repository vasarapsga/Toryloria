export type GameObjectType = 'block' | 'spawn' | 'goal' | 'lava' | 'platform';

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: GameObjectType;
  color?: string;
}

export interface GameLevel {
  id: string;
  name: string;
  description: string;
  creator: string;
  type: 'parkour' | 'survival' | 'sandbox';
  objects: GameObject[];
  createdAt: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: 'hat' | 'shirt' | 'pants';
  color: string;
  icon?: string;
}

export interface UserCharacter {
  nickname: string;
  bodyColor: string;
  size: number;
  equipped: {
    hat?: string;
    shirt?: string;
    pants?: string;
  };
}

export interface User {
  id: string;
  username: string;
  password?: string; // Only for local mock storage
  character?: UserCharacter;
}

export type ControlType = 'pc' | 'mobile';

export type ViewState = 'menu' | 'editor' | 'play' | 'avatar' | 'shop' | 'browser' | 'auth';

export interface GameState {
  currentView: ViewState;
  selectedLevelId?: string;
  character: UserCharacter;
  levels: GameLevel[];
}
