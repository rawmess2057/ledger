"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Hero, Features, HowItWorks, Testimonials, CTASection, Footer } from "@/components/sections";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-slate/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
              <span className="text-navy font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-white">Ledger</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate hover:text-teal transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate hover:text-teal transition-colors">How It Works</a>
            <a href="#testimonials" className="text-slate hover:text-teal transition-colors">Reviews</a>
            {!isAuthenticated && (
              <>
                <Link href="/login" className="text-slate hover:text-teal transition-colors">Sign In</Link>
                <Link href="/register" className="text-teal hover:underline">Sign Up</Link>
              </>
            )}
          </nav>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="sm">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/register">
              <button className="bg-teal text-navy font-medium px-4 py-2 rounded-xl hover:bg-teal-dark transition-colors">
                Get Started
              </button>
            </Link>
          )}
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}