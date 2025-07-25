import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface User {
  id: string
  email: string
  user_type: "student" | "recruiter"
  full_name: string
  created_at: string
  updated_at: string
}

export interface StudentProfile {
  id: string
  user_id: string
  school?: string
  major?: string
  secondary_major?: string
  gpa?: number
  graduation_year?: string
  year_entered?: string
  visa_status?: string
  phone?: string
  location?: string
  skills?: string
  experience?: string
  projects?: string
  cycles_available?: string
  consecutive_cycles?: string
  full_time_eligible?: string
  resume_url?: string
  created_at: string
  updated_at: string
}

export interface RecruiterProfile {
  id: string
  user_id: string
  company: string
  company_key: string
  created_at: string
  updated_at: string
}

export interface TeslaResumeData {
  id: string
  submission_time?: string
  first_name?: string
  last_name?: string
  ucla_email?: string
  primary_major?: string
  secondary_major?: string
  year_entered?: string
  grad_year?: string
  visa_status?: string
  cycles_available?: string
  consecutive_cycles?: string
  full_time_eligible?: string
  resume_url?: string
  created_at: string
}

export interface HiringRecord {
  id: string
  student_email: string
  student_name: string
  recruiter_id: string
  company: string
  position_title?: string
  cycle: string
  hire_date: string
  status: "hired" | "offer_extended" | "declined" | "withdrawn"
  notes?: string
  created_at: string
  updated_at: string
}

// Hiring functions
export async function markStudentAsHired(data: {
  studentEmail: string
  studentName: string
  recruiterId: string
  company: string
  positionTitle?: string
  cycle: string
  notes?: string
}) {
  const { data: result, error } = await supabase
    .from("hiring_records")
    .insert({
      student_email: data.studentEmail,
      student_name: data.studentName,
      recruiter_id: data.recruiterId,
      company: data.company,
      position_title: data.positionTitle,
      cycle: data.cycle,
      status: "hired",
      notes: data.notes,
    })
    .select()
    .single()

  return { data: result, error }
}

export async function getHiringRecords(recruiterId: string) {
  const { data, error } = await supabase
    .from("hiring_records")
    .select("*")
    .eq("recruiter_id", recruiterId)
    .order("hire_date", { ascending: false })

  return { data, error }
}

export async function updateHiringRecord(id: string, updates: Partial<HiringRecord>) {
  const { data, error } = await supabase
    .from("hiring_records")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  return { data, error }
}

export async function getStudentHiringStatus(studentEmail: string) {
  const { data, error } = await supabase
    .from("hiring_records")
    .select("*")
    .eq("student_email", studentEmail)
    .order("hire_date", { ascending: false })

  return { data, error }
}
