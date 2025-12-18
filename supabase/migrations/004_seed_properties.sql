-- Seed properties with diverse data across Ethiopian cities for testing

INSERT INTO properties (
  title, description, description_am, property_type, listing_type,
  price, bedrooms, bathrooms, area_sqm,
  address, city, region, latitude, longitude,
  images, status, featured
) VALUES

-- Addis Ababa Properties (coordinates around 9.03, 38.74)
('Modern Villa in Bole', 'Luxurious 4-bedroom villa with garden and modern amenities in the heart of Bole', 'በቦሌ ልብ ውስጥ የአትክልት ቦታና ዘመናዊ መገልገያዎች ያሉት ቪላ', 'house', 'sale', 45000000, 4, 3, 350, 'Bole Road, Near Edna Mall', 'Addis Ababa', 'Addis Ababa', 9.0084, 38.7612, ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800'], 'active', true),

('Luxury Apartment in CMC', 'Brand new 3-bedroom apartment with city views and parking', 'ከተማ ይዞታና የመኪና ማቆሚያ ያለው አዲስ አፓርትመንት', 'apartment', 'rent', 35000, 3, 2, 180, 'CMC Road, Tower Building', 'Addis Ababa', 'Addis Ababa', 9.0192, 38.7525, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'], 'active', false),

('Commercial Space Merkato', 'Prime location shop space in Merkato, high foot traffic', 'በመርካቶ ከፍተኛ የሰው ትራፊክ ያለበት የንግድ ቦታ', 'commercial', 'rent', 50000, 0, 1, 120, 'Merkato, Main Road', 'Addis Ababa', 'Addis Ababa', 9.0343, 38.7359, ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], 'active', false),

('Cozy Studio in Piassa', 'Affordable studio apartment perfect for students or young professionals', 'ለተማሪዎች ወይም ወጣቶች ተስማሚ የሆነ ስቱዲዮ አፓርትመንት', 'apartment', 'rent', 8000, 1, 1, 45, 'Piassa, Near Churchill Avenue', 'Addis Ababa', 'Addis Ababa', 9.0333, 38.7439, ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'], 'active', false),

('Family House in Old Airport', 'Spacious 5-bedroom house with large compound', 'ሰፊ ግቢ ያለው 5 መኝታ ቤት', 'house', 'sale', 65000000, 5, 4, 450, 'Old Airport Area, Quiet Street', 'Addis Ababa', 'Addis Ababa', 9.0167, 38.7869, ARRAY['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'], 'active', true),

('Land for Sale in Lebu', 'Prime residential land, 500 sqm with all utilities', '500 ካሬ ሜትር የመኖሪያ መሬት ሁሉም መገልገያዎች ያሉት', 'land', 'sale', 12000000, null, null, 500, 'Lebu, Near Main Road', 'Addis Ababa', 'Addis Ababa', 8.9806, 38.7078, ARRAY['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800'], 'active', false),

('Penthouse in Sarbet', 'Luxury penthouse with panoramic city views', 'የከተማ እይታ ያለው የቅንጦት ፔንትሃውስ', 'apartment', 'sale', 55000000, 3, 3, 250, 'Sarbet, High-rise Building', 'Addis Ababa', 'Addis Ababa', 9.0456, 38.7632, ARRAY['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'], 'active', true),

-- Bahir Dar Properties (coordinates around 11.60, 37.39)
('Lake View Villa Bahir Dar', 'Beautiful villa overlooking Lake Tana with 4 bedrooms', 'ጣና ሀይቅ የሚታይበት የ4 መኝታ ቪላ', 'house', 'sale', 28000000, 4, 3, 320, 'Lake Tana Shore Road', 'Bahir Dar', 'Amhara', 11.5933, 37.3878, ARRAY['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'], 'active', true),

('Apartment Near Blue Nile Falls', 'Modern 2-bedroom apartment, walking distance to attractions', 'ዋና የቱሪስት መስህቦች አቅራቢያ 2 መኝታ አፓርትመንት', 'apartment', 'rent', 15000, 2, 1, 95, 'Blue Nile Avenue', 'Bahir Dar', 'Amhara', 11.6048, 37.3914, ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'], 'active', false),

('Commercial Building Downtown', 'Three-story commercial building in city center', 'ከተማ መሃል 3 ፎቅ የንግድ ህንፃ', 'commercial', 'sale', 85000000, 0, 4, 600, 'Main Street, City Center', 'Bahir Dar', 'Amhara', 11.5987, 37.3852, ARRAY['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'], 'active', false),

-- Dire Dawa Properties (coordinates around 9.59, 41.87)
('Modern House in Dire Dawa', 'Contemporary 3-bedroom house with garage', 'ጋራዥ ያለው ዘመናዊ 3 መኝታ ቤት', 'house', 'sale', 22000000, 3, 2, 210, 'Kezira District', 'Dire Dawa', 'Dire Dawa', 9.5936, 41.8661, ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800'], 'active', false),

('Apartment for Rent', 'Spacious 2-bedroom apartment near railway station', 'የባቡር ጣቢያ አቅራቢያ 2 መኝታ አፓርትመንት', 'apartment', 'rent', 12000, 2, 1, 110, 'Railway Avenue', 'Dire Dawa', 'Dire Dawa', 9.6012, 41.8583, ARRAY['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'], 'active', false),

-- Mekele Properties (coordinates around 13.50, 39.47)
('Villa in Mekele Center', 'Elegant 4-bedroom villa in prime location', 'ዋና በሆነ ቦታ 4 መኝታ ቪላ', 'house', 'sale', 32000000, 4, 3, 300, 'City Center, Main Boulevard', 'Mekele', 'Tigray', 13.4967, 39.4753, ARRAY['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'], 'active', false),

('Office Space for Rent', 'Modern office space with parking', 'የመኪና ማቆሚያ ያለው ዘመናዊ ቢሮ', 'commercial', 'rent', 25000, 0, 2, 150, 'Business District', 'Mekele', 'Tigray', 13.5011, 39.4698, ARRAY['https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800'], 'active', false),

-- Hawassa Properties (coordinates around 7.06, 38.48)
('Lakefront Property Hawassa', 'Stunning house with direct lake access', 'በቀጥታ ሀይቅ የሚገኝበት የቤት', 'house', 'sale', 38000000, 3, 2, 280, 'Lake Hawassa Shore', 'Hawassa', 'SNNPR', 7.0621, 38.4764, ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800'], 'active', true),

('Resort Hotel for Sale', 'Established resort hotel with 20 rooms', '20 ክፍሎች ያሉት ሪዞርት ሆቴል', 'commercial', 'sale', 150000000, 20, 22, 1200, 'Tourist Area, Lakeside', 'Hawassa', 'SNNPR', 7.0456, 38.4892, ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'], 'active', true),

-- Gondar Properties (coordinates around 12.60, 37.47)
('Historical Area House', 'Traditional house near Gondar Castle', 'ጎንደር ቤተ መንግስት አቅራቢያ ባህላዊ ቤት', 'house', 'sale', 18000000, 3, 2, 180, 'Castle Area', 'Gondar', 'Amhara', 12.6089, 37.4654, ARRAY['https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800'], 'active', false),

('Student Apartments', 'Affordable apartments near university', 'ዩኒቨርስቲ አቅራቢያ ተመጣጣኝ አፓርትመንቶች', 'apartment', 'rent', 6000, 1, 1, 40, 'University Road', 'Gondar', 'Amhara', 12.5998, 37.4532, ARRAY['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'], 'active', false),

-- Adama (Nazret) Properties (coordinates around 8.54, 39.27)
('New Development Adama', 'Brand new 3-bedroom house in gated community', 'በጌትድ ኮሙዩኒቲ ውስጥ አዲስ 3 መኝታ ቤት', 'house', 'sale', 24000000, 3, 2, 200, 'Gated Community, South Adama', 'Adama', 'Oromia', 8.5389, 39.2644, ARRAY['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'], 'active', false),

('Warehouse for Rent', 'Large warehouse near industrial zone', 'ኢንደስትሪ ዞን አቅራቢያ ትልቅ መጋዘን', 'commercial', 'rent', 40000, 0, 2, 500, 'Industrial Area', 'Adama', 'Oromia', 8.5612, 39.2789, ARRAY['https://images.unsplash.com/photo-1553413077-190dd305871c?w=800'], 'active', false),

-- More Addis Ababa Properties for variety
('Luxury Condo in 22 Mazoria', 'High-end condominium with gym and pool', 'ጂም እና መዋኛ ገንዳ ያለው ኮንዶሚኒየም', 'apartment', 'sale', 42000000, 3, 2, 165, '22 Mazoria Area', 'Addis Ababa', 'Addis Ababa', 9.0267, 38.7892, ARRAY['https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800'], 'active', true),

('Affordable House in Kotebe', 'Great starter home for young families', 'ለወጣት ቤተሰቦች ተስማሚ ቤት', 'house', 'sale', 16000000, 2, 1, 120, 'Kotebe Area', 'Addis Ababa', 'Addis Ababa', 8.9845, 38.8123, ARRAY['https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800'], 'active', false),

('Office in Summit', 'Professional office space with conference room', 'ኮንፈረንስ ሩም ያለው ፕሮፌሽናል ቢሮ', 'commercial', 'rent', 55000, 0, 3, 200, 'Summit Area, Modern Building', 'Addis Ababa', 'Addis Ababa', 9.0421, 38.7956, ARRAY['https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'], 'active', false),

('Garden Villa in Gerji', 'Spacious villa with large garden and pool', 'ትልቅ የአትክልት ቦታ እና መዋኛ ገንዳ ያለው ቪላ', 'house', 'sale', 72000000, 5, 4, 500, 'Gerji, Residential Area', 'Addis Ababa', 'Addis Ababa', 9.0523, 38.8234, ARRAY['https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'], 'active', true),

('Budget Apartment Megenagna', 'Affordable 1-bedroom apartment near transport', 'ትራንስፖርት አቅራቢያ ተመጣጣኝ 1 መኝታ አፓርትመንት', 'apartment', 'rent', 7500, 1, 1, 50, 'Megenagna, Near Bus Station', 'Addis Ababa', 'Addis Ababa', 9.0189, 38.8067, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'], 'active', false);
