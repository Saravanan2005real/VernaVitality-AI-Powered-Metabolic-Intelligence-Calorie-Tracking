'use client';
import type { FoodItemNutrition, NutritionData } from '@/lib/ai';
import { useEffect, useRef, useState } from 'react';
import { FaPen, FaTrash, FaCheck, FaTimes, FaLayerGroup } from 'react-icons/fa';

type ExtendedNutritionData = NutritionData & {
  grams: number;
};

const SERVING_SIZE_OPTIONS = [
  { value: '0.25', label: '1/4' },
  { value: '0.5', label: '1/2' },
  { value: '1', label: '1x' },
  { value: '1.5', label: '1.5x' },
  { value: '2', label: '2x' },
];

interface NutritionEditorProps {
  items: FoodItemNutrition[];
  onUpdateItem: (itemIndex: number, field: keyof NutritionData, value: number) => void;
  onUpdateItemName: (itemIndex: number, newName: string) => void;
  onRemoveItem: (itemIndex: number) => void;
  onConfirm: (adjustedItems: FoodItemNutrition[]) => void;
  onCancel: () => void;
  compact?: boolean;
}

export default function NutritionEditor({
  items,
  onUpdateItem,
  onUpdateItemName,
  onRemoveItem,
  onConfirm,
  onCancel,
  compact = false,
}: NutritionEditorProps) {
  const initialNutritionPerGram = useRef<(ExtendedNutritionData | null)[]>([]);
  const [originalItems, setOriginalItems] = useState<FoodItemNutrition[]>([]);
  const isInitialized = useRef(false);
  const [activeChange, setActiveChange] = useState<{
    itemIndex: number;
    field: keyof NutritionData;
    value: string;
  } | null>(null);
  const [activeNameEdit, setActiveNameEdit] = useState<{
    itemIndex: number;
    value: string;
  } | null>(null);
  const [servingSize, setServingSize] = useState<number>(1);
  const [activeServingEdit, setActiveServingEdit] = useState<string>('1');

  useEffect(() => {
    if (items.length > 0 && !isInitialized.current) {
      setOriginalItems(JSON.parse(JSON.stringify(items)));
      isInitialized.current = true;
      initialNutritionPerGram.current = items.map(item => {
        const nutrition = item.nutrition as ExtendedNutritionData;
        if (!nutrition.grams || nutrition.grams === 0) return null;
        return {
          calories: nutrition.calories / nutrition.grams,
          protein: nutrition.protein / nutrition.grams,
          carbs: nutrition.carbs / nutrition.grams,
          fat: nutrition.fat / nutrition.grams,
          fiber: nutrition.fiber / nutrition.grams,
          grams: 1,
        };
      });
    }
  }, [items]);

  const handleInputChange = (itemIndex: number, field: keyof NutritionData, value: string) => {
    setActiveChange({ itemIndex, field, value });
  };

  const handleNameChange = (itemIndex: number, value: string) => {
    setActiveNameEdit({ itemIndex, value });
  };

  const commitServingSizeChange = () => {
    const newServingSize = parseFloat(activeServingEdit) || 1;
    if (newServingSize <= 0) {
      setActiveServingEdit('1');
      setServingSize(1);
      return;
    }
    setServingSize(newServingSize);
    setActiveServingEdit(newServingSize.toString());
  };

  const commitNameChange = () => {
    if (!activeNameEdit) return;
    const { itemIndex, value } = activeNameEdit;
    const newName = value.trim() || 'Unnamed Item';
    onUpdateItemName(itemIndex, newName);
    setOriginalItems(prev => {
      const newItems = [...prev];
      if (newItems[itemIndex]) newItems[itemIndex].item = newName;
      return newItems;
    });
    setActiveNameEdit(null);
  };

  const commitChange = () => {
    if (!activeChange) return;
    const { itemIndex, field, value } = activeChange;
    const numericValue = value === '' ? 0 : parseFloat(value) || 0;
    if (field === 'grams' && initialNutritionPerGram.current[itemIndex]) {
      const perGramValues = initialNutritionPerGram.current[itemIndex];
      if (perGramValues) {
        (Object.keys(perGramValues) as Array<keyof ExtendedNutritionData>).forEach(nutrientKey => {
          if (nutrientKey !== 'grams') {
            const scaledValue = parseFloat((perGramValues[nutrientKey] * numericValue).toFixed(2));
            onUpdateItem(itemIndex, nutrientKey, scaledValue);
            setOriginalItems(prev => {
              const newItems = [...prev];
              if (newItems[itemIndex]) newItems[itemIndex].nutrition[nutrientKey] = scaledValue;
              return newItems;
            });
          }
        });
      }
    }
    onUpdateItem(itemIndex, field, numericValue);
    setOriginalItems(prev => {
      const newItems = [...prev];
      if (newItems[itemIndex]) newItems[itemIndex].nutrition[field] = numericValue;
      return newItems;
    });
    setActiveChange(null);
  };

  const getDisplayValue = (itemIndex: number, field: keyof NutritionData, value: number): string => {
    if (activeChange && activeChange.itemIndex === itemIndex && activeChange.field === field) return activeChange.value;
    if (!isInitialized.current || originalItems.length === 0 || !originalItems[itemIndex]) return value.toString();
    const originalValue = originalItems[itemIndex].nutrition[field];
    return parseFloat((originalValue * servingSize).toFixed(2)).toString();
  };

  const handleConfirm = () => {
    if (servingSize === 1) {
      onConfirm([...items]);
      return;
    }
    const adjustedItems = items.map((item, itemIndex) => {
      if (!originalItems[itemIndex]) return item;
      const newItem = { ...item };
      const scaledNutrition = { ...item.nutrition };
      (Object.keys(originalItems[itemIndex].nutrition) as Array<keyof NutritionData>).forEach(key => {
        const originalValue = originalItems[itemIndex].nutrition[key];
        scaledNutrition[key] = parseFloat((originalValue * servingSize).toFixed(2));
      });
      newItem.nutrition = scaledNutrition;
      return newItem;
    });
    onConfirm(adjustedItems);
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-6"}>
      {!compact && (
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-blue-500/20 rounded-xl w-10 h-10">
            <FaLayerGroup className="text-blue-500" />
          </div>
          <div>
            <h2 className="font-bold text-white text-lg">Verify Nutrition</h2>
            <p className="text-gray-400 text-xs">Confirm AI analysis results below</p>
          </div>
        </div>
      )}

      <div className={compact ? "space-y-2" : "space-y-4"}>
        {items.map((item, itemIndex) => (
          <div key={itemIndex} className={`bg-zinc-900/40 rounded-2xl border border-white/5 ${compact ? "p-3 space-y-3" : "p-5 space-y-4"}`}>
            <div className="flex justify-between items-center">
              {activeNameEdit && activeNameEdit.itemIndex === itemIndex ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={activeNameEdit.value}
                    onChange={e => handleNameChange(itemIndex, e.target.value)}
                    className="bg-zinc-800 px-3 py-1 border border-blue-500/50 rounded-lg w-full text-white text-xs focus:outline-none"
                    autoFocus
                  />
                  <button onClick={commitNameChange} className="bg-blue-600 p-1.5 rounded-lg text-white">
                    <FaCheck size={10} />
                  </button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <p className={`font-bold text-zinc-200 capitalize ${compact ? "text-xs" : ""}`}>{item.item}</p>
                  <button
                    onClick={() => setActiveNameEdit({ itemIndex, value: item.item })}
                    className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-white transition-opacity"
                  >
                    <FaPen size={8} />
                  </button>
                </div>
              )}
              <button
                onClick={() => onRemoveItem(itemIndex)}
                className="hover:bg-rose-500/10 p-1.5 rounded-lg text-zinc-500 hover:text-rose-500 transition-colors"
              >
                <FaTrash size={10} />
              </button>
            </div>

            <div className={`grid ${compact ? "grid-cols-3 gap-2" : "grid-cols-2 sm:grid-cols-5 gap-3"}`}>
              {(Object.keys(item.nutrition) as Array<keyof NutritionData>).map(field => (
                <div key={field} className="space-y-0.5">
                  <label className="text-zinc-600 text-[7px] font-black uppercase tracking-widest">{field}</label>
                  <input
                    type="number"
                    value={getDisplayValue(itemIndex, field, item.nutrition[field])}
                    onChange={e => handleInputChange(itemIndex, field, e.target.value)}
                    onBlur={commitChange}
                    className={`bg-zinc-800/50 hover:bg-zinc-800 px-2 py-1 border border-white/5 focus:border-blue-500/50 rounded-lg w-full text-white transition-colors focus:outline-none ${compact ? "text-[10px]" : "text-sm"}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={`bg-blue-600/5 border border-blue-600/10 space-y-3 ${compact ? "p-4 rounded-2xl" : "p-6 rounded-3xl"}`}>
        <div className="flex justify-between items-center gap-4">
          <div className="space-y-0.5">
            <h4 className={`font-black tracking-tight text-white ${compact ? "text-xs" : ""}`}>Serving Size</h4>
            {!compact && <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Scale All Values</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.1"
              value={activeServingEdit}
              onChange={e => setActiveServingEdit(e.target.value)}
              onBlur={commitServingSizeChange}
              className={`bg-zinc-900 border-white/10 text-center text-white focus:outline-none border rounded-lg ${compact ? "w-16 py-1 text-xs" : "w-24 py-2 text-sm"}`}
            />
            <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">x</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-1.5">
          {SERVING_SIZE_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => {
                setActiveServingEdit(option.value);
                setServingSize(parseFloat(option.value));
              }}
              className={`p-1.5 px-3 rounded-lg text-[10px] font-black tracking-widest uppercase transition-all ${Math.abs(parseFloat(activeServingEdit) - parseFloat(option.value)) < 0.01
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-zinc-800 text-zinc-500 hover:text-white'
                }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleConfirm}
          className={`flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-xl shadow-emerald-500/20 rounded-xl text-white font-black uppercase tracking-widest transition-all active:scale-[0.98] ${compact ? "p-3 text-[10px]" : "p-4 text-sm"}`}
        >
          Confirm Log
        </button>
        <button
          onClick={onCancel}
          className={`bg-zinc-900 hover:bg-zinc-800 px-4 rounded-xl text-zinc-600 font-black uppercase tracking-widest transition-all ${compact ? "p-3 text-[10px]" : "p-4 text-sm"}`}
        >
          Void
        </button>
      </div>
    </div>
  );
}
