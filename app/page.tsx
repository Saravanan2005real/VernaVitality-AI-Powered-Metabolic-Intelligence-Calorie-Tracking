'use client';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { useFavorites } from '@/lib/hooks/useFavorites';
import { useMeals } from '@/lib/hooks/useMeals';
import { useNutritionApi } from '@/lib/hooks/useNutritionApi';
import type { FoodItemNutrition } from '@/lib/ai';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import type { MealEntry } from '../lib/types';
import CalorieProgress from './components/CalorieProgress';
import FavoritesModal from './components/FavoritesModal';
import MealForm from './components/MealForm';
import MealList from './components/MealList';
import NutritionEditor from './components/NutritionEditor';
import SettingsPrompt from './components/SettingsPrompt';
import DietCorrection from './components/DietCorrection';
import LiveMetabolism from './components/LiveMetabolism';
import { FaFireAlt, FaChartLine, FaRobot, FaLeaf, FaMagic, FaRunning, FaDna, FaHistory, FaUserAlt, FaStar } from 'react-icons/fa';

export default function Home() {
  const { apiKey, targetCalories, fitnessGoal, futureGoalDescription, currentWeight, targetWeight, height, setCurrentWeight, setTargetWeight } = useSettings();

  const { favorites, toggleFavorite, deleteFavorite, isMealFavorite } = useFavorites();
  const { isLoading, analyzeMealDescription, analyzeMealImage, getRecommendation, clearTokenUsage } =
    useNutritionApi();

  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [resetImageUpload, setResetImageUpload] = useState(0);
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<{ analysis: string; recommendation: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(`recommendation_${today}`);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse stored recommendation', e);
        }
      }
    }
    return null;
  });

  // Save recommendation whenever it changes
  useEffect(() => {
    if (recommendation) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`recommendation_${today}`, JSON.stringify(recommendation));
    }
  }, [recommendation]);

  const {
    dailyMeals,
    addMeal,
    deleteMeal,
    updateMeal,
    calculateDailyTotals,
    mealDescription,
    setMealDescription,
    editableItems,
    setEditableItems,
    isEditing,
    setIsEditing,
    updateItemNutrition,
    updateItemName,
    removeItem,
  } = useMeals();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) {
      router.push('/settings');
      return;
    }

    try {
      const items = await analyzeMealDescription(mealDescription);
      setEditableItems(items);
      setIsEditing(true);
      setEditingMealId(null);
    } catch (err) {
      console.error('Meal analysis failed:', err);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!apiKey) {
      router.push('/settings');
      return;
    }

    try {
      const items = await analyzeMealImage(file, mealDescription);
      setEditableItems(items);
      setIsEditing(true);
      setEditingMealId(null);
    } catch (err) {
      console.error('Image analysis failed:', err);
    }
  };

  const handleConfirmMeal = (adjustedItems: FoodItemNutrition[]) => {
    if (editingMealId) {
      updateMeal(editingMealId, {
        description: mealDescription,
        items: adjustedItems,
      });
      setEditingMealId(null);
    } else {
      addMeal({
        id: crypto.randomUUID(),
        description: mealDescription,
        items: adjustedItems,
        timestamp: new Date().toISOString(),
      });
    }

    // Trigger diet correction recommendation with vision context
    if (apiKey && adjustedItems.length > 0) {
      getRecommendation(adjustedItems, fitnessGoal, futureGoalDescription)
        .then(res => {
          setRecommendation(res);
        })
        .catch(err => {
          console.error('Failed to get recommendation:', err);
        });
    }

    setMealDescription('');
    setEditableItems([]);
    setIsEditing(false);
    setResetImageUpload(prev => prev + 1);
  };

  const handleEditMeal = (meal: MealEntry) => {
    setMealDescription(meal.description);
    setEditableItems(meal.items);
    setIsEditing(true);
    setEditingMealId(meal.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFavorite = (favorite: MealEntry) => {
    setMealDescription(favorite.description);
    setEditableItems(favorite.items);
    setIsEditing(true);
    setIsFavoritesOpen(false);
  };

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      {/* Refined Atmospheric Background */}
      <div className="top-[-10%] left-[-10%] absolute bg-blue-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />
      <div className="bottom-[-10%] right-[-10%] absolute bg-emerald-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />

      <main className="flex-grow flex flex-col p-4 sm:p-6 pb-2 gap-4 overflow-hidden">
        {/* 3-Column Zero-Scroll Grid */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

          {/* COLUMN 1: VICTORY RADAR (Fixed/Short) */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            <LiveMetabolism targetCalories={targetCalories} />

            <div className="glass-morphism p-6 rounded-[32px] border border-white/5 relative overflow-hidden shrink-0">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex justify-center items-center bg-blue-500 rounded-2xl w-8 h-8">
                  <FaUserAlt className="text-white text-xs" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Victory Radar</h3>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-blue-500/30 transition-colors">
                    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest block mb-1 px-1">My Weight</span>
                    <input
                      type="number"
                      value={currentWeight || 0}
                      onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
                      className="bg-transparent text-white text-sm font-black italic w-full focus:outline-none focus:text-blue-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5 group hover:border-emerald-500/30 transition-colors">
                    <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest block mb-1 px-1">Goal Weight</span>
                    <input
                      type="number"
                      value={targetWeight || 0}
                      onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 0)}
                      className="bg-transparent text-emerald-400 text-sm font-black italic w-full focus:outline-none focus:text-emerald-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>

                {futureGoalDescription && (
                  <div className="bg-blue-500/5 p-3 rounded-xl border border-blue-500/10 group cursor-pointer hover:bg-blue-500/10 transition-colors">
                    <p className="text-zinc-400 text-[9px] leading-relaxed italic line-clamp-2">"You've Got This: {futureGoalDescription}"</p>
                  </div>
                )}

                <div className="pt-2 border-t border-white/5">
                  <CalorieProgress totals={calculateDailyTotals()} targetCalories={targetCalories} size="sm" />
                </div>
              </div>
            </div>

            {!apiKey && <SettingsPrompt type="apiKey" />}
          </div>

          {/* COLUMN 2: FUEL THE MACHINE (Active Area) */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-zinc-800">
            <section className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-none">
                  <FaMagic className="text-blue-500" /> Fuel the Machine
                </div>
                <button
                  onClick={() => setIsFavoritesOpen(true)}
                  className="text-blue-400 text-[10px] font-black hover:text-blue-300 transition-colors uppercase tracking-widest"
                >
                  Hall of Fame
                </button>
              </div>

              <div className="glass-morphism p-1 rounded-[32px] overflow-hidden group hover:border-blue-500/20 transition-all shadow-2xl shadow-blue-500/5">
                <div className="bg-white/2 p-6 rounded-[31px]">
                  <MealForm
                    mealDescription={mealDescription}
                    setMealDescription={setMealDescription}
                    onSubmit={handleSubmit}
                    onImageUpload={handleImageUpload}
                    isLoading={isLoading}
                    onOpenFavorites={() => setIsFavoritesOpen(true)}
                    compact={true}
                    key={resetImageUpload}
                  />
                </div>
              </div>
            </section>

            {/* ANALYSIS AREA */}
            {(isEditing && editableItems.length > 0) || recommendation ? (
              <section className="space-y-6 animate-in zoom-in-95 duration-500">
                {isEditing && editableItems.length > 0 && (
                  <div className="glass-morphism p-1 rounded-[32px] border-blue-500/20 shadow-2xl shadow-blue-600/10">
                    <div className="bg-blue-500/5 p-6 rounded-[31px]">
                      <div className="flex items-center gap-3 mb-4">
                        <FaRobot className="text-blue-400 animate-bounce" />
                        <h3 className="font-black text-lg text-white tracking-tighter uppercase italic">Precision Input</h3>
                      </div>
                      <NutritionEditor
                        items={editableItems}
                        onUpdateItem={updateItemNutrition}
                        onUpdateItemName={updateItemName}
                        onRemoveItem={removeItem}
                        onConfirm={handleConfirmMeal}
                        onCancel={() => {
                          setIsEditing(false);
                          setEditableItems([]);
                          setEditingMealId(null);
                          clearTokenUsage();
                        }}
                        compact={true}
                      />
                    </div>
                  </div>
                )}

                {recommendation && (
                  <DietCorrection
                    analysis={recommendation.analysis}
                    recommendation={recommendation.recommendation}
                    onDismiss={() => {
                      setRecommendation(null);
                      const today = new Date().toISOString().split('T')[0];
                      localStorage.removeItem(`recommendation_${today}`);
                    }}
                    compact={true}
                  />
                )}
              </section>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center opacity-20 py-20 pointer-events-none">
                <FaStar className="text-6xl text-yellow-500 mb-4 animate-pulse" />
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] text-center">Fuel Up for Excellence!<br /><span className="text-[8px] opacity-50">You are one meal away from a better you.</span></p>
              </div>
            )}
          </div>

          {/* COLUMN 3: VICTORY LOG (History) */}
          <div className="lg:col-span-3 xl:col-span-4 flex flex-col gap-4 overflow-hidden border-l border-white/5 pl-6">
            <div className="flex justify-between items-center px-1 shrink-0">
              <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                <FaHistory className="text-rose-500" /> Victory Log
              </div>
              <span className="text-[8px] text-zinc-700 font-black tracking-widest uppercase italic">{dailyMeals.length} Wins Today</span>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800 space-y-3">
              {dailyMeals.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center glass-morphism rounded-[32px] border-dashed border-white/5 border-2 p-10">
                  <FaLeaf className="text-zinc-800 text-3xl mb-4" />
                  <p className="text-zinc-700 text-[8px] font-bold uppercase tracking-[0.3em] text-center italic">Waiting for biological data points</p>
                </div>
              ) : (
                <MealList
                  meals={dailyMeals}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteMeal}
                  onEdit={handleEditMeal}
                  isFavorite={isMealFavorite}
                  compact={true}
                />
              )}
            </div>
          </div>

        </div>

        <FavoritesModal
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          favorites={favorites}
          onSelect={handleSelectFavorite}
          onDelete={deleteFavorite}
        />
      </main>
    </div>
  );
}
