export const HUB_BALANCE = {
  leveling: {
    baseHoursForLevel2: 12,       // Порог для 2 уровня
    hoursMultiplierPerLevel: 2,   // Каждый следующий уровень требует в 2 раза больше часов (12 -> 24 -> 48...)
    statGainPerPoint: 1,          // Сколько дает 1 очко базовым навыкам (Бой, Добыча...)
    vitalGainPerPoint: 5,         // Сколько дает 1 очко витальным статам (ХП, Выносливость)
    pointsPerLevel: 2,            // Очков за каждый новый уровень
    salaryGrowthPerLevel: 3,      // На сколько свечей растет зарплата за уровень (как в BB)
  },
  
  tavern: {
    initialRecruitsCount: 4,
  }
} as const;