'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types/property';
import { PropertyCard } from '@/components/features/PropertyCard';
import Link from 'next/link';

export default function FavoritesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  async function checkAuthAndFetchFavorites() {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      router.push('/auth/login');
      return;
    }

    setUser(session.user);
    await fetchFavorites(session.user.id);
  }

  async function fetchFavorites(userId: string) {
    try {
      // Get favorite property IDs
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (favError) throw favError;

      if (!favorites || favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        return;
      }

      // Get the actual properties
      const propertyIds = favorites.map(f => f.property_id);
      const { data: props, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .in('id', propertyIds)
        .eq('status', 'active');

      if (propsError) throw propsError;

      setProperties((props as Property[]) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your favorites...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {properties.length} {properties.length === 1 ? 'property' : 'properties'} saved
          </p>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">💙</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring properties and save your favorites by clicking the heart icon
            </p>
            <Link
              href="/properties"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
