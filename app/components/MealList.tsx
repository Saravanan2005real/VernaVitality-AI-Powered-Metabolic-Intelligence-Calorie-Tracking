'use client';
import type { MealEntry } from '../../lib/types';
import MealItem from './MealItem';

interface MealListProps {
  meals: MealEntry[];
  onToggleFavorite: (_meal: MealEntry) => void;
  onDelete: (_id: string) => void;
  onEdit?: (_meal: MealEntry) => void;
  isFavorite: (_id: string) => boolean;
  compact?: boolean;
}

export default function MealList({
  meals,
  onToggleFavorite,
  onDelete,
  onEdit,
  isFavorite,
  compact = false,
}: MealListProps) {
  if (meals.length === 0) return null;

  const sortedMeals = [...meals].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {sortedMeals.map(meal => (
        <MealItem
          key={meal.id}
          id={meal.id}
          description={meal.description}
          items={meal.items}
          timestamp={meal.timestamp}
          isFavorite={isFavorite(meal.id)}
          onToggleFavorite={() => onToggleFavorite(meal)}
          onDelete={() => onDelete(meal.id)}
          onEdit={onEdit ? () => onEdit(meal) : undefined}
          compact={compact}
        />
      ))}
    </div>
  );
}
