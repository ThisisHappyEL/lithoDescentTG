import React from 'react';
import { X, Heart, Zap, Swords, Pickaxe, FlaskConical, Hammer, Eye, UserPlus, Package, Shield } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Character } from '../types/character'; // Добавили слово type!


export function RosterModal() {
  // Достаем нужные данные и экшены прямо из глобального стейта!
  const { 
    isRosterOpen, 
    closeRoster, 
    roster, 
    recruits, 
    rosterTab, 
    setRosterTab,
    hireCharacter 
  } = useGameStore();

  // Локальный фильтр склада: все / оружие / броня
  const [warehouseFilter, setWarehouseFilter] = React.useState<'all' | 'weapons' | 'armors'>('all');
  const warehouse = useGameStore((state) => state.warehouse);
  const totalItemsCount = warehouse.weapons.length + warehouse.armors.length;

  // Если окно закрыто — не рендерим ничего
  if (!isRosterOpen) return null;

  return (
    // absolute inset-0 перекрывает всё мобильное окно
    <div className="absolute inset-0 bg-darkBg z-50 flex flex-col font-sans animate-slide-up">
      
      {/* Шапка модалки */}
      <header className="p-3 bg-gray-950 border-b border-gray-800 flex justify-between items-center shrink-0">
        <h2 className="text-sm font-bold tracking-wider uppercase text-gray-200">
          Управление Отрядом
        </h2>
        <button 
          onClick={closeRoster}
          className="p-1 text-gray-400 hover:text-white rounded-lg active:bg-gray-800"
        >
          <X size={20} />
        </button>
      </header>

      {/* 3 Подкнопки переключения */}
      <div className="flex border-b border-gray-800 bg-[#161616] shrink-0 text-xs font-bold">
        <button
          onClick={() => setRosterTab('my-roster')}
          className={`flex-1 py-3 text-center transition border-b-2 ${
            rosterTab === 'my-roster' ? 'border-amber-500 text-amber-400 bg-gray-800/40' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          В строю ({roster.length})
        </button>
        <button
          onClick={() => setRosterTab('hire')}
          className={`flex-1 py-3 text-center transition border-b-2 ${
            rosterTab === 'hire' ? 'border-amber-500 text-amber-400 bg-gray-800/40' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Найм ({recruits.length})
        </button>
        <button
          onClick={() => setRosterTab('warehouse')}
          className={`flex-1 py-3 text-center transition border-b-2 ${
            rosterTab === 'warehouse' ? 'border-amber-500 text-amber-400 bg-gray-800/40' : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          Склад ({totalItemsCount})
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-3">
        {/* Вкладка 1: Отряд */}
        {rosterTab === 'my-roster' && (
          roster.length === 0 ? (
            <div className="text-center text-gray-600 text-xs py-10">Отряд пуст</div>
          ) : (
            roster.map((char) => <CharacterCard key={char.id} character={char} />)
          )
        )}

        {/* Вкладка 2: Биржа найма */}
        {rosterTab === 'hire' && (
          recruits.length === 0 ? (
            <div className="text-center text-gray-600 text-xs py-10">Нет кандидатов</div>
          ) : (
            recruits.map((char) => (
              <CharacterCard key={char.id} character={char} onHire={() => hireCharacter(char.id)} />
            ))
          )
        )}

        {/* Вкладка 3: СКЛАД С ФИЛЬТРАМИ */}
        {rosterTab === 'warehouse' && (
          <div className="space-y-3">
            {/* Кнопки фильтрации */}
            <div className="flex gap-2 text-[11px] font-bold">
              <button
                onClick={() => setWarehouseFilter('all')}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  warehouseFilter === 'all' ? 'bg-amber-700/40 border-amber-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                Все ({totalItemsCount})
              </button>
              <button
                onClick={() => setWarehouseFilter('weapons')}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  warehouseFilter === 'weapons' ? 'bg-amber-700/40 border-amber-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                Оружие ({warehouse.weapons.length})
              </button>
              <button
                onClick={() => setWarehouseFilter('armors')}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  warehouseFilter === 'armors' ? 'bg-amber-700/40 border-amber-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-500'
                }`}
              >
                Одеяния ({warehouse.armors.length})
              </button>
            </div>

            {/* Список предметов на складе */}
            <div className="space-y-2 pt-1">
              {(warehouseFilter === 'all' || warehouseFilter === 'weapons') &&
                warehouse.weapons.map((w) => (
                  <div key={w.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black/40 rounded border border-gray-800 text-amber-500">
                        <Swords size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-200">{w.name}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{w.description}</div>
                      </div>
                    </div>
                    <span className="text-amber-500 font-mono text-xs font-bold shrink-0 ml-2">Ур. {w.level}</span>
                  </div>
                ))}

              {(warehouseFilter === 'all' || warehouseFilter === 'armors') &&
                warehouse.armors.map((a) => (
                  <div key={a.id} className="bg-gray-900 border border-gray-800 rounded-lg p-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-black/40 rounded border border-gray-800 text-blue-400">
                        <Shield size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-200">{a.name}</div>
                        <div className="text-[10px] text-gray-500 leading-tight">{a.description}</div>
                      </div>
                    </div>
                  </div>
                ))}

              {totalItemsCount === 0 && (
                <div className="text-center text-gray-600 text-xs py-10">Склад пуст</div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

// Карточка одного персонажа
function CharacterCard({ character, onHire }: { character: Character; onHire?: () => void }) {
  const { stats } = character;
  
  // Достаем функцию выбора персонажа из стора
  const selectCharacter = useGameStore((state) => state.selectCharacter);

  return (
    <div 
      // При клике на карточку открываем его лист персонажа
      onClick={() => selectCharacter(character.id)}
      className="bg-gray-900 border border-gray-800 hover:border-gray-700 active:scale-[0.99] rounded-lg p-3 relative flex flex-col gap-2 cursor-pointer transition"
    >
      
      {/* Имя и Профессия */}
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-bold text-gray-200">{character.name}</div>
          <div className="text-xs text-amber-500/80 font-medium">
            {character.background} <span className="text-gray-600 text-[10px]">• Тир {character.tier}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-gray-400">{character.salary} св./цикл</span>
        </div>
      </div>

      {/* Описание предыстории */}
      <p className="text-[11px] text-gray-500 italic leading-snug">
        "{character.description}"
      </p>

      {/* Сетка характеристик */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 border-t border-gray-800/60 text-[11px]">
        <div className="flex items-center gap-1 text-red-400 bg-black/30 px-1.5 py-0.5 rounded">
          <Heart size={12} /> <span>{stats.hp}</span>
        </div>
        <div className="flex items-center gap-1 text-amber-400 bg-black/30 px-1.5 py-0.5 rounded">
          <Zap size={12} /> <span>{stats.stamina}</span>
        </div>
        <div className="flex items-center gap-1 text-orange-400 bg-black/30 px-1.5 py-0.5 rounded">
          <Swords size={12} /> <span>{stats.battle}</span>
        </div>
        <div className="flex items-center gap-1 text-yellow-500 bg-black/30 px-1.5 py-0.5 rounded">
          <Pickaxe size={12} /> <span>{stats.mining}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-400 bg-black/30 px-1.5 py-0.5 rounded">
          <FlaskConical size={12} /> <span>{stats.research}</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 bg-black/30 px-1.5 py-0.5 rounded">
          <Hammer size={12} /> <span>{stats.construction}</span>
        </div>
        <div className="flex items-center gap-1 text-purple-400 bg-black/30 px-1.5 py-0.5 rounded">
          <Eye size={12} /> <span>{stats.scouting}</span>
        </div>
      </div>

      {/* Кнопка нанять */}
      {onHire && (
        <button
          onClick={(e) => {
            // e.stopPropagation() — супер-важная штука!
            // Она запрещает клику "всплывать" выше.
            // Без неё нажатие на "Нанять" одновременно нанимало бы бойца И открывало окно персонажа.
            e.stopPropagation();
            onHire();
          }}
          className="mt-1 w-full bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1 transition"
        >
          <UserPlus size={14} /> Нанять
        </button>
      )}

    </div>
  );
}