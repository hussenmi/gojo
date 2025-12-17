'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuthAndFavorite();
  }, [propertyId]);

  async function checkAuthAndFavorite() {
    // Check if user is logged in
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);

    if (!session?.user) return;

    // Check if property is favorited
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('property_id', propertyId)
      .single();

    setIsFavorite(!!data);
  }

  async function toggleFavorite() {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/auth/login');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        setIsFavorite(false);
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            property_id: propertyId,
          });

        if (error) throw error;
        setIsFavorite(true);
      }
    } catch (error: any) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorite');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite();
      }}
      disabled={loading}
      className={`group ${className}`}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`w-6 h-6 transition-all ${
          isFavorite
            ? 'fill-red-500 text-red-500'
            : 'fill-none text-gray-400 group-hover:text-red-500'
        } ${loading ? 'opacity-50' : ''}`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
