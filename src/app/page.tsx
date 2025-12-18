import Link from 'next/link';
import { FeaturedProperties } from '@/components/features/FeaturedProperties';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Your Dream Home in Ethiopia
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Discover thousands of properties across Ethiopia
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/properties"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse Properties
              </Link>
              <Link
                href="/admin/properties/new"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
              >
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Carousel */}
      <FeaturedProperties />

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Why Choose Gojo?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Wide Selection</h3>
              <p className="text-gray-700 leading-relaxed">
                Browse thousands of properties from houses to commercial spaces across Ethiopia.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Easy Search</h3>
              <p className="text-gray-700 leading-relaxed">
                Advanced filters to help you find exactly what you're looking for quickly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
              <div className="text-4xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Verified Listings</h3>
              <p className="text-gray-700 leading-relaxed">
                All properties are verified to ensure quality and legitimacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-blue-600 text-white rounded-lg p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Home?</h2>
            <p className="text-xl mb-6 opacity-90">
              Start your search today and discover amazing properties.
            </p>
            <Link
              href="/properties"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
