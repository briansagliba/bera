-- Supabase SQL setup script

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'responder', 'requestor')),
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergencies table
CREATE TABLE emergencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('medical', 'fire', 'police', 'disaster', 'other')),
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'responding', 'resolved', 'cancelled')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  reported_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Responders table
CREATE TABLE responders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  type TEXT,
  status TEXT NOT NULL CHECK (status IN ('available', 'responding', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requestors table
CREATE TABLE requestors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  situation TEXT,
  concern TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emergency assignments table (links responders to emergencies)
CREATE TABLE emergency_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  emergency_id UUID REFERENCES emergencies(id),
  responder_id UUID REFERENCES responders(id),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('assigned', 'en_route', 'on_scene', 'completed')),
  notes TEXT,
  UNIQUE(emergency_id, responder_id)
);

-- Create RLS policies
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE responders ENABLE ROW LEVEL SECURITY;
ALTER TABLE requestors ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admin can do everything
CREATE POLICY "Admins have full access" ON users FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins have full access" ON emergencies FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins have full access" ON responders FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins have full access" ON requestors FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admins have full access" ON emergency_assignments FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid() = id);

-- Responders can read emergencies and update their status
CREATE POLICY "Responders can read emergencies" ON emergencies FOR SELECT USING (auth.jwt() ->> 'role' = 'responder');
CREATE POLICY "Responders can update emergency status" ON emergencies FOR UPDATE USING (auth.jwt() ->> 'role' = 'responder');

-- Requestors can create emergencies and read their own
CREATE POLICY "Requestors can create emergencies" ON emergencies FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'requestor');
CREATE POLICY "Requestors can read own emergencies" ON emergencies FOR SELECT USING (auth.uid() = user_id);
