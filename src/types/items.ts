// Базовый интерфейс навыка оружия для отображения в инвентаре
export interface WeaponSkill {
  id: string;
  name: string;
  description: string;
  staminaCost?: number;
  damageCoef?: number;
}

// Оружие
export interface WeaponItem {
  id: string;
  name: string;
  category: 'swords' | 'axes' | 'maces' | 'polearms';
  level: number;
  baseDamage: number;
  description: string;
  skills: WeaponSkill[];
}

// Одеяние / Доспех
export interface ArmorItem {
  id: string;
  name: string;
  description: string;
  effect: {
    hp?: number;
    stamina?: number;
    battle?: number;
    mining?: number;
    research?: number;
    construction?: number;
    scouting?: number;
  };
}