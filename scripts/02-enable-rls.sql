-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tesla_resume_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE hiring_records ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for student_profiles table
CREATE POLICY "Students can view own profile" ON student_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can view all student profiles" ON student_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'recruiter'
    )
  );

-- Create policies for recruiter_profiles table
CREATE POLICY "Recruiters can view own profile" ON recruiter_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Create policies for tesla_resume_data table
CREATE POLICY "Recruiters can view Tesla resume data" ON tesla_resume_data
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'recruiter'
    )
  );

-- Create policies for hiring_records table
CREATE POLICY "Recruiters can view own hiring records" ON hiring_records
  FOR SELECT USING (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can create hiring records" ON hiring_records
  FOR INSERT WITH CHECK (auth.uid() = recruiter_id);

CREATE POLICY "Recruiters can update own hiring records" ON hiring_records
  FOR UPDATE USING (auth.uid() = recruiter_id);

CREATE POLICY "Students can view hiring records about them" ON hiring_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.user_type = 'student'
      AND users.email = hiring_records.student_email
    )
  );
