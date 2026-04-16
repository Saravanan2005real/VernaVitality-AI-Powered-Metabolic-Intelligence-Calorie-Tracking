'use client';
import { useEffect, useState } from 'react';
import { FaBolt, FaHeartbeat, FaWaveSquare } from 'react-icons/fa';

interface LiveMetabolismProps {
    targetCalories: number;
}

export default function LiveMetabolism({ targetCalories }: LiveMetabolismProps) {
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [pulse, setPulse] = useState(false);
    const [bpm, setBpm] = useState(72);

    useEffect(() => {
        const baseKcalPerSec = (targetCalories || 2000) / 86400;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const secondsPassed = (now.getTime() - startOfDay.getTime()) / 1000;

        setCaloriesBurned(secondsPassed * baseKcalPerSec);

        const interval = setInterval(() => {
            // Add slight randomness to burn rate and BPM
            const flux = 0.95 + Math.random() * 0.1;
            setCaloriesBurned(prev => prev + baseKcalPerSec * flux);
            setBpm(prev => Math.max(60, Math.min(100, prev + (Math.random() - 0.5) * 4)));
            setPulse(true);
            setTimeout(() => setPulse(false), 300);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetCalories]);

    return (
        <div className="glass-morphism p-5 rounded-[32px] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-[-10%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <FaHeartbeat size={100} className={`${pulse ? 'scale-110 text-rose-500' : 'scale-100 text-white'} transition-all duration-300`} />
            </div>

            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className={`flex justify-center items-center rounded-xl w-8 h-8 ${pulse ? 'bg-blue-500/30' : 'bg-blue-500/10'} transition-colors duration-300`}>
                        <FaBolt className={`${pulse ? 'text-yellow-400' : 'text-blue-400'} transition-colors duration-300`} />
                    </div>
                    <div>
                        <h3 className="font-black text-xs text-white tracking-tighter uppercase italic">Live Metabolism</h3>
                        <p className="text-zinc-600 text-[7px] font-black uppercase tracking-[0.2em]">Telemetry Active</p>
                    </div>
                </div>
                <div className="bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest italic">{bpm.toFixed(0)} BPM</span>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="font-black text-3xl text-white tracking-tighter italic leading-none">
                            {caloriesBurned.toFixed(3)}
                        </p>
                        <p className="text-zinc-600 text-[8px] font-black uppercase tracking-[0.2em] mt-1">Energy Deployed (KCAL)</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                        <FaWaveSquare className={`text-blue-500/20 text-xl ${pulse ? 'opacity-100 scale-x-110' : 'opacity-30'} transition-all`} />
                        <span className="text-[7px] font-black text-zinc-700 uppercase tracking-widest leading-none">Signal 112.4Hz</span>
                    </div>
                </div>

                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${(caloriesBurned / (targetCalories || 2000)) * 100}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
