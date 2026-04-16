'use client';
import { FaShieldAlt, FaRocket, FaLock, FaDatabase, FaMagic, FaBrain, FaDna, FaRunning, FaHeartbeat, FaCode, FaBolt } from 'react-icons/fa';

export default function AboutPage() {
  const features = [
    {
      title: 'Neural Privacy',
      description: 'On-device vaulting & local-first encryption.',
      icon: FaShieldAlt,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'LPU Acceleration',
      description: 'Groq LPUs for sub-second nutritional inference.',
      icon: FaRocket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    {
      title: 'Multimodal Vision',
      description: 'Surgical food geometry identification.',
      icon: FaMagic,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="h-full relative overflow-hidden flex flex-col">
      <div className="top-[-10%] left-[-10%] absolute bg-blue-500/5 blur-[150px] rounded-full w-[600px] h-[600px] pointer-events-none" />
      <div className="bottom-[-10%] right-[-10%] absolute bg-purple-500/5 blur-[150px] rounded-full w-[600px] h-[600px] pointer-events-none" />

      <main className="flex-grow flex flex-col p-4 sm:p-6 pb-2 gap-4 overflow-hidden">
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden min-h-0">

          {/* COLUMN 1: VITALITY VISION */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-zinc-800">
            <div className="glass-morphism p-6 rounded-[32px] border border-white/5 space-y-8">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-blue-500/10 rounded-xl w-8 h-8">
                  <FaDna className="text-blue-400 text-sm animate-spin-slow" />
                </div>
                <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Bio-Protocol</h3>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <FaRunning className="text-zinc-700 text-2xl group-hover:text-blue-500 transition-colors" />
                  <div>
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Active State</p>
                    <p className="text-zinc-600 text-[8px] font-medium leading-none">Constant Motion</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <FaHeartbeat className="text-zinc-700 text-2xl group-hover:text-rose-500 transition-colors" />
                  <div>
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Vitality Flux</p>
                    <p className="text-zinc-600 text-[8px] font-medium leading-none">Infinite Rhythm</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <FaBrain className="text-zinc-700 text-2xl group-hover:text-purple-500 transition-colors" />
                  <div>
                    <p className="text-white text-[10px] font-black uppercase tracking-widest">Neural Sync</p>
                    <p className="text-zinc-600 text-[8px] font-medium leading-none">Cognitive Balance</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/2 p-5 rounded-2xl border border-dashed border-white/10 text-[9px] text-zinc-600 font-medium italic leading-relaxed">
              "Biological precision meets artificial intelligence. We are redefining the relationship between data and wellness."
            </div>
          </div>

          {/* COLUMN 2: THE MANIFESTO */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col gap-4 overflow-hidden min-h-0">
            <div className="flex items-center gap-3 px-2">
              <div className="flex justify-center items-center bg-blue-600 rounded-xl w-8 h-8">
                <FaShieldAlt className="text-white text-sm" />
              </div>
              <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Performance Manifesto</h3>
            </div>

            <div className="flex-grow glass-morphism rounded-[32px] border border-white/5 p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="font-black text-4xl text-white tracking-tighter leading-tight italic uppercase">
                    Unified <br /><span className="text-blue-500">Biological Engine</span>
                  </h2>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-transparent" />
                  <p className="text-zinc-400 text-lg leading-relaxed font-medium">
                    VernaVitality is a high-performance engine for your body.
                    Built on Next.js 15, every calorie analyzed and every macro tracked
                    is processed with sub-second precision.
                  </p>
                </div>

                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-blue-400 text-[8px] font-black uppercase tracking-widest leading-none border border-blue-400/20 px-2 py-0.5 rounded-full">Primary</span>
                      <FaBolt className="text-blue-500/20 text-xs" />
                    </div>
                    <p className="font-bold text-white text-sm mb-1 italic">Groq LPUs</p>
                    <p className="text-zinc-600 text-[10px] leading-tight">Massively parallel processing for instant deconstruction.</p>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-emerald-400 text-[8px] font-black uppercase tracking-widest leading-none border border-emerald-400/20 px-2 py-0.5 rounded-full">Security</span>
                      <FaLock className="text-emerald-500/20 text-xs" />
                    </div>
                    <p className="font-bold text-white text-sm mb-1 italic">Local Vault</p>
                    <p className="text-zinc-600 text-[10px] leading-tight">Zero-cloud data residency. Your metrics belong to you.</p>
                  </div>
                </div>

                <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-500/20">
                  <p className="text-blue-300 text-xs font-medium italic leading-relaxed">
                    "The transition between biological input and digital intelligence should be invisible."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: NEURAL STACK */}
          <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden border-l border-white/5 pl-6">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-purple-500/10 rounded-xl w-8 h-8">
                <FaCode className="text-purple-400 text-sm" />
              </div>
              <h3 className="font-black text-sm text-white tracking-tighter uppercase italic">Neural Stack</h3>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 pb-20">
              {features.map((feature, i) => (
                <div key={i} className="glass-morphism p-6 rounded-2xl border border-white/5 group relative overflow-hidden">
                  <div className="absolute top-[-20%] right-[-10%] opacity-5 group-hover:opacity-10 transition-opacity">
                    <feature.icon size={60} />
                  </div>
                  <div className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1 tracking-tight">{feature.title}</h4>
                  <p className="text-zinc-500 text-[10px] leading-relaxed font-medium">{feature.description}</p>
                </div>
              ))}

              <div className="pt-8 text-center opacity-30">
                <p className="text-zinc-700 text-[8px] font-black uppercase tracking-[0.4em]">v2.4 System Core</p>
                <div className="h-px w-16 bg-blue-500/20 mx-auto mt-2" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
