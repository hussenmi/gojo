import { createClient } from '@supabase/supabase-js';
import { demoProperties } from '../src/lib/demo-data';
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

async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...\n');

  try {
    // Check if properties table exists and has data
    const { data: existingProperties, error: checkError } = await supabase
      .from('properties')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking database:', checkError.message);
      console.log('\n⚠️  Make sure you have run the migration from supabase/migrations/001_initial_schema.sql');
      console.log('   Go to your Supabase dashboard > SQL Editor and run the migration.');
      return;
    }

    if (existingProperties && existingProperties.length > 0) {
      console.log('⚠️  Database already has properties!');
      console.log('   Run this script with --force to add demo data anyway.\n');

      // Show count
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true });

      console.log(`📊 Current properties in database: ${count}\n`);
      return;
    }

    console.log('📝 Database is empty. Inserting demo data...\n');

    // Insert demo data
    const { data, error } = await supabase
      .from('properties')
      .insert(demoProperties)
      .select();

    if (error) {
      console.error('❌ Error inserting data:', error.message);
      return;
    }

    console.log(`✅ Successfully inserted ${data?.length || 0} properties!\n`);
    console.log('🎉 Demo data seeding complete!');
    console.log('   Visit http://localhost:3001/properties to see them.\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

seedDemoData();
