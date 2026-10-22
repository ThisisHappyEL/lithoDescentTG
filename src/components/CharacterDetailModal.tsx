import React, { useState } from 'react';
import { X, Shield, Swords, Plus, Sparkles, User } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { WeaponItem, ArmorItem } from '../types/items';
import { HUB_BALANCE } from '../data/balance/hubBalance';

export function CharacterDetailModal() {
  const { 
    selectedCharacterId, 
    selectCharacter, 
    roster, 
    warehouse, 
    upgradeStat, 
    equipWeapon, 
    equipArmor 
  } = useGameStore();

  // Локальный стейт для открытия списка выбора оружия или одеяния
  const [itemPickerType, setItemPickerType] = useState<'weapon' | 'armor' | null>(null);

  if (!selectedCharacterId) return null;
  const character = roster.find((c) => c.id === selectedCharacterId);
  if (!character) return null;

  return (
    <div className="absolute inset-0 bg-darkBg z-[60] flex flex-col font-sans animate-slide-up">
      {/* Шапка с именем и кнопкой закрыть */}
      <header className="p-3 bg-gray-950 border-b border-gray-800 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-sm font-bold text-gray-200">{character.name}</h2>
          <span className="text-xs text-amber-500">{character.background}</span>
        </div>
        <button 
          onClick={() => { selectCharacter(null); setItemPickerType(null); }}
          className="p-1 text-gray-400 hover:text-white"
        >
          <X size={20} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-4">
        
        {/* ВЕРХНЯЯ ЧАСТЬ: Внешность + Характеристики */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Левая колонка: Заглушка Внешки */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg flex flex-col items-center justify-center p-3 relative min-h-[160px]">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center border-2 border-dashed border-gray-700">
              <User size={40} className="text-gray-600" />
            </div>
            <span className="text-[10px] text-gray-500 mt-3 text-center uppercase tracking-wider">
              Внешка (MVP)
            </span>
          </div>

          {/* Правая колонка: Характеристики и Прокачка */}
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-2.5 flex flex-col justify-between text-xs">
            <div className="space-y-1">
              <StatRow label="Здоровье" value={`${character.stats.hp} / ${character.stats.maxHp}`} onUpgrade={() => upgradeStat(character.id, 'hp')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Выносливость" value={`${character.stats.stamina} / ${character.stats.maxStamina}`} onUpgrade={() => upgradeStat(character.id, 'stamina')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Бой" value={character.stats.battle} onUpgrade={() => upgradeStat(character.id, 'battle')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Добыча" value={character.stats.mining} onUpgrade={() => upgradeStat(character.id, 'mining')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Изыскания" value={character.stats.research} onUpgrade={() => upgradeStat(character.id, 'research')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Разведка" value={character.stats.scouting} onUpgrade={() => upgradeStat(character.id, 'scouting')} canUpgrade={character.statPoints > 0} />
              <StatRow label="Строительство" value={character.stats.construction} onUpgrade={() => upgradeStat(character.id, 'construction')} canUpgrade={character.statPoints > 0} />
            </div>

            {/* Уровень и Опыт */}
            <div className="pt-2 border-t border-gray-800 flex justify-between items-center text-[11px] text-gray-400">
              <span>Ур. {character.level}</span>
              // СТАЛО (динамический расчет по формуле):
                {(() => {
                const reqHours = HUB_BALANCE.leveling.baseHoursForLevel2 * Math.pow(HUB_BALANCE.leveling.hoursMultiplierPerLevel, character.level - 1);
                return (
                    <span className="font-mono text-amber-500">
                    {character.hoursWorked} / {reqHours} ч.
                    </span>
                );
                })()}
            </div>
          </div>

        </div>

        {/* СРЕДНЯЯ ЧАСТЬ: Слоты Оружия и Одеяния */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Слот: Оружие */}
          <div 
            onClick={() => setItemPickerType(itemPickerType === 'weapon' ? null : 'weapon')}
            className="bg-gray-900 border border-gray-800 hover:border-amber-600/50 p-2.5 rounded-lg flex flex-col items-center justify-center cursor-pointer min-h-[90px] relative text-center"
          >
            <Swords size={20} className="text-amber-500/80 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Оружие</span>
            <span className="text-xs font-bold text-gray-200 mt-0.5">
              {character.equippedWeapon ? character.equippedWeapon.name : 'Пусто (Кулаки)'}
            </span>
          </div>

          {/* Слот: Одеяние */}
          <div 
            onClick={() => setItemPickerType(itemPickerType === 'armor' ? null : 'armor')}
            className="bg-gray-900 border border-gray-800 hover:border-amber-600/50 p-2.5 rounded-lg flex flex-col items-center justify-center cursor-pointer min-h-[90px] relative text-center"
          >
            <Shield size={20} className="text-blue-500/80 mb-1" />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Одеяние</span>
            <span className="text-xs font-bold text-gray-200 mt-0.5">
              {character.equippedArmor ? character.equippedArmor.name : 'Лохмотья'}
            </span>
          </div>

        </div>

        {/* ПАНЕЛЬ ВЫБОРА ПРЕДМЕТОВ (выдвигается при клике на слот) */}
        {itemPickerType && (
          <div className="bg-gray-950 border border-amber-600/40 rounded-lg p-2 space-y-1.5 animate-slide-up">
            <div className="text-[11px] font-bold text-amber-500 px-1 uppercase">
              Склад: {itemPickerType === 'weapon' ? 'Доступное Оружие' : 'Доступные Одеяния'}
            </div>
            
            {itemPickerType === 'weapon' ? (
              warehouse.weapons.length === 0 ? <p className="text-xs text-gray-600 p-2">Склад оружия пуст</p> :
              warehouse.weapons.map((w) => (
                <div key={w.id} onClick={() => { equipWeapon(character.id, w); setItemPickerType(null); }}
                  className="bg-gray-900 hover:bg-gray-800 p-2 rounded flex justify-between items-center cursor-pointer text-xs">
                  <div>
                    <div className="font-bold text-gray-200">{w.name}</div>
                    <div className="text-[10px] text-gray-500">{w.description}</div>
                  </div>
                  <span className="text-amber-500 font-mono text-[11px]">Урон {w.baseDamage}</span>
                </div>
              ))
            ) : (
              warehouse.armors.length === 0 ? <p className="text-xs text-gray-600 p-2">Склад одеяний пуст</p> :
              warehouse.armors.map((a) => (
                <div key={a.id} onClick={() => { equipArmor(character.id, a); setItemPickerType(null); }}
                  className="bg-gray-900 hover:bg-gray-800 p-2 rounded flex justify-between items-center cursor-pointer text-xs">
                  <div>
                    <div className="font-bold text-gray-200">{a.name}</div>
                    <div className="text-[10px] text-gray-500">{a.description}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* НИЖНЯЯ ЧАСТЬ: Навыки от Оружия */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-300 mb-2">
            <Sparkles size={14} className="text-amber-500" />
            <span>Навыки от экипированного оружия</span>
          </div>
          
          {character.equippedWeapon && character.equippedWeapon.skills.length > 0 ? (
            <div className="space-y-1.5">
              {character.equippedWeapon.skills.map((skill) => (
                <div key={skill.id} className="bg-black/30 p-2 rounded border border-gray-800/50">
                  <div className="text-xs font-bold text-amber-400">{skill.name}</div>
                  <div className="text-[11px] text-gray-400 leading-snug">{skill.description}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-600 italic">
              Вооружите погруженца, чтобы открыть боевые приемы.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

// Строчка характеристики со скрытой кнопочкой "+" (активна при наличии очков прокачки)
function StatRow({ label, value, onUpgrade, canUpgrade }: { label: string; value: string | number; onUpgrade: () => void; canUpgrade: boolean }) {
  return (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-gray-400">{label}:</span>
      <div className="flex items-center gap-1.5">
        <span className="font-mono font-bold text-gray-200">{value}</span>
        {canUpgrade && (
          <button onClick={onUpgrade} className="bg-amber-600 hover:bg-amber-500 text-white rounded p-0.5">
            <Plus size={10} />
          </button>
        )}
      </div>
    </div>
  );
}