'use client';

interface NutritionTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

interface CalorieProgressProps {
  totals: NutritionTotals;
  targetCalories: number;
  size?: 'sm' | 'md';
}

export default function CalorieProgress({ totals, targetCalories, size = 'md' }: CalorieProgressProps) {
  const isSm = size === 'sm';
  const calories = Math.round(totals.calories);
  const percentage = Math.min((calories / targetCalories) * 100, 100);
  const remaining = targetCalories - calories;
  const isOver = remaining < 0;

  // Determine colors based on status
  const getStatusInfo = () => {
    if (isOver) return { color: 'from-rose-500 to-red-600', text: 'text-rose-400', label: 'Fuel Surge!' };
    if (remaining < targetCalories * 0.1) return { color: 'from-amber-400 to-orange-500', text: 'text-amber-400', label: 'Peak Zone' };
    return { color: 'from-emerald-400 to-blue-500', text: 'text-emerald-400', label: 'Winning Strategy' };
  };

  const status = getStatusInfo();

  const macros = [
    { label: 'Prot', value: totals.protein, color: 'text-rose-400', bg: 'bg-rose-500/10' },
    { label: 'Carb', value: totals.carbs, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Fat', value: totals.fat, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Fiber', value: totals.fiber, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className={isSm ? "space-y-3" : "space-y-6"}>
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className={`font-black tracking-tight text-white ${isSm ? "text-xl" : "text-3xl sm:text-4xl"}`}>
            {calories.toLocaleString()} <span className="text-zinc-500 text-xs font-medium tracking-normal">/ {targetCalories.toLocaleString()}</span>
          </p>
          <p className={`text-[8px] font-bold uppercase tracking-[0.2em] ${status.text}`}>
            {status.label}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-bold tracking-tight ${status.text} ${isSm ? "text-lg" : "text-2xl"}`}>
            {isOver ? `+${Math.abs(remaining).toLocaleString()}` : remaining.toLocaleString()}
          </p>
          <p className="text-zinc-600 text-[8px] font-medium uppercase tracking-widest">
            {isOver ? 'Excess' : 'Left'}
          </p>
        </div>
      </div>

      <div className={`relative bg-white/5 rounded-full overflow-hidden border border-white/5 ${isSm ? "h-2" : "h-4"}`}>
        <div
          className={`h-full bg-gradient-to-r ${status.color} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-gradient-x" />
        </div>
      </div>

      <div className={`gap-2 grid ${isSm ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}>
        {macros.map((macro) => (
          <div key={macro.label} className={`flex flex-col items-center p-2 rounded-xl border border-white/5 ${macro.bg}`}>
            <span className={`font-bold ${isSm ? "text-[10px]" : "text-lg"} ${macro.color}`}>{Math.round(macro.value)}g</span>
            <span className="text-zinc-600 text-[7px] font-black uppercase tracking-widest">{macro.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
