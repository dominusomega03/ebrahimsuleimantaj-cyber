
import { Service, ServiceCategory, Product, UserProfile, LoyaltyTier, ServiceProvider, Review, Booking } from './types';

export const USER_MOCK: UserProfile = {
  id: "u_alex",
  name: "Alex Kamau",
  location: "Karen, Nairobi",
  tier: LoyaltyTier.PLATINUM,
  points: 12500,
  totalSpent: 450000,
  locationWealthIndex: 'HIGH',
};

export const MOCK_PROVIDERS: ServiceProvider[] = [
  {
    id: 'prov1',
    name: 'James O.',
    role: 'Elite Cleaning Master',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    rating: 4.9,
    jobsCompleted: 1240,
    tier: 'Elite',
    specialization: [ServiceCategory.VEHICLE],
    bio: 'James is a certified master detailer with over 10 years of experience treating luxury vehicles. His obsession with perfection makes him the go-to for ceramic coatings.'
  },
  {
    id: 'prov2',
    name: 'Sarah K.',
    role: 'Interior Specialist',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    rating: 4.8,
    jobsCompleted: 850,
    tier: 'Standard',
    specialization: [ServiceCategory.PROPERTY, ServiceCategory.LUXURY],
    bio: 'Sarah specializes in fabric restoration and eco-friendly deep cleaning for high-end homes. She brings a fresh, revitalizing touch to every space.'
  },
  {
    id: 'prov3',
    name: 'David M.',
    role: 'Customization Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    rating: 5.0,
    jobsCompleted: 430,
    tier: 'Master',
    specialization: [ServiceCategory.CUSTOMIZATION],
    bio: 'Known as "The Artist," David handles our most complex wraps and modifications. His work has been featured in international automotive magazines.'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    userId: 'u2',
    userName: 'Grace M.',
    rating: 5,
    comment: 'Absolutely stunning work! My car looks better than the day I bought it. James was professional and meticulous.',
    date: '2 days ago'
  },
  {
    id: 'r2',
    userId: 'u3',
    userName: 'Brian K.',
    rating: 4,
    comment: 'Great service, highly recommended. The team arrived on time and did a thorough job.',
    date: '1 week ago'
  },
  {
    id: 'r3',
    userId: 'u4',
    userName: 'Sophia L.',
    rating: 5,
    comment: 'The ceramic coating is a game changer. Rain just slides off! Worth every penny.',
    date: '2 weeks ago'
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-1023',
    serviceId: 's1',
    userId: 'u55',
    userName: 'Kevin Hart',
    providerId: 'prov1',
    providerName: 'James O.',
    date: 'Oct 24, 2023',
    time: '10:00 AM',
    status: 'COMPLETED',
    total: 25000
  },
  {
    id: 'bk-1024',
    serviceId: 's2',
    userId: 'u62',
    userName: 'Lupita N.',
    providerId: 'prov2',
    providerName: 'Sarah K.',
    date: 'Oct 25, 2023',
    time: '02:00 PM',
    status: 'IN_PROGRESS',
    total: 1500
  },
  {
    id: 'bk-1025',
    serviceId: 's7',
    userId: 'u71',
    userName: 'Trevor N.',
    providerId: 'prov3',
    providerName: 'David M.',
    date: 'Oct 26, 2023',
    time: '09:00 AM',
    status: 'CONFIRMED',
    total: 85000
  },
  // Active bookings for the current user mock (Alex)
  {
    id: 'bk-8821',
    serviceId: 's1',
    userId: 'u_alex',
    userName: 'Alex Kamau',
    providerId: 'prov1',
    providerName: 'James O.',
    date: 'Tomorrow',
    time: '09:00 AM',
    status: 'CONFIRMED',
    total: 25000
  },
  {
    id: 'bk-8822',
    serviceId: 's4',
    userId: 'u_alex',
    userName: 'Alex Kamau',
    providerId: 'prov2',
    providerName: 'Sarah K.',
    date: 'Next Saturday',
    time: '11:00 AM',
    status: 'PENDING',
    total: 15000
  },
  {
    id: 'bk-1026',
    serviceId: 's5',
    userId: 'u88',
    userName: 'Eliud K.',
    providerId: 'prov2',
    providerName: 'Sarah K.',
    date: 'Oct 26, 2023',
    time: '06:00 PM',
    status: 'PENDING',
    total: 35000
  },
  {
    id: 'bk-1027',
    serviceId: 's2',
    userId: 'u91',
    userName: 'Maina K.',
    providerId: 'prov1',
    providerName: 'James O.',
    date: 'Oct 23, 2023',
    time: '11:00 AM',
    status: 'CANCELLED',
    total: 1500
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'Ceramic Coating Elite',
    description: 'Immortalize your vehicle\'s finish. The ultimate hydrophobic shield that guarantees a 5-year showroom shine and effortless maintenance.',
    price: 25000,
    category: ServiceCategory.VEHICLE,
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=400',
    duration: '6 Hours',
    premiumOnly: true,
    averageRating: 4.9,
    reviewCount: 128
  },
  {
    id: 's2',
    title: 'Mobile Executive Wash',
    description: 'The CEO Standard. Command respect with a spotless exterior and pristine interior, delivered precisely to your schedule. Success loves cleanliness.',
    price: 1500,
    category: ServiceCategory.VEHICLE,
    image: 'https://images.unsplash.com/photo-1520340356584-7c903ccf70dc?auto=format&fit=crop&q=80&w=400',
    duration: '1 Hour',
    averageRating: 4.7,
    reviewCount: 850
  },
  {
    id: 's13',
    title: 'Signature Deep Detailing',
    description: 'Reset your car to factory settings. We erase years of wear, restoring the new-car feel that you fell in love with. A mandatory refresh for high-value assets.',
    price: 8500,
    category: ServiceCategory.VEHICLE,
    image: 'https://images.unsplash.com/photo-1600661653561-629509216228?auto=format&fit=crop&q=80&w=400',
    duration: '4 Hours',
    averageRating: 4.8,
    reviewCount: 340
  },
  {
    id: 's14',
    title: 'Full Mechanical Repair',
    description: 'Don\'t let a breakdown compromise your momentum. Our elite mechanics bring the dealership workshop to your driveway. Expert diagnostics, zero downtime.',
    price: 5500,
    category: ServiceCategory.VEHICLE,
    image: 'https://images.unsplash.com/photo-1530046339160-ce3e530c7d2f?auto=format&fit=crop&q=80&w=400',
    duration: 'Varies',
    averageRating: 4.6,
    reviewCount: 120
  },
  {
    id: 's3',
    title: 'Deep Sofa Restoration',
    description: 'Revitalize your living space. We eliminate allergens and restore the vibrancy of your luxury furniture, creating a healthier, more inviting home environment.',
    price: 4500,
    category: ServiceCategory.PROPERTY,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=400',
    duration: '2 Hours',
    averageRating: 4.7,
    reviewCount: 210
  },
  {
    id: 's4',
    title: 'Mansion Pressure Wash',
    description: 'Curb appeal is everything. Blast away unsightly grime from your driveway and patios to reflect the true value of your property.',
    price: 15000,
    category: ServiceCategory.PROPERTY,
    image: 'https://images.unsplash.com/photo-1581578731117-104f2a863a17?auto=format&fit=crop&q=80&w=400',
    duration: '4 Hours',
    averageRating: 4.9,
    reviewCount: 85
  },
  {
    id: 's5',
    title: 'Private Chef Experience',
    description: 'Transform your home into a 5-star restaurant. Impress your guests with a bespoke culinary journey crafted by Nairobi\'s top chefs.',
    price: 35000,
    category: ServiceCategory.LUXURY,
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=400',
    duration: 'Evening',
    premiumOnly: true,
    averageRating: 5.0,
    reviewCount: 42
  },
  {
    id: 's6',
    title: 'Mechanic Diagnostics',
    description: 'Knowledge is power. Identify hidden issues before they become expensive failures with our hospital-grade diagnostic scan.',
    price: 3000,
    category: ServiceCategory.VEHICLE,
    image: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&q=80&w=400',
    duration: '1 Hour',
    averageRating: 4.5,
    reviewCount: 150
  },
  {
    id: 's7',
    title: 'Premium Vehicle Wrap',
    description: 'Reinvent your identity. Turn heads at every corner with a flawless, custom color change. Protect your original paint while expressing your unique style.',
    price: 85000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=400',
    duration: '2 Days',
    premiumOnly: true,
    averageRating: 4.9,
    reviewCount: 67
  },
  {
    id: 's8',
    title: 'Ceramic Window Tinting',
    description: 'Privacy meets performance. Reject 99% of UV rays and keep your cabin cool, while adding a mysterious, sophisticated aesthetic to your ride.',
    price: 15000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=400',
    duration: '4 Hours',
    averageRating: 4.7,
    reviewCount: 190
  },
  {
    id: 's9',
    title: 'Audio System Upgrade',
    description: 'Feel the bass, don\'t just hear it. Transform your commute into a private concert with a custom-tuned auditory experience.',
    price: 45000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1545459720-aacaf5090834?auto=format&fit=crop&q=80&w=400',
    duration: '1 Day',
    averageRating: 4.8,
    reviewCount: 95
  },
  {
    id: 's10',
    title: 'Custom Body Kit & Pimping',
    description: 'Aggressive stance, aerodynamic performance. Elevate your car from stock to shock. Be the envy of the road.',
    price: 60000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=400',
    duration: '3 Days',
    averageRating: 4.8,
    reviewCount: 45
  },
  {
    id: 's11',
    title: 'Professional Paint Respray',
    description: 'Perfection restored. A complete, gallery-quality respray that creates a depth and luster deeper than the day it left the factory.',
    price: 120000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1625043484550-df60256f6ea5?auto=format&fit=crop&q=80&w=400',
    duration: '5 Days',
    premiumOnly: true,
    averageRating: 5.0,
    reviewCount: 28
  },
  {
    id: 's12',
    title: 'Music System Installation',
    description: 'The heartbeat of your car. Professional installation of high-fidelity head units and speakers for crystal clear sound that cuts through the noise.',
    price: 25000,
    category: ServiceCategory.CUSTOMIZATION,
    image: 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&q=80&w=400',
    duration: '6 Hours',
    averageRating: 4.7,
    reviewCount: 112
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Meguiar\'s Gold Class Wax',
    description: 'The secret to that "wet look" shine. Trusted by professionals.',
    price: 2800,
    category: 'Car Care',
    image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&q=80&w=200',
    rating: 4.8
  },
  {
    id: 'p2',
    name: 'Dyson V15 Detect',
    description: 'Invest in the best. Unmatched power for a spotless home sanctuary.',
    price: 125000,
    category: 'Home',
    image: 'https://images.unsplash.com/photo-1558317374-a3594743e466?auto=format&fit=crop&q=80&w=200',
    rating: 4.9
  },
  {
    id: 'p3',
    name: 'Chemical Guys Leather Kit',
    description: 'Preserve the luxury. Keep your leather soft, supple, and smelling new.',
    price: 4500,
    category: 'Car Care',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=200',
    rating: 4.7
  },
  {
    id: 'p4',
    name: 'JBL BassPro Hub',
    description: 'Hidden power. Add massive bass without sacrificing trunk space.',
    price: 45000,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&q=80&w=200',
    rating: 4.9
  },
  {
    id: 'p5',
    name: '3M Vinyl Wrap Roll (Matte Black)',
    description: 'Customize it yourself. Professional grade vinyl for elite results.',
    price: 8500,
    category: 'Customization',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=200',
    rating: 4.6
  }
];
