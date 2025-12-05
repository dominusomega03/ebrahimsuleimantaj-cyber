
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Plus, Check, Clock } from 'lucide-react';

interface MarketplaceProps {
  cart: string[];
  addToCart: (id: string) => void;
  setView: (view: string) => void;
  products: Product[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ cart, addToCart, setView, products }) => {
  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-royal-900 dark:text-white">Elite Marketplace</h1>
        <button 
            onClick={() => setView('cart')}
            className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/30 px-3 py-1.5 rounded-full border border-sky-100 dark:border-sky-800 active:scale-95 transition-transform"
        >
            <ShoppingCart size={14} className="text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-sky-600 dark:text-sky-400">{cart.length} Items</span>
        </button>
      </div>

      {/* Featured Banner - Scarcity & Urgency */}
      {products.length > 0 && (
      <div className="bg-black dark:bg-gray-900 rounded-xl p-6 text-white mb-8 relative overflow-hidden border border-gray-800 shadow-xl">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gold-400 rounded-full blur-2xl opacity-20 -translate-y-10 translate-x-10 animate-pulse"></div>
        <div className="flex items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">LIMITED TIME</span>
            <span className="text-gold-400 text-xs font-bold tracking-widest uppercase block">3 Left in Stock</span>
        </div>
        <h2 className="text-xl font-bold mb-2">The Ultimate Care Kit</h2>
        <p className="text-gray-400 text-xs mb-4 max-w-[80%] font-medium">Professional grade. The same kit used by our elite detailers. Secure yours before they sell out.</p>
        <button 
            onClick={() => { addToCart(products[0].id); setView('cart'); }}
            className="bg-white text-black px-6 py-2.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors shadow-lg"
        >
            Secure Now
        </button>
      </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        {products.map(product => {
            const isInCart = cart.includes(product.id);
            return (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col group hover:shadow-lg transition-all">
                <div className="h-32 bg-gray-50 dark:bg-gray-900 relative">
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110" />
                     {product.rating > 4.7 && (
                        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded">BESTSELLER</div>
                     )}
                     <button 
                        onClick={() => addToCart(product.id)}
                        className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all ${isInCart ? 'bg-green-500 text-white' : 'bg-royal-800 dark:bg-sky-600 text-white hover:bg-royal-900 dark:hover:bg-sky-700'}`}
                     >
                         {isInCart ? <Check size={16} /> : <Plus size={16} />}
                     </button>
                </div>
                <div className="p-3 flex-1 flex flex-col">
                    <div className="flex items-center gap-1 mb-1">
                        <Star size={10} className="fill-gold-400 text-gold-400" />
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold">{product.rating} (500+ Sold)</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-1 leading-tight">{product.name}</h3>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{product.description}</p>
                    <div className="mt-auto">
                        <p className="text-royal-800 dark:text-sky-300 font-black text-sm">KES {product.price.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        )})}
      </div>
    </div>
  );
};

export default Marketplace;
