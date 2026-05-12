"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  User,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleGuestLogin = async () => {
    setError("");
    setGuestLoading(true);
    try {
      await api.guestLogin();
      await refreshUser();
      router.push("/dashboard");
    } catch {
      setError("Guest login failed. Please try again.");
    } finally {
      setGuestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    if (!email) {
      setError("Please enter your email");
      setSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setSubmitting(false);
      return;
    }

    const result = await authLogin(email, password);
    if (result) {
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1000);
    } else {
      setError("Invalid email or password");
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 grid-pattern">
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/5 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
              <span className="text-navy font-bold text-xl">L</span>
            </div>
            <span className="text-2xl font-bold text-white">Ledger</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-light">Sign in to continue your CA preparation</p>
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
              <span className="text-emerald-400 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-navy border border-slate/20 rounded-xl focus:outline-none focus:border-teal transition-colors"
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded bg-navy border-slate/20" />
                <span className="text-slate">Remember me</span>
              </label>
              <a href="#" className="text-teal hover:underline">Forgot password?</a>
            </div>

            <Button type="submit" className="w-full" disabled={submitting || success !== ""}>
              {submitting ? (
                <span className="animate-pulse">Signing in...</span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-teal hover:underline">
              Sign up free
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-slate/10">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleGuestLogin}
              disabled={guestLoading}
            >
              {guestLoading ? (
                <span className="animate-pulse">Entering as guest...</span>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Continue as Demo User
                </>
              )}
            </Button>
            <p className="text-xs text-slate text-center mt-3">
              No account needed — explore all features with sample data
            </p>
          </div>
        </Card>

        <p className="text-center text-sm text-slate mt-6">
          <Link href="/" className="hover:text-teal">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}