-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student', 'recruiter')),
  full_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_profiles table
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  school VARCHAR(255),
  major VARCHAR(255),
  secondary_major VARCHAR(255),
  gpa DECIMAL(3,2),
  graduation_year VARCHAR(10),
  year_entered VARCHAR(10),
  visa_status VARCHAR(255),
  phone VARCHAR(20),
  location VARCHAR(255),
  skills TEXT,
  experience TEXT,
  projects TEXT,
  cycles_available VARCHAR(255),
  consecutive_cycles VARCHAR(255),
  full_time_eligible VARCHAR(255),
  resume_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create recruiter_profiles table
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  company_key VARCHAR(9) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tesla_resume_data table for the imported CSV data
CREATE TABLE IF NOT EXISTS tesla_resume_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_time TIMESTAMP WITH TIME ZONE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  ucla_email VARCHAR(255),
  primary_major VARCHAR(255),
  secondary_major VARCHAR(255),
  year_entered VARCHAR(10),
  grad_year VARCHAR(10),
  visa_status VARCHAR(255),
  cycles_available VARCHAR(255),
  consecutive_cycles VARCHAR(255),
  full_time_eligible VARCHAR(255),
  resume_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hiring_records table for tracking hired students
CREATE TABLE IF NOT EXISTS hiring_records (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_email VARCHAR(255) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  recruiter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company VARCHAR(255) NOT NULL,
  position_title VARCHAR(255),
  cycle VARCHAR(255) NOT NULL,
  hire_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'hired' CHECK (status IN ('hired', 'offer_extended', 'declined', 'withdrawn')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_student_profiles_major ON student_profiles(major);
CREATE INDEX IF NOT EXISTS idx_student_profiles_graduation_year ON student_profiles(graduation_year);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_user_id ON recruiter_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_company ON recruiter_profiles(company);
CREATE INDEX IF NOT EXISTS idx_tesla_resume_data_email ON tesla_resume_data(ucla_email);
CREATE INDEX IF NOT EXISTS idx_tesla_resume_data_major ON tesla_resume_data(primary_major);
CREATE INDEX IF NOT EXISTS idx_hiring_records_student_email ON hiring_records(student_email);
CREATE INDEX IF NOT EXISTS idx_hiring_records_recruiter_id ON hiring_records(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_hiring_records_company ON hiring_records(company);
CREATE INDEX IF NOT EXISTS idx_hiring_records_cycle ON hiring_records(cycle);
