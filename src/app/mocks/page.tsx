"use client";

import { useState, useEffect } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/api";
import Link from "next/link";
import {
  Play,
  Clock,
  FileText,
  Target,
  Award,
  BookOpen,
  Brain,
  Sparkles,
  GraduationCap,
  Loader2,
  BarChart3,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MockTestItem {
  id: string;
  title: string;
  level: string;
  subject?: string;
  duration_minutes: number;
  total_marks: number;
  question_count: number;
}

const levels = ["CAP-II", "CAP-I", "CAP-III", "MEMBERSHIP"];
const subjectMap: Record<string, string> = {
  "Advanced Accounting": "Advanced Accounting",
  "Audit and Assurance": "Audit and Assurance",
  "Corporate and Other Laws": "Corporate and Other Laws",
};

function MocksContent() {
  const [selectedLevel, setSelectedLevel] = useState("CAP-II");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [mockTests, setMockTests] = useState<MockTestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMockTests() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getMockTests(selectedLevel, selectedSubject || undefined);
        setMockTests(data || []);
      } catch (e) {
        console.error("Failed to fetch mock tests:", e);
        setError("Could not load mock tests. Make sure the backend is running.");
        setMockTests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMockTests();
  }, [selectedLevel, selectedSubject]);

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Mock Exams" }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Mock Exams</h1>
          <p className="text-sm text-slate-light">Test with real CAP exam papers and suggested answers</p>
        </div>
      </div>

      <div className="flex gap-2 md:gap-3 mb-4 overflow-x-auto pb-2">
        {levels.map((level) => (
          <Button
            key={level}
            variant={selectedLevel === level ? "default" : "secondary"}
            size="sm"
            onClick={() => {
              setSelectedLevel(level);
              setSelectedSubject(null);
            }}
          >
            <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
            {level}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        <Button
          variant={!selectedSubject ? "default" : "secondary"}
          size="sm"
          onClick={() => setSelectedSubject(null)}
        >
          All Papers
        </Button>
        {Object.entries(subjectMap).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedSubject === key ? "default" : "secondary"}
            size="sm"
            onClick={() => setSelectedSubject(key)}
          >
            <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
            {label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-teal animate-spin" />
            <p className="text-slate">Loading mock tests...</p>
          </div>
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <p className="text-slate mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Card>
      ) : mockTests.length === 0 ? (
        <Card className="p-8 md:p-12 text-center">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="w-7 h-7 md:w-8 md:h-8 text-teal" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold mb-2">No Mock Tests Available</h3>
          <p className="text-sm text-slate-light">
            {selectedLevel} mock tests for {selectedSubject || "this level"} have not been added yet.
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {mockTests.map((test) => (
            <Card key={test.id} className="p-4 md:p-6 hover:border-teal/30 transition-all">
              <div className="flex items-start justify-between mb-3 md:mb-4 gap-2">
                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm md:text-base">{test.title}</h3>
                    <p className="text-xs text-slate">{test.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-teal/20 px-2 py-1 rounded-full shrink-0">
                  <span className="text-xs text-teal font-medium">{test.level}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-slate mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 md:w-4 md:h-4" />
                  {Math.floor(test.duration_minutes / 60)}h {test.duration_minutes % 60}m
                </div>
                <div className="flex items-center gap-1">
                  <ListChecks className="w-3 h-3 md:w-4 md:h-4" />
                  {test.question_count} Questions
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3 md:w-4 md:h-4" />
                  {test.total_marks} Marks
                </div>
              </div>

              <Link href={`/mock-exam/${test.id}`}>
                <Button className="w-full">
                  <Play className="w-4 h-4" />
                  Start Mock Exam
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
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
