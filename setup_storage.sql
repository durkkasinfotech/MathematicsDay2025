-- Create a public storage bucket named 'uploads'
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- Enable RLS (required for policies to work, even public ones)
-- Note: 'storage.objects' usually has RLS enabled by default in Supabase

-- Create a policy to allow anyone to upload to the 'uploads' bucket
-- This is a "simple" policy as requested ("rls policies lam venam" interpretation: keep it open/working)
create policy "Allow public uploads"
on storage.objects for insert
with check ( bucket_id = 'uploads' );

-- Create a policy to allow public viewing/downloading of files
create policy "Allow public viewing"
on storage.objects for select
using ( bucket_id = 'uploads' );
