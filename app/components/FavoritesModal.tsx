'use client';
import type { MealEntry } from '@/lib/types';
import { FaTimes, FaStar, FaTrash, FaPlus } from 'react-icons/fa';

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: MealEntry[];
  onSelect: (meal: MealEntry) => void;
  onDelete: (id: string) => void;
}

export default function FavoritesModal({
  isOpen,
  onClose,
  favorites,
  onSelect,
  onDelete,
}: FavoritesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative glass-morphism rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center bg-white/5 p-6 border-white/5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-yellow-500/20 rounded-xl w-10 h-10">
              <FaStar className="text-yellow-500" />
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">Favorite Meals</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-xl text-zinc-500 hover:text-white transition-all"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 max-h-[calc(80vh-5rem)] overflow-y-auto custom-scrollbar">
          {favorites.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <FaStar className="mx-auto w-12 h-12 text-zinc-800" />
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-[10px]">No favorites saved</p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map(meal => (
                <div key={meal.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-4 transition-all hover:bg-white/10">
                  <div>
                    <p className="font-bold text-gray-200 mb-1 leading-tight">{meal.description}</p>
                    <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                      {meal.items.reduce((sum, item) => sum + item.nutrition.calories, 0)} Total Calories
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onSelect(meal)}
                      className="flex-1 flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-500 p-3 rounded-xl text-white text-xs font-bold transition-all"
                    >
                      <FaPlus size={10} />
                      Log Again
                    </button>
                    <button
                      onClick={() => onDelete(meal.id)}
                      className="bg-zinc-800 hover:bg-rose-500/10 p-3 rounded-xl text-zinc-500 hover:text-rose-500 transition-all"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
