
import React, { useState } from 'react';
import { MOCK_BOOKINGS, MOCK_PROVIDERS, USER_MOCK } from '../constants';
import { BookingStatus, Booking, Service, Product, ServiceCategory } from '../types';
import { 
    LayoutDashboard, Users, CalendarDays, DollarSign, TrendingUp, 
    MoreHorizontal, Search, Filter, CheckCircle2, Clock, XCircle, 
    LogOut, Settings, ArrowUpRight, Wrench, Edit, Trash2, Shield, Plus, X, ShoppingBag, Image, Save
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminDashboardProps {
    onLogout: () => void;
    services: Service[];
    products: Product[];
    onAddService: (service: Service) => void;
    onAddProduct: (product: Product) => void;
}

const data = [
  { name: 'Mon', revenue: 45000 },
  { name: 'Tue', revenue: 72000 },
  { name: 'Wed', revenue: 58000 },
  { name: 'Thu', revenue: 95000 },
  { name: 'Fri', revenue: 120000 },
  { name: 'Sat', revenue: 180000 },
  { name: 'Sun', revenue: 140000 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, services, products, onAddService, onAddProduct }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'customers' | 'services' | 'marketplace'>('overview');
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

    // Modal State
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    // Form State
    const [newService, setNewService] = useState<Partial<Service>>({
        category: ServiceCategory.VEHICLE,
        premiumOnly: false
    });
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        category: 'Car Care',
        rating: 5.0
    });

    const getStatusColor = (status: BookingStatus) => {
        switch(status) {
            case 'COMPLETED': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
            case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
            case 'CONFIRMED': return 'text-sky-600 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-400';
            case 'PENDING': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
            case 'CANCELLED': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const toggleStatus = (id: string) => {
        setBookings(prev => prev.map(b => {
            if (b.id === id) {
                const nextStatus: BookingStatus = b.status === 'PENDING' ? 'CONFIRMED' : (b.status === 'CONFIRMED' ? 'COMPLETED' : 'PENDING');
                return { ...b, status: nextStatus };
            }
            return b;
        }));
    };

    const submitService = (e: React.FormEvent) => {
        e.preventDefault();
        const serviceToAdd: Service = {
            id: `s-${Date.now()}`,
            title: newService.title || 'Untitled Service',
            description: newService.description || '',
            price: Number(newService.price) || 0,
            category: newService.category as ServiceCategory,
            image: newService.image || 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400',
            duration: newService.duration || '1 Hour',
            averageRating: 5.0,
            reviewCount: 0,
            premiumOnly: newService.premiumOnly
        };
        onAddService(serviceToAdd);
        setIsServiceModalOpen(false);
        setNewService({ category: ServiceCategory.VEHICLE, premiumOnly: false });
    };

    const submitProduct = (e: React.FormEvent) => {
        e.preventDefault();
        const productToAdd: Product = {
            id: `p-${Date.now()}`,
            name: newProduct.name || 'Untitled Product',
            description: newProduct.description || '',
            price: Number(newProduct.price) || 0,
            category: newProduct.category || 'General',
            image: newProduct.image || 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200',
            rating: 5.0
        };
        onAddProduct(productToAdd);
        setIsProductModalOpen(false);
        setNewProduct({ category: 'Car Care', rating: 5.0 });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-800 dark:text-gray-200 font-sans">
            
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col fixed h-full z-20">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        TumyTum<span className="text-sky-500">.</span> <span className="text-xs bg-black text-white px-2 py-0.5 rounded font-medium">ADMIN</span>
                    </h2>
                </div>
                
                <nav className="flex-1 p-4 space-y-2">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'overview' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                        <LayoutDashboard size={20} /> Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('bookings')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'bookings' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                        <CalendarDays size={20} /> Bookings
                    </button>
                    <button 
                        onClick={() => setActiveTab('customers')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'customers' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                        <Users size={20} /> Customers
                    </button>
                    <button 
                        onClick={() => setActiveTab('services')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'services' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                        <Wrench size={20} /> Services
                    </button>
                    <button 
                        onClick={() => setActiveTab('marketplace')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'marketplace' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'}`}
                    >
                        <ShoppingBag size={20} /> Marketplace
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-500 font-bold px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                        <LogOut size={18} /> Exit Portal
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
                {/* Mobile Header */}
                <div className="md:hidden flex justify-between items-center mb-6">
                     <h2 className="text-xl font-black">TumyTum Admin</h2>
                     <button onClick={onLogout} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"><LogOut size={16}/></button>
                </div>

                {/* Top Stats - Always Visible on Overview */}
                {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-sky-100 dark:bg-sky-900/50 text-sky-600 dark:text-sky-400 rounded-lg"><DollarSign size={20} /></div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1"><ArrowUpRight size={10} /> +12.5%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Total Revenue</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">KES 1.2M</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-lg"><CalendarDays size={20} /></div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1"><ArrowUpRight size={10} /> +8.2%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Active Bookings</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">42</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg"><Users size={20} /></div>
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">0%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">New Customers</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">156</h3>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between group hover:border-sky-200 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-400 rounded-lg"><TrendingUp size={20} /></div>
                            <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full flex items-center gap-1"><ArrowUpRight size={10} /> +24%</span>
                        </div>
                        <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Avg Order Value</p>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white">KES 8,500</h3>
                        </div>
                    </div>
                </div>
                )}

                {/* Overview Tab Content */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg">Revenue Overview</h3>
                                <button className="text-xs font-bold bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">This Week</button>
                            </div>
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} tickFormatter={(value) => `${value/1000}k`} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                            itemStyle={{ color: '#0EA5E9', fontWeight: 'bold' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Elite Cleaning Professional Masters */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <h3 className="font-bold text-lg mb-6">Elite Cleaning Professional Masters</h3>
                            <div className="space-y-4">
                                {MOCK_PROVIDERS.map((provider) => (
                                    <div key={provider.id} className="flex items-center gap-3 pb-4 border-b border-gray-50 dark:border-gray-700/50 last:border-0 last:pb-0">
                                        <img src={provider.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{provider.name}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{provider.jobsCompleted} Jobs • {provider.rating} <span className="text-gold-400">★</span></p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${provider.tier === 'Master' ? 'bg-black text-gold-400' : 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'}`}>
                                            {provider.tier}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bookings Management */}
                {(activeTab === 'overview' || activeTab === 'bookings') && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <h3 className="font-bold text-lg">Recent Bookings</h3>
                        <div className="flex gap-2 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input type="text" placeholder="Search orders..." className="w-full bg-gray-50 dark:bg-gray-700 pl-10 pr-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-sky-500/20" />
                            </div>
                            <button className="p-2 bg-gray-50 dark:bg-gray-700 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600"><Filter size={18} /></button>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/30">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Provider</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {bookings.map((booking) => {
                                    const serviceDetails = services.find(s => s.id === booking.serviceId);
                                    return (
                                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                        <img src={serviceDetails?.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{serviceDetails?.title || 'Unknown Service'}</p>
                                                        <p className="text-xs text-gray-500">#{booking.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{booking.userName}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{booking.date}</span>
                                                    <span className="text-xs text-gray-500">{booking.time}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden">
                                                        <img src={MOCK_PROVIDERS.find(p => p.id === booking.providerId)?.image} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">{booking.providerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-black text-gray-800 dark:text-white">KES {booking.total.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                                                    {booking.status === 'COMPLETED' && <CheckCircle2 size={12} />}
                                                    {booking.status === 'PENDING' && <Clock size={12} />}
                                                    {booking.status === 'CANCELLED' && <XCircle size={12} />}
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button onClick={() => toggleStatus(booking.id)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors">
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {/* Customers Tab */}
                {activeTab === 'customers' && (
                    <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg">Registered Customers</h3>
                            <button className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                                <Settings size={16} /> Manage
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                             <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700/30">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Location</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Tier</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Total Spent</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {/* Mocking a list including the main user */}
                                    {[USER_MOCK, { id: 'u2', name: 'Kevin Hart', location: 'Muthaiga, Nairobi', tier: 'Gold', totalSpent: 210000 }, { id: 'u3', name: 'Lupita N.', location: 'Runda, Nairobi', tier: 'Diamond', totalSpent: 850000 }].map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/20">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{user.location}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.tier === 'Diamond' ? 'bg-black text-gold-400' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.tier}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">KES {user.totalSpent?.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="text-gray-400 hover:text-sky-500"><MoreHorizontal size={18}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                        </div>
                    </div>
                )}

                {/* Services Management Tab */}
                 {activeTab === 'services' && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-xl">Service Management</h3>
                             <button 
                                onClick={() => setIsServiceModalOpen(true)}
                                className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-colors"
                             >
                                <Plus size={16} /> Add New Service
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((service) => (
                                <div key={service.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col group">
                                    <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                                        <img src={service.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:text-sky-500 shadow-sm"><Edit size={14} /></button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{service.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{service.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50 dark:border-gray-700">
                                        <span className="font-black text-sky-600 dark:text-sky-400">KES {service.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-2">
                                             <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                             <span className="text-xs font-bold text-gray-500">Active</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Marketplace Management Tab */}
                {activeTab === 'marketplace' && (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-xl">Product Inventory</h3>
                             <button 
                                onClick={() => setIsProductModalOpen(true)}
                                className="bg-sky-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-colors"
                             >
                                <Plus size={16} /> Add New Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((product) => (
                                <div key={product.id} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col group">
                                    <div className="h-32 rounded-xl overflow-hidden mb-3 relative">
                                        <img src={product.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button className="p-1.5 bg-white/90 rounded-lg text-gray-700 hover:text-sky-500 shadow-sm"><Edit size={14} /></button>
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">{product.name}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                                    <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-50 dark:border-gray-700">
                                        <span className="font-black text-sky-600 dark:text-sky-400">KES {product.price.toLocaleString()}</span>
                                        <span className="text-xs font-bold text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{product.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>

            {/* Add Service Modal */}
            {isServiceModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Add Service</h3>
                            <button onClick={() => setIsServiceModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"><X size={20}/></button>
                        </div>
                        <form onSubmit={submitService} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Title</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newService.title || ''}
                                    onChange={e => setNewService({...newService, title: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    placeholder="e.g. Platinum Polish"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Category</label>
                                <select 
                                    value={newService.category}
                                    onChange={e => setNewService({...newService, category: e.target.value as ServiceCategory})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                >
                                    {Object.values(ServiceCategory).map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Price (KES)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newService.price || ''}
                                        onChange={e => setNewService({...newService, price: Number(e.target.value)})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Duration</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newService.duration || ''}
                                        onChange={e => setNewService({...newService, duration: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                        placeholder="e.g. 2 Hours"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <Image size={20} className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={newService.image || ''}
                                        onChange={e => setNewService({...newService, image: e.target.value})}
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    required
                                    value={newService.description || ''}
                                    onChange={e => setNewService({...newService, description: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                                    placeholder="Describe the service..."
                                />
                            </div>
                            <button type="submit" className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
                                <Save size={20} /> Save Service
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Product Modal */}
            {isProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-200 dark:border-gray-800">
                         <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">Add Product</h3>
                            <button onClick={() => setIsProductModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"><X size={20}/></button>
                        </div>
                        <form onSubmit={submitProduct} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Product Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newProduct.name || ''}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                    placeholder="e.g. Ceramic Wax Kit"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Price (KES)</label>
                                    <input 
                                        type="number" 
                                        required
                                        value={newProduct.price || ''}
                                        onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Category</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={newProduct.category || ''}
                                        onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                                        className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 font-bold"
                                        placeholder="e.g. Car Care"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Image URL</label>
                                <div className="flex gap-2">
                                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                        <Image size={20} className="text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={newProduct.image || ''}
                                        onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                                        className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Description</label>
                                <textarea 
                                    rows={3}
                                    required
                                    value={newProduct.description || ''}
                                    onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-500 text-sm resize-none"
                                    placeholder="Describe the product..."
                                />
                            </div>
                            <button type="submit" className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-colors flex items-center justify-center gap-2">
                                <Save size={20} /> Save Product
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminDashboard;