"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Calendar,
  GraduationCap,
} from "lucide-react";

const levels = [
  { value: "foundation", label: "Foundation", desc: "6 months preparation" },
  { value: "application", label: "Application", desc: "9 months preparation" },
  { value: "advisory", label: "Advisory", desc: "Advanced level" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    level: "foundation" as "foundation" | "application" | "advisory",
    examDate: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    setError("");
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone) {
        setError("Please fill in all fields");
        return;
      }
      if (!formData.email.includes("@")) {
        setError("Please enter a valid email");
        return;
      }
    }
    if (step === 2) {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.examDate) {
      setError("Please select your exam date");
      return;
    }

    const result = await register(formData);
    if (result) {
      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 grid-pattern">
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
              <span className="text-navy font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold text-white">Ledger</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Create Your Account</h1>
          <p className="text-slate-light">Start your CA preparation journey today</p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                  step >= s ? "bg-teal text-navy" : "bg-navy-light text-slate"
                )}
              >
                {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={cn(
                    "w-16 h-0.5 mx-2",
                    step > s ? "bg-teal" : "bg-slate/20"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Card className="p-8">
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-6">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-400 text-sm">Account created! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="your@email.com"
                      className="w-full pl-12 pr-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full pl-12 pr-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <Button type="button" className="w-full" onClick={handleNextStep}>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => updateField("password", e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-12 pr-12 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-slate" />
                      ) : (
                        <Eye className="w-5 h-5 text-slate" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField("confirmPassword", e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full pl-12 pr-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="button" className="flex-1" onClick={handleNextStep}>
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    CA Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {levels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => updateField("level", level.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center transition-all",
                          formData.level === level.value
                            ? "border-teal bg-teal/10"
                            : "border-slate/20 hover:border-teal/50"
                        )}
                      >
                        <p className="font-semibold">{level.label}</p>
                        <p className="text-xs text-slate mt-1">{level.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Target Exam Date
                  </label>
                  <input
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => updateField("examDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading || success}>
                    {isLoading ? (
                      <span className="animate-pulse">Creating Account...</span>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm text-slate">
            Already have an account?{" "}
            <Link href="/login" className="text-teal hover:underline">
              Sign in
            </Link>
          </div>
        </Card>

        <p className="text-center text-sm text-slate mt-6">
          <Link href="/" className="hover:text-teal">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}