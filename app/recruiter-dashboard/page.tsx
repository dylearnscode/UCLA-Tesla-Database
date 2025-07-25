"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiSelect } from "@/components/ui/multi-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  LogOut,
  Search,
  Users,
  UserCheck,
  TrendingUp,
  BarChart3,
  Download,
  Filter,
  ArrowUpDown,
} from "lucide-react"
import { supabase, getHiringRecords } from "@/lib/supabase"
import { getCurrentUser, logout } from "@/lib/auth"
import type { TeslaResumeData, HiringRecord } from "@/lib/supabase"

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

const QUARTERS = [
  { label: "Fall", value: "fall" },
  { label: "Winter", value: "winter" },
  { label: "Spring", value: "spring" },
  { label: "Summer", value: "summer" },
]

export default function RecruiterDashboard() {
  const [user, setUser] = useState<any>(null)
  const [students, setStudents] = useState<any[]>([])
  const [filteredStudents, setFilteredStudents] = useState<any[]>([])
  const [teslaData, setTeslaData] = useState<TeslaResumeData[]>([])
  const [hiringRecords, setHiringRecords] = useState<HiringRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Search filters
  const [searchName, setSearchName] = useState("")
  const [selectedMajor, setSelectedMajor] = useState("all")
  const [selectedGradYear, setSelectedGradYear] = useState("all")
  const [selectedVisaStatus, setSelectedVisaStatus] = useState<string[]>([])
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([])

  // Sorting
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

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

      try {
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
            profile: user.student_profiles?.[0] || {},
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
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  useEffect(() => {
    let filtered = students

    // Apply filters
    if (searchName) {
      filtered = filtered.filter((student) => student.full_name?.toLowerCase().includes(searchName.toLowerCase()))
    }

    if (selectedMajor !== "all") {
      filtered = filtered.filter((student) => student.profile?.major === selectedMajor)
    }

    if (selectedGradYear !== "all") {
      filtered = filtered.filter((student) => student.profile?.graduation_year === selectedGradYear)
    }

    if (selectedVisaStatus.length > 0) {
      filtered = filtered.filter((student) => {
        const studentVisaStatus = student.profile?.visa_status?.split(",") || []
        return selectedVisaStatus.some((status) => studentVisaStatus.includes(status))
      })
    }

    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue = ""
        let bValue = ""

        switch (sortField) {
          case "name":
            aValue = a.full_name || ""
            bValue = b.full_name || ""
            break
          case "email":
            aValue = a.email || ""
            bValue = b.email || ""
            break
          case "major":
            aValue = a.profile?.major || ""
            bValue = b.profile?.major || ""
            break
          case "gpa":
            aValue = a.profile?.gpa?.toString() || "0"
            bValue = b.profile?.gpa?.toString() || "0"
            break
          case "graduation":
            aValue = a.profile?.graduation_year || ""
            bValue = b.profile?.graduation_year || ""
            break
        }

        if (sortDirection === "asc") {
          return aValue.localeCompare(bValue)
        } else {
          return bValue.localeCompare(aValue)
        }
      })
    }

    setFilteredStudents(filtered)
  }, [
    students,
    searchName,
    selectedMajor,
    selectedGradYear,
    selectedVisaStatus,
    selectedQuarters,
    sortField,
    sortDirection,
  ])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const clearFilters = () => {
    setSearchName("")
    setSelectedMajor("all")
    setSelectedGradYear("all")
    setSelectedVisaStatus([])
    setSelectedQuarters([])
    setSortField("")
    setSortDirection("asc")
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
              <div className="bg-slate-900 p-2 rounded-lg">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">UCLA Recruitment Platform</h1>
                <p className="text-sm text-slate-500">Recruiter Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                <p className="text-xs text-slate-500">{user.profile?.company || "Company"}</p>
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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900">{students.length}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Tesla Applicants</p>
                  <p className="text-3xl font-bold text-slate-900">{teslaData.length}</p>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Students Hired</p>
                  <p className="text-3xl font-bold text-slate-900">{hiringRecords.length}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Hiring Rate</p>
                  <p className="text-3xl font-bold text-slate-900">
                    {students.length > 0 ? ((hiringRecords.length / students.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="students" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="students" className="flex items-center space-x-2 font-medium">
              <Users className="h-4 w-4" />
              <span>Student Database</span>
            </TabsTrigger>
            <TabsTrigger value="tesla" className="flex items-center space-x-2 font-medium">
              <Building2 className="h-4 w-4" />
              <span>Tesla Data</span>
            </TabsTrigger>
            <TabsTrigger value="hired" className="flex items-center space-x-2 font-medium">
              <UserCheck className="h-4 w-4" />
              <span>Hired ({hiringRecords.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            {/* Search and Filters */}
            <Card className="shadow-lg border-0 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Search className="h-5 w-5" />
                      <span>Search & Filter Students</span>
                    </CardTitle>
                    <CardDescription>Find the perfect candidates using advanced search and filtering</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      <Filter className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Student Name</Label>
                    <Input
                      placeholder="Search by name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Major</Label>
                    <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Majors</SelectItem>
                        {MAJOR_OPTIONS.map((major) => (
                          <SelectItem key={major} value={major}>
                            {major}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Graduation Year</Label>
                    <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {GRADUATION_YEARS.map((year) => (
                          <SelectItem key={year.value} value={year.value}>
                            {year.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Visa Status</Label>
                    <MultiSelect
                      options={VISA_STATUS_OPTIONS}
                      selected={selectedVisaStatus}
                      onChange={setSelectedVisaStatus}
                      placeholder="Select visa status..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Quarter Available</Label>
                    <MultiSelect
                      options={QUARTERS}
                      selected={selectedQuarters}
                      onChange={setSelectedQuarters}
                      placeholder="Select quarters..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Student Results Table */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Student Database ({filteredStudents.length})</CardTitle>
                    <CardDescription>
                      {filteredStudents.length} of {students.length} students match your criteria
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("name")}
                            className="font-medium text-left p-0 h-auto"
                          >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("email")}
                            className="font-medium text-left p-0 h-auto"
                          >
                            Email
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("major")}
                            className="font-medium text-left p-0 h-auto"
                          >
                            Major
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th>Secondary Major</th>
                        <th>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSort("graduation")}
                            className="font-medium text-left p-0 h-auto"
                          >
                            Graduation
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </Button>
                        </th>
                        <th>Visa Status</th>
                        <th>Quarter Available</th>
                        <th>Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="font-medium">{student.full_name}</td>
                          <td className="text-slate-600">{student.email}</td>
                          <td>{student.profile?.major || "-"}</td>
                          <td>{student.profile?.secondary_major || "-"}</td>
                          <td>
                            {student.profile?.graduation_year
                              ? GRADUATION_YEARS.find((y) => y.value === student.profile.graduation_year)?.label ||
                                student.profile.graduation_year
                              : "-"}
                          </td>
                          <td>
                            {student.profile?.visa_status ? (
                              <div className="flex flex-wrap gap-1">
                                {student.profile.visa_status.split(",").map((status: string) => (
                                  <Badge key={status} variant="secondary" className="text-xs">
                                    {VISA_STATUS_OPTIONS.find((v) => v.value === status)?.label || status}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>-</td>
                          <td>
                            {student.profile?.resume_url ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(student.profile.resume_url, "_blank")}
                              >
                                View
                              </Button>
                            ) : (
                              <span className="text-slate-400">No resume</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredStudents.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
                      <p className="text-slate-500">Try adjusting your search criteria or filters</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tesla">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">T</span>
                  </div>
                  <span>Tesla Resume Database ({teslaData.length})</span>
                </CardTitle>
                <CardDescription>
                  Students who have submitted their resumes for Tesla internship opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Major</th>
                        <th>Secondary Major</th>
                        <th>Graduation</th>
                        <th>Visa Status</th>
                        <th>Quarter Available</th>
                        <th>Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teslaData.map((applicant) => (
                        <tr key={applicant.id}>
                          <td className="font-medium">
                            {applicant.first_name} {applicant.last_name}
                          </td>
                          <td className="text-slate-600">{applicant.ucla_email}</td>
                          <td>{applicant.primary_major}</td>
                          <td>{applicant.secondary_major || "-"}</td>
                          <td>{applicant.grad_year}</td>
                          <td>
                            <Badge variant="secondary" className="text-xs">
                              {applicant.visa_status}
                            </Badge>
                          </td>
                          <td>{applicant.cycles_available}</td>
                          <td>
                            {applicant.resume_url ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(applicant.resume_url!, "_blank")}
                              >
                                View
                              </Button>
                            ) : (
                              <span className="text-slate-400">No resume</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hired">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <UserCheck className="h-5 w-5" />
                  <span>Hired Students ({hiringRecords.length})</span>
                </CardTitle>
                <CardDescription>Students you have marked as hired for various positions and cycles</CardDescription>
              </CardHeader>
              <CardContent>
                {hiringRecords.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No hired students yet</h3>
                    <p className="text-slate-500">Start marking students as hired to track your recruitment progress</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Position</th>
                          <th>Cycle</th>
                          <th>Hire Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hiringRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="font-medium">{record.student_name}</td>
                            <td className="text-slate-600">{record.student_email}</td>
                            <td>{record.position_title || "Not specified"}</td>
                            <td>{record.cycle}</td>
                            <td>{new Date(record.hire_date).toLocaleDateString()}</td>
                            <td>
                              <Badge className="bg-green-600 capitalize">{record.status}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
