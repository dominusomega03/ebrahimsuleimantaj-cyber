
import React, { useEffect, useState } from 'react';
import { UserProfile, Service } from '../types';
import { getAIRecommendation } from '../services/geminiService';
import { MapPin, Bell, Sun, Sparkles, Hexagon, Zap, Music, PaintBucket } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  setView: (view: string) => void;
  services: Service[];
}

const Dashboard: React.FC<DashboardProps> = ({ user, setView, services }) => {
  const [recommendation, setRecommendation] = useState<string>('Tumy is curating your elite experience...');

  useEffect(() => {
    // Simulate fetching AI recommendation on mount
    const fetchRec = async () => {
      const rec = await getAIRecommendation(user, services, "User is feeling energetic and wants to upgrade their car.");
      setRecommendation(rec);
    };
    fetchRec();
  }, [user, services]);

  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sky-500 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
             <span className="animate-pulse">✨</span> Elite Access Unlocked
          </p>
          <h1 className="text-3xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
            Hi, {user.name.split(' ')[0]}!
          </h1>
        </div>
        <div className="relative group">
          <button className="p-3 bg-white/80 dark:bg-gray-800/80 glass rounded-full shadow-sm border border-sky-100 dark:border-gray-700 hover:shadow-md transition-all active:scale-95">
            <Bell size={20} className="text-sky-600 dark:text-sky-400" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full border-2 border-white dark:border-gray-800 animate-bounce"></span>
          </button>
        </div>
      </div>

      {/* Motivational / Context Card with Sacred Geometry */}
      <div className="bg-gradient-to-tr from-sky-400 to-blue-600 dark:from-sky-700 dark:to-blue-900 rounded-[2rem] p-6 text-white shadow-xl shadow-sky-500/20 dark:shadow-sky-900/40 mb-8 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500 cursor-pointer">
        {/* Sacred Geometry Overlay */}
        <div className="absolute inset-0 opacity-10">
             <div className="absolute top-[-50px] right-[-50px] w-64 h-64 border-[20px] border-white rounded-full"></div>
             <div className="absolute top-[20px] right-[20px] w-64 h-64 border-[20px] border-white rounded-full"></div>
             <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 border-[10px] border-white rounded-full"></div>
             <div className="absolute bottom-[40px] left-[20px] w-48 h-48 border-[10px] border-white rounded-full"></div>
        </div>
        
        <div className="absolute top-0 right-0 p-4">
             <Hexagon className="text-white/20 fill-white/10 rotate-12" size={120} strokeWidth={1} />
        </div>

        <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                    <MapPin size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold tracking-wide text-sky-50">{user.location}</span>
            </div>
            
            <div className="mb-4">
                 <h2 className="text-2xl font-bold leading-tight mb-1">Command<br/>Attention.</h2>
                 <p className="text-sky-100 text-sm font-medium opacity-90">Experience perfection with our Elite Cleaning Professional Masters.</p>
            </div>

            <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                 <div className="flex items-center gap-2">
                     <Sun className="text-yellow-300 animate-spin-slow" size={24}/>
                     <span className="font-bold text-xl">Perfect Day</span>
                 </div>
                 <div className="text-right">
                     <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg text-white backdrop-blur-sm shadow-sm">{user.points.toLocaleString()} Happiness Pts</span>
                 </div>
            </div>
        </div>
      </div>

      {/* AI Insight Bubble - Glassmorphism */}
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 via-sky-200 to-indigo-200 dark:from-pink-900 dark:via-sky-900 dark:to-indigo-900 blur-xl opacity-30 rounded-full"></div>
        <div className="glass p-5 rounded-3xl relative border border-white/50 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
                <Sparkles size={18} className="text-sky-500 dark:text-sky-400 fill-sky-200 dark:fill-sky-800" />
                <h2 className="text-xs font-extrabold text-sky-600 dark:text-sky-400 uppercase tracking-widest">Tumy Insight</h2>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed italic">"{recommendation}"</p>
        </div>
      </div>

      {/* Service Categories Grid */}
      <div className="flex justify-between items-end mb-4 px-2">
         <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-100">Upgrade Your Lifestyle</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-8">
        <button 
            onClick={() => setView('services')}
            className="glass bg-white dark:bg-gray-800 p-3 rounded-2xl border border-white dark:border-gray-700 shadow-sm flex flex-col items-center justify-center gap-3 py-6 active:scale-95 transition-all hover:shadow-md group relative overflow-hidden"
        >
            <div className="w-12 h-12 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-[11px]">Car Spa</span>
        </button>

        <button 
             onClick={() => setView('services')}
             className="glass bg-white dark:bg-gray-800 p-3 rounded-2xl border border-white dark:border-gray-700 shadow-sm flex flex-col items-center justify-center gap-3 py-6 active:scale-95 transition-all hover:shadow-md group"
        >
            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center text-pink-500 dark:text-pink-400 group-hover:scale-110 transition-transform shadow-inner relative z-10">
               <PaintBucket size={24} />
            </div>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-[11px]">Custom</span>
        </button>

        <button 
             onClick={() => setView('services')}
             className="glass bg-white dark:bg-gray-800 p-3 rounded-2xl border border-white dark:border-gray-700 shadow-sm flex flex-col items-center justify-center gap-3 py-6 active:scale-95 transition-all hover:shadow-md group"
        >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                <Music size={24} />
            </div>
            <span className="font-bold text-gray-600 dark:text-gray-300 text-[11px]">Audio</span>
        </button>
      </div>

      {/* Featured Pimping Section */}
      <div className="mb-8">
         <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 px-1">Trending Modifications <span className="text-xs text-red-500 ml-2 animate-pulse font-extrabold">HIGH DEMAND</span></h2>
         <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
            {services.filter(s => s.category === 'CUSTOMIZATION').slice(0, 3).map(s => (
                <div key={s.id} onClick={() => setView('services')} className="min-w-[240px] bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-md transition-all">
                    <div className="h-32 overflow-hidden relative">
                        <img src={s.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={s.title} />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                        <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg">
                           <p className="text-[10px] font-extrabold text-gray-900">MOST POPULAR</p>
                        </div>
                    </div>
                    <div className="p-3">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{s.title}</h3>
                        <p className="text-sky-600 dark:text-sky-400 text-xs font-bold mt-1">KES {s.price.toLocaleString()}</p>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
