"use client";

import { useState } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import Link from "next/link";
import {
  Play,
  Clock,
  FileText,
  Target,
  Award,
  Calendar,
  ChevronRight,
  BookOpen,
  Brain,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mockExams = [
  {
    id: "1",
    title: "Foundation Mock Test 1",
    description: "Complete Foundation syllabus covering all 4 papers",
    duration: 180,
    questions: 100,
    marks: 100,
    difficulty: "medium",
    completed: false,
    bestScore: null,
  },
  {
    id: "2",
    title: "Paper 1 - Accounting",
    description: "Financial accounting, cost accounting, and fundamentals",
    duration: 120,
    questions: 60,
    marks: 60,
    difficulty: "medium",
    completed: false,
    bestScore: null,
  },
  {
    id: "3",
    title: "Paper 2 - Assurance & IS",
    description: "Auditing, attestation, and information systems",
    duration: 90,
    questions: 50,
    marks: 50,
    difficulty: "hard",
    completed: true,
    bestScore: 72,
  },
  {
    id: "4",
    title: "Paper 3 - Business & Finance",
    description: "Business mathematics, statistics, and financial management",
    duration: 120,
    questions: 60,
    marks: 60,
    difficulty: "medium",
    completed: false,
    bestScore: null,
  },
  {
    id: "5",
    title: "Paper 4 - Law & Taxation",
    description: "Business law, ethics, and Nepalese tax system",
    duration: 150,
    questions: 75,
    marks: 75,
    difficulty: "hard",
    completed: true,
    bestScore: 58,
  },
  {
    id: "6",
    title: "Weak Areas Focus Test",
    description: "AI-generated test focusing on your weak topics",
    duration: 60,
    questions: 30,
    marks: 30,
    difficulty: "medium",
    completed: false,
    bestScore: null,
    isAI: true,
  },
];

const recentAttempts = [
  { title: "Paper 2 - Assurance & IS", score: 72, date: "2026-05-08", time: "1h 45m" },
  { title: "Foundation Mock Test 1", score: 55, date: "2026-05-06", time: "2h 30m" },
  { title: "Paper 4 - Law & Taxation", score: 58, date: "2026-05-04", time: "2h 10m" },
];

function MocksContent() {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "full" | "paper" | "ai">("all");

  const filteredExams = mockExams.filter((exam) => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "full") return exam.title.includes("Foundation");
    if (selectedCategory === "paper") return exam.title.startsWith("Paper");
    if (selectedCategory === "ai") return exam.isAI;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Exams" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Mock Exams</h1>
          <p className="text-sm text-slate-light">Test your knowledge with realistic ICAN-style exams</p>
        </div>
        <Link href="/quiz?mode=mock">
          <Button className="w-full sm:w-auto">
            <Zap className="w-4 h-4" />
            AI Generate Mock
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="p-4 md:p-6 bg-gradient-to-br from-teal/20 to-emerald-500/20 border border-teal/30">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-teal/20 flex items-center justify-center">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-teal" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-light">Best Score</p>
              <p className="text-xl md:text-2xl font-bold">72%</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate">Paper 2 - Assurance & IS</p>
        </Card>

        <Card className="p-4 md:p-6">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 md:w-6 md:h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-light">Exams Taken</p>
              <p className="text-xl md:text-2xl font-bold">3</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate">Last attempt: May 8, 2026</p>
        </Card>

        <Card className="p-4 md:p-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 md:w-6 md:h-6 text-violet-400" />
            </div>
            <div>
              <p className="text-xs md:text-sm text-slate-light">Avg. Time</p>
              <p className="text-xl md:text-2xl font-bold">2h 8m</p>
            </div>
          </div>
          <p className="text-xs md:text-sm text-slate">Per exam completion</p>
        </Card>
      </div>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {[
          { key: "all", label: "All Exams" },
          { key: "full", label: "Full Tests" },
          { key: "paper", label: "Paper-wise" },
          { key: "ai", label: "AI Generated" },
        ].map((cat) => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedCategory(cat.key as any)}
          >
            {cat.label}
          </Button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        {filteredExams.map((exam) => (
          <Card key={exam.id} className="p-4 md:p-6">
            <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  exam.title.includes("Foundation") ? "bg-violet-500/20" :
                  exam.isAI ? "bg-teal/20" : "bg-blue-500/20"
                }`}>
                  {exam.isAI ? (
                    <Brain className="w-5 h-5 md:w-6 md:h-6 text-teal" />
                  ) : (
                    <FileText className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold flex items-center gap-2 text-sm md:text-base">
                    {exam.title}
                    {exam.isAI && <span className="text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full shrink-0">AI</span>}
                  </h3>
                  <p className="text-xs md:text-sm text-slate truncate">{exam.description}</p>
                </div>
              </div>
              {exam.completed && exam.bestScore && (
                <div className={`text-base md:text-lg font-bold shrink-0 ${exam.bestScore >= 70 ? "text-emerald-400" : exam.bestScore >= 50 ? "text-amber-400" : "text-red-400"}`}>
                  {exam.bestScore}%
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-slate mb-3 md:mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                {Math.floor(exam.duration / 60)}h {exam.duration % 60}m
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3 h-3 md:w-4 md:h-4" />
                {exam.questions} Q
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3 md:w-4 md:h-4" />
                {exam.marks} marks
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                exam.difficulty === "hard" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {exam.difficulty}
              </span>
            </div>

            <div className="flex gap-2 md:gap-3">
              {exam.completed ? (
                <>
                  <Button variant="secondary" size="sm" className="flex-1 text-xs md:text-sm">
                    <Play className="w-3 h-3 md:w-4 md:h-4" />
                    Retake
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs md:text-sm">
                    Report
                  </Button>
                </>
              ) : (
                <Link href={`/quiz?exam=${exam.id}`} className="flex-1">
                  <Button size="sm" className="w-full text-xs md:text-sm">
                    <Play className="w-3 h-3 md:w-4 md:h-4" />
                    Start Exam
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">Recent Attempts</h2>
        <div className="space-y-3 md:space-y-4">
          {recentAttempts.map((attempt, index) => (
            <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-navy rounded-xl gap-2">
              <div className="flex items-center gap-2 md:gap-4 min-w-0">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{attempt.title}</p>
                  <p className="text-xs md:text-sm text-slate">{attempt.date} • {attempt.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <span className={cn(
                  "text-base md:text-xl font-bold",
                  attempt.score >= 70 ? "text-emerald-400" : attempt.score >= 50 ? "text-amber-400" : "text-red-400"
                )}>
                  {attempt.score}%
                </span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-slate" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function MocksPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="md:ml-64 pt-16 pb-24 md:pb-8 px-4 md:px-6">
        <ProtectedRoute>
          <MocksContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}