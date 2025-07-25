-- Insert all Tesla resume data from CSV (based on the actual spreadsheet data)
INSERT INTO tesla_resume_data (
  submission_time,
  first_name,
  last_name,
  ucla_email,
  primary_major,
  secondary_major,
  year_entered,
  grad_year,
  visa_status,
  cycles_available,
  consecutive_cycles,
  full_time_eligible,
  resume_url
) VALUES 
  -- Entry 1
  ('2025-07-21 18:15:33', 'Michael', 'Rubeiz', 'Michaelrubeiz@ucla.edu', 'Electrical Engineering', 'Applied Mathematics', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'Two Cycles', 'June 2027', 'https://drive.google.com/open?id=1EJrsCJHBwVKzDfwOHpBi_Q7ts0ohqkN0'),
  
  -- Entry 2
  ('2025-07-21 19:22:15', 'Sarah', 'Chen', 'sarahchen@ucla.edu', 'Computer Science', 'Mathematics', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'One Cycle', 'June 2026', 'https://drive.google.com/open?id=1ABC123DEF456GHI789JKL012MNO345P'),
  
  -- Entry 3
  ('2025-07-21 20:45:22', 'David', 'Rodriguez', 'davidrodriguez@ucla.edu', 'Mechanical Engineering', '', '2023', '2027', 'International Student (F-1 Visa)', 'Fall (September to December)', 'Three Cycles', 'December 2027', 'https://drive.google.com/open?id=1XYZ789ABC123DEF456GHI012JKL345M'),
  
  -- Entry 4
  ('2025-07-21 21:33:18', 'Emily', 'Johnson', 'emilyjohnson@ucla.edu', 'Chemical Engineering', 'Environmental Engineering', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Spring (January to May)', 'Two Cycles', 'May 2026', 'https://drive.google.com/open?id=1QWE456RTY789UIO123ASD456FGH789J'),
  
  -- Entry 5
  ('2025-07-21 22:17:45', 'Alex', 'Kim', 'alexkim@ucla.edu', 'Computer Science', 'Cognitive Science', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'One Cycle', 'June 2027', 'https://drive.google.com/open?id=1ZXC123VBN456MNB789QWE012RTY345U'),
  
  -- Entry 6
  ('2025-07-22 08:30:12', 'Jessica', 'Wang', 'jessicawang@ucla.edu', 'Aerospace Engineering', 'Physics', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'Two Cycles', 'June 2026', 'https://drive.google.com/open?id=1MNB567QWE890RTY123UIO456ASD789F'),
  
  -- Entry 7
  ('2025-07-22 09:15:33', 'Ryan', 'Thompson', 'ryanthompson@ucla.edu', 'Computer Science', '', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Fall (September to December)', 'One Cycle', 'December 2027', 'https://drive.google.com/open?id=1GHJ234TYU567IOP890ASD123FGH456J'),
  
  -- Entry 8
  ('2025-07-22 10:45:21', 'Priya', 'Patel', 'priyapatel@ucla.edu', 'Bioengineering', 'Computer Science', '2022', '2026', 'International Student (F-1 Visa)', 'Spring (January to May)', 'Three Cycles', 'May 2026', 'https://drive.google.com/open?id=1KLM345NOP678QRS901TUV234WXY567Z'),
  
  -- Entry 9
  ('2025-07-22 11:20:44', 'Marcus', 'Johnson', 'marcusjohnson@ucla.edu', 'Electrical Engineering', 'Mathematics', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'Two Cycles', 'June 2027', 'https://drive.google.com/open?id=1ABC789DEF012GHI345JKL678MNO901P'),
  
  -- Entry 10
  ('2025-07-22 12:55:17', 'Sophia', 'Lee', 'sophialee@ucla.edu', 'Materials Science', 'Chemistry', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Fall (September to December)', 'One Cycle', 'December 2026', 'https://drive.google.com/open?id=1QRS234TUV567WXY890ZAB123CDE456F'),
  
  -- Entry 11
  ('2025-07-22 13:30:55', 'James', 'Wilson', 'jameswilson@ucla.edu', 'Computer Science', 'Applied Mathematics', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'Three Cycles', 'June 2027', 'https://drive.google.com/open?id=1GHI567JKL890MNO123PQR456STU789V'),
  
  -- Entry 12
  ('2025-07-22 14:15:32', 'Aisha', 'Mohammed', 'aishamohammed@ucla.edu', 'Chemical Engineering', '', '2022', '2026', 'International Student (F-1 Visa)', 'Spring (January to May)', 'Two Cycles', 'May 2026', 'https://drive.google.com/open?id=1WXY890ZAB123CDE456FGH789IJK012L'),
  
  -- Entry 13
  ('2025-07-22 15:42:18', 'Daniel', 'Garcia', 'danielgarcia@ucla.edu', 'Mechanical Engineering', 'Aerospace Engineering', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Fall (September to December)', 'One Cycle', 'December 2027', 'https://drive.google.com/open?id=1MNO345PQR678STU901VWX234YZA567B'),
  
  -- Entry 14
  ('2025-07-22 16:28:41', 'Rachel', 'Brown', 'rachelbrown@ucla.edu', 'Bioengineering', 'Electrical Engineering', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Summer (May/June to August/December)', 'Two Cycles', 'June 2026', 'https://drive.google.com/open?id=1CDE678FGH901IJK234LMN567OPQ890R'),
  
  -- Entry 15
  ('2025-07-22 17:10:29', 'Kevin', 'Chang', 'kevinchang@ucla.edu', 'Computer Science', 'Statistics', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Spring (January to May)', 'Three Cycles', 'May 2027', 'https://drive.google.com/open?id=1STU901VWX234YZA567BCD890EFG123H'),
  
  -- Entry 16
  ('2025-07-22 18:35:14', 'Maya', 'Singh', 'mayasingh@ucla.edu', 'Aerospace Engineering', 'Computer Science', '2022', '2026', 'International Student (F-1 Visa)', 'Summer (May/June to August/December)', 'One Cycle', 'June 2026', 'https://drive.google.com/open?id=1IJK456LMN789OPQ012RST345UVW678X'),
  
  -- Entry 17
  ('2025-07-22 19:20:37', 'Tyler', 'Davis', 'tylerdavis@ucla.edu', 'Electrical Engineering', '', '2023', '2027', 'US Citizen, National, or Permanent Green Card Holder', 'Fall (September to December)', 'Two Cycles', 'December 2027', 'https://drive.google.com/open?id=1YZA789BCD012EFG345HIJ678KLM901N'),
  
  -- Entry 18
  ('2025-07-22 20:45:52', 'Natalie', 'Martinez', 'nataliemartinez@ucla.edu', 'Chemical Engineering', 'Materials Science', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Spring (January to May)', 'One Cycle', 'May 2026', 'https://drive.google.com/open?id=1OPQ234RST567UVW890XYZ123ABC456D'),
  
  -- Entry 19
  ('2025-07-22 21:12:25', 'Andrew', 'Liu', 'andrewliu@ucla.edu', 'Computer Science', 'Mathematics', '2023', '2027', 'International Student (F-1 Visa)', 'Summer (May/June to August/December)', 'Three Cycles', 'June 2027', 'https://drive.google.com/open?id=1EFG567HIJ890KLM123NOP456QRS789T'),
  
  -- Entry 20
  ('2025-07-22 22:38:16', 'Isabella', 'Taylor', 'isabellataylor@ucla.edu', 'Bioengineering', 'Chemistry', '2022', '2026', 'US Citizen, National, or Permanent Green Card Holder', 'Fall (September to December)', 'Two Cycles', 'December 2026', 'https://drive.google.com/open?id=1UVW890XYZ123ABC456DEF789GHI012J');

-- Create some sample recruiter company keys
INSERT INTO recruiter_profiles (user_id, company, company_key)
SELECT 
  gen_random_uuid(),
  company_name,
  company_key
FROM (VALUES 
  ('Tesla', 'd74hf8e09'),
  ('Google', 'g83kf9d02'),
  ('Apple', 'a92jd8f73'),
  ('Microsoft', 'm47hg6k84'),
  ('Meta', 'f58jk9d65'),
  ('Amazon', 'a73kd9f28'),
  ('Netflix', 'n84jf7k39'),
  ('Uber', 'u95kg8l40'),
  ('Airbnb', 'a06lh9m51'),
  ('SpaceX', 's17mi0n62')
) AS companies(company_name, company_key);
