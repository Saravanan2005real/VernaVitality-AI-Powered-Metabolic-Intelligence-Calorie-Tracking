'use client';

import { FaLightbulb, FaUtensils, FaCheckCircle } from 'react-icons/fa';

interface DietCorrectionProps {
    analysis: string;
    recommendation: string;
    isCorrected?: boolean;
    onDismiss?: () => void;
    compact?: boolean;
}

export default function DietCorrection({ analysis, recommendation, isCorrected, onDismiss, compact = false }: DietCorrectionProps) {
    const isGood = analysis.toLowerCase().includes('good') || analysis.toLowerCase().includes('great') || analysis.toLowerCase().includes('perfect') || analysis.toLowerCase().includes('excellent');

    return (
        <div className={`glass-morphism relative border border-white/5 bg-gradient-to-br from-blue-500/10 via-transparent to-rose-500/10 animate-in zoom-in-95 group ${compact ? "p-4 rounded-2xl" : "p-6 rounded-3xl"}`}>
            {onDismiss && (
                <button
                    onClick={onDismiss}
                    className="top-3 right-3 absolute opacity-0 group-hover:opacity-100 p-1.5 text-zinc-500 hover:text-white transition-opacity"
                    title="Dismiss"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}

            <div className={`flex items-center gap-3 ${compact ? "mb-3" : "mb-4"}`}>
                <div className={`flex justify-center items-center rounded-xl shrink-0 ${compact ? "w-8 h-8" : "w-10 h-10"} ${isGood ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                    {isGood ? (
                        <FaCheckCircle className={`text-emerald-400 ${compact ? "text-xs" : ""}`} />
                    ) : (
                        <FaLightbulb className={`text-blue-400 animate-pulse ${compact ? "text-xs" : ""}`} />
                    )}
                </div>
                <div>
                    <h3 className={`font-black uppercase tracking-tighter italic text-white ${compact ? "text-xs" : "text-sm"}`}>{isGood ? 'Champ Protocol Active!' : 'Master Coach Insight'}</h3>
                    {!compact && <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest italic">You are winning!</p>}
                </div>
            </div>

            <div className={compact ? "space-y-2" : "space-y-4"}>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    {!compact && <h4 className="flex items-center gap-2 mb-1 text-zinc-500 text-[8px] font-black uppercase tracking-widest italic">The Breakdown</h4>}
                    <p className={`text-zinc-300 italic leading-relaxed ${compact ? "text-[10px]" : "text-sm"}`}>"{analysis}"</p>
                </div>

                {!isGood && (
                    <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 relative overflow-hidden">
                        <div className="top-0 right-0 absolute bg-blue-500/10 blur-xl rounded-full w-12 h-12 -translate-y-1/2 translate-x-1/2" />
                        <h4 className="flex items-center gap-2 mb-1 text-blue-400 text-[8px] font-black uppercase tracking-widest relative z-10 italic">
                            Your Next Play:
                        </h4>
                        <p className={`font-black text-white relative z-10 leading-tight ${compact ? "text-xs italic" : "text-md"}`}>{recommendation}</p>
                    </div>
                )}

                {isCorrected && (
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
                        <FaCheckCircle />
                        <span>Target balance fixed across 2 meals</span>
                    </div>
                )}
            </div>
        </div>
    );
}
