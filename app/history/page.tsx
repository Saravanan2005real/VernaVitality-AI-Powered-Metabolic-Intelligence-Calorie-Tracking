'use client';
import type { FoodItemNutrition } from '@/lib/ai';
import type { MealEntry } from '@/lib/types';
import { useEffect, useState } from 'react';
import DayMealsModal from '../components/DayMealsModal';
import { FaCalendarAlt, FaChevronRight, FaHistory, FaTrophy, FaChartLine, FaCalendarCheck } from 'react-icons/fa';
import LiveMetabolism from '../components/LiveMetabolism';
import { useSettings } from '@/lib/contexts/SettingsContext';

interface DailyTotal {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  count: number;
}

export default function History() {
  const { targetCalories } = useSettings();
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedMeals, setSelectedMeals] = useState<MealEntry[]>([]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const mealKeys = keys.filter(key => key.startsWith('meals_'));

    const totals = mealKeys.map(key => {
      const date = key.replace('meals_', '');
      const meals = JSON.parse(localStorage.getItem(key) || '[]') as MealEntry[];

      const dailyTotal = meals.reduce(
        (total: DailyTotal, meal: MealEntry) => {
          const mealTotal = meal.items.reduce(
            (itemTotal: Omit<DailyTotal, 'date' | 'count'>, item: FoodItemNutrition) => ({
              calories: itemTotal.calories + item.nutrition.calories,
              protein: itemTotal.protein + item.nutrition.protein,
              carbs: itemTotal.carbs + item.nutrition.carbs,
              fat: itemTotal.fat + item.nutrition.fat,
            }),
            { calories: 0, protein: 0, carbs: 0, fat: 0 }
          );

          return {
            date,
            count: total.count + 1,
            calories: total.calories + mealTotal.calories,
            protein: total.protein + mealTotal.protein,
            carbs: total.carbs + mealTotal.carbs,
            fat: total.fat + mealTotal.fat,
          };
        },
        { date, calories: 0, protein: 0, carbs: 0, fat: 0, count: 0 }
      );

      return dailyTotal;
    });

    totals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDailyTotals(totals);
  }, []);

  const handleDayClick = (date: string) => {
    const meals = JSON.parse(localStorage.getItem(`meals_${date}`) || '[]') as MealEntry[];
    setSelectedDate(date);
    setSelectedMeals(meals);
  };

  const avgCalories = dailyTotals.length > 0
    ? Math.round(dailyTotals.reduce((acc, curr) => acc + curr.calories, 0) / dailyTotals.length)
    : 0;

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      <div className="top-[-10%] left-[-10%] absolute bg-blue-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />
      <div className="bottom-[-10%] right-[-10%] absolute bg-rose-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />

      <main className="flex-grow flex flex-col p-4 sm:p-6 pb-2 gap-4 overflow-hidden">
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

          {/* COLUMN 1: BIO-SUMMARY */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            <LiveMetabolism targetCalories={targetCalories} />

            <div className="glass-morphism p-6 rounded-[32px] border border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-blue-500 rounded-xl w-8 h-8">
                  <FaChartLine className="text-white text-xs" />
                </div>
                <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">My Victory Path</h3>
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Daily Power</p>
                  <p className="text-2xl font-black text-white italic tracking-tighter">{avgCalories} <span className="text-xs text-zinc-600 not-italic">KCAL/DAY</span></p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Total Victories</p>
                  <p className="text-2xl font-black text-emerald-500 italic tracking-tighter">{dailyTotals.length} <span className="text-xs text-zinc-600 not-italic">DAYS WON</span></p>
                </div>
                <div className="p-2 border border-blue-500/20 rounded-xl bg-blue-500/5 text-center mt-2">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-tight italic">Success is a series of small wins! Keep going!</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 2: PAST WINS */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 overflow-hidden min-h-0">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-blue-600 rounded-xl w-8 h-8">
                  <FaHistory className="text-white text-sm" />
                </div>
                <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Past Wins</h3>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto px-2 space-y-3 scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
              {dailyTotals.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 glass-morphism rounded-3xl border border-white/5 opacity-50">
                  <FaCalendarAlt className="w-12 h-12 text-zinc-800 mb-4" />
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">Waiting for your first victory!</p>
                </div>
              ) : (
                dailyTotals.map(day => (
                  <button
                    key={day.date}
                    onClick={() => handleDayClick(day.date)}
                    className="group flex justify-between items-center glass-morphism p-4 rounded-2xl w-full text-left transition-all hover:bg-white/10 border-white/5 border relative overflow-hidden"
                  >
                    <div className="relative z-10 flex-grow">
                      <p className="font-black text-white italic uppercase tracking-tighter text-sm mb-1">
                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-black uppercase bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded tracking-widest">{day.count} MEALS</span>
                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                        <span className="text-[8px] font-black uppercase text-zinc-500 tracking-widest">Victory Breakdown Logged</span>
                      </div>
                    </div>
                    <div className="relative z-10 text-right">
                      <p className="text-xl font-black text-white italic leading-none">{Math.round(day.calories)}</p>
                      <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">KCAL</p>
                    </div>
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-emerald-500 transform translate-x-1 group-hover:translate-x-0 transition-transform" />
                  </button>
                ))
              )}
            </div>
          </div>

          {/* COLUMN 3: HALL OF FAME */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-hidden border-l border-white/5 pl-6">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-emerald-500 rounded-xl w-8 h-8">
                <FaTrophy className="text-white text-sm" />
              </div>
              <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Hall of Fame</h3>
            </div>

            <div className="space-y-4">
              <div className="glass-morphism p-5 rounded-2xl border border-white/5 space-y-4 shadow-xl shadow-emerald-500/5">
                <div className="flex items-center gap-2">
                  <FaCalendarCheck className="text-emerald-500 text-xs" />
                  <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest">Victory Streak</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black text-white italic tracking-tighter leading-none">{dailyTotals.length}</span>
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Days Strong</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[100%]" />
                </div>
              </div>

              <div className="bg-emerald-500/5 p-5 rounded-2xl border border-dashed border-emerald-500/10 text-center space-y-2">
                <p className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Building a Legacy</p>
                <p className="text-[10px] text-zinc-500 italic">Every day you log is a day you take control. Your future self is thanking you right now!</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <DayMealsModal
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        date={selectedDate || ''}
        meals={selectedMeals}
      />
    </div>
  );
}
