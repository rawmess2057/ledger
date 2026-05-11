"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Zap,
  Target,
  Clock,
  FileQuestion,
  TrendingUp,
  Award,
  Users,
  ArrowRight,
  CheckCircle2,
  Play,
  Star,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Card } from "@/components/ui/Card";

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-pattern">
      <div className="absolute inset-0 gradient-primary opacity-30"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-teal/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-teal/20 border border-teal/30 rounded-full px-4 py-2 mb-8">
          <Zap className="w-4 h-4 text-teal" />
          <span className="text-teal text-sm font-medium">AI-Powered CA Practice Platform</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Master the Ledger.<br />
          <span className="gradient-text">Pass ICAN.</span><br />
          Live the Dream.
        </h1>

        <p className="text-xl text-slate-light max-w-2xl mx-auto mb-10">
          The intelligent practice platform that adapts to your learning style,
          generates personalized quizzes, and provides instant AI-powered feedback
          to help you ace your CA exams.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link href="/dashboard">
            <Button size="lg" className="group">
              Start Free Diagnostic
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button variant="secondary" size="lg">
            <Play className="w-5 h-5" />
            Watch Demo
          </Button>
        </div>

        <div className="flex items-center justify-center gap-8 text-sm text-slate">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>500+ practice questions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>24/7 AI feedback</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Features() {
  const features = [
    {
      icon: FileQuestion,
      title: "AI Quiz Generator",
      description: "Generate unlimited personalized quizzes based on your weak areas and learning pace.",
    },
    {
      icon: Target,
      title: "Smart Study Planner",
      description: "AI-generated weekly plans that adapt to your exam date and daily study hours.",
    },
    {
      icon: Clock,
      title: "Instant Feedback",
      description: "Get detailed step-by-step explanations with ICAN examiner-style insights.",
    },
    {
      icon: TrendingUp,
      title: "Progress Analytics",
      description: "Track mastery per topic with beautiful visualizations and predicted readiness scores.",
    },
    {
      icon: Award,
      title: "Realistic Mock Exams",
      description: "Full-length timed mocks with real CBT interface and detailed performance reports.",
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow CA students, share tips, and stay motivated together.",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Everything You Need to Ace ICAN</h2>
          <p className="text-slate-light text-lg max-w-2xl mx-auto">
            Built by CA experts, powered by AI, designed to help you practice smarter.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:border-teal/30">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal/20 to-emerald-500/20 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-light">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: "Take Diagnostic Test",
      description: "Complete a 20-minute assessment to identify your current level and weak areas.",
    },
    {
      step: 2,
      title: "Get Your AI Plan",
      description: "Receive a personalized study plan tailored to your exam date and available hours.",
    },
    {
      step: 3,
      title: "Practice Daily",
      description: "Solve AI-generated quizzes, get instant feedback, and track your progress.",
    },
    {
      step: 4,
      title: "Ace Your Exam",
      description: "Take full-length mock exams and walk into your ICAN exam with confidence.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-navy-light/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How Ledger Works</h2>
          <p className="text-slate-light text-lg">Simple steps to transform your CA preparation</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center mx-auto mb-6 text-navy font-bold text-2xl">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-slate-light">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-teal to-transparent"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      name: "Priya Thapa",
      role: "CA Foundation Student",
      content: "Ledger helped me improve from 45% to 78% in accounting within 2 months. The AI explanations are incredibly detailed!",
      rating: 5,
    },
    {
      name: "Rahul Shrestha",
      role: "Application Level Student",
      content: "The mock exams feel just like the real ICAN tests. My confidence has skyrocketed since using this platform.",
      rating: 5,
    },
    {
      name: "Sita Kumari",
      role: "Working Professional",
      content: "As an articleship student, I barely have time. Ledger's smart planner fits perfectly into my schedule.",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Trusted by 500+ CA Students</h2>
          <p className="text-slate-light text-lg">Join thousands of successful ICA aspirants</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-light mb-6">&quot;{testimonial.content}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
                  <span className="text-navy font-bold">{testimonial.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{testimonial.name}</p>
                  <p className="text-sm text-slate">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto gradient-primary rounded-3xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Master the Ledger?</h2>
        <p className="text-lg text-slate-light mb-8 max-w-xl mx-auto">
          Join 500+ CA students who are already practicing smarter, not harder.
          Your ICAN success story starts here.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              Start Your Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="lg" className="text-white hover:text-teal">
            View Pricing
          </Button>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-slate/10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal to-emerald-400 flex items-center justify-center">
                <span className="text-navy font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-bold text-white">Ledger</span>
            </div>
            <p className="text-slate-light text-sm">
              AI-powered practice platform for CA students preparing for ICAN exams.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-slate">
              <li><Link href="/practice" className="hover:text-teal">Practice</Link></li>
              <li><Link href="/mocks" className="hover:text-teal">Mock Exams</Link></li>
              <li><Link href="/planner" className="hover:text-teal">Study Planner</Link></li>
              <li><Link href="/progress" className="hover:text-teal">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-slate">
              <li><Link href="/resources" className="hover:text-teal">Study Materials</Link></li>
              <li><a href="#" className="hover:text-teal">ICAN Syllabus</a></li>
              <li><a href="#" className="hover:text-teal">Past Papers</a></li>
              <li><a href="#" className="hover:text-teal">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate">
              <li><a href="#" className="hover:text-teal">About Us</a></li>
              <li><a href="#" className="hover:text-teal">Contact</a></li>
              <li><a href="#" className="hover:text-teal">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-teal">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate/10">
          <p className="text-sm text-slate">© 2026 Ledger. All rights reserved.</p>
          <p className="text-sm text-slate mt-4 md:mt-0">
            Built with ❤️ for CA students in Nepal
          </p>
        </div>
      </div>
    </footer>
  );
}