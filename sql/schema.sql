-- SIGAP schema: jalan di Postgres lokal (STB) maupun Supabase tanpa ubah
create table if not exists reports (
  id uuid default gen_random_uuid() primary key,
  ticket_code text unique not null,
  kategori text not null,
  kronologi text not null,
  waktu_kejadian timestamptz not null,
  lokasi text not null,
  bukti_url text,
  status text default 'Diterima' check (status in ('Diterima','Diverifikasi','Diproses','Selesai')),
  urgensi text check (urgensi in ('Ringan','Sedang','Berat')),
  created_at timestamptz default now()
);

create table if not exists admins (
  id uuid default gen_random_uuid() primary key,
  username text unique not null,
  password_hash text not null
);

create index if not exists idx_reports_ticket on reports(ticket_code);
create index if not exists idx_reports_status on reports(status);
