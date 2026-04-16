'use client';
import type { MealEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import MealItem from './MealItem';
import { FaTimes, FaCalendarDay } from 'react-icons/fa';

interface DayMealsModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  meals: MealEntry[];
}

export default function DayMealsModal({ isOpen, onClose, date, meals }: DayMealsModalProps) {
  const [favorites, setFavorites] = useState<MealEntry[]>([]);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('favorite_meals');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }, []);

  const saveFavorites = (newFavorites: MealEntry[]) => {
    localStorage.setItem('favorite_meals', JSON.stringify(newFavorites));
    setFavorites(newFavorites);
  };

  const handleToggleFavorite = (meal: MealEntry) => {
    const isFavorite = favorites.some(fav => fav.id === meal.id);
    if (isFavorite) {
      saveFavorites(favorites.filter(fav => fav.id !== meal.id));
    } else {
      saveFavorites([...favorites, meal]);
    }
  };

  const isMealFavorite = (id: string) => favorites.some(fav => fav.id === id);

  if (!isOpen) return null;

  return (
    <div className="z-[100] fixed inset-0 flex justify-center items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      <div className="relative glass-morphism rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <div className="flex justify-between items-center bg-white/5 p-5 border-white/5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-blue-500/20 rounded-xl w-8 h-8">
              <FaCalendarDay className="text-blue-500 text-sm" />
            </div>
            <h2 className="font-bold text-white tracking-tight leading-none">
              {new Date(date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/10 p-2 rounded-xl text-zinc-500 hover:text-white transition-all"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-5 max-h-[calc(85vh-5rem)] overflow-y-auto custom-scrollbar">
          <div className="space-y-4">
            {meals.map(meal => (
              <MealItem
                key={meal.id}
                id={meal.id}
                description={meal.description}
                items={meal.items}
                isFavorite={isMealFavorite(meal.id)}
                onToggleFavorite={() => handleToggleFavorite(meal)}
                onDelete={() => { }} // Disabled in history
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
