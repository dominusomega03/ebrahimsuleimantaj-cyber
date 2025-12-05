
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Marketplace from './pages/Marketplace';
import Rewards from './pages/Rewards';
import Wishlist from './pages/Wishlist';
import ProviderProfile from './pages/ProviderProfile';
import AdminDashboard from './pages/AdminDashboard';
import Cart from './pages/Cart';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import AIConcierge from './components/AIConcierge';
import { USER_MOCK, MOCK_BOOKINGS, SERVICES as INITIAL_SERVICES, MOCK_PROVIDERS, PRODUCTS as INITIAL_PRODUCTS } from './constants';
import { UserProfile, ServiceProvider, BookingStatus, Service, Product } from './types';
import { ShoppingCart, Moon, Sun, ShieldCheck, Clock, CheckCircle2, ChevronRight, Package, MapPin, Calendar, Settings as SettingsIcon } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState<UserProfile>(USER_MOCK);
  
  // Data State (Lifted for Admin updates)
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  const [wishlist, setWishlist] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);

  useEffect(() => {
    // Check local storage or system preference
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const toggleWishlist = (serviceId: string) => {
    setWishlist(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId) 
        : [...prev, serviceId]
    );
  };

  const addToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const handleProviderClick = (provider: ServiceProvider) => {
      setSelectedProvider(provider);
      setCurrentView('provider');
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
      setUser(updatedUser);
      setCurrentView('settings');
  };

  const handleAddService = (newService: Service) => {
      setServices(prev => [newService, ...prev]);
  };

  const handleAddProduct = (newProduct: Product) => {
      setProducts(prev => [newProduct, ...prev]);
  };

  const getStatusColor = (status: BookingStatus) => {
      switch(status) {
          case 'CONFIRMED': return 'bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-400';
          case 'PENDING': return 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400';
          case 'COMPLETED': return 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400';
          default: return 'bg-gray-100 text-gray-500';
      }
  };

  const renderView = () => {
    switch(currentView) {
      case 'dashboard':
        return <Dashboard user={user} setView={setCurrentView} services={services} />;
      case 'services':
        return <Services user={user} services={services} wishlist={wishlist} onToggleWishlist={toggleWishlist} onProviderClick={handleProviderClick} />;
      case 'marketplace':
        return <Marketplace products={products} cart={cart} addToCart={addToCart} setView={setCurrentView} />;
      case 'cart':
        return <Cart user={user} cart={cart} products={products} setCart={setCart} setView={setCurrentView} />;
      case 'rewards':
        return <Rewards user={user} />;
      case 'wishlist':
        return <Wishlist wishlist={wishlist} services={services} onToggleWishlist={toggleWishlist} setView={setCurrentView} />;
      case 'provider':
        if (selectedProvider) {
            return <ProviderProfile provider={selectedProvider} onBack={() => setCurrentView('services')} />;
        }
        return <Dashboard user={user} setView={setCurrentView} services={services} />;
      case 'admin':
        return (
            <AdminDashboard 
                onLogout={() => setCurrentView('profile')} 
                services={services}
                products={products}
                onAddService={handleAddService}
                onAddProduct={handleAddProduct}
            />
        );
      case 'settings':
        return <Settings user={user} isDarkMode={isDarkMode} toggleTheme={toggleTheme} setView={setCurrentView} onEditProfile={() => setCurrentView('edit-profile')} />;
      case 'edit-profile':
        return <EditProfile user={user} onSave={handleUpdateUser} onCancel={() => setCurrentView('settings')} />;
      case 'profile':
        // Filter bookings for current user
        const myBookings = MOCK_BOOKINGS.filter(b => b.userId === user.id);
        
        return (
            <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-4">
                        <div className="w-28 h-28 bg-gradient-to-tr from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl shadow-sky-200 dark:shadow-sky-900/50 ring-4 ring-white dark:ring-gray-800">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white dark:border-gray-800">
                            {user.tier}
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user.name}</h1>
                    <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-sm font-bold">
                        <MapPin size={14} /> {user.location}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                     <button onClick={() => setCurrentView('admin')} className="bg-gray-900 dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold shadow-lg flex flex-col items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                        <ShieldCheck size={24} /> 
                        <span className="text-xs">Admin Portal</span>
                    </button>
                    <button onClick={() => setCurrentView('settings')} className="bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 py-4 rounded-2xl font-bold border border-sky-100 dark:border-sky-800/50 flex flex-col items-center justify-center gap-2 hover:bg-sky-100 dark:hover:bg-sky-900/30 transition-colors">
                        <SettingsIcon size={24} />
                        <span className="text-xs">Settings</span>
                    </button>
                </div>

                {/* My Active Bookings */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-sky-500" /> Active Bookings
                </h2>
                
                {myBookings.length > 0 ? (
                    <div className="space-y-4 mb-8">
                        {myBookings.map(booking => {
                            const service = services.find(s => s.id === booking.serviceId);
                            const provider = MOCK_PROVIDERS.find(p => p.id === booking.providerId);
                            
                            return (
                                <div key={booking.id} className="bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                                     <div className={`absolute top-0 right-0 px-3 py-1 text-[10px] font-bold rounded-bl-xl ${getStatusColor(booking.status)}`}>
                                         {booking.status}
                                     </div>
                                     <div className="flex gap-4">
                                         <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-700 overflow-hidden shrink-0">
                                             <img src={service?.image} className="w-full h-full object-cover" alt="" />
                                         </div>
                                         <div className="flex-1">
                                             <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{service?.title}</h3>
                                             <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
                                                 <Clock size={12} /> {booking.date} • {booking.time}
                                             </p>
                                             <div className="flex items-center gap-2">
                                                 <img src={provider?.image} className="w-5 h-5 rounded-full object-cover border border-white dark:border-gray-600" alt="" />
                                                 <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{booking.providerName}</span>
                                             </div>
                                         </div>
                                     </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 mb-8">
                        <p className="text-gray-500 text-sm font-bold">No active bookings.</p>
                        <button onClick={() => setCurrentView('services')} className="text-sky-500 text-xs font-bold mt-2">Book a Service</button>
                    </div>
                )}

                {/* Purchase History (Simulated) */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Package size={20} className="text-purple-500" /> Order History
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-2 space-y-1">
                    <div className="p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-2xl transition-colors">
                        <div className="flex items-center gap-3">
                             <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                                 <CheckCircle2 size={16} />
                             </div>
                             <div>
                                 <p className="font-bold text-sm text-gray-900 dark:text-white">Gold Class Wax Kit</p>
                                 <p className="text-[10px] text-gray-500">Delivered • 2 days ago</p>
                             </div>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                    </div>
                </div>

                <div className="mt-8">
                    <button className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 py-4 rounded-2xl font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                        Sign Out
                    </button>
                </div>
            </div>
        );
      default:
        return <Dashboard user={user} setView={setCurrentView} services={services} />;
    }
  };

  // If in Admin view, hide the main app wrapper (nav, header) to give full screen experience
  if (currentView === 'admin') {
      return (
          <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 antialiased selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-100 transition-colors duration-300">
             {renderView()}
          </div>
      );
  }

  return (
    <div className="min-h-screen font-sans text-gray-900 dark:text-gray-100 antialiased selection:bg-sky-200 selection:text-sky-900 dark:selection:bg-sky-900 dark:selection:text-sky-100 transition-colors duration-300">
      {/* Top Bar with 3D Infinity Logo */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-sky-100 dark:border-gray-800 px-4 py-3 shadow-sm transition-colors duration-300">
         <div className="flex justify-between items-center max-w-md mx-auto w-full">
            <div className="flex items-center gap-3" onClick={() => setCurrentView('dashboard')}>
                {/* Custom 3D Infinity Logo */}
                <div className="relative w-12 h-8 animate-float cursor-pointer">
                    <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-xl filter">
                        <defs>
                            <linearGradient id="logoGradient3D" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#bae6fd', stopOpacity:1}} />
                                <stop offset="50%" style={{stopColor:'#38bdf8', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor:'#0284c7', stopOpacity:1}} />
                            </linearGradient>
                             <linearGradient id="logoGradientHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.8}} />
                                <stop offset="100%" style={{stopColor:'#ffffff', stopOpacity:0}} />
                            </linearGradient>
                            <filter id="glow3D">
                                <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
                                <feMerge>
                                    <feMergeNode in="coloredBlur"/>
                                    <feMergeNode in="SourceGraphic"/>
                                </feMerge>
                            </filter>
                        </defs>
                        
                        {/* Shadow Layer */}
                        <path 
                            d="M30,30 C30,10 50,10 50,30 C50,50 70,50 70,30 C70,10 90,10 90,30 C90,50 70,50 70,30 C70,10 50,10 50,30 C50,50 30,50 30,30 Z" 
                            fill="none" 
                            stroke="#000000" 
                            strokeWidth="14"
                            strokeLinecap="round"
                            strokeOpacity="0.1"
                            transform="translate(2, 2)"
                        />

                        {/* Main Tube */}
                        <path 
                            d="M30,30 C30,10 50,10 50,30 C50,50 70,50 70,30 C70,10 90,10 90,30 C90,50 70,50 70,30 C70,10 50,10 50,30 C50,50 30,50 30,30 Z" 
                            fill="none" 
                            stroke="url(#logoGradient3D)" 
                            strokeWidth="14"
                            strokeLinecap="round"
                        />
                        
                        {/* Highlight/Reflection for 3D effect */}
                        <path 
                            d="M30,30 C30,10 50,10 50,30 C50,50 70,50 70,30 C70,10 90,10 90,30 C90,50 70,50 70,30 C70,10 50,10 50,30 C50,50 30,50 30,30 Z" 
                            fill="none" 
                            stroke="url(#logoGradientHighlight)" 
                            strokeWidth="4"
                            strokeLinecap="round"
                            className="opacity-50"
                        />
                    </svg>
                </div>
                <div className="flex flex-col cursor-pointer">
                    <span className="font-extrabold text-2xl tracking-tight text-gray-800 dark:text-gray-100 leading-none transition-colors">
                        Tumy<span className="text-sky-500">.</span>
                    </span>
                    <span className="text-[9px] font-bold text-sky-400 uppercase tracking-widest leading-none mt-1">
                        Infinite Happiness
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-sky-50 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
                >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                
                {/* Profile Icon (acts as menu) */}
                <button 
                    onClick={() => setCurrentView('profile')}
                    className="p-1 rounded-full border-2 border-white dark:border-gray-700 shadow-sm ml-1"
                >
                    <div className="w-8 h-8 bg-gradient-to-tr from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                </button>
            </div>
         </div>
      </header>

      <main className="relative z-10">
        {renderView()}
      </main>

      <Navigation currentView={currentView} setView={setCurrentView} />
      
      <AIConcierge user={user} />
    </div>
  );
}

export default App;
