import type { WeaponItem, ArmorItem } from './items';

// Характеристики персонажа
export interface CharacterStats {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  battle: number;
  mining: number;
  research: number;
  construction: number;
  scouting: number;
}

// Сам персонаж
export interface Character {
  id: string;
  name: string;
  gender: 'm' | 'f';
  background: string;
  tier: number;
  salary: number;
  category: string;
  profile: string;
  description: string;
  stats: CharacterStats;
  
  // --- НОВЫЕ ПОЛЯ ПРОКАЧКИ И ЭКИПИРОВКИ ---
  level: number;
  hoursWorked: number; // Часы в шахте (12 часов = 1 уровень)
  statPoints: number; // Доступные очки для прокачки характеристик
  equippedWeapon?: WeaponItem;
  equippedArmor?: ArmorItem;
}