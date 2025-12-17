export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          title_am: string | null
          description: string
          description_am: string | null
          price: number
          property_type: 'house' | 'apartment' | 'commercial' | 'land'
          listing_type: 'sale' | 'rent'
          bedrooms: number | null
          bathrooms: number | null
          area_sqm: number | null
          address: string
          city: string
          region: string
          latitude: number | null
          longitude: number | null
          images: string[]
          featured: boolean
          status: 'active' | 'pending' | 'sold' | 'rented'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          title_am?: string | null
          description: string
          description_am?: string | null
          price: number
          property_type: 'house' | 'apartment' | 'commercial' | 'land'
          listing_type: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area_sqm?: number | null
          address: string
          city: string
          region: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured?: boolean
          status?: 'active' | 'pending' | 'sold' | 'rented'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          title_am?: string | null
          description?: string
          description_am?: string | null
          price?: number
          property_type?: 'house' | 'apartment' | 'commercial' | 'land'
          listing_type?: 'sale' | 'rent'
          bedrooms?: number | null
          bathrooms?: number | null
          area_sqm?: number | null
          address?: string
          city?: string
          region?: string
          latitude?: number | null
          longitude?: number | null
          images?: string[]
          featured?: boolean
          status?: 'active' | 'pending' | 'sold' | 'rented'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
