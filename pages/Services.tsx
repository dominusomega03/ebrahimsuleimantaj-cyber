
import React, { useState, useEffect } from 'react';
import { MOCK_PROVIDERS, MOCK_REVIEWS } from '../constants';
import ServiceCard from '../components/ServiceCard';
import { Service, UserProfile, ServiceCategory, ServiceProvider, Review, LoyaltyTier } from '../types';
import { findRelevantServices } from '../services/geminiService';
import { Filter, Check, Zap, Search, Heart, Share2, Calendar, MapPin, User, ChevronLeft, ChevronRight, Sparkles, PaintBucket, Clock, Music, Star, Send, Loader2, Circle, Truck } from 'lucide-react';
import { submitToFormspree } from '../utils/formspree';

interface ServicesProps {
  user: UserProfile;
  services: Service[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onProviderClick: (provider: ServiceProvider) => void;
}

const Services: React.FC<ServicesProps> = ({ user, services, wishlist, onToggleWishlist, onProviderClick }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['ALL']);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiSearchResults, setAiSearchResults] = useState<string[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingStep, setBookingStep] = useState(0); // 0: List, 1: Details, 2: Payment, 3: Success

  // Booking Options
  const [includePickAndDrop, setIncludePickAndDrop] = useState(false);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  // Review State
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  // Scheduling State
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date()); // View state for calendar
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState<'checking' | 'available' | 'busy'>('checking');

  useEffect(() => {
      if (user.location) {
          setPickupAddress(user.location);
          setDropoffAddress(user.location);
      }
  }, [user.location]);

  // Filtering Logic
  const filteredServices = services.filter(service => {
    // If AI results exist, filter by ID matches
    if (aiSearchResults) {
        return aiSearchResults.includes(service.id);
    }

    const matchesCategory = selectedCategories.includes('ALL') || selectedCategories.includes(service.category);
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          // If query is long/natural language, use AI
          if (searchQuery.trim().split(' ').length > 2) {
              setIsSearching(true);
              const ids = await findRelevantServices(searchQuery, services);
              setAiSearchResults(ids);
              setIsSearching(false);
          } else {
              setAiSearchResults(null);
          }
      }
  };
  
  const clearSearch = () => {
      setSearchQuery('');
      setAiSearchResults(null);
  }

  // Categorize Customization Services for specific sections
  const pimpingServices = services.filter(s => 
    s.category === ServiceCategory.CUSTOMIZATION && 
    (s.title.includes('Wrap') || s.title.includes('Body Kit') || s.title.includes('Respray') || s.title.includes('Painting'))
  );

  const audioAndTechServices = services.filter(s => 
    s.category === ServiceCategory.CUSTOMIZATION && 
    (s.title.includes('Audio') || s.title.includes('Music') || s.title.includes('Tint'))
  );

  const showCustomizationSections = (selectedCategories.includes('ALL') || selectedCategories.includes('CUSTOMIZATION')) && !searchQuery;

  const categories = ['ALL', 'VEHICLE', 'PROPERTY', 'CUSTOMIZATION', 'LUXURY'];

  const toggleCategory = (category: string) => {
    if (category === 'ALL') {
      setSelectedCategories(['ALL']);
      return;
    }

    let newCategories = selectedCategories.filter(c => c !== 'ALL');
    if (newCategories.includes(category)) {
      newCategories = newCategories.filter(c => c !== category);
    } else {
      newCategories = [...newCategories, category];
    }

    if (newCategories.length === 0) {
      setSelectedCategories(['ALL']);
    } else {
      setSelectedCategories(newCategories);
    }
  };

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setBookingStep(1); // Go to Detail View
    // Reset selection
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
    setSelectedTime(null);
    setAvailabilityStatus('checking');
    setIncludePickAndDrop(false);
    // Reset addresses to current user location when opening new service
    setPickupAddress(user.location);
    setDropoffAddress(user.location);
  };

  // Calendar Helpers
  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); 
    return { daysInMonth, startDay };
  };

  const changeMonth = (increment: number) => {
      const newDate = new Date(currentMonth);
      newDate.setMonth(newDate.getMonth() + increment);
      setCurrentMonth(newDate);
  };

  const isDateSelected = (day: number) => {
      return selectedDate.getDate() === day && 
             selectedDate.getMonth() === currentMonth.getMonth() && 
             selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const isDateToday = (day: number) => {
      const today = new Date();
      return today.getDate() === day && 
             today.getMonth() === currentMonth.getMonth() && 
             today.getFullYear() === currentMonth.getFullYear();
  };

  const isDateDisabled = (day: number) => {
      const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const today = new Date();
      today.setHours(0,0,0,0);
      return d < today;
  };

  const { daysInMonth, startDay } = getCalendarDays(currentMonth);
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const calendarBlanks = Array.from({ length: startDay }, (_, i) => i);


  // Mock Time Slots
  const timeSlots = ['08:00', '09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];

  // Calculate a dummy estimated time for the confirmation
  const getFormattedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Assign a random provider based on service category
  const assignedProvider = selectedService ? MOCK_PROVIDERS.find(p => p.specialization.includes(selectedService.category)) || MOCK_PROVIDERS[0] : MOCK_PROVIDERS[0];

  const handleBookNow = async () => {
    if (!selectedTime || !selectedService) return;
    
    // Validate addresses if pick and drop is selected
    if (includePickAndDrop && (!pickupAddress || !dropoffAddress)) {
        alert("Please enter pickup and drop-off addresses.");
        return;
    }

    setBookingStep(2); // Go to Payment/Processing
    
    // Send data to Formspree
    const bookingData = {
        _subject: `New Service Booking: ${selectedService.title}`,
        type: 'SERVICE_BOOKING',
        serviceId: selectedService.id,
        serviceTitle: selectedService.title,
        price: selectedService.price,
        pickAndDropService: includePickAndDrop ? 'YES' : 'NO',
        pickupAddress: includePickAndDrop ? pickupAddress : 'N/A',
        dropoffAddress: includePickAndDrop ? dropoffAddress : 'N/A',
        providerId: assignedProvider.id,
        providerName: assignedProvider.name,
        appointmentDate: getFormattedDate(selectedDate),
        appointmentTime: selectedTime,
        customerName: user.name,
        customerLocation: user.location,
        customerTier: user.tier,
        bookingCreated: new Date().toLocaleString()
    };

    await submitToFormspree(bookingData);

    setTimeout(() => {
        setBookingStep(3); // Go to Success
    }, 2500);
  };

  const isLiked = selectedService ? wishlist.includes(selectedService.id) : false;

  // Effect to simulate checking real-time availability when a date is selected
  useEffect(() => {
      if (bookingStep === 1) {
          setAvailabilityStatus('checking');
          const timer = setTimeout(() => {
              setAvailabilityStatus('available');
          }, 1500);
          return () => clearTimeout(timer);
      }
  }, [selectedDate, bookingStep]);

  // Styling based on Tier
  const isElite = user.tier === LoyaltyTier.DIAMOND || user.tier === LoyaltyTier.PLATINUM || user.tier === LoyaltyTier.GOLD;
  const activeColorClass = isElite ? 'bg-gold-400 text-black border-gold-400 shadow-lg shadow-gold-400/30' : 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/30';
  const activeRingClass = isElite ? 'ring-gold-400' : 'ring-sky-500';

  if (bookingStep > 0 && selectedService) {
      return (
          <div className="pt-6 px-5 pb-24 max-w-md mx-auto min-h-screen bg-sky-50/50 dark:bg-gray-900/50">
              
              {/* Back Button (Only for Details) */}
              {bookingStep === 1 && (
                <div className="flex justify-between items-center mb-6">
                    <button onClick={() => setBookingStep(0)} className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex gap-2">
                         <button 
                            onClick={() => onToggleWishlist(selectedService.id)} 
                            className={`bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}
                         >
                            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                        </button>
                        <button className="bg-white dark:bg-gray-800 p-2.5 rounded-full shadow-sm text-gray-500 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
              )}

              {/* Step 1: Detail Page */}
              {bookingStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                      {/* Image Hero */}
                      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl h-80 border-4 border-white dark:border-gray-800 group">
                          <img src={selectedService.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={selectedService.title} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                          <div className="absolute bottom-6 left-6 text-white right-6">
                              <div className="flex justify-between items-end">
                                  <div>
                                      <div className="flex items-center gap-2 mb-2">
                                         <p className="bg-white/20 backdrop-blur-md text-sky-200 font-extrabold uppercase text-[10px] tracking-widest px-2 py-1 rounded-md">{selectedService.category}</p>
                                         {selectedService.premiumOnly && <span className="text-gold-400 text-[10px] font-bold flex items-center gap-1"><Sparkles size={10} /> VIP</span>}
                                      </div>
                                      <h3 className="font-black text-3xl leading-tight mb-2 shadow-black drop-shadow-md">{selectedService.title}</h3>
                                      <div className="flex items-center gap-2">
                                          <div className="flex text-gold-400">
                                              {[...Array(5)].map((_, i) => (
                                                  <Star key={i} size={14} fill={i < Math.floor(selectedService.averageRating || 5) ? 'currentColor' : 'none'} className={i < Math.floor(selectedService.averageRating || 5) ? '' : 'text-gray-400'} />
                                              ))}
                                          </div>
                                          <span className="text-xs font-bold text-gray-300">{selectedService.averageRating} ({selectedService.reviewCount} Reviews)</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Details Card */}
                      <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] shadow-xl shadow-sky-100/50 dark:shadow-sky-900/10 border border-white dark:border-gray-700">
                          
                          {/* Provider & Availability Check */}
                          <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl border border-gray-100 dark:border-gray-700">
                              <div className="relative">
                                  <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img src={assignedProvider.image} alt={assignedProvider.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${availabilityStatus === 'available' ? 'bg-green-500' : 'bg-amber-500'} animate-pulse`}></div>
                              </div>
                              <div className="flex-1">
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Assigned Expert</p>
                                  <p className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                                      {assignedProvider.name}
                                      <span className="text-sky-500 text-[10px] bg-sky-100 dark:bg-sky-900/50 px-1.5 rounded ml-1">{assignedProvider.tier}</span>
                                  </p>
                              </div>
                              <div className="text-right">
                                  {availabilityStatus === 'checking' ? (
                                      <div className="flex items-center gap-1 text-xs font-bold text-gray-400">
                                          <Loader2 size={12} className="animate-spin" /> Checking...
                                      </div>
                                  ) : (
                                      <div className="text-xs font-bold text-green-500 flex items-center gap-1">
                                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Online
                                      </div>
                                  )}
                              </div>
                          </div>

                          <h4 className="text-gray-900 dark:text-white font-extrabold text-lg mb-2">Description</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-8 font-medium">{selectedService.description}</p>
                          
                          {/* Calendar & Time Selection */}
                          <div className="mb-8">
                               <h4 className="text-gray-900 dark:text-white font-extrabold text-lg mb-4 flex items-center gap-2">
                                   <Calendar size={20} className={isElite ? 'text-gold-400' : 'text-sky-500'} /> 
                                   Select Schedule
                               </h4>
                               
                               {/* Custom Calendar Component */}
                               <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-3xl mb-6 border border-gray-100 dark:border-gray-700">
                                    {/* Calendar Header */}
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <button 
                                            onClick={() => changeMonth(-1)} 
                                            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <span className="font-black text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">
                                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </span>
                                        <button 
                                            onClick={() => changeMonth(1)} 
                                            className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300 transition-colors shadow-sm"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>

                                    {/* Days Header */}
                                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                        {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                                            <span key={d} className="text-[10px] font-bold text-gray-400 uppercase">{d}</span>
                                        ))}
                                    </div>

                                    {/* Days Grid */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarBlanks.map((_, i) => <div key={`blank-${i}`} />)}
                                        {calendarDays.map(day => {
                                            const selected = isDateSelected(day);
                                            const disabled = isDateDisabled(day);
                                            const today = isDateToday(day);
                                            
                                            return (
                                                <button 
                                                    key={day} 
                                                    disabled={disabled}
                                                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                                                    className={`
                                                        aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all relative
                                                        ${selected 
                                                            ? activeColorClass 
                                                            : disabled 
                                                                ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-gray-700 border border-transparent shadow-sm'
                                                        }
                                                    `}
                                                >
                                                    {day}
                                                    {today && !selected && (
                                                        <div className={`absolute bottom-1 w-1 h-1 rounded-full ${isElite ? 'bg-gold-400' : 'bg-sky-500'}`}></div>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                               </div>

                               {/* Time Slots */}
                               <div className="grid grid-cols-4 gap-2">
                                   {timeSlots.map((time) => (
                                       <button
                                           key={time}
                                           onClick={() => setSelectedTime(time)}
                                           className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                                               selectedTime === time
                                               ? `${activeColorClass} shadow-md`
                                               : 'bg-gray-50 dark:bg-gray-700/30 border-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                           }`}
                                       >
                                           {time}
                                       </button>
                                   ))}
                               </div>
                          </div>

                          {/* Pick & Drop Toggle and Options */}
                          <div className={`rounded-2xl mb-6 border transition-all overflow-hidden ${
                                  includePickAndDrop 
                                  ? 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800' 
                                  : 'bg-white dark:bg-gray-700/30 border-gray-100 dark:border-gray-700'
                              }`}>
                              
                              <div 
                                  onClick={() => setIncludePickAndDrop(!includePickAndDrop)}
                                  className="flex items-center justify-between p-4 cursor-pointer"
                              >
                                  <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-xl transition-colors ${includePickAndDrop ? 'bg-sky-500 text-white' : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300'}`}>
                                          <Truck size={20} />
                                      </div>
                                      <div>
                                          <h4 className="font-bold text-sm text-gray-900 dark:text-white">Pick & Drop Service</h4>
                                          <p className="text-xs text-gray-500 dark:text-gray-400">We collect, clean, and return your items.</p>
                                      </div>
                                  </div>
                                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${includePickAndDrop ? 'bg-sky-500' : 'bg-gray-200 dark:bg-gray-600'}`}>
                                      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${includePickAndDrop ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                  </div>
                              </div>

                              {/* Collapsible Location Inputs */}
                              {includePickAndDrop && (
                                  <div className="px-4 pb-4 pt-0 space-y-3 animate-fade-in">
                                      <div className="border-t border-sky-100 dark:border-sky-800/50 pt-3"></div>
                                      <div>
                                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Pickup Address</label>
                                          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-sky-100 dark:border-sky-800/50 focus-within:ring-2 focus-within:ring-sky-200 dark:focus-within:ring-sky-800 transition-all">
                                              <MapPin size={16} className="text-sky-500" />
                                              <input 
                                                  type="text" 
                                                  value={pickupAddress}
                                                  onChange={(e) => setPickupAddress(e.target.value)}
                                                  className="flex-1 bg-transparent text-sm font-bold text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                                                  placeholder="Enter pickup location"
                                              />
                                          </div>
                                      </div>
                                      <div>
                                          <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase ml-1">Drop-off Address</label>
                                          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-xl border border-sky-100 dark:border-sky-800/50 focus-within:ring-2 focus-within:ring-sky-200 dark:focus-within:ring-sky-800 transition-all">
                                              <MapPin size={16} className="text-sky-500" />
                                              <input 
                                                  type="text" 
                                                  value={dropoffAddress}
                                                  onChange={(e) => setDropoffAddress(e.target.value)}
                                                  className="flex-1 bg-transparent text-sm font-bold text-gray-800 dark:text-gray-200 outline-none placeholder:text-gray-400"
                                                  placeholder="Enter return location"
                                              />
                                          </div>
                                      </div>
                                  </div>
                              )}
                          </div>

                          <div className="flex items-center gap-4 mb-8">
                              <div className="flex-1 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-3xl text-center border border-sky-100 dark:border-sky-800/30">
                                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Duration</span>
                                  <span className="font-black text-gray-800 dark:text-gray-200 text-lg">{selectedService.duration}</span>
                              </div>
                              <div className="flex-1 bg-green-50 dark:bg-green-900/20 p-4 rounded-3xl text-center border border-green-100 dark:border-green-800/30">
                                  <span className="block text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">Total</span>
                                  <span className="font-black text-green-700 dark:text-green-400 text-lg">KES {selectedService.price.toLocaleString()}</span>
                              </div>
                          </div>

                          <div className="flex gap-4 mb-10">
                              <button onClick={() => onToggleWishlist(selectedService.id)} className={`p-4 rounded-2xl transition-colors ${isLiked ? 'bg-red-50 dark:bg-red-900/20 text-red-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                  <Heart size={24} fill={isLiked ? 'currentColor' : 'none'} />
                              </button>
                              <button 
                                onClick={handleBookNow} 
                                disabled={!selectedTime}
                                className={`flex-1 py-4 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2 ${
                                    !selectedTime 
                                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed shadow-none' 
                                    : 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/30 hover:shadow-sky-500/50'
                                }`}
                              >
                                  {selectedTime ? 'Confirm Booking' : 'Select Time'} <Zap size={20} fill="currentColor" />
                              </button>
                          </div>

                          {/* Reviews Section */}
                          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
                              <h4 className="text-gray-900 dark:text-white font-extrabold text-lg mb-4">Reviews</h4>
                              
                              {/* Write Review Input (Visual Only) */}
                              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-2xl mb-6">
                                  <div className="flex gap-2 mb-2">
                                      {[1,2,3,4,5].map(star => (
                                          <button key={star} onClick={() => setReviewRating(star)} className="text-gold-400 hover:scale-110 transition-transform">
                                              <Star size={20} fill={star <= reviewRating ? 'currentColor' : 'none'} />
                                          </button>
                                      ))}
                                  </div>
                                  <div className="flex gap-2">
                                      <input 
                                        type="text" 
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        placeholder="Share your experience..." 
                                        className="flex-1 bg-transparent border-b border-gray-200 dark:border-gray-600 focus:outline-none focus:border-sky-500 text-sm py-2 text-gray-800 dark:text-white"
                                      />
                                      <button className="bg-sky-500 text-white p-2 rounded-lg hover:bg-sky-600">
                                          <Send size={16} />
                                      </button>
                                  </div>
                              </div>

                              <div className="space-y-4">
                                  {MOCK_REVIEWS.map(review => (
                                      <div key={review.id} className="bg-gray-50 dark:bg-gray-700/20 p-4 rounded-2xl">
                                          <div className="flex justify-between mb-2">
                                               <span className="font-bold text-sm text-gray-900 dark:text-gray-100">{review.userName}</span>
                                               <div className="flex items-center gap-1">
                                                   <Star size={10} fill="#FFD700" className="text-gold-400"/>
                                                   <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{review.rating}</span>
                                               </div>
                                          </div>
                                          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{review.comment}</p>
                                          <span className="text-[10px] text-gray-400 font-medium">{review.date}</span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Step 2: Processing */}
              {bookingStep === 2 && (
                  <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                       <div className="relative mb-10">
                           <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg relative z-10">
                               <Zap className="text-sky-500 animate-pulse" size={40} fill="currentColor" />
                           </div>
                           <div className="absolute inset-0 bg-sky-400 rounded-full animate-ping opacity-20"></div>
                           <div className="absolute inset-0 bg-sky-400 rounded-full animate-pulse opacity-20 delay-75"></div>
                       </div>
                       <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Connecting...</h3>
                       <p className="text-gray-500 dark:text-gray-400 font-medium max-w-[200px]">We are securing {assignedProvider.name} for your {selectedService.title}.</p>
                  </div>
              )}

              {/* Step 3: Success Confirmation */}
              {bookingStep === 3 && (
                  <div className="flex flex-col items-center justify-center space-y-6 pt-8 animate-fade-in-up relative overflow-hidden min-h-[80vh]">
                      
                      {/* Dynamic Confetti & Aura based on Tier */}
                      <div className="absolute inset-0 pointer-events-none">
                         {[...Array(30)].map((_, i) => (
                             <div key={i} className="absolute w-2 h-2 rounded-full animate-float" style={{
                                 backgroundColor: user.tier === LoyaltyTier.DIAMOND || user.tier === LoyaltyTier.PLATINUM 
                                    ? ['#FFD700', '#FDB931', '#FFFFFF', '#0EA5E9'][Math.floor(Math.random() * 4)] // Gold theme
                                    : ['#38BDF8', '#FFD700', '#F472B6', '#4ADE80'][Math.floor(Math.random() * 4)], // Fun theme
                                 top: `${Math.random() * 100}%`,
                                 left: `${Math.random() * 100}%`,
                                 animationDelay: `${Math.random() * 2}s`,
                                 animationDuration: `${3 + Math.random() * 3}s`
                             }}></div>
                         ))}
                         {/* Aura */}
                         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-30 ${user.tier === LoyaltyTier.DIAMOND ? 'bg-gold-500' : 'bg-sky-500'}`}></div>
                      </div>

                      <div className="w-32 h-32 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 shadow-[0_0_50px_rgba(74,222,128,0.5)] animate-bounce relative z-10 border-4 border-white dark:border-gray-800">
                          <Check size={64} className="text-green-600 dark:text-green-400 drop-shadow-sm" strokeWidth={4} />
                      </div>
                      
                      <div className="text-center mb-6 relative z-10 px-4">
                        <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Confirmed!</h2>
                        <p className="text-gray-600 dark:text-gray-300 font-bold text-lg">
                            {user.tier === LoyaltyTier.DIAMOND || user.tier === LoyaltyTier.PLATINUM 
                                ? `A ${user.tier}-Tier experience is locked in!` 
                                : `Happiness is on the way, ${user.name.split(' ')[0]}!`
                            }
                        </p>
                        {includePickAndDrop && (
                            <div className="mt-3 inline-block bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 px-3 py-1 rounded-full text-xs font-bold border border-sky-200 dark:border-sky-800 flex items-center gap-1">
                                <Truck size={12} /> Pick & Drop Included
                            </div>
                        )}
                      </div>
                      
                      {/* Booking Summary Card */}
                      <div className="w-full bg-white dark:bg-gray-800 p-0 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-xl overflow-hidden relative z-10">
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-6 border-b border-gray-100 dark:border-gray-700">
                             <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                                    <img src={selectedService.image} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                      <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">{selectedService.title}</h3>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">{selectedService.category}</p>
                                  </div>
                             </div>
                          </div>
                          <div className="p-6 space-y-4">
                               <div className="flex justify-between items-center">
                                   <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                        <div className="bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg text-sky-500 dark:text-sky-400"><Clock size={18} /></div>
                                        <span className="text-sm font-bold">Scheduled For</span>
                                   </div>
                                   <div className="text-right">
                                       <span className="block font-bold text-gray-900 dark:text-white">{getFormattedDate(selectedDate)}</span>
                                       <span className="text-sm text-sky-600 dark:text-sky-400 font-extrabold">{selectedTime}</span>
                                   </div>
                               </div>

                               {includePickAndDrop && (
                                   <div className="flex justify-between items-start pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
                                       <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                                            <div className="bg-sky-50 dark:bg-sky-900/30 p-2 rounded-lg text-sky-500 dark:text-sky-400"><MapPin size={18} /></div>
                                            <span className="text-sm font-bold">Pick & Drop</span>
                                       </div>
                                       <div className="text-right max-w-[50%]">
                                           <span className="block text-[10px] font-bold text-gray-400 uppercase">Pickup</span>
                                           <span className="block font-bold text-gray-900 dark:text-white text-xs truncate mb-1">{pickupAddress}</span>
                                           <span className="block text-[10px] font-bold text-gray-400 uppercase">Drop-off</span>
                                           <span className="block font-bold text-gray-900 dark:text-white text-xs truncate">{dropoffAddress}</span>
                                       </div>
                                   </div>
                               )}
                               
                               {/* Provider Section - Clickable */}
                               <div 
                                    onClick={() => onProviderClick(assignedProvider)}
                                    className="flex justify-between items-center pt-4 border-t border-dashed border-gray-200 dark:border-gray-700 mt-2 cursor-pointer group hover:bg-gray-50 dark:hover:bg-gray-700/50 -mx-6 px-6 py-2 transition-colors"
                                >
                                   <div className="flex items-center gap-3">
                                       <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden ring-2 ring-white dark:ring-gray-600 group-hover:ring-sky-400 transition-all">
                                           <img src={assignedProvider.image} alt="Pro" className="w-full h-full object-cover"/>
                                       </div>
                                       <div>
                                           <p className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-sky-500 transition-colors flex items-center gap-1">{assignedProvider.name} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/></p>
                                           <p className="text-[10px] text-sky-500 font-bold uppercase tracking-wider">{assignedProvider.tier} Specialist</p>
                                       </div>
                                   </div>
                                    <div className="text-right">
                                      <span className="block text-[10px] text-gray-400 uppercase font-bold">Total Paid</span>
                                      <span className="font-black text-xl text-sky-600 dark:text-sky-400">KES {selectedService.price.toLocaleString()}</span>
                                    </div>
                               </div>
                          </div>
                      </div>

                      <button onClick={() => setBookingStep(0)} className="w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 py-4 rounded-2xl font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all mt-4 relative z-10">
                          Book Another Service
                      </button>
                  </div>
              )}
          </div>
      );
  }

  // View: Service List
  return (
    <div className="pb-24 pt-6 px-5 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Services</h1>
        <button className="p-3 bg-white dark:bg-gray-800 border border-sky-100 dark:border-gray-700 rounded-2xl shadow-sm hover:bg-sky-50 dark:hover:bg-gray-700 transition-colors">
            <Filter size={20} className="text-sky-600 dark:text-sky-400" />
        </button>
      </div>

      {/* AI Search Bar */}
      <div className="relative mb-6">
          <input 
            type="text" 
            placeholder="Try 'I need a fast wash...'" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className={`w-full bg-white dark:bg-gray-800 border ${aiSearchResults ? 'border-sky-500 ring-2 ring-sky-200 dark:ring-sky-900' : 'border-gray-100 dark:border-gray-700'} rounded-2xl py-4 pl-12 pr-12 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-900 focus:border-sky-300 transition-all text-sm font-bold text-gray-700 dark:text-gray-200 placeholder:text-gray-400`}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
               {isSearching ? <Sparkles size={20} className="text-sky-500 animate-spin" /> : <Search className="text-gray-400" size={20} />}
          </div>
          {searchQuery && (
              <button onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-200 dark:bg-gray-700 rounded-full p-1 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                  <span className="sr-only">Clear</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
          )}
          {aiSearchResults && (
             <div className="absolute top-full left-0 right-0 mt-2 bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2">
                 <Sparkles size={12} /> AI found matches for your request!
             </div>
          )}
      </div>

      {/* Category Pills (Multi-Select) */}
      <div className="flex gap-2 overflow-x-auto pb-6 mb-2 no-scrollbar pl-1">
        {categories.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
                <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-sm border ${
                        isSelected
                        ? 'bg-sky-500 text-white border-sky-500 shadow-sky-500/30' 
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-100 dark:border-gray-700 hover:border-sky-200 dark:hover:border-gray-600'
                    }`}
                >
                    {cat === 'CUSTOMIZATION' ? 'CUSTOM' : cat}
                </button>
            );
        })}
      </div>

      {/* Car Pimping & Wraps Section */}
      {showCustomizationSections && pimpingServices.length > 0 && (
        <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-100 dark:bg-purple-900/50 p-2 rounded-lg">
                    <PaintBucket size={16} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Car Pimping & Wraps</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                {pimpingServices.map(service => (
                    <div 
                        key={service.id} 
                        onClick={() => handleServiceClick(service)}
                        className="min-w-[260px] bg-gray-900 dark:bg-gray-950 rounded-[2rem] shadow-xl overflow-hidden relative group cursor-pointer border border-gray-700 dark:border-gray-800"
                    >
                        <img src={service.image} className="w-full h-40 object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-110" alt={service.title} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <span className="bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md mb-2 inline-block">HOT</span>
                            <h3 className="text-white font-bold text-lg leading-none mb-1">{service.title}</h3>
                            <p className="text-gray-300 text-xs">{service.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Audio & Tech Lounge Section */}
      {showCustomizationSections && audioAndTechServices.length > 0 && (
        <div className="mb-8">
             <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                    <Music size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">Audio & Tech Lounge</h2>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-5 px-5">
                 {audioAndTechServices.map(service => (
                     <div 
                        key={service.id} 
                        onClick={() => handleServiceClick(service)}
                        className="min-w-[220px] bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col cursor-pointer hover:shadow-md transition-all group"
                     >
                         <div className="h-28 rounded-2xl overflow-hidden mb-3 relative">
                             <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={service.title} />
                         </div>
                         <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{service.title}</h3>
                         <div className="mt-auto flex justify-between items-center">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{service.duration}</span>
                              <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">KES {service.price.toLocaleString()}</span>
                         </div>
                     </div>
                 ))}
            </div>
        </div>
      )}

      {/* Main List (Everything else) */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
            {aiSearchResults ? 'Recommended for You' : (selectedCategories.includes('ALL') ? 'All Services' : 'Other Services')}
        </h2>
        {filteredServices.length > 0 ? (
            filteredServices.map(service => (
                <ServiceCard key={service.id} service={service} onBook={handleServiceClick} />
            ))
        ) : (
            <div className="text-center py-10 opacity-50">
                <p className="text-gray-500 dark:text-gray-400 font-bold">No matching services found.</p>
                {aiSearchResults && <button onClick={clearSearch} className="text-sky-500 font-bold text-sm mt-2">Clear Search</button>}
            </div>
        )}
      </div>
    </div>
  );
};

export default Services;
