import type { Character } from '../types/character'; // <-- Заметь: import type!
import { BACKGROUNDS, NAMES_DATA, type Nickname } from '../data/characterData';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateCharacter(): Character {
  const bgKeys = Object.keys(BACKGROUNDS);
  const bgName = getRandomElement(bgKeys);
  const bgData = BACKGROUNDS[bgName];

  const gender: 'm' | 'f' = Math.random() > 0.5 ? 'm' : 'f';

  let nameGroup: 'elite' | 'martial' | 'outcast' | 'common' = 'common';
  const cat = bgData.category.toLowerCase();
  
  if (cat.includes('элита')) {
    nameGroup = 'elite';
  } else if (cat.includes('боев') || bgName.includes('Страж') || bgName.includes('Вояка')) {
    nameGroup = 'martial';
  } else if (cat.includes('маргинал') || cat.includes('незаконный')) {
    nameGroup = 'outcast';
  }

  const firstName = getRandomElement(NAMES_DATA.firstNames[nameGroup][gender]);
  
  let fullName = firstName;
  if (Math.random() < 0.3) {
    const nickObj: Nickname = getRandomElement(NAMES_DATA.genericNicknames);
    fullName = `${firstName} «${nickObj[gender]}»`;
  }

  const hp = getRandomInt(bgData.stats.hp[0], bgData.stats.hp[1]);
  const stamina = getRandomInt(bgData.stats.stamina[0], bgData.stats.stamina[1]);

  return {
    id: crypto.randomUUID(),
    name: fullName,
    gender,
    background: bgName,
    tier: bgData.tier,
    salary: bgData.salary,
    category: bgData.category,
    profile: bgData.profile,
    description: bgData.description,
    stats: {
      hp,
      maxHp: hp,
      stamina,
      maxStamina: stamina,
      battle: getRandomInt(bgData.stats.battle[0], bgData.stats.battle[1]),
      mining: getRandomInt(bgData.stats.mining[0], bgData.stats.mining[1]),
      research: getRandomInt(bgData.stats.research[0], bgData.stats.research[1]),
      construction: getRandomInt(bgData.stats.construction[0], bgData.stats.construction[1]),
      scouting: getRandomInt(bgData.stats.scouting[0], bgData.stats.scouting[1]),
    },
    level: 1,
    hoursWorked: 0,
    statPoints: 0,
  };
}