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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Building2, LogOut, Search, Users, Filter, Mail, Phone, MapPin, GraduationCap, UserCheck } from "lucide-react"
import { supabase, markStudentAsHired, getHiringRecords } from "@/lib/supabase"
import { getCurrentUser, logout } from "@/lib/auth"
import type { TeslaResumeData, HiringRecord } from "@/lib/supabase"
import Image from "next/image"

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [schoolFilter, setSchoolFilter] = useState("all")
  const [majorFilter, setMajorFilter] = useState("all")
  const [teslaData, setTeslaData] = useState<TeslaResumeData[]>([])
  const [hiringRecords, setHiringRecords] = useState<HiringRecord[]>([])
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [hiringDialogOpen, setHiringDialogOpen] = useState(false)
  const [hiringForm, setHiringForm] = useState({
    positionTitle: "",
    cycle: "",
    notes: "",
  })
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getCurrentUser()
      if (!currentUser) {
        router.push("/")
        return
      }

      if (currentUser.user_type !== "recruiter") {
        router.push("/")
        return
      }

      setUser(currentUser)

      // Load students with profiles from Supabase
      const { data: users } = await supabase
        .from("users")
        .select(`
          *,
          student_profiles (*)
        `)
        .eq("user_type", "student")

      if (users) {
        const studentsWithProfiles = users.map((user: any) => ({
          ...user,
          profile: user.student_profiles[0] || {},
        }))
        setStudents(studentsWithProfiles)
        setFilteredStudents(studentsWithProfiles)
      }

      // Load Tesla resume data
      const { data: teslaResumeData } = await supabase
        .from("tesla_resume_data")
        .select("*")
        .order("submission_time", { ascending: false })

      if (teslaResumeData) {
        setTeslaData(teslaResumeData)
      }

      // Load hiring records
      const { data: hiringData } = await getHiringRecords(currentUser.id)
      if (hiringData) {
        setHiringRecords(hiringData)
      }
    }

    loadData()
  }, [router])

  useEffect(() => {
    let filtered = students

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    logout()
    router.push("/")
  }

  const handleHireStudent = (student: any, isTeslaData = false) => {
    if (isTeslaData) {
      setSelectedStudent({
        email: student.ucla_email,
        full_name: `${student.first_name} ${student.last_name}`,
        major: student.primary_major,
        cycles_available: student.cycles_available,
      })
    } else {
      setSelectedStudent({
        email: student.email,
        full_name: student.full_name,
        major: student.profile.major,
        cycles_available: student.profile.cycles_available,
      })
    }
    setHiringDialogOpen(true)
  }

  const submitHiring = async () => {
    if (!selectedStudent || !user) return

    const { error } = await markStudentAsHired({
      studentEmail: selectedStudent.email,
      studentName: selectedStudent.full_name,
      recruiterId: user.id,
      company: user.company,
      positionTitle: hiringForm.positionTitle,
      cycle: hiringForm.cycle,
      notes: hiringForm.notes,
    })

    if (error) {
      alert("Error marking student as hired: " + error.message)
    } else {
      alert("Student marked as hired successfully!")
      setHiringDialogOpen(false)
      setHiringForm({ positionTitle: "", cycle: "", notes: "" })

      // Refresh hiring records
      const { data: hiringData } = await getHiringRecords(user.id)
      if (hiringData) {
        setHiringRecords(hiringData)
      }
    }
  }

  const isStudentHired = (studentEmail: string) => {
    return hiringRecords.some((record) => record.student_email === studentEmail && record.status === "hired")
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
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
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
            <TabsTrigger value="tesla" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Tesla Resume Data</span>
            </TabsTrigger>
            <TabsTrigger value="hired" className="flex items-center space-x-2">
              <UserCheck className="h-4 w-4" />
              <span>Hired Students ({hiringRecords.length})</span>
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
                        <SelectItem value="UCLA School of Engineering">UCLA School of Engineering</SelectItem>
                        <SelectItem value="UCLA Computer Science">UCLA Computer Science</SelectItem>
                        <SelectItem value="UCLA Applied Mathematics">UCLA Applied Mathematics</SelectItem>
                        <SelectItem value="UCLA Physics & Astronomy">UCLA Physics & Astronomy</SelectItem>
                        <SelectItem value="Other UCLA School">Other UCLA School</SelectItem>
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
                                {student.full_name
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{student.full_name}</CardTitle>
                              <CardDescription>{student.email}</CardDescription>
                            </div>
                          </div>
                          {isStudentHired(student.email) && (
                            <Badge variant="default" className="bg-green-600">
                              <UserCheck className="h-3 w-3 mr-1" />
                              Hired
                            </Badge>
                          )}
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

                        {student.profile.graduation_year && (
                          <div className="text-sm text-gray-600">
                            <strong>Graduation:</strong> {student.profile.graduation_year}
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
                          <Button
                            size="sm"
                            variant={isStudentHired(student.email) ? "secondary" : "outline"}
                            onClick={() => handleHireStudent(student)}
                            disabled={isStudentHired(student.email)}
                          >
                            {isStudentHired(student.email) ? (
                              <>
                                <UserCheck className="h-4 w-4 mr-1" />
                                Hired
                              </>
                            ) : (
                              "Mark as Hired"
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tesla">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="relative w-6 h-6">
                    <Image src="/images/tesla-logo.png" alt="Tesla" fill className="object-contain" />
                  </div>
                  <span>Tesla Resume Database</span>
                </CardTitle>
                <CardDescription>
                  Students who have submitted their resumes for Tesla internship opportunities
                </CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Tesla Applicants ({teslaData.length})</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teslaData.map((applicant) => (
                  <Card key={applicant.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {applicant.first_name} {applicant.last_name}
                          </CardTitle>
                          <CardDescription>{applicant.ucla_email}</CardDescription>
                        </div>
                        {isStudentHired(applicant.ucla_email || "") && (
                          <Badge variant="default" className="bg-green-600">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Hired
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="w-fit">
                        {applicant.primary_major}
                      </Badge>
                      {applicant.secondary_major && (
                        <Badge variant="secondary" className="w-fit">
                          {applicant.secondary_major}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="text-sm">
                        <strong>Graduation:</strong> {applicant.grad_year}
                      </div>
                      <div className="text-sm">
                        <strong>Visa Status:</strong> {applicant.visa_status}
                      </div>
                      <div className="text-sm">
                        <strong>Available:</strong> {applicant.cycles_available}
                      </div>
                      <div className="text-sm">
                        <strong>Consecutive Cycles:</strong> {applicant.consecutive_cycles}
                      </div>
                      <div className="text-sm">
                        <strong>Full-time Eligible:</strong> {applicant.full_time_eligible}
                      </div>

                      <div className="flex space-x-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Mail className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          variant={isStudentHired(applicant.ucla_email || "") ? "secondary" : "outline"}
                          onClick={() => handleHireStudent(applicant, true)}
                          disabled={isStudentHired(applicant.ucla_email || "")}
                        >
                          {isStudentHired(applicant.ucla_email || "") ? (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Hired
                            </>
                          ) : (
                            "Mark as Hired"
                          )}
                        </Button>
                        {applicant.resume_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(applicant.resume_url!, "_blank")}
                          >
                            Resume
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hired">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Hired Students</span>
                </CardTitle>
                <CardDescription>Students you have marked as hired for various positions and cycles</CardDescription>
              </CardHeader>
            </Card>

            <div className="space-y-4">
              {hiringRecords.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hired students yet</h3>
                    <p className="text-gray-500">Start marking students as hired to track your recruitment progress</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hiringRecords.map((record) => (
                    <Card key={record.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{record.student_name}</CardTitle>
                            <CardDescription>{record.student_email}</CardDescription>
                          </div>
                          <Badge variant="default" className="bg-green-600">
                            {record.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm">
                          <strong>Position:</strong> {record.position_title || "Not specified"}
                        </div>
                        <div className="text-sm">
                          <strong>Cycle:</strong> {record.cycle}
                        </div>
                        <div className="text-sm">
                          <strong>Hired Date:</strong> {new Date(record.hire_date).toLocaleDateString()}
                        </div>
                        {record.notes && (
                          <div className="text-sm">
                            <strong>Notes:</strong>
                            <p className="text-gray-600 mt-1">{record.notes}</p>
                          </div>
                        )}
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
                  <CardTitle className="text-sm font-medium text-gray-600">Tesla Applicants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{teslaData.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Students Hired</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hiringRecords.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Hiring Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {students.length > 0 ? ((hiringRecords.length / students.length) * 100).toFixed(1) : 0}%
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Student Distribution by Major</CardTitle>
                <CardDescription>Overview of student majors in Tesla applicant database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Computer Science",
                    "Electrical Engineering",
                    "Mechanical Engineering",
                    "Chemical Engineering",
                    "Aerospace Engineering",
                    "Bioengineering",
                  ].map((major) => {
                    const count = teslaData.filter((s) => s.primary_major?.includes(major)).length
                    const percentage = teslaData.length > 0 ? ((count / teslaData.length) * 100).toFixed(1) : 0

                    return (
                      <div key={major} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{major}</span>
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

      {/* Hiring Dialog */}
      <Dialog open={hiringDialogOpen} onOpenChange={setHiringDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Mark Student as Hired</DialogTitle>
            <DialogDescription>Record the hiring details for {selectedStudent?.full_name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Position
              </Label>
              <Input
                id="position"
                placeholder="Software Engineer Intern"
                className="col-span-3"
                value={hiringForm.positionTitle}
                onChange={(e) => setHiringForm((prev) => ({ ...prev, positionTitle: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cycle" className="text-right">
                Cycle
              </Label>
              <Select onValueChange={(value) => setHiringForm((prev) => ({ ...prev, cycle: value }))}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select cycle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Summer 2025">Summer 2025</SelectItem>
                  <SelectItem value="Fall 2025">Fall 2025</SelectItem>
                  <SelectItem value="Spring 2026">Spring 2026</SelectItem>
                  <SelectItem value="Summer 2026">Summer 2026</SelectItem>
                  <SelectItem value="Full-time 2026">Full-time 2026</SelectItem>
                  <SelectItem value="Full-time 2027">Full-time 2027</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about the hiring..."
                className="col-span-3"
                value={hiringForm.notes}
                onChange={(e) => setHiringForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={submitHiring} disabled={!hiringForm.cycle}>
              Mark as Hired
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
