'use client';

import { FaHeart, FaShieldAlt, FaRocket, FaInstagram, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative mt-auto py-20 px-4 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-12">
        <div className="grid grid-cols-1 md:grid-cols-3 w-full gap-10 items-center">
          <div className="flex flex-col items-center md:items-start gap-4">
            <span className="font-bold text-xl text-white tracking-tighter">
              Verna<span className="text-blue-500">Vitality</span>
            </span>
            <p className="text-zinc-500 text-sm max-w-[200px] text-center md:text-left leading-relaxed">
              Empowering your health journey with the speed of AI and the privacy of local-first design.
            </p>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="group flex flex-col items-center gap-2 cursor-help">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <FaRocket className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Performance</span>
              </div>
              <div className="group flex flex-col items-center gap-2 cursor-help">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <FaShieldAlt className="w-5 h-5 text-emerald-500" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Privacy</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center md:justify-end gap-4">
            {[FaInstagram, FaTwitter, FaGithub].map((Icon, i) => (
              <button key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                <Icon />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 pt-10 border-t border-white/5 w-full">
          <p className="text-zinc-500 text-[10px] flex items-center gap-2 font-bold uppercase tracking-[0.3em]">
            Handcrafted with <FaHeart className="text-rose-500 animate-pulse" /> by VernaVitality Systems
          </p>
          <div className="flex items-center gap-6 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <span>Privacy Policy</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>Terms of Service</span>
            <span className="w-1 h-1 rounded-full bg-zinc-800" />
            <span>© {new Date().getFullYear()} All Rights Reserved</span>
          </div>
        </div>
      </div>

      {/* Background Decorative Element */}
      <div className="bottom-0 left-1/2 -translate-x-1/2 absolute bg-blue-500/5 blur-[100px] rounded-full w-[600px] h-[300px] -z-10" />
    </footer>
  );
}
