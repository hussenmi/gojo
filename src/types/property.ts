export type PropertyType = 'house' | 'apartment' | 'commercial' | 'land';
export type ListingType = 'sale' | 'rent';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented';

export interface Property {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  title_am: string | null;
  description: string;
  description_am: string | null;
  price: number;
  property_type: PropertyType;
  listing_type: ListingType;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqm: number | null;
  address: string;
  city: string;
  region: string;
  latitude: number | null;
  longitude: number | null;
  images: string[];
  featured: boolean;
  status: PropertyStatus;
}
