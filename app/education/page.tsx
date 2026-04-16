'use client';
import { useSettings } from '@/lib/contexts/SettingsContext';
import { FaYoutube, FaBookOpen, FaLightbulb, FaGraduationCap, FaArrowRight, FaBrain, FaExternalLinkAlt } from 'react-icons/fa';
import LiveMetabolism from '../components/LiveMetabolism';

export default function InstitutePage() {
    const { fitnessGoal, targetCalories, age, gender } = useSettings();

    const resources = {
        'Weight Loss': {
            videos: [
                { title: 'The Science of Fat Loss', id: 'GqPrGueO9_0', channel: 'Andrew Huberman' },
                { title: 'Effective HIIT Workouts', id: 'ml6cT4AZdqI', channel: 'FitnessBlender' },
                { title: 'Intermittent Fasting Guide', id: '9t9E_yH_oEg', channel: 'Doctor Mike' }
            ],
            articles: [
                { title: 'Caloric Deficit 101: How to Lose Weight Safely', description: 'Understanding the thermodynamics of weight management.' },
                { title: 'Metabolism Boosters: Myths vs. Reality', description: 'What actually speeds up your biological furnace?' },
                { title: 'The Psychology of Hunger', description: 'How to manage cravings and emotional eating.' }
            ]
        },
        'Muscle Gain': {
            videos: [
                { title: 'Hypertrophy Training Principles', id: '2K_m77v2vj0', channel: 'Jeff Nippard' },
                { title: 'Nutrition for Elite Muscle Growth', id: 'L_W14wN9_2Y', channel: 'Renaissance Periodization' },
                { title: 'Perfect Workout Splits', id: 'kMv67P9mS7M', channel: 'Athlean-X' }
            ],
            articles: [
                { title: 'Progressive Overload Mastery', description: 'The foundation of all muscle growth strategies.' },
                { title: 'Protein Synthesis: Timing vs. Total Intake', description: 'Maximizing your post-workout anabolic window.' },
                { title: 'Compound vs. Isolation Movements', description: 'Optimizing your training economy for maximum gains.' }
            ]
        },
        'Maintenance': {
            videos: [
                { title: 'The Science of Healthy Living', id: 'ml6cT4AZdqI', channel: 'Healthline' },
                { title: 'Staying Fit Forever', id: 'L_W14wN9_2Y', channel: 'Renaissance Periodization' },
                { title: 'Balance & Wellbeing', id: 'GqPrGueO9_0', channel: 'Andrew Huberman' }
            ],
            articles: [
                { title: 'Sustainability in Fitness', description: 'How to make health a lifetime priority without burnout.' },
                { title: 'Metabolic Flexibility', description: 'Teaching your body to transition between fuel sources.' },
                { title: 'Mindful Eating Patterns', description: 'Maintaining your physique with intuition and science.' }
            ]
        },
        'Aesthetic Optimization': {
            videos: [
                { title: 'Sculpting Your Physique', id: 'ml6cT4AZdqI', channel: 'Jeff Nippard' },
                { title: 'Body Recomposition Secrets', id: 'ml6cT4AZdqI', channel: 'Athlean-X' },
                { title: 'Advanced Aesthetics Guide', id: 'ml6cT4AZdqI', channel: 'Renaissance Periodization' }
            ],
            articles: [
                { title: 'The Art of Body Recomposition', description: 'Losing fat and gaining muscle simultaneously.' },
                { title: 'Perfect Symmetry Training', description: 'Focusing on weak points for a balanced physique.' },
                { title: 'Lighting & Posing for Progress', description: 'How to track your visual changes effectively.' }
            ]
        },
        'default': {
            videos: [
                { title: 'General Fitness Foundations', id: 'ml6cT4AZdqI', channel: 'Healthline' },
                { title: 'Daily Mobility Routine', id: 'L_W14wN9_2Y', channel: 'The Ready State' }
            ],
            articles: [
                { title: 'Building Sustainable Habits', description: 'How to make fitness a lifetime priority.' },
                { title: 'The Importance of Recovery', description: 'Why rest is as important as the workout.' }
            ]
        }
    };

    const currentResources = resources[fitnessGoal as keyof typeof resources] || resources['default'];

    return (
        <div className="h-full relative overflow-hidden flex flex-col">
            <div className="top-[-10%] left-[-10%] absolute bg-blue-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />
            <div className="bottom-[-10%] right-[-10%] absolute bg-purple-500/5 blur-[120px] rounded-full w-[600px] h-[600px] pointer-events-none" />

            <main className="flex-grow flex flex-col p-4 sm:p-6 pb-2 gap-4 overflow-hidden">
                <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

                    {/* COLUMN 1: BIO-CONTEXT */}
                    <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
                        <LiveMetabolism targetCalories={targetCalories} />

                        <div className="glass-morphism p-6 rounded-[32px] border border-white/5 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="flex justify-center items-center bg-blue-500/10 rounded-xl w-8 h-8">
                                    <FaBrain className="text-blue-400 text-sm" />
                                </div>
                                <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">My Mission Control</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Current Goal</p>
                                    <p className="font-black text-white italic truncate tracking-tighter">{fitnessGoal}</p>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mb-1">Body Stats</p>
                                    <p className="font-black text-zinc-400 italic tracking-tighter">{age} Years Young / {gender}</p>
                                </div>
                                <div className="p-2 border border-emerald-500/20 rounded-xl bg-emerald-500/5 text-center">
                                    <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest leading-tight">You are building a masterpiece. Every piece of knowledge is a step toward greatness!</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: VIDEO ENGINE */}
                    <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 overflow-hidden min-h-0">
                        <div className="flex items-center gap-3 px-2">
                            <div className="flex justify-center items-center bg-rose-600 rounded-xl w-8 h-8">
                                <FaYoutube className="text-white text-sm" />
                            </div>
                            <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Fuel Your Mind</h3>
                        </div>

                        <div className="flex-grow overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
                            {currentResources.videos.map((video, i) => (
                                <div key={i} className="glass-morphism group rounded-[24px] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all flex flex-col sm:flex-row h-auto sm:h-32">
                                    <div className="relative w-full sm:w-48 h-32 sm:h-full bg-zinc-900 shrink-0 overflow-hidden cursor-pointer" onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}>
                                        <img
                                            src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                                            alt={video.title}
                                            className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-rose-600 transition-colors">
                                                <FaYoutube className="text-white text-xs" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col justify-center gap-1">
                                        <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest">{video.channel}</p>
                                        <h3 className="font-black text-white tracking-tighter leading-tight italic uppercase text-sm">{video.title}</h3>
                                        <button
                                            onClick={() => window.open(`https://youtube.com/watch?v=${video.id}`, '_blank')}
                                            className="inline-flex items-center gap-1.5 text-blue-500 text-[8px] font-black uppercase tracking-[0.2em] mt-2 group-hover:text-blue-400"
                                        >
                                            WATCH & GROW <FaExternalLinkAlt size={8} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUMN 3: ARTICLE INTELLIGENCE */}
                    <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden border-l border-white/5 pl-6">
                        <div className="flex items-center gap-3">
                            <div className="flex justify-center items-center bg-emerald-500 rounded-xl w-8 h-8">
                                <FaBookOpen className="text-white text-sm" />
                            </div>
                            <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Success Manuscripts</h3>
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
                            {currentResources.articles.map((article, i) => (
                                <div key={i} className="glass-morphism p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-all group space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                                            <FaLightbulb className="text-blue-400 group-hover:text-white text-xs" />
                                        </div>
                                        <h3 className="font-black text-xs text-white tracking-tighter uppercase italic leading-tight">{article.title}</h3>
                                    </div>
                                    <p className="text-zinc-500 text-[10px] leading-relaxed font-medium">{article.description}</p>
                                    <button
                                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(article.title + " fitness guide")}`, '_blank')}
                                        className="flex items-center gap-2 text-zinc-600 text-[8px] font-black uppercase tracking-widest pt-1 group-hover:text-emerald-400 transition-colors"
                                    >
                                        Read Manuscript <FaArrowRight />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
