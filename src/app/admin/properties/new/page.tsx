'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminNav } from '@/components/admin/AdminNav';
import { supabase } from '@/lib/supabase';
import { PropertyType, ListingType } from '@/types/property';

export default function NewPropertyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'premium' | 'admin' | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_am: '',
    description: '',
    description_am: '',
    price: '',
    property_type: 'house' as PropertyType,
    listing_type: 'sale' as ListingType,
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    address: '',
    city: '',
    region: '',
    latitude: '',
    longitude: '',
    images: '',
    status: 'active',
    featured: false,
  });

  useEffect(() => {
    fetchUserTier();
  }, []);

  const fetchUserTier = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('subscription_tier')
        .eq('id', user.id)
        .single();

      if (profile) {
        setUserTier(profile.subscription_tier);
      }
    } catch (error) {
      console.error('Error fetching user tier:', error);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (error) throw error;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setUploadedImages(prev => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      alert('Error uploading images: ' + (error.message || 'Unknown error'));
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine uploaded images with any manual URLs
      const manualUrls = formData.images
        .split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const allImages = [...uploadedImages, ...manualUrls];

      if (allImages.length === 0) {
        alert('Please add at least one image');
        setLoading(false);
        return;
      }

      // Get current user to set owner_id
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('You must be logged in to create a property');
        setLoading(false);
        return;
      }

      const propertyData = {
        title: formData.title,
        title_am: formData.title_am || null,
        description: formData.description,
        description_am: formData.description_am || null,
        price: parseFloat(formData.price),
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
        address: formData.address,
        city: formData.city,
        region: formData.region,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        images: allImages,
        status: formData.status,
        featured: formData.featured,
        owner_id: user.id, // Set the owner
      };

      const { error } = await supabase
        .from('properties')
        .insert([propertyData]);

      if (error) throw error;

      alert('Property added successfully!');

      // Redirect based on user tier
      if (userTier === 'admin') {
        router.push('/admin/properties');
      } else {
        router.push('/my-properties');
      }
    } catch (error: any) {
      console.error('Error adding property:', error);
      alert('Error: ' + (error.message || 'Failed to add property'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-950">
        <AdminNav />

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white">Add New Property</h1>
            <p className="text-gray-400 mt-1">Create a new property listing</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg shadow p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="Modern Villa in Bole"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Title (Amharic)
                  </label>
                  <input
                    type="text"
                    name="title_am"
                    value={formData.title_am}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="ዘመናዊ ቪላ በቦሌ"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description (English) *
                  </label>
                  <textarea
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="Detailed description of the property..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Description (Amharic)
                  </label>
                  <textarea
                    name="description_am"
                    value={formData.description_am}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="የንብረቱ ዝርዝር መግለጫ..."
                  />
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="property_type"
                    required
                    value={formData.property_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                  >
                    <option value="house">House</option>
                    <option value="apartment">Apartment</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Listing Type *
                  </label>
                  <select
                    name="listing_type"
                    required
                    value={formData.listing_type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="5000000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Area (m²)
                  </label>
                  <input
                    type="number"
                    name="area_sqm"
                    value={formData.area_sqm}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="2"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Location</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="Bole Subcity, Street 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="Addis Ababa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Region *
                  </label>
                  <input
                    type="text"
                    name="region"
                    required
                    value={formData.region}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="Addis Ababa"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="9.0320"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="38.7469"
                  />
                </div>
              </div>
            </div>

            {/* Images & Status */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Images & Status</h2>
              <div className="space-y-4">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload Images
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
                        Choose Files
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {uploadingImages && (
                      <span className="text-sm text-gray-400">Uploading...</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Select one or more images from your computer (JPG, PNG, etc.)
                  </p>
                </div>

                {/* Image Previews */}
                {uploadedImages.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Uploaded Images ({uploadedImages.length})
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {uploadedImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-600"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional: Manual URL Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Or paste Image URLs (comma-separated, optional)
                  </label>
                  <textarea
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Alternative: paste image URLs from Unsplash or other sources
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white bg-gray-700"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    {/* Featured Property Section - Tier-based */}
                    {userTier === 'premium' || userTier === 'admin' ? (
                      <div className="w-full">
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div className="flex-1">
                              <label className="flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  name="featured"
                                  checked={formData.featured}
                                  onChange={handleChange}
                                  className="rounded border-gray-600 text-yellow-600 focus:ring-yellow-500 h-5 w-5"
                                />
                                <span className="ml-3">
                                  <span className="text-base font-bold text-white block">
                                    Make this a Featured Property
                                  </span>
                                  <span className="text-sm text-gray-300">
                                    ⭐ Premium feature: Top placement • Homepage visibility • Detailed analytics
                                  </span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : userTier === 'free' ? (
                      <div className="w-full">
                        <div className="bg-gray-950 border-2 border-gray-600 rounded-lg p-4 opacity-60">
                          <div className="flex items-start gap-3">
                            <svg className="w-6 h-6 text-gray-400 mt-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            <div className="flex-1">
                              <div className="text-base font-bold text-white mb-1">
                                Featured Property (Premium Only)
                              </div>
                              <p className="text-sm text-gray-400 mb-3">
                                Upgrade to Premium to feature your properties and get 3-5x more inquiries
                              </p>
                              <button
                                type="button"
                                onClick={() => alert('Contact admin to upgrade your account to Premium')}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-semibold text-sm"
                              >
                                Upgrade to Premium
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-4 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-950 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Adding...' : 'Add Property'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
