
import React from 'react';
import { Service } from '../types';
import { Clock, ChevronRight, Zap, Star } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook: (service: Service) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div 
      onClick={() => onBook(service)}
      className="bg-white/80 dark:bg-gray-800/80 glass rounded-[2rem] shadow-sm border border-white dark:border-gray-700 overflow-hidden active:scale-[0.99] transition-all duration-300 hover:shadow-xl hover:shadow-sky-100 dark:hover:shadow-sky-900/20 group relative cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {service.premiumOnly && (
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-gold-400 text-[10px] font-extrabold px-3 py-1.5 rounded-full border border-gold-400/30 flex items-center gap-1 shadow-lg">
            <Star size={10} fill="#FFD700" /> ELITE
          </div>
        )}
        
        {service.category === 'CUSTOMIZATION' && (
           <div className="absolute top-4 left-4 bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <Zap size={10} fill="currentColor" /> CUSTOM
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-16">
            <div className="flex justify-between items-end text-white">
                <div>
                     <h3 className="font-bold text-lg leading-none shadow-black drop-shadow-md mb-1">{service.title}</h3>
                     <div className="flex items-center text-gray-300 text-[10px] font-bold uppercase tracking-wide gap-3">
                        <span className="flex items-center"><Clock size={10} className="mr-1" /> {service.duration}</span>
                        {service.averageRating && (
                            <span className="flex items-center text-gold-400"><Star size={10} fill="currentColor" className="mr-1" /> {service.averageRating} ({service.reviewCount})</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className="p-5">
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 line-clamp-2 font-medium leading-relaxed">{service.description}</p>
        <div className="flex items-center justify-between gap-4">
            <div className="text-sky-900 dark:text-sky-400 font-black text-lg">
                KES {service.price.toLocaleString()}
            </div>
            <button 
            className="bg-sky-500 text-white px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 group-hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 dark:shadow-sky-900"
            >
            View <ChevronRight size={16} strokeWidth={3} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
