
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, Moon, Sun, Bell, Shield, CreditCard, User, LogOut, ChevronRight, Smartphone, Mail } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setView: (view: string) => void;
  onEditProfile: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, isDarkMode, toggleTheme, setView, onEditProfile }) => {
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    promo: false,
  });

  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('profile')} className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Settings</h1>
      </div>

      {/* Account Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">Account</h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            <div 
                onClick={onEditProfile}
                className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <User size={20} />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Personal Information</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.name} • {user.location}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-4 border-b border-gray-50 dark:border-gray-700/50">
                <div className="w-12 h-12 bg-sky-50 dark:bg-sky-900/20 rounded-full flex items-center justify-center text-sky-500">
                    <CreditCard size={20} />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Payment Methods</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Visa ending in 4242</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
            <div className="p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center text-green-500">
                    <Shield size={20} />
                </div>
                <div className="flex-1">
                    <p className="font-bold text-gray-900 dark:text-white">Privacy & Security</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Biometric ID enabled</p>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
            </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="mb-8">
        <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">Preferences</h2>
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
            {/* Dark Mode Toggle */}
            <div className="p-4 flex items-center justify-between border-b border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-full flex items-center justify-center text-purple-500">
                        {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Appearance</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
                    </div>
                </div>
                <button 
                    onClick={toggleTheme}
                    className={`w-12 h-7 rounded-full transition-colors relative ${isDarkMode ? 'bg-sky-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${isDarkMode ? 'left-6' : 'left-1'}`}></div>
                </button>
            </div>

            {/* Notifications */}
            <div className="p-4 border-b border-gray-50 dark:border-gray-700/50">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center text-amber-500">
                        <Bell size={20} />
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white">Notifications</p>
                    </div>
                </div>
                
                <div className="pl-16 space-y-4">
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                             <Smartphone size={16} /> Push Notifications
                         </div>
                         <button 
                            onClick={() => setNotifications(p => ({...p, push: !p.push}))}
                            className={`w-10 h-6 rounded-full transition-colors relative ${notifications.push ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notifications.push ? 'left-5' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="flex justify-between items-center">
                         <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                             <Mail size={16} /> Email Updates
                         </div>
                         <button 
                            onClick={() => setNotifications(p => ({...p, email: !p.email}))}
                            className={`w-10 h-6 rounded-full transition-colors relative ${notifications.email ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${notifications.email ? 'left-5' : 'left-1'}`}></div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </section>

       {/* Actions */}
       <section>
           <button className="w-full bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 p-4 rounded-3xl font-bold flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors mb-4">
               <LogOut size={20} /> Log Out
           </button>
           <p className="text-center text-xs text-gray-400 font-medium">Version 2.5.1 • Build 2024</p>
       </section>
    </div>
  );
};

export default Settings;
