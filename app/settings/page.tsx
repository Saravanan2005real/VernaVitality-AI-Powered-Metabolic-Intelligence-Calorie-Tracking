'use client';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { useState, Suspense } from 'react';
import { FaUserAlt, FaWeight, FaRulerVertical, FaCalendarAlt, FaRunning, FaRocket, FaDatabase, FaCog, FaEye, FaEyeSlash, FaDna, FaShieldAlt, FaChartArea, FaFireAlt, FaStar, FaCheckCircle } from 'react-icons/fa';
import LiveMetabolism from '../components/LiveMetabolism';
import dynamic from 'next/dynamic';

const DynamicWeightTracker = dynamic(() => import('../components/WeightTracker'), { ssr: false });

export default function ProfilePage() {
  const {
    apiKey,
    setApiKey,
    targetCalories,
    setTargetCalories,
    targetWeight,
    setTargetWeight,
    currentWeight,
    setCurrentWeight,
    height,
    setHeight,
    age,
    setAge,
    gender,
    setGender,
    activityLevel,
    setActivityLevel,
    fitnessGoal,
    setFitnessGoal,
    futureGoalDescription,
    setFutureGoalDescription,
  } = useSettings();

  const [showApiKey, setShowApiKey] = useState(false);

  const SectionTitle = ({ title, icon: Icon, color = "bg-blue-600" }: { title: string, icon: any, color?: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className={`flex justify-center items-center ${color} rounded-xl w-8 h-8`}>
        <Icon className="text-white text-sm" />
      </div>
      <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">{title}</h3>
    </div>
  );

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      <div className="top-[-10%] left-[-10%] absolute bg-blue-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />
      <div className="bottom-[-10%] right-[-10%] absolute bg-purple-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />

      <main className="flex-grow flex flex-col p-4 sm:p-6 pb-2 gap-4 overflow-hidden">
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

          {/* COLUMN 1: MISSION BASE */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            <LiveMetabolism targetCalories={targetCalories} />

            <div className="glass-morphism p-6 rounded-[32px] border border-white/5 space-y-6">
              <SectionTitle title="Body Stats" icon={FaDna} />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <label className="text-zinc-600 text-[8px] font-black uppercase tracking-widest block mb-1">Height (cm)</label>
                    <input type="number" value={height || ''} onChange={e => setHeight(parseFloat(e.target.value) || 0)} className="bg-transparent text-white font-black italic w-full focus:outline-none text-sm" />
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <label className="text-zinc-600 text-[8px] font-black uppercase tracking-widest block mb-1">Age</label>
                    <input type="number" value={age || ''} onChange={e => setAge(parseInt(e.target.value) || 0)} className="bg-transparent text-white font-black italic w-full focus:outline-none text-sm" />
                  </div>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <label className="text-zinc-600 text-[8px] font-black uppercase tracking-widest block mb-1">Daily Activity Level</label>
                  <select value={activityLevel} onChange={e => setActivityLevel(e.target.value)} className="bg-transparent text-white font-black italic w-full focus:outline-none text-xs appearance-none">
                    <option value="Sedentary">Mostly Sitting</option>
                    <option value="Light">Light Exercise (1-2 days)</option>
                    <option value="Moderate">Active (3-5 days)</option>
                    <option value="Active">Very Active (Daily)</option>
                    <option value="Elite">Athlete Level</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="glass-morphism p-6 rounded-[32px] border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <SectionTitle title="System Status" icon={FaShieldAlt} color="bg-zinc-800" />
                {apiKey ? <span className="text-emerald-500 text-[8px] font-black flex items-center gap-1 uppercase tracking-widest"><FaCheckCircle /> Online</span> : <span className="text-rose-500 text-[8px] font-black uppercase tracking-widest">Offline</span>}
              </div>

              <div className="space-y-3">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <label className="block mb-1 text-zinc-600 text-[8px] font-black uppercase tracking-widest">AI Brain Connection</label>
                  <div className="relative group">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Enter API Key to enable brain"
                      className="bg-black/20 p-2 pr-8 border border-white/5 rounded-lg w-full text-zinc-400 text-[10px] font-mono focus:outline-none"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="right-2 absolute inset-y-0 flex items-center text-zinc-700 hover:text-blue-500 transition-colors"
                    >
                      {showApiKey ? <FaEyeSlash size={10} /> : <FaEye size={10} />}
                    </button>
                  </div>
                </div>
                <p className="text-[8px] text-zinc-600 leading-tight italic px-1">Your data is stored safely on this device only. No one else can see your stats!</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: VICTORY PROGRESS */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 overflow-hidden min-h-0">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-blue-600 rounded-xl w-8 h-8">
                  <FaChartArea className="text-white text-sm" />
                </div>
                <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">My Victory Map</h3>
              </div>
              <div className="bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-widest animate-pulse">
                Recording Dominance
              </div>
            </div>

            <div className="flex-grow glass-morphism rounded-[32px] border border-white/5 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
              <Suspense fallback={<div className="py-20 text-center text-zinc-500 text-xs font-black uppercase tracking-widest">Loading Your Success...</div>}>
                <DynamicWeightTracker />
              </Suspense>
            </div>
          </div>

          {/* COLUMN 3: FUTURE YOU */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden border-l border-white/5 pl-6">
            <SectionTitle title="The Roadmap" icon={FaRocket} color="bg-emerald-600" />

            <div className="flex-grow overflow-y-auto space-y-6 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
              <div className="glass-morphism p-5 rounded-[24px] border border-white/5 space-y-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block px-1">My Ultimate Goal</label>
                  <select
                    value={fitnessGoal}
                    onChange={e => setFitnessGoal(e.target.value)}
                    className="bg-zinc-900/50 p-4 border border-white/10 rounded-2xl w-full text-white font-black italic tracking-tighter focus:outline-none appearance-none"
                  >
                    <option value="Weight Loss">Crush the Weight (Burn Fat)</option>
                    <option value="Muscle Gain">Build the Beast (Gain Muscle)</option>
                    <option value="Maintenance">Stay Strong (Health Focus)</option>
                  </select>
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div className="space-y-2 group">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block px-1 group-hover:text-emerald-400 transition-colors">Target Weight</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetWeight || ''}
                        onChange={e => setTargetWeight(parseFloat(e.target.value) || 0)}
                        className="bg-emerald-500/5 p-4 border border-emerald-500/10 focus:border-emerald-500/40 rounded-2xl w-full text-emerald-500 font-black italic tracking-tighter transition-all focus:outline-none"
                      />
                      <span className="absolute right-4 inset-y-0 flex items-center text-emerald-500/30 text-[8px] font-black italic">KG</span>
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block px-1 group-hover:text-blue-400 transition-colors">Daily Calorie Goal</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={targetCalories || ''}
                        onChange={e => setTargetCalories(parseInt(e.target.value) || 0)}
                        className="bg-blue-500/5 p-4 border border-blue-500/10 focus:border-blue-500/40 rounded-2xl w-full text-blue-500 font-black italic tracking-tighter transition-all focus:outline-none"
                      />
                      <span className="absolute right-4 inset-y-0 flex items-center text-blue-500/30 text-[8px] font-black italic">KCAL</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-zinc-500 text-[10px] font-black uppercase tracking-widest block px-1">Motivational Vision</label>
                  <textarea
                    value={futureGoalDescription}
                    onChange={e => setFutureGoalDescription(e.target.value)}
                    className="bg-zinc-900/50 p-4 border border-white/5 focus:border-blue-500/30 rounded-2xl w-full h-32 text-zinc-300 text-xs italic leading-relaxed transition-all focus:outline-none resize-none"
                    placeholder="Tell yourself how you will feel when you reach your goal! You've got this!"
                  />
                </div>
              </div>

              <div className="bg-emerald-500/5 p-5 rounded-2xl border border-dashed border-emerald-500/10 text-center">
                <FaStar className="mx-auto text-yellow-500 mb-2 animate-bounce" />
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">You are 100% capable of achieving greatness! Every entry is a win!</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
