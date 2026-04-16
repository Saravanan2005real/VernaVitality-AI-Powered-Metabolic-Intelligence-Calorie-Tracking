'use client';

import { useSettings } from '@/lib/contexts/SettingsContext';
import { useWeights } from '@/lib/hooks/useWeights';
import { WeightEntry } from '@/lib/types';
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { FaChevronDown, FaChevronUp, FaTrash, FaPlus, FaChartLine, FaHistory } from 'react-icons/fa';

let chartRegistered = false;

type WeightChartData = ChartData<'line', number[], string>;

export default function WeightTracker() {
  const { targetWeight } = useSettings();
  const { weights, addWeight, deleteWeight, isLoading } = useWeights();

  const [newWeight, setNewWeight] = useState<string>('');
  const [newNote, setNewNote] = useState<string>('');
  const [newDate, setNewDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [chartData, setChartData] = useState<WeightChartData | null>(null);

  useEffect(() => {
    if (!chartRegistered) {
      ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
      );
      chartRegistered = true;
    }
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const weightStats = useMemo(() => {
    if (weights.length === 0) return null;

    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];

    const startWeight = firstEntry.weight;
    const currentWeight = lastEntry.weight;
    const weightChange = currentWeight - startWeight;
    const weightChangePercent = (weightChange / startWeight) * 100;

    let progressPercent = 0;
    if (targetWeight > 0) {
      if (startWeight > targetWeight) {
        const totalToLose = startWeight - targetWeight;
        const lost = startWeight - currentWeight;
        progressPercent = Math.min(100, Math.max(0, (lost / totalToLose) * 100));
      } else if (startWeight < targetWeight) {
        const totalToGain = targetWeight - startWeight;
        const gained = currentWeight - startWeight;
        progressPercent = Math.min(100, Math.max(0, (gained / totalToGain) * 100));
      } else {
        progressPercent = 100;
      }
    }

    return {
      startWeight,
      currentWeight,
      weightChange,
      weightChangePercent,
      progressPercent,
      entries: sortedEntries.length,
      isWeightLoss: startWeight > targetWeight,
    };
  }, [weights, targetWeight]);

  useEffect(() => {
    if (isLoading || weights.length === 0) return;

    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const labels = sortedEntries.map(entry => formatDate(entry.date));
    const weightData = sortedEntries.map(entry => entry.weight);
    const targetData = targetWeight ? Array(labels.length).fill(targetWeight) : [];

    setChartData({
      labels,
      datasets: [
        {
          label: 'Weight',
          data: weightData,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        ...(targetWeight
          ? [
            {
              label: 'Target',
              data: targetData,
              borderColor: 'rgba(244, 63, 94, 0.5)',
              borderDash: [6, 6],
              pointRadius: 0,
              borderWidth: 2,
            } as any,
          ]
          : []),
      ],
    });
  }, [weights, targetWeight, isLoading]);

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(newWeight);
    if (isNaN(weightValue) || weightValue <= 0) return;
    const dateISO = new Date(`${newDate}T12:00:00`).toISOString();
    addWeight(weightValue, newNote.trim() || undefined, dateISO);
    setNewWeight('');
    setNewNote('');
    setNewDate(new Date().toISOString().split('T')[0]);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Delete this entry?')) {
      deleteWeight(id);
    }
  };

  const getPreviousEntry = (currentEntry: WeightEntry): WeightEntry | null => {
    if (weights.length <= 1) return null;
    const sortedEntries = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const currentIndex = sortedEntries.findIndex(entry => entry.id === currentEntry.id);
    if (currentIndex <= 0) return null;
    return sortedEntries[currentIndex - 1];
  };

  if (isLoading) return <div className="py-20 text-center animate-pulse text-zinc-500 uppercase tracking-widest font-bold text-xs">Syncing Data...</div>;

  return (
    <div className="space-y-8 pb-12">
      {weightStats && (
        <div className="glass-morphism p-6 rounded-3xl border border-white/5 space-y-6">
          <div className="gap-4 grid grid-cols-3">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Start</p>
              <p className="font-bold text-lg text-white">{weightStats.startWeight} <span className="text-xs font-medium text-zinc-500">kg</span></p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Current</p>
              <p className="font-bold text-lg text-white">{weightStats.currentWeight} <span className="text-xs font-medium text-zinc-500">kg</span></p>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Change</p>
              <div className={`font-bold text-lg flex items-center justify-center gap-1 ${weightStats.weightChange === 0 ? 'text-zinc-500' : weightStats.weightChange < 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                {weightStats.weightChange > 0 ? '+' : ''}{weightStats.weightChange.toFixed(1)}
                {weightStats.weightChange !== 0 && (
                  <span>{weightStats.weightChange < 0 ? <FaChevronDown size={12} /> : <FaChevronUp size={12} />}</span>
                )}
              </div>
            </div>
          </div>

          {targetWeight > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Goal Progress</p>
                  <p className="text-2xl font-bold text-white tracking-tight">{weightStats.progressPercent.toFixed(0)}%</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg text-zinc-300 tracking-tight">{Math.abs(targetWeight - weightStats.currentWeight).toFixed(1)} <span className="text-xs font-medium">kg</span></p>
                  <p className="text-zinc-600 text-[10px] font-bold uppercase">To reach target</p>
                </div>
              </div>
              <div className="relative bg-zinc-800 rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)] ${weightStats.isWeightLoss ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-blue-500 shadow-blue-500/20'
                    }`}
                  style={{ width: `${weightStats.progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-zinc-600 text-[10px] font-bold tracking-widest uppercase">
                <span>{weightStats.startWeight} kg</span>
                <span>{targetWeight} kg</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="glass-morphism p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex justify-center items-center bg-blue-500/20 rounded-xl w-10 h-10">
            <FaPlus className="text-blue-500" />
          </div>
          <h2 className="font-bold text-xl text-white tracking-tight">Post New Entry</h2>
        </div>

        <form onSubmit={handleAddWeight} className="space-y-6">
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="weight" className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Body Mass (KG)</label>
              <input
                type="number"
                id="weight"
                value={newWeight}
                onChange={e => setNewWeight(e.target.value)}
                placeholder="0.0"
                className="bg-zinc-900/50 p-4 border border-white/10 focus:border-blue-500/50 rounded-2xl w-full text-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/5"
                step="0.1" required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="date" className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Date of Record</label>
              <input
                type="date"
                id="date"
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="bg-zinc-900/50 p-4 border border-white/10 focus:border-blue-500/50 rounded-2xl w-full text-white transition-all focus:outline-none"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="note" className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Insights / Notes</label>
            <input
              type="text"
              id="note"
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              placeholder="How do you feel today?"
              className="bg-zinc-900/50 p-4 border border-white/10 focus:border-blue-500/50 rounded-2xl w-full text-white transition-all focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 p-4 rounded-2xl w-full text-white font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            Submit Entry
          </button>
        </form>
      </div>

      {chartData && (
        <div className="glass-morphism p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-emerald-500/20 rounded-xl w-10 h-10">
              <FaChartLine className="text-emerald-500" />
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">Weight Analysis</h2>
          </div>
          <div className="h-64 sm:h-80">
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#71717a', font: { size: 10 } } },
                  x: { grid: { display: false }, ticks: { color: '#71717a', font: { size: 10 } } },
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: '#18181b',
                    titleColor: '#fff',
                    bodyColor: '#3b82f6',
                    padding: 12,
                    cornerRadius: 12,
                    displayColors: false,
                  },
                },
              }}
            />
          </div>
        </div>
      )}

      <div className="glass-morphism p-8 rounded-3xl border border-white/5 space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex justify-center items-center bg-zinc-700/20 rounded-xl w-10 h-10">
              <FaHistory className="text-zinc-500" />
            </div>
            <h2 className="font-bold text-xl text-white tracking-tight">Entry Log</h2>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${editMode ? 'text-blue-400' : 'text-zinc-500 hover:text-white'}`}
          >
            {editMode ? 'Save View' : 'Modify'}
          </button>
        </div>

        {weights.length === 0 ? (
          <p className="py-12 text-zinc-600 text-center font-bold text-xs uppercase tracking-[0.2em]">No logs yet</p>
        ) : (
          <div className="space-y-3">
            {[...weights]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((entry: WeightEntry) => {
                const prevEntry = getPreviousEntry(entry);
                const weightDiff = prevEntry ? entry.weight - prevEntry.weight : 0;
                return (
                  <div key={entry.id} className="group relative flex justify-between items-center bg-white/5 hover:bg-white/10 p-4 rounded-2xl transition-all border border-white/5">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white text-lg">{entry.weight.toFixed(1)} <span className="text-xs font-medium text-zinc-500">kg</span></span>
                        {prevEntry && (
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${weightDiff === 0 ? 'bg-zinc-800 text-zinc-500' : weightDiff < 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                            }`}>
                            {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                      {entry.note && <div className="mt-2 text-zinc-400 text-xs italic">&ldquo;{entry.note}&rdquo;</div>}
                    </div>
                    {editMode && (
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="bg-rose-500/10 hover:bg-rose-500 p-2.5 rounded-xl text-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/0 hover:shadow-rose-500/20"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
