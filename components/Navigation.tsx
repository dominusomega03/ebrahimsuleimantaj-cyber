import React from 'react';
import { Home, Grid, ShoppingBag, Heart, Crown } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Tumy' },
    { id: 'services', icon: Grid, label: 'Book' },
    { id: 'marketplace', icon: ShoppingBag, label: 'Shop' },
    { id: 'rewards', icon: Crown, label: 'Club' },
    { id: 'wishlist', icon: Heart, label: 'Wishlist' },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-100 dark:border-gray-800 pb-safe z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${
                isActive ? 'text-sky-600 dark:text-sky-400' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : 'group-hover:scale-105'}`}>
                <item.icon
                  size={isActive ? 24 : 22}
                  className={`${isActive ? 'fill-sky-100 dark:fill-sky-900' : ''}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className={`text-[10px] font-bold mt-1 ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-gray-400 dark:text-gray-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;