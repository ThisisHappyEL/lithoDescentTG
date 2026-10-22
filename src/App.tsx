import React, { useState } from 'react';
import { Users, ArrowDown, ScrollText, Lock, ChevronUp, ChevronDown } from 'lucide-react';
import { useGameStore } from './store/gameStore';
import { RosterModal } from './components/RosterModal';
import { CharacterDetailModal } from './components/CharacterDetailModal';



export default function App() {
  const [isTopBarExpanded, setIsTopBarExpanded] = useState(false);
  const [isBiomeExpanded, setIsBiomeExpanded] = useState(false); // <-- Состояние раскрытия биома
  // Достаем функцию открытия окна из стора
  const openRoster = useGameStore((state) => state.openRoster);
  const rosterCount = useGameStore((state) => state.roster.length);

  return (
    <div className="min-h-screen flex justify-center bg-black font-sans">
      <div className="w-full max-w-[430px] h-dvh bg-darkBg flex flex-col relative shadow-2xl overflow-hidden border-x border-gray-900">
        
        {/* ВЕРХНЯЯ ШТОРКА (Статистика + События) */}
        <header 
          onClick={() => setIsTopBarExpanded(!isTopBarExpanded)}
          className={`shrink-0 bg-gray-950 border-b border-gray-800 px-4 py-2 transition-all duration-200 cursor-pointer flex flex-col overflow-hidden ${
            isTopBarExpanded ? 'h-32' : 'h-9'
          }`}
        >
          <div className="flex justify-between items-center text-xs w-full">
            <span className="text-gray-400">Цикл: 14 ▼</span>
            <span className="text-amber-500 font-bold">350 свечей</span>
          </div>
          {isTopBarExpanded && (
            <div className="mt-2 pt-2 border-t border-gray-800 text-[11px] text-gray-500 space-y-1 animate-slide-up">
              <div>• Станция стабильна, конвекционные потоки в норме.</div>
              <div>• Налог унии уплачен вовремя.</div>
            </div>
          )}
        </header>

        {/* БАЗА (~42% экрана) */}
        <section className="shrink-0 p-3 border-b border-gray-800 bg-[#161616] h-[42dvh] flex flex-col">
          <div className="grid grid-cols-3 gap-3 h-full">
            
            <div 
              onClick={openRoster}
              className="bg-gray-800 rounded-xl p-2 flex flex-col items-center justify-center border border-gray-700 active:bg-gray-700 active:scale-[0.98] transition cursor-pointer"
            >
              <Users size={32} className="mb-3 text-blue-400/80" />
              <h2 className="text-xs font-bold text-center leading-tight">Ростер ({rosterCount})</h2>
            </div>

            <div className="bg-gray-800 rounded-xl p-2 flex flex-col items-center justify-center border-2 border-amber-700/50 active:border-amber-500 active:scale-[0.98] transition relative overflow-hidden cursor-pointer">
              <div className="absolute top-0 w-1.5 h-12 bg-gray-900 border-x border-gray-700"></div>
              <ArrowDown size={40} className="text-amber-500 mt-4 animate-pulse" />
              <h2 className="text-sm font-bold mt-3 tracking-wide uppercase">Клеть</h2>
            </div>

            {/* Правая карточка: Контракты вместо Склада */}
            <div className="bg-gray-800 rounded-xl p-2 flex flex-col items-center justify-center border border-gray-700 active:bg-gray-700 active:scale-[0.98] transition cursor-pointer">
              <ScrollText size={32} className="mb-3 text-green-400/80" />
              <h2 className="text-xs font-bold text-center leading-tight">Контракты</h2>
            </div>

          </div>
        </section>

        {/* ШАХТА */}
        <section className="flex-1 overflow-y-auto no-scrollbar p-3 bg-panelBg">
          <div className="grid grid-cols-3 gap-2 pb-6">
            {[1, 2, 3, 4, 5, 6].map((depth) => (
              <React.Fragment key={depth}>
                <MineNode type="west" depth={depth} />
                <MineNode type="center" depth={depth} />
                <MineNode type="east" depth={depth} />
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* ВЫДВИЖНАЯ ПАНЕЛЬ БИОМА */}
        <footer 
          onClick={() => setIsBiomeExpanded(!isBiomeExpanded)}
          className={`shrink-0 bg-gray-950 border-t border-gray-800 transition-all duration-300 ease-in-out cursor-pointer flex flex-col justify-between overflow-hidden relative ${
            isBiomeExpanded ? 'h-56 p-4' : 'h-12 px-4 py-2'
          }`}
        >
          {/* Полоса прогресса времени */}
          <div className="absolute left-0 top-0 h-1 w-[40%] bg-amber-600"></div>

          {/* Базовая строка (всегда видна) */}
          <div className="flex justify-between items-center w-full shrink-0">
            <div className="flex items-center gap-2">
              {isBiomeExpanded ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronUp size={18} className="text-gray-400" />}
              <span className="text-sm font-bold text-gray-200">Биом: Ржавый терновник</span>
            </div>
            <span className="text-sm text-amber-500 font-mono">16 ч.</span>
          </div>

          {/* Раскрывающийся контент (данные разведки) */}
          {isBiomeExpanded && (
            <div className="flex-1 mt-3 pt-3 border-t border-gray-800/60 text-xs text-gray-400 space-y-2 overflow-y-auto no-scrollbar">
              <p className="italic text-gray-500">
                Влажный лабиринт из окисленного железа. Агрессивная кислая среда, разъедающая экипировку.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="bg-gray-900 p-2 rounded border border-gray-800">
                  <span className="text-red-400 font-bold block mb-1">Опасности:</span>
                  Ржавая плесень, Кислота
                </div>
                <div className="bg-gray-900 p-2 rounded border border-gray-800">
                  <span className="text-amber-400 font-bold block mb-1">Ресурсы:</span>
                  Железо (Fe2+), Окислы
                </div>
              </div>
            </div>
          )}
        </footer>

        {/* 
          МОДАЛЬНОЕ ОКНО РОСТЕРА 
          Оно отрендерится поверх всего мобильного контейнера, когда мы нажмем на кнопку!
        */}
        <RosterModal />
        <CharacterDetailModal />

      </div>
    </div>
  );
}

// Вспомогательный компонент ноды шахты (без изменений)
interface MineNodeProps {
  type: 'west' | 'center' | 'east';
  depth: number;
}

function MineNode({ type, depth }: MineNodeProps) {
  const isCenter = type === 'center';
  const isExplored = isCenter && depth === 1;
  const baseStyle = "h-32 flex flex-col items-center justify-center rounded-lg border-2 transition-all relative overflow-hidden";
  
  if (isExplored) {
    return (
      <div className={`${baseStyle} bg-gray-800 border-amber-700/50 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]`}>
        <div className="absolute w-2 h-full bg-black/20"></div>
        <ArrowDown size={24} className="text-amber-700/40 mb-2" />
        <span className="text-xs font-bold text-gray-400 z-10 uppercase tracking-widest">Глубина {depth}</span>
      </div>
    );
  }

  return (
    <div className={`${baseStyle} bg-black/40 border-gray-900/50`}>
      <Lock size={16} className="text-gray-800 mb-2" />
      <span className="text-[10px] text-gray-700 font-semibold tracking-widest uppercase">Мрак</span>
    </div>
  );
}