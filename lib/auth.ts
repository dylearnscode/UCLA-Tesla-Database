import { supabase } from "./supabase"
import bcrypt from "bcryptjs"

export interface SignUpData {
  email: string
  password: string
  fullName: string
  userType: "student" | "recruiter"
  school?: string
  company?: string
  companyKey?: string
}

export interface LoginData {
  email: string
  password: string
}

export async function signUp(data: SignUpData) {
  try {
    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(data.password, saltRounds)

    // Validate company key for recruiters
    if (data.userType === "recruiter" && data.companyKey) {
      const { data: validKey } = await supabase
        .from("recruiter_profiles")
        .select("company_key, company")
        .eq("company_key", data.companyKey)
        .single()

      if (!validKey) {
        throw new Error("Invalid company key")
      }

      if (validKey.company.toLowerCase() !== data.company?.toLowerCase()) {
        throw new Error("Company name does not match the provided key")
      }
    }

    // Create user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email: data.email,
        password_hash: passwordHash,
        user_type: data.userType,
        full_name: data.fullName,
      })
      .select()
      .single()

    if (userError) throw userError

    // Create profile based on user type
    if (data.userType === "student") {
      const { error: profileError } = await supabase.from("student_profiles").insert({
        user_id: user.id,
        school: data.school,
      })

      if (profileError) throw profileError
    } else if (data.userType === "recruiter") {
      const { error: profileError } = await supabase.from("recruiter_profiles").insert({
        user_id: user.id,
        company: data.company!,
        company_key: data.companyKey!,
      })

      if (profileError) throw profileError
    }

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

export async function login(data: LoginData) {
  try {
    // Get user by email
    const { data: user, error: userError } = await supabase.from("users").select("*").eq("email", data.email).single()

    if (userError || !user) {
      throw new Error("Invalid email or password")
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password_hash)
    if (!isValidPassword) {
      throw new Error("Invalid email or password")
    }

    // Get profile data
    let profile = null
    if (user.user_type === "student") {
      const { data: studentProfile } = await supabase
        .from("student_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      profile = studentProfile
    } else if (user.user_type === "recruiter") {
      const { data: recruiterProfile } = await supabase
        .from("recruiter_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single()
      profile = recruiterProfile
    }

    return { user: { ...user, profile }, error: null }
  } catch (error) {
    return { user: null, error: error as Error }
  }
}

export async function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem("currentUser")
}
