import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.log('   Make sure you have set:');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
  console.log('🔍 Checking database status...\n');

  try {
    // Check connection
    const { data: tables, error: tablesError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (tablesError) {
      console.log('❌ Cannot connect to properties table');
      console.log('   Error:', tablesError.message);
      console.log('\n📝 Action needed:');
      console.log('   1. Go to your Supabase dashboard: https://supabase.com/dashboard');
      console.log('   2. Navigate to SQL Editor');
      console.log('   3. Run the migration from: supabase/migrations/001_initial_schema.sql\n');
      return;
    }

    console.log('✅ Database connection successful!\n');

    // Count properties
    const { count, error: countError } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error counting properties:', countError.message);
      return;
    }

    console.log(`📊 Properties in database: ${count || 0}`);

    if (count === 0) {
      console.log('\n💡 Your database is empty!');
      console.log('   Run: npm run seed-demo');
      console.log('   To add 10 demo properties with images.\n');
    } else {
      console.log('✅ Database has data!\n');

      // Show some sample properties
      const { data: sampleProps } = await supabase
        .from('properties')
        .select('title, city, price, property_type')
        .limit(3);

      if (sampleProps && sampleProps.length > 0) {
        console.log('📋 Sample properties:');
        sampleProps.forEach((prop, i) => {
          console.log(`   ${i + 1}. ${prop.title} - ${prop.city} (${prop.property_type})`);
        });
        console.log('');
      }
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

checkDatabase();
