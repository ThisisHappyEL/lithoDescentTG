import type { WeaponItem, ArmorItem } from '../types/items';

export const INITIAL_WEAPONS: WeaponItem[] = [
  {
    id: 'rustySword',
    name: 'Ржавый меч',
    category: 'swords',
    level: 1,
    baseDamage: 10,
    description: 'Хлам с гор мусора, списанный ввиду нерентабельности ремонта.',
    skills: [
      { id: 'dupliren', name: 'Дуплирен', description: '2 быстрых рубящих удара.' },
      { id: 'cleavingStrike', name: 'Секущий удар', description: 'Удар малой силы, вызывающий кровотечение.' },
      { id: 'wideSwing', name: 'Широкий размах', description: 'Задевает двух стоящих рядом противников.' },
    ]
  },
  {
    id: 'messer',
    name: 'Фальшион',
    category: 'swords',
    level: 2,
    baseDamage: 12,
    description: 'Тяжелый тесак. Мило дело рубить, но ткнуть кого-то не выйдет.',
    skills: [
      { id: 'dupliren', name: 'Дуплирен', description: '2 быстрых рубящих удара.' },
      { id: 'mordhau', name: 'Мордхау', description: 'Удар эфесом, сдвигающий цель.' },
    ]
  }
];

export const INITIAL_ARMORS: ArmorItem[] = [
  {
    id: 'greasyRags',
    name: 'Засаленные лохмотья',
    description: 'Пахнут сыростью и безнадёгой. Почти не греют, но лучше, чем ничего.',
    effect: { hp: 2, stamina: 2 }
  },
  {
    id: 'leatherApron',
    name: 'Кожаный фартук',
    description: 'Защищает от искр горна или брызг жира на бойне.',
    effect: { hp: 8, construction: 1, mining: 1 }
  },
  {
    id: 'sleevelessJacket',
    name: 'Стёганая безрукавка',
    description: 'Старая поддёвка под доспех. Немного смягчает удары.',
    effect: { hp: 10, battle: 1 }
  }
];