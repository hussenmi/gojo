import { Property } from '@/types/property';

// Demo properties with images from Unsplash
// These are for demonstration purposes only
export const demoProperties: Omit<Property, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    title: 'Modern Villa in Bole',
    title_am: 'ዘመናዊ ቪላ በቦሌ',
    description: 'Luxurious 4-bedroom villa with modern amenities, private garden, and parking. Located in the heart of Bole, close to restaurants and shopping centers.',
    description_am: 'የቅንጦት 4 መኝታ ቤት ቪላ ከዘመናዊ ምቹነቶች፣ የግል የአትክልት ቦታ እና የመኪና ማቆሚያ ጋር። በቦሌ መሃል ላይ የሚገኝ።',
    price: 15000000,
    property_type: 'house',
    listing_type: 'sale',
    bedrooms: 4,
    bathrooms: 3,
    area_sqm: 350,
    address: 'Bole Subcity',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 8.9956,
    longitude: 38.7636,
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'
    ],
    featured: true,
    status: 'active'
  },
  {
    title: 'Cozy Apartment in CMC',
    title_am: 'ምቹ አፓርታማ በሲኤምሲ',
    description: 'Beautiful 2-bedroom apartment with balcony and city view. Perfect for small families or couples. Walking distance to CMC market.',
    description_am: 'ውብ 2 መኝታ አፓርታማ ከባልኮኒ እና የከተማ እይታ ጋር። ለትናንሽ ቤተሰቦች ወይም ጥንዶች ተስማሚ።',
    price: 25000,
    property_type: 'apartment',
    listing_type: 'rent',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 85,
    address: 'CMC Area',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0054,
    longitude: 38.7636,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'
    ],
    featured: false,
    status: 'active'
  },
  {
    title: 'Commercial Building in Merkato',
    title_am: 'የንግድ ህንፃ በመርካቶ',
    description: 'Prime commercial space ideal for retail or office use. High foot traffic area in the heart of Merkato business district.',
    description_am: 'ለችርቻሮ ወይም ለቢሮ አገልግሎት ተስማሚ የሆነ ዋና የንግድ ቦታ። በመርካቶ የንግድ አካባቢ መሃል ላይ።',
    price: 35000000,
    property_type: 'commercial',
    listing_type: 'sale',
    bedrooms: null,
    bathrooms: 2,
    area_sqm: 450,
    address: 'Merkato',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0320,
    longitude: 38.7209,
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ],
    featured: true,
    status: 'active'
  },
  {
    title: 'Residential Land in Lebu',
    title_am: 'የመኖሪያ መሬት በሌቡ',
    description: 'Spacious residential land perfect for building your dream home. Quiet neighborhood with easy access to main roads.',
    description_am: 'ለህልም ቤትዎ ለመገንባት ተስማሚ ሰፊ የመኖሪያ መሬት። ጸጥታ ባለው አካባቢ።',
    price: 8000000,
    property_type: 'land',
    listing_type: 'sale',
    bedrooms: null,
    bathrooms: null,
    area_sqm: 500,
    address: 'Lebu Area',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0461,
    longitude: 38.6891,
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'
    ],
    featured: false,
    status: 'active'
  },
  {
    title: 'Luxury Penthouse in Kazanchis',
    title_am: 'የቅንጦት ፔንትሃውስ በካዛንችስ',
    description: 'Stunning 3-bedroom penthouse with panoramic city views. Features include modern kitchen, spa bathroom, and rooftop terrace.',
    description_am: 'አስደናቂ 3 መኝታ ቤት ፔንትሃውስ ከከተማ እይታ ጋር። ዘመናዊ ኩሽና፣ ስፓ መታጠቢያ እና የጣራ መንገድ ያለው።',
    price: 50000,
    property_type: 'apartment',
    listing_type: 'rent',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 180,
    address: 'Kazanchis',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0307,
    longitude: 38.7578,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800',
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
    ],
    featured: true,
    status: 'active'
  },
  {
    title: 'Family House in Old Airport',
    title_am: 'የቤተሰብ ቤት በኦልድ አየር ማረፊያ',
    description: 'Spacious 5-bedroom family house with large compound. Ideal for large families, includes separate guest house.',
    description_am: 'ሰፊ 5 መኝታ ቤት የቤተሰብ ቤት ከትልቅ ግቢ ጋር። ለትላልቅ ቤተሰቦች ተስማሚ።',
    price: 22000000,
    property_type: 'house',
    listing_type: 'sale',
    bedrooms: 5,
    bathrooms: 4,
    area_sqm: 450,
    address: 'Old Airport',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0173,
    longitude: 38.7542,
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ],
    featured: false,
    status: 'active'
  },
  {
    title: 'Studio Apartment in Piassa',
    title_am: 'ስቱዲዮ አፓርታማ በፒያሳ',
    description: 'Affordable studio apartment perfect for students or young professionals. Fully furnished with WiFi included.',
    description_am: 'ለተማሪዎች ወይም ለወጣት ባለሙያዎች ተስማሚ ርካሽ ስቱዲዮ አፓርታማ። ሙሉ በሙሉ የተቀመጠ።',
    price: 12000,
    property_type: 'apartment',
    listing_type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    area_sqm: 45,
    address: 'Piassa',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0330,
    longitude: 38.7469,
    images: [
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'
    ],
    featured: false,
    status: 'active'
  },
  {
    title: 'Office Space in Summit',
    title_am: 'የቢሮ ቦታ በሰሚት',
    description: 'Modern office space with glass facade and central AC. Perfect for startups or small businesses. Includes parking.',
    description_am: 'ዘመናዊ የቢሮ ቦታ ከመስታወት ፊት እና ማዕከላዊ ኤሲ ጋር። የመኪና ማቆሚያ ያለው።',
    price: 80000,
    property_type: 'commercial',
    listing_type: 'rent',
    bedrooms: null,
    bathrooms: 2,
    area_sqm: 200,
    address: 'Summit Area',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0155,
    longitude: 38.7906,
    images: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'
    ],
    featured: false,
    status: 'active'
  },
  {
    title: 'Traditional Gojo in Entoto',
    title_am: 'ባህላዊ ጎጆ በእንጦጦ',
    description: 'Authentic Ethiopian traditional house (Gojo) with thatched roof. Perfect for eco-tourism or retreat center. Mountain views.',
    description_am: 'ትክክለኛ የኢትዮጵያ ባህላዊ ቤት (ጎጆ) ከሳር ጣራ ጋር። ለኢኮ-ቱሪዝም ወይም ለማረፊያ ማእከል ተስማሚ።',
    price: 5000000,
    property_type: 'house',
    listing_type: 'sale',
    bedrooms: 2,
    bathrooms: 1,
    area_sqm: 120,
    address: 'Entoto Mountain',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 9.0733,
    longitude: 38.7452,
    images: [
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800'
    ],
    featured: true,
    status: 'active'
  },
  {
    title: 'New Construction in Ayat',
    title_am: 'አዲስ ግንባታ በአያት',
    description: 'Brand new 3-bedroom condominium in Ayat area. Never lived in, modern finishes, and parking included.',
    description_am: 'አዲስ 3 መኝታ ቤት ኮንዶሚኒየም በአያት አካባቢ። ሙሉ በሙሉ አዲስ፣ ዘመናዊ ማጠናቀቂያ።',
    price: 6500000,
    property_type: 'apartment',
    listing_type: 'sale',
    bedrooms: 3,
    bathrooms: 2,
    area_sqm: 110,
    address: 'Ayat',
    city: 'Addis Ababa',
    region: 'Addis Ababa',
    latitude: 8.9464,
    longitude: 38.7238,
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'
    ],
    featured: false,
    status: 'active'
  }
];
