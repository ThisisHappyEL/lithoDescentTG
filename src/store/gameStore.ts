import { create } from 'zustand';
import type { Character, CharacterStats } from '../types/character';
import type { WeaponItem, ArmorItem } from '../types/items';
import { generateCharacter } from '../utils/characterGenerator';
import { INITIAL_WEAPONS, INITIAL_ARMORS } from '../data/itemData';
import { HUB_BALANCE } from '../data/balance/hubBalance';

interface GameState {
  candles: number;
  roster: Character[];
  recruits: Character[];
  isRosterOpen: boolean;
  rosterTab: 'my-roster' | 'hire' | 'warehouse'; // <-- Добавили 'warehouse'
  
  // Выбранный для детального просмотра персонаж (null = модалка закрыта)
  selectedCharacterId: string | null;

  // Общий склад базы
  warehouse: {
    weapons: WeaponItem[];
    armors: ArmorItem[];
  };

  // Экшены
  openRoster: () => void;
  closeRoster: () => void;
  setRosterTab: (tab: 'my-roster' | 'hire' | 'warehouse') => void;
  hireCharacter: (candidateId: string) => void;
  selectCharacter: (id: string | null) => void;
  
  
  // Прокачка: повышение стата за очки
  upgradeStat: (characterId: string, statName: keyof CharacterStats) => void;

  // Экипировка
  equipWeapon: (characterId: string, weapon: WeaponItem) => void;
  equipArmor: (characterId: string, armor: ArmorItem) => void;
}

export const useGameStore = create<GameState>((set) => ({
  candles: 350,
  roster: [generateCharacter()],
  recruits: [
    generateCharacter(),
    generateCharacter(),
    generateCharacter(),
    generateCharacter(),
  ],
  isRosterOpen: false,
  rosterTab: 'my-roster',
  selectedCharacterId: null,

  warehouse: {
    weapons: [...INITIAL_WEAPONS],
    armors: [...INITIAL_ARMORS],
  },

  openRoster: () => set({ isRosterOpen: true }),
  closeRoster: () => set({ isRosterOpen: false }),
  setRosterTab: (tab) => set({ rosterTab: tab }),
  selectCharacter: (id) => set({ selectedCharacterId: id }),

  hireCharacter: (candidateId: string) => set((state) => {
    const candidate = state.recruits.find((c) => c.id === candidateId);
    if (!candidate) return state;

    return {
      roster: [...state.roster, candidate],
      recruits: state.recruits.filter((c) => c.id !== candidateId),
    };
  }),

  // Логика прокачки стата
  upgradeStat: (characterId, statName) => set((state) => ({
    roster: state.roster.map((char) => {
      if (char.id !== characterId || char.statPoints <= 0) return char;
      
      const isVital = statName === 'hp' || statName === 'stamina';
      const gain = isVital 
        ? HUB_BALANCE.leveling.vitalGainPerPoint 
        : HUB_BALANCE.leveling.statGainPerPoint;

      return {
        ...char,
        statPoints: char.statPoints - 1,
        stats: {
          ...char.stats,
          [statName]: char.stats[statName] + gain,
          ...(statName === 'hp' ? { maxHp: char.stats.maxHp + gain } : {}),
          ...(statName === 'stamina' ? { maxStamina: char.stats.maxStamina + gain } : {}),
        }
      };
    })
  })),

  // Экипировка оружия со склада (старое возвращается на склад)
  equipWeapon: (characterId, weapon) => set((state) => {
    const char = state.roster.find((c) => c.id === characterId);
    if (!char) return state;

    const oldWeapon = char.equippedWeapon;
    const newWarehouseWeapons = state.warehouse.weapons.filter((w) => w.id !== weapon.id);
    if (oldWeapon) newWarehouseWeapons.push(oldWeapon);

    return {
      warehouse: { ...state.warehouse, weapons: newWarehouseWeapons },
      roster: state.roster.map((c) => c.id === characterId ? { ...c, equippedWeapon: weapon } : c)
    };
  }),

  // Экипировка брони со склада
  equipArmor: (characterId, armor) => set((state) => {
    const char = state.roster.find((c) => c.id === characterId);
    if (!char) return state;

    const oldArmor = char.equippedArmor;
    const newWarehouseArmors = state.warehouse.armors.filter((a) => a.id !== armor.id);
    if (oldArmor) newWarehouseArmors.push(oldArmor);

    return {
      warehouse: { ...state.warehouse, armors: newWarehouseArmors },
      roster: state.roster.map((c) => c.id === characterId ? { ...c, equippedArmor: armor } : c)
    };
  })
}));