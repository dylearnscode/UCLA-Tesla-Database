"use client"

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
import { GraduationCap, LogOut, User, FileText, Briefcase, Mail, Phone, MapPin } from "lucide-react"

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState({
    major: "",
    gpa: "",
    graduationYear: "",
    skills: "",
    experience: "",
    projects: "",
    phone: "",
    location: "",
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.type !== "student") {
      router.push("/")
      return
    }

    setUser(userData)

    // Load saved profile data
    const savedProfile = localStorage.getItem(`profile_${userData.id}`)
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleProfileUpdate = (field: string, value: string) => {
    const updatedProfile = { ...profile, [field]: value }
    setProfile(updatedProfile)
    if (user) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile))
    }
  }

  const saveProfile = () => {
    if (user) {
      localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile))
      alert("Profile saved successfully!")
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">UCLA Recruitment Platform</h1>
                <p className="text-sm text-gray-500">Student Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.school}</p>
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
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarFallback className="text-lg">
                    {user.fullName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <CardTitle>{user.fullName}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
                <Badge variant="secondary" className="mt-2">
                  {user.school}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.major && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-900">Major</p>
                    <p className="text-sm text-gray-600">{profile.major}</p>
                  </div>
                )}
                {profile.gpa && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">GPA</p>
                    <p className="text-sm text-gray-600">{profile.gpa}</p>
                  </div>
                )}
                {profile.graduationYear && (
                  <div>
                    <p className="text-sm font-medium text-gray-900">Expected Graduation</p>
                    <p className="text-sm text-gray-600">{profile.graduationYear}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList>
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
                <Card>
                  <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Help recruiters find you by completing your profile information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="major">Major</Label>
                        <Input
                          id="major"
                          placeholder="Computer Science"
                          value={profile.major}
                          onChange={(e) => handleProfileUpdate("major", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gpa">GPA</Label>
                        <Input
                          id="gpa"
                          placeholder="3.8"
                          value={profile.gpa}
                          onChange={(e) => handleProfileUpdate("gpa", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="graduationYear">Expected Graduation</Label>
                        <Input
                          id="graduationYear"
                          placeholder="Spring 2025"
                          value={profile.graduationYear}
                          onChange={(e) => handleProfileUpdate("graduationYear", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={profile.phone}
                          onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="Los Angeles, CA"
                        value={profile.location}
                        onChange={(e) => handleProfileUpdate("location", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Textarea
                        id="skills"
                        placeholder="Python, JavaScript, React, Node.js, Machine Learning..."
                        value={profile.skills}
                        onChange={(e) => handleProfileUpdate("skills", e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experience">Work Experience</Label>
                      <Textarea
                        id="experience"
                        placeholder="Describe your internships, part-time jobs, or relevant work experience..."
                        value={profile.experience}
                        onChange={(e) => handleProfileUpdate("experience", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projects">Projects</Label>
                      <Textarea
                        id="projects"
                        placeholder="Describe your notable projects, hackathon wins, or personal projects..."
                        value={profile.projects}
                        onChange={(e) => handleProfileUpdate("projects", e.target.value)}
                        rows={4}
                      />
                    </div>

                    <Button onClick={saveProfile} className="w-full">
                      Save Profile
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle>Job Applications</CardTitle>
                    <CardDescription>Track your applications and responses from recruiters</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                      <p className="text-gray-500 mb-4">
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
