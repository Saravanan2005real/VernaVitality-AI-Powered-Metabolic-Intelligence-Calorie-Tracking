'use client';
import Link from 'next/link';
import { FaExclamationTriangle, FaBullseye, FaArrowRight } from 'react-icons/fa';

interface SettingsPromptProps {
  type: 'apiKey' | 'calorieTarget';
}

export default function SettingsPrompt({ type }: SettingsPromptProps) {
  const isApiKey = type === 'apiKey';
  const Icon = isApiKey ? FaExclamationTriangle : FaBullseye;
  const accentColor = isApiKey ? 'text-amber-400' : 'text-blue-400';
  const bgColor = isApiKey ? 'bg-amber-500/10' : 'bg-blue-500/10';
  const borderColor = isApiKey ? 'border-amber-500/20' : 'border-blue-500/20';

  const message = isApiKey
    ? 'API Connectivity Required'
    : 'Define Your Daily Goal';

  const submessage = isApiKey
    ? 'Configure your Groq API key to unlock AI-powered food analysis.'
    : 'Set a calorie target to visualize your progress and maintain consistency.';

  return (
    <div className={`group relative p-5 ${bgColor} border ${borderColor} rounded-2xl transition-all hover:bg-opacity-20`}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl bg-black/20 ${accentColor}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-1">
          <h4 className="font-bold text-white text-sm tracking-tight">{message}</h4>
          <p className="text-zinc-500 text-xs leading-relaxed">{submessage}</p>
          <div className="pt-2">
            <Link
              href="/settings"
              className={`inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] ${accentColor} hover:brightness-125 transition-all`}
            >
              Configure in Settings <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
