
export enum ServiceCategory {
  VEHICLE = 'VEHICLE',
  PROPERTY = 'PROPERTY',
  LUXURY = 'LUXURY',
  CUSTOMIZATION = 'CUSTOMIZATION',
}

export enum LoyaltyTier {
  BRONZE = 'Bronze',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
  DIAMOND = 'Diamond',
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  date: string;
  time: string;
  status: BookingStatus;
  total: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  role: string;
  image: string;
  rating: number;
  jobsCompleted: number;
  tier: 'Standard' | 'Elite' | 'Master';
  specialization: ServiceCategory[];
  bio: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: ServiceCategory;
  image: string;
  premiumOnly?: boolean;
  duration: string;
  averageRating?: number;
  reviewCount?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export interface UserProfile {
  id: string;
  name: string;
  location: string;
  tier: LoyaltyTier;
  points: number;
  totalSpent: number;
  locationWealthIndex: 'HIGH' | 'MEDIUM' | 'STANDARD'; // AI derived
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
