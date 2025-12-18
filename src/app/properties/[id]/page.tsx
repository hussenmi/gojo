'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { Property } from '@/types/property';
import { supabase } from '@/lib/supabase';
import { demoProperties } from '@/lib/demo-data';
import { ContactForm } from '@/components/features/ContactForm';
import { ScheduleViewing } from '@/components/features/ScheduleViewing';
import { PropertyDetailSkeleton } from '@/components/ui/Skeletons';

// Dynamically import PropertyLocationMap with no SSR
const PropertyLocationMap = dynamic(
  () => import('@/components/features/PropertyLocationMap').then(mod => ({ default: mod.PropertyLocationMap })),
  {
    ssr: false,
    loading: () => (
      <div className="bg-gray-100 rounded-lg h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [isScheduleViewingOpen, setIsScheduleViewingOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'admin' | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id as string);
      trackPropertyView(params.id as string);
    }
  }, [params.id]);

  const trackPropertyView = async (propertyId: string) => {
    try {
      // Track view - don't track demo properties
      if (!propertyId.startsWith('demo-')) {
        await supabase.from('property_views').insert([
          {
            property_id: propertyId,
            session_id: typeof window !== 'undefined' ? window.sessionStorage.getItem('session_id') || generateSessionId() : null,
            user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
          },
        ]);
      }
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.debug('Analytics tracking failed:', error);
    }
  };

  const generateSessionId = () => {
    if (typeof window !== 'undefined') {
      let sessionId = window.sessionStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        window.sessionStorage.setItem('session_id', sessionId);
      }
      return sessionId;
    }
    return null;
  };

  const fetchProperty = async (id: string) => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Check if it's a demo property
      if (id.startsWith('demo-')) {
        const index = parseInt(id.replace('demo-', '')) - 1;
        if (index >= 0 && index < demoProperties.length) {
          const demoProperty = {
            ...demoProperties[index],
            id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Property;
          setProperty(demoProperty);
        }
      } else {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProperty(data as Property);

        // Check if current user is the owner
        if (user && data.owner_id === user.id) {
          setIsOwner(true);

          // Get user tier
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('subscription_tier')
            .eq('id', user.id)
            .single();

          if (profile) {
            setUserTier(profile.subscription_tier);
          }
        }
      }
    } catch (error) {
      console.info('Using demo data for property details');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const capitalizeText = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  if (loading) {
    return <PropertyDetailSkeleton />;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link
            href="/properties"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96 bg-gray-200 group">
                <Image
                  src={property.images[selectedImage] || '/images/placeholder-house.jpg'}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
                {property.featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold">
                    Featured Property
                  </div>
                )}

                {/* Navigation Arrows */}
                {property.images.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={() => setSelectedImage(selectedImage === 0 ? property.images.length - 1 : selectedImage - 1)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={() => setSelectedImage(selectedImage === property.images.length - 1 ? 0 : selectedImage + 1)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImage + 1} / {property.images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-blue-600' : ''
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.bedrooms && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-gray-600 text-sm mb-1">Bedrooms</div>
                    <div className="text-xl font-bold text-gray-900">{property.bedrooms}</div>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-gray-600 text-sm mb-1">Bathrooms</div>
                    <div className="text-xl font-bold text-gray-900">{property.bathrooms}</div>
                  </div>
                )}
                {property.area_sqm && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-gray-600 text-sm mb-1">Area</div>
                    <div className="text-xl font-bold text-gray-900">{property.area_sqm} m²</div>
                  </div>
                )}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-gray-600 text-sm mb-1">Type</div>
                  <div className="text-xl font-bold text-gray-900">{capitalizeText(property.property_type)}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-gray-600 text-sm mb-1">Listing</div>
                  <div className="text-xl font-bold text-gray-900">{capitalizeText(property.listing_type)}</div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-gray-600 text-sm mb-1">Status</div>
                  <div className="text-xl font-bold text-green-600">{capitalizeText(property.status)}</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{property.description}</p>

              {property.description_am && (
                <>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-6">መግለጫ</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description_am}</p>
                </>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Location</h2>
              <PropertyLocationMap property={property} />
              <div className="mt-4 text-sm text-gray-600">
                <div className="font-semibold text-gray-900">{property.address}</div>
                <div>{property.city}, {property.region}</div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact/Price Info */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-4">
              <div className="mb-6">
                <div className="text-sm text-gray-600 mb-1">Price</div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-600">
                  For {capitalizeText(property.listing_type)}
                </div>
              </div>

              {/* Location */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Location</div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">{property.address}</div>
                    <div className="text-sm text-gray-600">{property.city}, {property.region}</div>
                  </div>
                </div>
              </div>

              {/* Owner Actions or Contact Buttons */}
              {isOwner ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-800 font-medium flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      You own this property
                    </p>
                  </div>
                  <Link
                    href={`/my-properties/${property.id}/edit`}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Property
                  </Link>
                  {(userTier === 'premium' || userTier === 'admin') && (
                    <Link
                      href={`/my-properties/analytics?property=${property.id}`}
                      className="w-full border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View Analytics
                    </Link>
                  )}
                  <Link
                    href="/my-properties"
                    className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    My Properties
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => setIsContactFormOpen(true)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Contact Agent
                  </button>
                  <button
                    onClick={() => setIsScheduleViewingOpen(true)}
                    className="w-full border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                  >
                    Schedule Viewing
                  </button>
                  <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Save Property
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ContactForm
        propertyId={property.id}
        propertyTitle={property.title}
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
      <ScheduleViewing
        propertyId={property.id}
        propertyTitle={property.title}
        isOpen={isScheduleViewingOpen}
        onClose={() => setIsScheduleViewingOpen(false)}
      />
    </div>
  );
}
