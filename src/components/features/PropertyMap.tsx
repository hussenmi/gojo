'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import Link from 'next/link';
import { Property } from '@/types/property';

// Component to adjust map view based on markers
function MapViewAdjuster({ properties }: { properties: Property[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map(p => [p.latitude!, p.longitude!] as [number, number])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [properties, map]);

  return null;
}

interface PropertyMapProps {
  properties: Property[];
}

export function PropertyMap({ properties }: PropertyMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter properties that have coordinates
  const propertiesWithCoords = properties.filter(
    (p) => p.latitude !== null && p.longitude !== null
  );

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isMounted) {
    return (
      <div className="bg-white rounded-lg shadow h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (propertiesWithCoords.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <p className="text-gray-600">No properties with location data available</p>
      </div>
    );
  }

  // Default center (Addis Ababa)
  const center: [number, number] = [9.03, 38.74];

  // Custom marker icon - only create after component is mounted
  const customIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <MapContainer
        center={center}
        zoom={12}
        className="h-[600px] w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Auto-adjust map view to show all filtered properties */}
        <MapViewAdjuster properties={propertiesWithCoords} />
        <MarkerClusterGroup
          chunkedLoading
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          maxClusterRadius={50}
        >
          {propertiesWithCoords.map((property) => (
            <Marker
              key={property.id}
              position={[property.latitude!, property.longitude!]}
              icon={customIcon}
            >
              <Popup maxWidth={280} className="property-popup">
              <div className="min-w-[260px]">
                {/* Property Image */}
                {property.images && property.images[0] && (
                  <div className="relative h-32 mb-3 -mt-3 -mx-3 overflow-hidden rounded-t">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Title and City */}
                <h3 className="font-bold text-gray-900 mb-1 text-sm leading-tight">{property.title}</h3>
                <p className="text-xs text-gray-600 mb-2">{property.city}</p>

                {/* Price */}
                <p className="text-lg font-bold text-blue-600 mb-3">
                  {formatPrice(property.price)}
                </p>

                {/* Property Details */}
                <div className="flex items-center gap-3 text-xs text-gray-700 mb-3 pb-3 border-b border-gray-200">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="font-medium">{property.bedrooms} bed</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                      </svg>
                      <span className="font-medium">{property.bathrooms} bath</span>
                    </div>
                  )}
                  {property.area_sqm && (
                    <div className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                      <span className="font-medium">{property.area_sqm} m²</span>
                    </div>
                  )}
                </div>

                {/* View Details Button */}
                <Link
                  href={`/properties/${property.id}`}
                  style={{ backgroundColor: '#1d4ed8', color: '#ffffff' }}
                  className="block text-center py-3 px-4 rounded-lg hover:opacity-90 transition text-sm font-bold"
                >
                  View Details →
                </Link>
              </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
