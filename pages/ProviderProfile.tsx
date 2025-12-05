
import React from 'react';
import { ServiceProvider, Review, ServiceCategory } from '../types';
import { Star, MapPin, Award, CheckCircle, ChevronLeft } from 'lucide-react';
import { MOCK_REVIEWS } from '../constants';

interface ProviderProfileProps {
    provider: ServiceProvider;
    onBack: () => void;
}

const ProviderProfile: React.FC<ProviderProfileProps> = ({ provider, onBack }) => {
    return (
        <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
             <div className="flex items-center gap-4 mb-6">
                <button onClick={onBack} className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <h1 className="text-xl font-black text-gray-800 dark:text-white">Expert Profile</h1>
            </div>

            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sky-100 dark:from-sky-900/30 to-transparent"></div>
                <div className="relative z-10">
                     <div className="w-32 h-32 mx-auto rounded-full p-1 bg-gradient-to-tr from-gold-400 to-sky-500 mb-4 shadow-lg">
                        <img src={provider.image} className="w-full h-full rounded-full object-cover border-4 border-white dark:border-gray-800" alt={provider.name} />
                     </div>
                     <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{provider.name}</h2>
                     <p className="text-sky-500 dark:text-sky-400 font-bold uppercase text-xs tracking-wider mb-4">{provider.role}</p>
                     
                     <div className="flex justify-center items-center gap-6 mb-6">
                         <div className="text-center">
                             <span className="block text-2xl font-black text-gray-800 dark:text-gray-100">{provider.rating}</span>
                             <span className="text-[10px] text-gray-500 uppercase font-bold flex items-center gap-1 justify-center"><Star size={10} fill="#FFD700" className="text-gold-400"/> Rating</span>
                         </div>
                         <div className="w-px h-8 bg-gray-200 dark:bg-gray-700"></div>
                          <div className="text-center">
                             <span className="block text-2xl font-black text-gray-800 dark:text-gray-100">{provider.jobsCompleted}</span>
                             <span className="text-[10px] text-gray-500 uppercase font-bold">Jobs Done</span>
                         </div>
                     </div>
                     
                     <div className="flex justify-center gap-2 flex-wrap">
                        {provider.tier === 'Master' && (
                             <span className="bg-black text-gold-400 px-3 py-1 rounded-full text-[10px] font-extrabold border border-gold-400/50 shadow-sm flex items-center gap-1">
                                 <Award size={10} /> MASTER TIER
                             </span>
                        )}
                        {provider.specialization.map(spec => (
                             <span key={spec} className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold">
                                 {spec}
                             </span>
                        ))}
                     </div>
                </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed font-medium bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                    {provider.bio}
                </p>
            </div>

            {/* Reviews */}
            <div>
                 <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Reviews</h3>
                 <div className="space-y-4">
                     {MOCK_REVIEWS.map(review => (
                         <div key={review.id} className="bg-white/60 dark:bg-gray-800/60 p-4 rounded-2xl border border-white dark:border-gray-700 shadow-sm">
                             <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center gap-2">
                                     <div className="w-8 h-8 bg-sky-100 dark:bg-sky-900 rounded-full flex items-center justify-center text-xs font-bold text-sky-700 dark:text-sky-300">
                                         {review.userName.charAt(0)}
                                     </div>
                                     <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{review.userName}</span>
                                 </div>
                                 <div className="flex items-center gap-1">
                                     <Star size={12} fill="#FFD700" className="text-gold-400" />
                                     <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{review.rating}</span>
                                 </div>
                             </div>
                             <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{review.comment}</p>
                             <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};

export default ProviderProfile;
