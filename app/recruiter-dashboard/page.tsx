"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, LogOut, Search, Users, Filter, Mail, Phone, MapPin, GraduationCap } from "lucide-react"

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [schoolFilter, setSchoolFilter] = useState("all")
  const [majorFilter, setMajorFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser")
    if (!currentUser) {
      router.push("/")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.type !== "recruiter") {
      router.push("/")
      return
    }

    setUser(userData)

    // Load all students and their profiles
    const users = JSON.parse(localStorage.getItem("users") || "[]")
    const studentUsers = users.filter((u: any) => u.type === "student")

    const studentsWithProfiles = studentUsers.map((student: any) => {
      const profile = localStorage.getItem(`profile_${student.id}`)
      return {
        ...student,
        profile: profile ? JSON.parse(profile) : {},
      }
    })

    setStudents(studentsWithProfiles)
    setFilteredStudents(studentsWithProfiles)
  }, [router])

  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (student.profile.major && student.profile.major.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (student.profile.skills && student.profile.skills.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // School filter
    if (schoolFilter !== "all") {
      filtered = filtered.filter((student) => student.school === schoolFilter)
    }

    // Major filter
    if (majorFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.profile.major && student.profile.major.toLowerCase().includes(majorFilter.toLowerCase()),
      )
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, schoolFilter, majorFilter])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
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
              <div className="bg-green-600 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">UCLA Recruitment Platform</h1>
                <p className="text-sm text-gray-500">Recruiter Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                <p className="text-xs text-gray-500">{user.company}</p>
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
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList>
            <TabsTrigger value="students" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Student Database</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            {/* Search and Filters */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Search & Filter Students</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Search by name, email, major, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Select value={schoolFilter} onValueChange={setSchoolFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Schools</SelectItem>
                        <SelectItem value="engineering">UCLA School of Engineering</SelectItem>
                        <SelectItem value="cs">UCLA Computer Science</SelectItem>
                        <SelectItem value="applied-math">UCLA Applied Mathematics</SelectItem>
                        <SelectItem value="physics">UCLA Physics & Astronomy</SelectItem>
                        <SelectItem value="other">Other UCLA School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Select value={majorFilter} onValueChange={setMajorFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Majors</SelectItem>
                        <SelectItem value="computer">Computer Science</SelectItem>
                        <SelectItem value="electrical">Electrical Engineering</SelectItem>
                        <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                        <SelectItem value="data">Data Science</SelectItem>
                        <SelectItem value="software">Software Engineering</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Results */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Students ({filteredStudents.length})</h2>
                <Badge variant="secondary">
                  {filteredStudents.length} of {students.length} students
                </Badge>
              </div>

              {filteredStudents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                    <p className="text-gray-500">Try adjusting your search criteria or filters</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {student.fullName
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{student.fullName}</CardTitle>
                              <CardDescription>{student.email}</CardDescription>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline" className="w-fit">
                          {student.school}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {student.profile.major && (
                          <div className="flex items-center space-x-2 text-sm">
                            <GraduationCap className="h-4 w-4 text-gray-500" />
                            <span>{student.profile.major}</span>
                            {student.profile.gpa && (
                              <Badge variant="secondary" className="ml-auto">
                                GPA: {student.profile.gpa}
                              </Badge>
                            )}
                          </div>
                        )}

                        {student.profile.phone && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{student.profile.phone}</span>
                          </div>
                        )}

                        {student.profile.location && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{student.profile.location}</span>
                          </div>
                        )}

                        {student.profile.graduationYear && (
                          <div className="text-sm text-gray-600">
                            <strong>Graduation:</strong> {student.profile.graduationYear}
                          </div>
                        )}

                        {student.profile.skills && (
                          <div className="text-sm">
                            <strong className="text-gray-900">Skills:</strong>
                            <p className="text-gray-600 mt-1 line-clamp-2">{student.profile.skills}</p>
                          </div>
                        )}

                        <div className="flex space-x-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Engineering Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.filter((s) => s.school === "engineering").length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">CS Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{students.filter((s) => s.school === "cs").length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Complete Profiles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.filter((s) => s.profile.major && s.profile.skills).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Distribution by School</CardTitle>
                <CardDescription>Overview of student enrollment across different UCLA schools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["engineering", "cs", "applied-math", "physics", "other"].map((school) => {
                    const count = students.filter((s) => s.school === school).length
                    const percentage = students.length > 0 ? ((count / students.length) * 100).toFixed(1) : 0
                    const schoolNames: { [key: string]: string } = {
                      engineering: "UCLA School of Engineering",
                      cs: "UCLA Computer Science",
                      "applied-math": "UCLA Applied Mathematics",
                      physics: "UCLA Physics & Astronomy",
                      other: "Other UCLA School",
                    }

                    return (
                      <div key={school} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{schoolNames[school]}</span>
                            <span className="text-gray-500">
                              {count} students ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
