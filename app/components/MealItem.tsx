'use client';
import type { FoodItemNutrition } from '@/lib/ai';
import { useState } from 'react';
import {
  FaChevronDown,
  FaChevronRight,
  FaPencilAlt,
  FaRegStar,
  FaStar,
  FaTrash,
  FaClock,
  FaRunning,
} from 'react-icons/fa';

interface MealItemProps {
  id: string;
  description: string;
  items: FoodItemNutrition[];
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  timestamp?: string;
  compact?: boolean;
}

export default function MealItem({
  description,
  items,
  isFavorite,
  onToggleFavorite,
  onDelete,
  onEdit,
  timestamp,
  compact = false,
}: MealItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  const totals = {
    calories: items.reduce((sum, item) => sum + item.nutrition.calories, 0),
    protein: items.reduce((sum, item) => sum + item.nutrition.protein, 0),
    carbs: items.reduce((sum, item) => sum + item.nutrition.carbs, 0),
    fat: items.reduce((sum, item) => sum + item.nutrition.fat, 0),
    fiber: items.reduce((sum, item) => sum + item.nutrition.fiber, 0),
  };

  return (
    <div className={`glass-morphism overflow-hidden rounded-2xl transition-all duration-300 ${isExpanded ? 'ring-1 ring-white/10' : 'hover:bg-white/5'}`}>
      <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className={`flex justify-between items-start gap-3 ${compact ? "p-3" : "p-4 sm:p-5"}`}>
          <div className="flex-1 space-y-1 overflow-hidden">
            <h4 className={`font-black text-white leading-tight italic uppercase tracking-tighter truncate ${compact ? "text-sm" : "text-lg"}`}>
              {description}
            </h4>
            <div className="flex items-center gap-2 text-zinc-500 text-[8px] font-bold uppercase tracking-[0.2em]">
              {formattedTime && (
                <span className="flex items-center gap-1">
                  <FaClock className="text-zinc-600 w-2 h-2" />
                  {formattedTime}
                </span>
              )}
              <span className="flex items-center gap-1 bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-400">
                {items.length}U
              </span>
            </div>
          </div>

          <div className="flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
            <button
              onClick={onToggleFavorite}
              className={`p-1.5 rounded-lg transition-colors ${isFavorite ? 'text-yellow-400 bg-yellow-400/10' : 'text-zinc-600 hover:text-yellow-400 hover:bg-yellow-400/5'
                }`}
            >
              {isFavorite ? <FaStar size={10} /> : <FaRegStar size={10} />}
            </button>
            {onEdit && (
              <button
                onClick={onEdit}
                className="hover:bg-blue-400/10 p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 transition-colors"
              >
                <FaPencilAlt size={10} />
              </button>
            )}
            <button
              onClick={onDelete}
              className="hover:bg-rose-400/10 p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 transition-colors"
            >
              <FaTrash size={10} />
            </button>
          </div>
        </div>

        <div className={`bg-white/5 border-white/5 border-y ${compact ? "px-3 py-1.5" : "p-4 py-3"}`}>
          <div className="gap-2 grid grid-cols-5 text-center">
            {Object.entries(totals).map(([key, value]) => (
              <div key={key}>
                <p className={`font-black text-white italic ${compact ? "text-[10px]" : "text-sm"}`}>{Math.round(value)}{key === 'calories' ? '' : 'g'}</p>
                <p className="text-zinc-600 text-[7px] font-black uppercase tracking-tighter italic">{key.slice(0, 3)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-black/20 space-y-3 p-4 animate-in slide-in-from-top-2 duration-300">
          {items.map((item, index) => (
            <div key={index} className="bg-white/5 p-3 rounded-xl border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium text-gray-200 text-sm capitalize">{item.item}</p>
                <span className="text-blue-400 text-xs font-bold">{Math.round(item.nutrition.calories)} cal</span>
              </div>
              <div className="gap-2 grid grid-cols-4 text-center">
                {[
                  { label: 'P', val: item.nutrition.protein },
                  { label: 'C', val: item.nutrition.carbs },
                  { label: 'F', val: item.nutrition.fat },
                  { label: 'Fb', val: item.nutrition.fiber },
                ].map(macro => (
                  <div key={macro.label} className="bg-black/20 py-1.5 rounded-lg">
                    <p className="font-semibold text-gray-400 text-[10px]">{Math.round(macro.val)}g</p>
                    <p className="text-zinc-600 text-[8px] font-bold uppercase">{macro.label}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
