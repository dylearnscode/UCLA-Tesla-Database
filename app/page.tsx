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
import { GraduationCap, Building2, Loader2 } from "lucide-react"
import { signUp, login, getCurrentUser } from "@/lib/auth"

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
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser()
    if (user) {
      if (user.user_type === "student") {
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
    setLoading(true)

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Email and password are required")
      setLoading(false)
      return
    }

    if (!isLogin) {
      if (userType === "student" && (!formData.fullName || !formData.school)) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }
      if (userType === "recruiter" && (!formData.fullName || !formData.company || !formData.companyKey)) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }
      if (userType === "recruiter" && formData.companyKey.length !== 9) {
        setError("Company key must be exactly 9 characters")
        setLoading(false)
        return
      }
    }

    try {
      if (isLogin) {
        // Login logic
        const { user, error: loginError } = await login({
          email: formData.email,
          password: formData.password,
        })

        if (loginError) {
          setError(loginError.message)
          setLoading(false)
          return
        }

        localStorage.setItem("currentUser", JSON.stringify(user))

        if (user?.user_type === "student") {
          router.push("/student-dashboard")
        } else {
          router.push("/recruiter-dashboard")
        }
      } else {
        // Sign up logic
        const { user, error: signUpError } = await signUp({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          userType,
          school: formData.school,
          company: formData.company,
          companyKey: formData.companyKey,
        })

        if (signUpError) {
          setError(signUpError.message)
          setLoading(false)
          return
        }

        localStorage.setItem("currentUser", JSON.stringify(user))

        if (userType === "student") {
          router.push("/student-dashboard")
        } else {
          router.push("/recruiter-dashboard")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="w-16 h-12 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">UCLA</span>
            </div>
            <div className="text-2xl font-bold text-gray-400">×</div>
            <div className="w-12 h-12 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">T</span>
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    "Login"
                  )}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
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
                    disabled={loading}
                  />
                </div>

                {userType === "student" ? (
                  <div className="space-y-2">
                    <Label htmlFor="school">School</Label>
                    <Select onValueChange={(value) => handleInputChange("school", value)} disabled={loading}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your school" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UCLA School of Engineering">UCLA School of Engineering</SelectItem>
                        <SelectItem value="UCLA Computer Science">UCLA Computer Science</SelectItem>
                        <SelectItem value="UCLA Applied Mathematics">UCLA Applied Mathematics</SelectItem>
                        <SelectItem value="UCLA Physics & Astronomy">UCLA Physics & Astronomy</SelectItem>
                        <SelectItem value="Other UCLA School">Other UCLA School</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Select onValueChange={(value) => handleInputChange("company", value)} disabled={loading}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your company" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tesla">Tesla</SelectItem>
                          <SelectItem value="Google">Google</SelectItem>
                          <SelectItem value="Apple">Apple</SelectItem>
                          <SelectItem value="Microsoft">Microsoft</SelectItem>
                          <SelectItem value="Meta">Meta</SelectItem>
                          <SelectItem value="Amazon">Amazon</SelectItem>
                          <SelectItem value="Netflix">Netflix</SelectItem>
                          <SelectItem value="Uber">Uber</SelectItem>
                          <SelectItem value="Airbnb">Airbnb</SelectItem>
                          <SelectItem value="SpaceX">SpaceX</SelectItem>
                        </SelectContent>
                      </Select>
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
                        disabled={loading}
                      />
                      <p className="text-xs text-gray-500">
                        Contact your HR department for your company's sign-in key
                        <br />
                        <strong>Demo keys:</strong> Tesla: d74hf8e09, Google: g83kf9d02, Apple: a92jd8f73
                      </p>
                    </div>
                  </>
                )}

                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
