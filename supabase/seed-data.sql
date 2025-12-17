-- Seed demo data for properties
-- Run this in Supabase SQL Editor

INSERT INTO properties (
  title, title_am, description, description_am, price, property_type, listing_type,
  bedrooms, bathrooms, area_sqm, address, city, region, latitude, longitude, images, featured, status
) VALUES
-- Modern Villa in Bole
(
  'Modern Villa in Bole',
  'ዘመናዊ ቪላ በቦሌ',
  'Luxurious 4-bedroom villa with modern amenities, private garden, and parking. Located in the heart of Bole, close to restaurants and shopping centers.',
  'የቅንጦት 4 መኝታ ቤት ቪላ ከዘመናዊ ምቹነቶች፣ የግል የአትክልት ቦታ እና የመኪና ማቆሚያ ጋር። በቦሌ መሃል ላይ የሚገኝ።',
  15000000, 'house', 'sale', 4, 3, 350,
  'Bole Subcity', 'Addis Ababa', 'Addis Ababa', 8.9956, 38.7636,
  ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'],
  true, 'active'
),
-- Cozy Apartment in CMC
(
  'Cozy Apartment in CMC',
  'ምቹ አፓርታማ በሲኤምሲ',
  'Beautiful 2-bedroom apartment with balcony and city view. Perfect for small families or couples. Walking distance to CMC market.',
  'ውብ 2 መኝታ አፓርታማ ከባልኮኒ እና የከተማ እይታ ጋር። ለትናንሽ ቤተሰቦች ወይም ጥንዶች ተስማሚ።',
  25000, 'apartment', 'rent', 2, 1, 85,
  'CMC Area', 'Addis Ababa', 'Addis Ababa', 9.0054, 38.7636,
  ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
  false, 'active'
),
-- Commercial Building in Merkato
(
  'Commercial Building in Merkato',
  'የንግድ ህንፃ በመርካቶ',
  'Prime commercial space ideal for retail or office use. High foot traffic area in the heart of Merkato business district.',
  'ለችርቻሮ ወይም ለቢሮ አገልግሎት ተስማሚ የሆነ ዋና የንግድ ቦታ። በመርካቶ የንግድ አካባቢ መሃል ላይ።',
  35000000, 'commercial', 'sale', NULL, 2, 450,
  'Merkato', 'Addis Ababa', 'Addis Ababa', 9.0320, 38.7209,
  ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'],
  true, 'active'
),
-- Residential Land in Lebu
(
  'Residential Land in Lebu',
  'የመኖሪያ መሬት በሌቡ',
  'Spacious residential land perfect for building your dream home. Quiet neighborhood with easy access to main roads.',
  'ለህልም ቤትዎ ለመገንባት ተስማሚ ሰፊ የመኖሪያ መሬት። ጸጥታ ባለው አካባቢ።',
  8000000, 'land', 'sale', NULL, NULL, 500,
  'Lebu Area', 'Addis Ababa', 'Addis Ababa', 9.0461, 38.6891,
  ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'],
  false, 'active'
),
-- Luxury Penthouse in Kazanchis
(
  'Luxury Penthouse in Kazanchis',
  'የቅንጦት ፔንትሃውስ በካዛንችስ',
  'Stunning 3-bedroom penthouse with panoramic city views. Features include modern kitchen, spa bathroom, and rooftop terrace.',
  'አስደናቂ 3 መኝታ ቤት ፔንትሃውስ ከከተማ እይታ ጋር። ዘመናዊ ኩሽና፣ ስፓ መታጠቢያ እና የጣራ መንገድ ያለው።',
  50000, 'apartment', 'rent', 3, 2, 180,
  'Kazanchis', 'Addis Ababa', 'Addis Ababa', 9.0307, 38.7578,
  ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'],
  true, 'active'
),
-- Family House in Old Airport
(
  'Family House in Old Airport',
  'የቤተሰብ ቤት በኦልድ አየር ማረፊያ',
  'Spacious 5-bedroom family house with large compound. Ideal for large families, includes separate guest house.',
  'ሰፊ 5 መኝታ ቤት የቤተሰብ ቤት ከትልቅ ግቢ ጋር። ለትላልቅ ቤተሰቦች ተስማሚ።',
  22000000, 'house', 'sale', 5, 4, 450,
  'Old Airport', 'Addis Ababa', 'Addis Ababa', 9.0173, 38.7542,
  ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'],
  false, 'active'
),
-- Studio Apartment in Piassa
(
  'Studio Apartment in Piassa',
  'ስቱዲዮ አፓርታማ በፒያሳ',
  'Affordable studio apartment perfect for students or young professionals. Fully furnished with WiFi included.',
  'ለተማሪዎች ወይም ለወጣት ባለሙያዎች ተስማሚ ርካሽ ስቱዲዮ አፓርታማ። ሙሉ በሙሉ የተቀመጠ።',
  12000, 'apartment', 'rent', 1, 1, 45,
  'Piassa', 'Addis Ababa', 'Addis Ababa', 9.0330, 38.7469,
  ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
  false, 'active'
),
-- Office Space in Summit
(
  'Office Space in Summit',
  'የቢሮ ቦታ በሰሚት',
  'Modern office space with glass facade and central AC. Perfect for startups or small businesses. Includes parking.',
  'ዘመናዊ የቢሮ ቦታ ከመስታወት ፊት እና ማዕከላዊ ኤሲ ጋር። የመኪና ማቆሚያ ያለው።',
  80000, 'commercial', 'rent', NULL, 2, 200,
  'Summit Area', 'Addis Ababa', 'Addis Ababa', 9.0155, 38.7906,
  ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'],
  false, 'active'
),
-- Traditional Gojo in Entoto
(
  'Traditional Gojo in Entoto',
  'ባህላዊ ጎጆ በእንጦጦ',
  'Authentic Ethiopian traditional house (Gojo) with thatched roof. Perfect for eco-tourism or retreat center. Mountain views.',
  'ትክክለኛ የኢትዮጵያ ባህላዊ ቤት (ጎጆ) ከሳር ጣራ ጋር። ለኢኮ-ቱሪዝም ወይም ለማረፊያ ማእከል ተስማሚ።',
  5000000, 'house', 'sale', 2, 1, 120,
  'Entoto Mountain', 'Addis Ababa', 'Addis Ababa', 9.0733, 38.7452,
  ARRAY['https://images.unsplash.com/photo-1591825729269-caeb344f6df2?w=800'],
  true, 'active'
),
-- New Construction in Ayat
(
  'New Construction in Ayat',
  'አዲስ ግንባታ በአያት',
  'Brand new 3-bedroom condominium in Ayat area. Never lived in, modern finishes, and parking included.',
  'አዲስ 3 መኝታ ቤት ኮንዶሚኒየም በአያት አካባቢ። ሙሉ በሙሉ አዲስ፣ ዘመናዊ ማጠናቀቂያ።',
  6500000, 'apartment', 'sale', 3, 2, 110,
  'Ayat', 'Addis Ababa', 'Addis Ababa', 8.9464, 38.7238,
  ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 'https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800'],
  false, 'active'
);
