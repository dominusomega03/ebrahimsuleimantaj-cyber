
import React from 'react';
import { UserProfile } from '../types';
import { Crown, Trophy, Gift, Sparkles, Hexagon, Zap } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

interface RewardsProps {
    user: UserProfile;
}

const data = [
  { name: 'Mon', pts: 40 },
  { name: 'Tue', pts: 0 },
  { name: 'Wed', pts: 120 },
  { name: 'Thu', pts: 30 },
  { name: 'Fri', pts: 80 },
  { name: 'Sat', pts: 200 },
  { name: 'Sun', pts: 50 },
];

const Rewards: React.FC<RewardsProps> = ({ user }) => {
  const nextTierPoints = 20000;
  const progress = (user.points / nextTierPoints) * 100;

  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-6">
             <Crown className="text-gold-500 fill-gold-200 dark:fill-gold-900/50" size={32} />
             <h1 className="text-3xl font-black text-gray-800 dark:text-white tracking-tight">TumyTum Club</h1>
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-gray-900 via-sky-900 to-black text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden mb-8 border-4 border-white/10 dark:border-gray-800 group transition-all hover:scale-[1.01]">
            {/* Sacred Geometry Background */}
            <div className="absolute -top-10 -right-10 opacity-20 animate-spin-slow">
                 <div className="w-64 h-64 border-2 border-dashed border-gold-400 rounded-full flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-gold-400 rotate-45"></div>
                 </div>
            </div>
            
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="text-sky-300 text-[10px] font-extrabold tracking-[0.2em] uppercase mb-1">Current Vibration</p>
                        <h2 className="text-5xl font-serif italic text-white tracking-tighter drop-shadow-lg">{user.tier}</h2>
                    </div>
                </div>

                <div className="mb-2 flex justify-between text-xs text-sky-200 font-bold tracking-wide">
                    <span>{user.points.toLocaleString()} PTS</span>
                    <span>DIAMOND GOAL</span>
                </div>
                
                <div className="w-full bg-white/10 rounded-full h-4 mb-4 overflow-hidden backdrop-blur-sm border border-white/5">
                    <div 
                        className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(56,189,248,0.6)] relative" 
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute top-0 right-0 h-full w-full bg-gradient-to-t from-transparent to-white/30"></div>
                    </div>
                </div>
                
                <p className="text-xs text-gray-300 font-medium flex items-center gap-2">
                    <Sparkles size={12} className="text-yellow-400" />
                    Only <span className="text-white font-bold">{nextTierPoints - user.points} pts</span> to unlock Infinite Luxury.
                </p>
            </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 glass p-6 rounded-3xl shadow-sm border border-white dark:border-gray-700 mb-8">
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-6 text-sm uppercase tracking-wide flex items-center gap-2">
                <Zap size={16} className="text-sky-500" />
                Momentum
            </h3>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} tick={{fill: '#9CA3AF', fontWeight: 700}} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)', fontFamily: 'Nunito', fontWeight: 'bold' }}
                            cursor={{fill: 'rgba(56, 189, 248, 0.1)'}}
                        />
                        <Bar dataKey="pts" fill="url(#colorGradient)" radius={[6, 6, 6, 6]} barSize={16} />
                        <defs>
                            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={1}/>
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Rewards List */}
        <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-xl">Rewards Store</h3>
        <div className="space-y-4">
            <div className="flex items-center p-4 bg-white/90 dark:bg-gray-800/90 glass rounded-3xl border border-white dark:border-gray-700 shadow-sm transition-transform hover:-translate-y-1">
                 <div className="w-14 h-14 bg-sky-100 dark:bg-sky-900 rounded-2xl flex items-center justify-center text-sky-600 dark:text-sky-400 mr-4 shadow-inner">
                     <Gift size={28} strokeWidth={2.5} />
                 </div>
                 <div className="flex-1">
                     <h4 className="font-black text-gray-900 dark:text-white text-sm">Free Engine Wash</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Redeem for 2,500 pts</p>
                 </div>
                 <button className="bg-black dark:bg-white text-white dark:text-black text-xs font-bold px-5 py-3 rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all">Claim</button>
            </div>
            
            <div className="flex items-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-3xl border border-white dark:border-gray-700 shadow-sm grayscale opacity-70 relative overflow-hidden">
                 <div className="absolute right-0 top-0 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-extrabold px-3 py-1.5 rounded-bl-2xl">LOCKED</div>
                 <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center text-gray-500 dark:text-gray-400 mr-4">
                     <Trophy size={28} />
                 </div>
                 <div className="flex-1">
                     <h4 className="font-black text-gray-900 dark:text-white text-sm">Diamond Concierge</h4>
                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unlocks at Diamond Tier</p>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default Rewards;