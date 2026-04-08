-- Create reservations table
CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  guests INTEGER NOT NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX idx_reservations_date ON reservations(reservation_date);
CREATE INDEX idx_reservations_email ON reservations(email);

-- Enable Row Level Security (RLS)
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts (for public reservations)
CREATE POLICY "Allow public inserts" ON reservations
  FOR INSERT WITH CHECK (true);

-- Create policy to allow reads (for admin)
CREATE POLICY "Allow authenticated reads" ON reservations
  FOR SELECT USING (auth.role() = 'authenticated');