"use client";

import { useState } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { mockSubjects } from "@/data/mockData";
import Link from "next/link";
import {
  Play,
  Shuffle,
  Target,
  Bookmark,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Calculator,
  ShieldCheck,
  TrendingUp,
  FileQuestion,
  Award,
  Sparkles,
} from "lucide-react";

const subjectIcons: Record<string, any> = {
  accounting: Calculator,
  assurance: ShieldCheck,
  "business-finance": TrendingUp,
  law: FileQuestion,
  taxation: Award,
};

const topics = {
  accounting: [
    { name: "Journal Entries", questions: 45, difficulty: "medium" },
    { name: "Bank Reconciliation", questions: 30, difficulty: "hard" },
    { name: "Depreciation", questions: 35, difficulty: "medium" },
    { name: "Final Accounts", questions: 50, difficulty: "hard" },
    { name: "Consignment Accounts", questions: 25, difficulty: "medium" },
    { name: "Joint Venture", questions: 20, difficulty: "medium" },
    { name: "Branch Accounting", questions: 30, difficulty: "hard" },
    { name: "Departmental Accounts", questions: 25, difficulty: "medium" },
  ],
  assurance: [
    { name: "Audit Planning", questions: 40, difficulty: "hard" },
    { name: "Audit Sampling", questions: 35, difficulty: "medium" },
    { name: "Internal Control", questions: 45, difficulty: "medium" },
    { name: "Verification", questions: 50, difficulty: "hard" },
  ],
  "business-finance": [
    { name: "Time Value of Money", questions: 35, difficulty: "medium" },
    { name: "Ratio Analysis", questions: 40, difficulty: "hard" },
    { name: "Fund Flow Statement", questions: 30, difficulty: "medium" },
    { name: "Cash Flow Statement", questions: 35, difficulty: "hard" },
  ],
  law: [
    { name: "Contract Law", questions: 50, difficulty: "medium" },
    { name: "Company Law", questions: 45, difficulty: "hard" },
    { name: "Negotiable Instruments", questions: 30, difficulty: "medium" },
    { name: "Sale of Goods", questions: 35, difficulty: "medium" },
  ],
  taxation: [
    { name: "Income Tax", questions: 55, difficulty: "hard" },
    { name: "VAT", questions: 45, difficulty: "medium" },
    { name: "Tax Planning", questions: 40, difficulty: "hard" },
    { name: "TDS", questions: 30, difficulty: "medium" },
  ],
};

function PracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<"quiz" | "homework" | "daily">("quiz");

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Practice" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Practice Center</h1>
          <p className="text-slate-light">Choose your subject and start practicing</p>
        </div>
        <div className="flex gap-3">
          <Button variant={practiceMode === "quiz" ? "default" : "secondary"} onClick={() => setPracticeMode("quiz")}>
            <Bookmark className="w-4 h-4" />
            Quiz Mode
          </Button>
          <Button variant={practiceMode === "homework" ? "default" : "secondary"} onClick={() => setPracticeMode("homework")}>
            <Filter className="w-4 h-4" />
            Homework Set
          </Button>
          <Button variant={practiceMode === "daily" ? "default" : "secondary"} onClick={() => setPracticeMode("daily")}>
            <Sparkles className="w-4 h-4" />
            Daily Practice
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Select Subject</h3>
            <div className="space-y-2">
              {mockSubjects.map((subject) => {
                const Icon = subjectIcons[subject.id] || Calculator;
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      selectedSubject === subject.id
                        ? "bg-teal/20 text-teal border border-teal"
                        : "bg-navy hover:bg-navy-light text-white"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-sm">{subject.name}</p>
                      <p className="text-xs text-slate">{subject.questions} questions</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!selectedSubject ? (
            <Card className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-teal" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Select a Subject</h3>
              <p className="text-slate-light">Choose a subject from the left to see available topics</p>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    {mockSubjects.find((s) => s.id === selectedSubject)?.name} Topics
                  </h2>
                  <Link href={`/quiz?subject=${selectedSubject}`}>
                    <Button>
                      <Shuffle className="w-4 h-4" />
                      Random Mix
                    </Button>
                  </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {(topics[selectedSubject as keyof typeof topics] || []).map((topic, index) => (
                    <div
                      key={index}
                      className="p-4 bg-navy rounded-xl hover:bg-navy-light transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium mb-1">{topic.name}</h4>
                          <p className="text-sm text-slate">{topic.questions} questions available</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            topic.difficulty === "hard" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-400"
                          }`}>
                            {topic.difficulty}
                          </span>
                          <Link href={`/quiz?subject=${selectedSubject}&topic=${encodeURIComponent(topic.name)}`}>
                            <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Play className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 gradient-primary border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Daily Practice Challenge</h3>
                    <p className="text-slate-light">Get 20 AI-generated questions based on your weak areas</p>
                  </div>
                  <Link href="/quiz?mode=daily">
                    <Button size="lg">
                      <Sparkles className="w-5 h-5" />
                      Start Now
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Recent Performance - {mockSubjects.find((s) => s.id === selectedSubject)?.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-navy rounded-xl">
                    <span className="text-sm">Journal Entries</span>
                    <div className="flex items-center gap-4">
                      <Progress value={75} className="w-24" />
                      <span className="text-emerald-400 font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-navy rounded-xl">
                    <span className="text-sm">Depreciation</span>
                    <div className="flex items-center gap-4">
                      <Progress value={60} className="w-24" />
                      <span className="text-amber-400 font-medium">60%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-navy rounded-xl">
                    <span className="text-sm">Bank Reconciliation</span>
                    <div className="flex items-center gap-4">
                      <Progress value={35} className="w-24" />
                      <span className="text-red-400 font-medium">35%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-16 pb-24 md:pb-8 px-6">
        <ProtectedRoute>
          <PracticeContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}