import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAppContext } from "../context/AppContext";
import { toast } from "sonner";
import { Activity, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login as apiLogin } from "../api/login";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [employeecode, setEmployeecode] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ employeecode: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors = { employeecode: "", password: "" };

    if (!employeecode.trim()) {
      newErrors.employeecode = "Employee code is required";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return !newErrors.employeecode && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call backend login API
      const response: any = await apiLogin({ employeecode, password });
      console.log("Full response:", response);

      // Validate response structure
      if (!response) {
        throw new Error("No response from server");
      }

      // Check if response has data property (axios response structure)
      const userData = response.data ? response.data : response;
      // console.log("User data:", userData._id);

      // Check if token exists
      if (!userData.token) {
        throw new Error("Token not found in response");
      }

      // Only store token in localStorage
      localStorage.setItem("token", userData.token);

      // Update app context with user data
      login({
        id: userData._id || "1",
        email: userData.email,
        name: userData.name || "User",
        role: "staff",
      });

      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-500 via-blue-800 to-slate-800 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div
        className={`w-full max-w-md relative z-10 transform transition-all duration-1000 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
      >
        {/* Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden hover:border-white/40 transition-all duration-500">
          {/* Header Section */}
          <div className="relative p-8 pb-6 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border-b border-white/10">
            <div
              className={`flex items-center justify-center mb-6 transform transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
                <Activity className="h-7 w-7 text-white" />
              </div>
            </div>

            <div
              className={`transform transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            >
              <h1 className="text-3xl font-bold text-white text-center mb-2">
                Hospital Transport
              </h1>
              <p className="text-center text-blue-100 text-sm">
                Smart Logistics Management System
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div
                className={`space-y-2 transform transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <Label
                  htmlFor="employeecode"
                  className="text-white/80 text-sm font-medium"
                >
                  Employee Code
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="employeecode"
                    type="text"
                    placeholder="Enter your employee code"
                    value={employeecode}
                    onChange={(e) => {
                      setEmployeecode(e.target.value);
                      if (errors.employeecode)
                        setErrors({ ...errors, employeecode: "" });
                    }}
                    disabled={isLoading}
                    className={`pl-12 bg-white/5 border transition-all duration-300 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-blue-400 outline-none ${
                      errors.employeecode
                        ? "border-red-500/70 focus:border-red-500"
                        : "border-white/20 hover:border-white/30"
                    }`}
                  />
                </div>
                {errors.employeecode && (
                  <p className="text-red-400 text-sm animate-fadeIn">
                    {errors.employeecode}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div
                className={`space-y-2 transform transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
              >
                <Label
                  htmlFor="password"
                  className="text-white/80 text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-400/60 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    disabled={isLoading}
                    className={`pl-12 pr-12 bg-white/5 border transition-all duration-300 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-blue-400 outline-none ${
                      errors.password
                        ? "border-red-500/70 focus:border-red-500"
                        : "border-white/20 hover:border-white/30"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400/60 hover:text-blue-400 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm animate-fadeIn">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform mt-8 ${
                  isLoading
                    ? "scale-95 opacity-80"
                    : "hover:scale-105 active:scale-95"
                } ${mounted ? "opacity-100 translate-y-0 delay-400" : "opacity-0 translate-y-4"}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="text-center text-sm text-white/70">
                New here?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="text-white underline hover:text-white"
                >
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Text */}
        <div
          className={`text-center mt-6 transform transition-all duration-700 delay-600 ${mounted ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-white/60 text-sm">
            Patient Transport & Equipment Management
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-blob {
          animation: blob 8s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }

        input:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
