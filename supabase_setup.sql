-- SmileCare Database Setup Script
-- Paste this into the Supabase SQL Editor

-- 1. Create Services Table
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  duration_mins integer default 30,
  price decimal(10,2) not null,
  category text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Dentists Table
create table if not exists dentists (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  specialization text,
  email text,
  avatar_url text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Appointments Table
create table if not exists appointments (
  id uuid default gen_random_uuid() primary key,
  service_id uuid references services(id) on delete set null,
  dentist_id uuid references dentists(id) on delete set null,
  patient_name text not null,
  patient_email text,
  patient_phone text not null,
  appointment_date date not null,
  time_slot text not null,
  status text default 'pending',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (Optional: Disable if you want public access for demo)
-- For a demo, it's easier to keep them public initially
alter table services enable row level security;
alter table dentists enable row level security;
alter table appointments enable row level security;

-- 5. Create public access policies (Allow anyone to read/write for this demo)
create policy "Allow public read services" on services for select using (true);
create policy "Allow public read dentists" on dentists for select using (true);
create policy "Allow public read/write appointments" on appointments for all using (true);
create policy "Allow public insert appointments" on appointments for insert with check (true);

-- 6. Insert initial data (Seed)
insert into services (name, description, duration_mins, price, category) values
('فحص الأسنان الشامل والتنقيص', 'فحص دوري دقيق لحالة الأسنان واللثة مع إزالة الجير والترسبات وتلميع الأسنان.', 30, 250, 'عناية عامة'),
('تبييض الأسنان بالليزر', 'تقنية حديثة وآمنة لتبييض الأسنان واستعادة بياضها الطبيعي وإزالة التصبغات.', 60, 1200, 'تجميل الأسنان'),
('علاج جذور الأسنان (سحب العصب)', 'علاج احترافي للأعصاب الملتهبة والمتضررة مع حشو العصب بدقة وبدون ألم.', 90, 950, 'علاج الأسنان');

insert into dentists (name, specialization, email, avatar_url, bio) values
('د. أحمد الرويلي', 'استشاري جراحة الفم والوجه والفكين', 'ahmad.ruwaili@smilecare.com', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80', 'خريج جامعة الملك سعود، خبرة لأكثر من 12 عاماً في جراحة الفم وزراعة الأسنان.'),
('د. سارة المنصور', 'أخصائية تجميل وتقويم الأسنان', 'sara.mansour@smilecare.com', 'https://images.unsplash.com/photo-1594824813572-463283307771?w=400&auto=format&fit=crop&q=80', 'حاصلة على البورد الأمريكي في تقويم الأسنان وتصميم الابتسامة الرقمية.');
