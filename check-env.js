// Quick script to check if .env file is properly configured
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  const envPath = join(__dirname, '.env');
  const envContent = readFileSync(envPath, 'utf-8');
  
  console.log('\n📄 .env File Content:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(envContent);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  const lines = envContent.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
  
  let hasUrl = false;
  let hasKey = false;
  
  lines.forEach(line => {
    if (line.includes('VITE_SUPABASE_URL')) {
      hasUrl = true;
      const value = line.split('=')[1]?.trim();
      if (value && value !== 'your_supabase_project_url' && !value.includes('your-project')) {
        console.log('✅ VITE_SUPABASE_URL: Found and has value');
      } else {
        console.log('⚠️ VITE_SUPABASE_URL: Found but value is placeholder');
      }
    }
    if (line.includes('VITE_SUPABASE_ANON_KEY')) {
      hasKey = true;
      const value = line.split('=')[1]?.trim();
      if (value && value.length > 50 && value.startsWith('eyJ')) {
        console.log('✅ VITE_SUPABASE_ANON_KEY: Found and looks valid');
      } else {
        console.log('⚠️ VITE_SUPABASE_ANON_KEY: Found but value looks invalid');
      }
    }
  });
  
  if (!hasUrl) {
    console.log('❌ VITE_SUPABASE_URL: NOT FOUND in .env file');
  }
  if (!hasKey) {
    console.log('❌ VITE_SUPABASE_ANON_KEY: NOT FOUND in .env file');
  }
  
  console.log('\n💡 If values are placeholders, replace them with your actual Supabase credentials\n');
  
} catch (error) {
  console.error('❌ Error reading .env file:', error.message);
  console.log('\n💡 Create .env file in project root with:');
  console.log('VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('VITE_SUPABASE_ANON_KEY=your_anon_key_here\n');
}

