
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, Save, MapPin, User, Loader2 } from 'lucide-react';
import { submitToFormspree } from '../utils/formspree';

interface EditProfileProps {
  user: UserProfile;
  onSave: (updatedUser: UserProfile) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    location: user.location,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Submit update to Formspree
    const profileUpdateData = {
        _subject: `Profile Update: ${user.name}`,
        type: 'PROFILE_UPDATE',
        originalName: user.name,
        originalLocation: user.location,
        newName: formData.name,
        newLocation: formData.location,
        updatedAt: new Date().toLocaleString()
    };

    await submitToFormspree(profileUpdateData);

    // Simulate API call latency
    setTimeout(() => {
        onSave({ ...user, ...formData });
        setIsSaving(false);
    }, 800);
  };

  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onCancel} className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
            <ChevronLeft size={20} />
        </button>
        <h1 className="text-2xl font-black text-gray-800 dark:text-white">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section (Visual only) */}
        <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-tr from-sky-400 to-sky-600 rounded-full flex items-center justify-center text-white text-3xl font-extrabold shadow-xl ring-4 ring-white dark:ring-gray-800 mb-3">
                 {formData.name.split(' ').map(n => n[0]).join('').substring(0,2)}
            </div>
            <p className="text-sm text-sky-500 font-bold">Profile Photo</p>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Full Name</label>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-900 transition-all shadow-sm">
                    <User className="text-gray-400" size={20} />
                    <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white font-bold"
                        placeholder="Enter your name"
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Primary Location</label>
                <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-4 flex items-center gap-3 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-900 transition-all shadow-sm">
                    <MapPin className="text-gray-400" size={20} />
                    <input 
                        type="text" 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="flex-1 bg-transparent outline-none text-gray-900 dark:text-white font-bold"
                        placeholder="e.g. Karen, Nairobi"
                        required
                    />
                </div>
            </div>
        </div>

        <button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all mt-8"
        >
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {isSaving ? 'Saving Changes...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
