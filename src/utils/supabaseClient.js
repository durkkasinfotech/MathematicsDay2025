import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug: Check if variables are loaded
console.log('🔍 Environment Check:');
console.log('VITE_SUPABASE_URL:', supabaseUrl ? '✅ Loaded' : '❌ Missing');
console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Loaded' : '❌ Missing');

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '\n⚠️⚠️⚠️ SUPABASE CREDENTIALS MISSING ⚠️⚠️⚠️\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
    'Please check your .env file in the project root:\n\n' +
    '1. Make sure .env file exists in: E:\\Certificate&QR\\Math Lead\\.env\n' +
    '2. File should contain (NO SPACES around =):\n' +
    '   VITE_SUPABASE_URL=https://your-project.supabase.co\n' +
    '   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n\n' +
    '3. After creating/updating .env file:\n' +
    '   - STOP the dev server (Ctrl+C)\n' +
    '   - START again: npm run dev\n\n' +
    '4. Get credentials from:\n' +
    '   https://app.supabase.com → Your Project → Settings → API\n' +
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
  );
}

// Create Supabase client
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-client-info': 'math-lead-registration@1.0.0',
          },
        },
      })
    : null;

// Log initialization status
if (supabase) {
  console.log('✅ Supabase client initialized successfully');
  console.log('📊 Connected to:', supabaseUrl);
} else {
  console.error('❌ Supabase client NOT initialized - check .env file');
}

export default supabase;

