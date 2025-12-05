
import React from 'react';
import ServiceCard from '../components/ServiceCard';
import { Heart, Sparkles } from 'lucide-react';
import { Service } from '../types';

interface WishlistProps {
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  setView: (view: string) => void;
  services: Service[];
}

const Wishlist: React.FC<WishlistProps> = ({ wishlist, onToggleWishlist, setView, services }) => {
  const wishlistedServices = services.filter(s => wishlist.includes(s.id));

  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="text-red-500 fill-red-500 animate-pulse" size={32} />
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Your Wishes</h1>
      </div>

      {wishlistedServices.length > 0 ? (
        <div className="space-y-6">
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">You have {wishlistedServices.length} saved services.</p>
          {wishlistedServices.map(service => (
            <div key={service.id} className="relative">
                <ServiceCard 
                    service={service} 
                    onBook={() => setView('services')} // Redirect to services for now or handle deep link
                />
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(service.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full text-red-500 hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm z-10"
                >
                    <Heart size={20} fill="currentColor" />
                </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center opacity-60">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Heart size={40} className="text-gray-300 dark:text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">It's empty here!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-[200px] mb-6">Find services that spark joy and save them for later.</p>
            <button 
                onClick={() => setView('services')}
                className="bg-sky-500 text-white px-6 py-3 rounded-full font-bold text-sm shadow-lg shadow-sky-200 dark:shadow-sky-900"
            >
                Explore Services
            </button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
