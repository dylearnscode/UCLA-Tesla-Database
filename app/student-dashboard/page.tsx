"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { GraduationCap, LogOut, User, FileText, Briefcase, Mail, Phone, Upload, File } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, logout } from "@/lib/auth"

const VISA_STATUS_OPTIONS = [
  { label: "US Citizen, National or Green Card", value: "citizen" },
  { label: "OPT (STEM)", value: "opt_stem" },
  { label: "OPT (non-STEM)", value: "opt_non_stem" },
  { label: "CPT Only", value: "cpt_only" },
  { label: "J-1", value: "j1" },
  { label: "Not comfortable disclosing", value: "not_disclosed" },
]

const MAJOR_OPTIONS = [
  "Computer Science",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Bioengineering",
  "Materials Science",
  "Civil Engineering",
  "Applied Mathematics",
  "Data Science",
  "Physics",
  "Chemistry",
  "Other",
]

const GRADUATION_YEARS = [
  { label: "2025", value: "2025" },
  { label: "2026", value: "2026" },
  { label: "2027", value: "2027" },
  { label: "2028", value: "2028" },
  { label: "2029", value: "2029" },
  { label: "March 2025", value: "march_2025" },
  { label: "June 2025", value: "june_2025" },
  { label: "September 2025", value: "september_2025" },
  { label: "December 2025", value: "december_2025" },
  { label: "March 2026", value: "march_2026" },
  { label: "June 2026", value: "june_2026" },
  { label: "September 2026", value: "september_2026" },
  { label: "December 2026", value: "december_2026" },
  { label: "March 2027", value: "march_2027" },
  { label: "June 2027", value: "june_2027" },
  { label: "September 2027", value: "september_2027" },
  { label: "December 2027", value: "december_2027" },
  { label: "March 2028", value: "march_2028" },
  { label: "June 2028", value: "june_2028" },
  { label: "September 2028", value: "september_2028" },
  { label: "December 2028", value: "december_2028" },
  { label: "March 2029", value: "march_2029" },
  { label: "June 2029", value: "june_2029" },
  { label: "September 2029", value: "september_2029" },
  { label: "December 2029", value: "december_2029" },
]

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    major: "",
    gpa: "",
    visaStatus: [] as string[],
    graduationYear: "",
    skills: "",
    experience: "",
    projects: "",
    phone: "",
    resumeUrl: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingResume, setUploadingResume] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/")
        return
      }

      if (currentUser.user_type !== "student") {
        router.push("/")
        return
      }

      setUser(currentUser)

      // Load student profile from Supabase
      try {
        const { data: studentProfile } = await supabase
          .from("student_profiles")
          .select("*")
          .eq("user_id", currentUser.id)
          .single()

        if (studentProfile) {
          setProfile({
            major: studentProfile.major || "",
            gpa: studentProfile.gpa?.toString() || "",
            visaStatus: studentProfile.visa_status ? studentProfile.visa_status.split(",") : [],
            graduationYear: studentProfile.graduation_year || "",
            skills: studentProfile.skills || "",
            experience: studentProfile.experience || "",
            projects: studentProfile.projects || "",
            phone: studentProfile.phone || "",
            resumeUrl: studentProfile.resume_url || "",
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUserData()
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleProfileUpdate = (field: string, value: string | string[]) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadingResume(true)
    try {
      // In a real app, you would upload to a file storage service
      // For demo purposes, we'll just create a mock URL
      const mockUrl = `https://example.com/resumes/${user.id}/${file.name}`
      setProfile((prev) => ({ ...prev, resumeUrl: mockUrl }))
    } catch (error) {
      console.error("Error uploading resume:", error)
    } finally {
      setUploadingResume(false)
    }
  }

  const saveProfile = async () => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("student_profiles")
        .update({
          major: profile.major,
          gpa: profile.gpa ? Number.parseFloat(profile.gpa) : null,
          visa_status: profile.visaStatus.join(","),
          graduation_year: profile.graduationYear,
          skills: profile.skills,
          experience: profile.experience,
          projects: profile.projects,
          phone: profile.phone,
          resume_url: profile.resumeUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id)

      if (error) {
        alert("Error saving profile: " + error.message)
      } else {
        alert("Profile saved successfully!")
      }
    } catch (error) {
      alert("Error saving profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">UCLA Recruitment Platform</h1>
                <p className="text-sm text-slate-500">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.profile?.school || "UCLA"}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg bg-slate-100">
                    {user.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user.full_name}</CardTitle>
                <Badge variant="secondary" className="mt-2">
                  {user.profile?.school || "UCLA"}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{user.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.major && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-slate-900">Major</p>
                    <p className="text-sm text-slate-600">{profile.major}</p>
                  </div>
                )}
                {profile.gpa && (
                  <div>
                    <p className="text-sm font-medium text-slate-900">GPA</p>
                    <p className="text-sm text-slate-600">{profile.gpa}</p>
                  </div>
                )}
                {profile.graduationYear && (
                  <div>
                    <p className="text-sm font-medium text-slate-900">Graduation</p>
                    <p className="text-sm text-slate-600">
                      {GRADUATION_YEARS.find((y) => y.value === profile.graduationYear)?.label}
                    </p>
                  </div>
                )}
                {profile.resumeUrl && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <File className="h-4 w-4" />
                      <span>Resume uploaded</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile" className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="applications" className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Applications</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
                    <CardDescription>Help recruiters find you by completing your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major" className="text-sm font-medium">
                          Major
                        </Label>
                        <Select value={profile.major} onValueChange={(value) => handleProfileUpdate("major", value)}>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select your major" />
                          </SelectTrigger>
                          <SelectContent>
                            {MAJOR_OPTIONS.map((major) => (
                              <SelectItem key={major} value={major}>
                                {major}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa" className="text-sm font-medium">
                          GPA
                        </Label>
                        <Input
                          id="gpa"
                          placeholder="3.8"
                          value={profile.gpa}
                          onChange={(e) => handleProfileUpdate("gpa", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    {/* New Fields */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Visa Status</Label>
                        <MultiSelect
                          options={VISA_STATUS_OPTIONS}
                          selected={profile.visaStatus}
                          onChange={(selected) => handleProfileUpdate("visaStatus", selected)}
                          placeholder="Select visa status..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Graduation Year</Label>
                        <Select
                          value={profile.graduationYear}
                          onValueChange={(value) => handleProfileUpdate("graduationYear", value)}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select graduation year" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADUATION_YEARS.map((year) => (
                              <SelectItem key={year.value} value={year.value}>
                                {year.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={profile.phone}
                          onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>

                    {/* Resume Upload */}
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Resume</Label>
                      <div className="upload-area">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleResumeUpload}
                          className="hidden"
                          id="resume-upload"
                          disabled={uploadingResume}
                        />
                        <label htmlFor="resume-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center space-y-2">
                            <Upload className="h-8 w-8 text-slate-400" />
                            <div className="text-center">
                              <p className="text-sm font-medium text-slate-900">
                                {uploadingResume ? "Uploading..." : "Click to upload resume"}
                              </p>
                              <p className="text-xs text-slate-500">PDF, DOC, or DOCX up to 10MB</p>
                            </div>
                          </div>
                        </label>
                        {profile.resumeUrl && (
                          <div className="mt-2 text-center">
                            <Badge variant="outline" className="text-green-600 border-green-200">
                              Resume uploaded
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Skills, Experience, Projects */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="skills" className="text-sm font-medium">
                          Skills
                        </Label>
                        <Textarea
                          id="skills"
                          placeholder="Python, JavaScript, React, Node.js, Machine Learning..."
                          value={profile.skills}
                          onChange={(e) => handleProfileUpdate("skills", e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-sm font-medium">
                          Work Experience
                        </Label>
                        <Textarea
                          id="experience"
                          placeholder="Describe your internships, part-time jobs, or relevant work experience..."
                          value={profile.experience}
                          onChange={(e) => handleProfileUpdate("experience", e.target.value)}
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projects" className="text-sm font-medium">
                          Projects
                        </Label>
                        <Textarea
                          id="projects"
                          placeholder="Describe your notable projects, hackathon wins, or personal projects..."
                          value={profile.projects}
                          onChange={(e) => handleProfileUpdate("projects", e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={saveProfile}
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800"
                      disabled={saving}
                    >
                      {saving ? "Saving..." : "Save Profile"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications">
                <Card className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl">Job Applications</CardTitle>
                    <CardDescription>Track your applications and responses from recruiters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No applications yet</h3>
                      <p className="text-slate-500 mb-4">
                        Complete your profile to start receiving opportunities from recruiters
                      </p>
                      <Button variant="outline">Browse Opportunities</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
