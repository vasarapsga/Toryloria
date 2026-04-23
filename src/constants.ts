import { ClothingItem } from './types';

export const CLOTHING_ITEMS: ClothingItem[] = [
  // Hats
  { id: 'hat_red', name: 'Red Cap', type: 'hat', color: '#ef4444' },
  { id: 'hat_blue', name: 'Blue Beanie', type: 'hat', color: '#3b82f6' },
  { id: 'hat_green', name: 'Green Fedora', type: 'hat', color: '#10b981' },
  { id: 'hat_yellow', name: 'Yellow Crown', type: 'hat', color: '#f59e0b' },
  { id: 'hat_purple', name: 'Purple Wizards Hat', type: 'hat', color: '#8b5cf6' },
  { id: 'hat_black', name: 'Black Top Hat', type: 'hat', color: '#1f2937' },
  
  // Shirts
  { id: 'shirt_white', name: 'White T-Shirt', type: 'shirt', color: '#ffffff' },
  { id: 'shirt_black', name: 'Black Hoodie', type: 'shirt', color: '#111827' },
  { id: 'shirt_red', name: 'Red Jacket', type: 'shirt', color: '#dc2626' },
  { id: 'shirt_blue', name: 'Blue Sweater', type: 'shirt', color: '#2563eb' },
  { id: 'shirt_pink', name: 'Pink Tank Top', type: 'shirt', color: '#ec4899' },
  
  // Pants
  { id: 'pants_jeans', name: 'Blue Jeans', type: 'pants', color: '#1d4ed8' },
  { id: 'pants_black', name: 'Black Trousers', type: 'pants', color: '#000000' },
  { id: 'pants_brown', name: 'Khaki Pants', type: 'pants', color: '#d97706' },
  { id: 'pants_shorts', name: 'Red Shorts', type: 'pants', color: '#b91c1c' },
];

export const INITIAL_CHARACTER = {
  nickname: 'New Explorer',
  bodyColor: '#e5e7eb',
  size: 1,
  equipped: {}
};

export const GRID_SIZE = 40;
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
