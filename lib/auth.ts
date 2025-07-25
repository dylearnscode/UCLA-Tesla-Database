import { supabase } from "./supabase"

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

// Simple hash function for demo purposes (in production, use proper server-side hashing)
function simpleHash(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

export async function signUp(data: SignUpData) {
  try {
    // Hash the password (simplified for demo)
    const passwordHash = simpleHash(data.password)

    // Validate company key for recruiters
    if (data.userType === "recruiter" && data.companyKey) {
      const { data: validKeys } = await supabase
        .from("recruiter_profiles")
        .select("company_key, company")
        .eq("company_key", data.companyKey)

      if (!validKeys || validKeys.length === 0) {
        throw new Error("Invalid company key")
      }

      const validKey = validKeys[0]
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

    // Verify password (simplified for demo)
    const hashedPassword = simpleHash(data.password)
    if (hashedPassword !== user.password_hash) {
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
