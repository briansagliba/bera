import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, LogIn, UserPlus } from "lucide-react";

interface LoginPageProps {
  onLoginSuccess?: (user: any) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess = () => {} }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange =
    (setState: React.Dispatch<React.SetStateAction<any>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
    };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      const user = registeredUsers.find(
        (u: any) =>
          u.email === loginData.email && u.password === loginData.password,
      );

      if (user) {
        onLoginSuccess(user);
        navigate("/");
      } else {
        throw new Error("Invalid email or password.");
      }
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      if (Object.values(registerData).some((val) => !val)) {
        throw new Error("All fields are required.");
      }

      const newUser = { ...registerData, role: "admin" };
      const registeredUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]",
      );
      localStorage.setItem(
        "registeredUsers",
        JSON.stringify([...registeredUsers, newUser]),
      );

      setActiveTab("login");
      setRegisterData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      alert("Registration successful! Please log in.");
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 p-6">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 bg-white">
        <CardHeader className="space-y-4 text-center">
          <img src="/logo2.png" alt="Logo" className="h-20 mx-auto" />
          <CardTitle className="text-2xl font-bold">
            Bilar Emergency Response
          </CardTitle>
          <CardDescription>
            Admin Portal for Emergency Management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "login" | "register")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                <LogIn className="w-4 h-4 mr-1" /> Login
              </TabsTrigger>
              <TabsTrigger value="register">
                <UserPlus className="w-4 h-4 mr-1" /> Register
              </TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" /> {error}
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={loginData.email}
                    onChange={handleInputChange(setLoginData)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={loginData.password}
                    onChange={handleInputChange(setLoginData)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </TabsContent>

            {/* Registration Form */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={registerData.name}
                    onChange={handleInputChange(setRegisterData)}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={registerData.email}
                    onChange={handleInputChange(setRegisterData)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={handleInputChange(setRegisterData)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={registerData.password}
                    onChange={handleInputChange(setRegisterData)}
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={registerData.confirmPassword}
                    onChange={handleInputChange(setRegisterData)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Bilar Emergency Response. All rights
          reserved.
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
