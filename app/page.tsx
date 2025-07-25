"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Building2 } from "lucide-react"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [userType, setUserType] = useState<"student" | "recruiter">("student")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    school: "",
    company: "",
    companyKey: "",
  })
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("currentUser")
    if (user) {
      const userData = JSON.parse(user)
      if (userData.type === "student") {
        router.push("/student-dashboard")
      } else {
        router.push("/recruiter-dashboard")
      }
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      return
    }

    if (!isLogin) {
      if (userType === "student" && (!formData.fullName || !formData.school)) {
        setError("Please fill in all required fields")
        return
      }
      if (userType === "recruiter" && (!formData.fullName || !formData.company || !formData.companyKey)) {
        setError("Please fill in all required fields")
        return
      }
      if (userType === "recruiter" && formData.companyKey.length !== 9) {
        setError("Company key must be exactly 9 characters")
        return
      }
    }

    try {
      if (isLogin) {
        // Login logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password)

        if (!user) {
          setError("Invalid email or password")
          return
        }

        localStorage.setItem("currentUser", JSON.stringify(user))

        if (user.type === "student") {
          router.push("/student-dashboard")
        } else {
          router.push("/recruiter-dashboard")
        }
      } else {
        // Sign up logic
        const users = JSON.parse(localStorage.getItem("users") || "[]")
        const existingUser = users.find((u: any) => u.email === formData.email)

        if (existingUser) {
          setError("User with this email already exists")
          return
        }

        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          type: userType,
          fullName: formData.fullName,
          ...(userType === "student"
            ? { school: formData.school }
            : { company: formData.company, companyKey: formData.companyKey }),
          createdAt: new Date().toISOString(),
        }

        users.push(newUser)
        localStorage.setItem("users", JSON.stringify(users))
        localStorage.setItem("currentUser", JSON.stringify(newUser))

        if (userType === "student") {
          router.push("/student-dashboard")
        } else {
          router.push("/recruiter-dashboard")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">UCLA Recruitment Platform</CardTitle>
          <CardDescription>Connect UCLA students with top recruiters</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@ucla.edu"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                  <Label>I am a:</Label>
                  <RadioGroup
                    value={userType}
                    onValueChange={(value: "student" | "recruiter") => setUserType(value)}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="flex items-center space-x-2 cursor-pointer">
                        <GraduationCap className="h-4 w-4" />
                        <span>Student</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recruiter" id="recruiter" />
                      <Label htmlFor="recruiter" className="flex items-center space-x-2 cursor-pointer">
                        <Building2 className="h-4 w-4" />
                        <span>Recruiter</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={userType === "student" ? "your.email@ucla.edu" : "recruiter@company.com"}
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                  />
                </div>

                {userType === "student" ? (
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Select onValueChange={(value) => handleInputChange("school", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engineering">UCLA School of Engineering</SelectItem>
                        <SelectItem value="cs">UCLA Computer Science</SelectItem>
                        <SelectItem value="applied-math">UCLA Applied Mathematics</SelectItem>
                        <SelectItem value="physics">UCLA Physics & Astronomy</SelectItem>
                        <SelectItem value="other">Other UCLA School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        placeholder="Google, Apple, Microsoft, etc."
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyKey">Company 9-Digit Sign-in Key</Label>
                      <Input
                        id="companyKey"
                        placeholder="d74hf8e09"
                        maxLength={9}
                        value={formData.companyKey}
                        onChange={(e) => handleInputChange("companyKey", e.target.value)}
                        required
                      />
                      <p className="text-xs text-gray-500">Contact your HR department for your company's sign-in key</p>
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
