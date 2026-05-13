"use client";

import { useState, useEffect } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import api from "@/lib/api";
import Link from "next/link";
import {
  Play,
  Shuffle,
  Target,
  Bookmark,
  Clock,
  ChevronRight,
  Filter,
  Calculator,
  ShieldCheck,
  TrendingUp,
  FileQuestion,
  Award,
  Sparkles,
  Loader2,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const subjectIcons: Record<string, any> = {
  accounting: Calculator,
  assurance: ShieldCheck,
  "business-finance": TrendingUp,
  taxation: Award,
  "Corporate Laws": FileQuestion,
  "Advanced Taxation": Calculator,
  "Advanced Accounting": Calculator,
  "Audit and Assurance": ShieldCheck,
  "Corporate and Other Laws": FileQuestion,
  "Business Law": FileQuestion,
  "cap-i": BookOpen,
};

const subjectColors: Record<string, string> = {
  accounting: "from-teal-500 to-emerald-500",
  assurance: "from-blue-500 to-cyan-500",
  "business-finance": "from-violet-500 to-purple-500",
  taxation: "from-rose-500 to-pink-500",
  "Corporate Laws": "from-amber-500 to-orange-500",
  "Advanced Taxation": "from-rose-500 to-pink-500",
  "Advanced Accounting": "from-teal-500 to-emerald-500",
  "Audit and Assurance": "from-blue-500 to-cyan-500",
  "Corporate and Other Laws": "from-amber-500 to-orange-500",
  "Business Law": "from-amber-500 to-orange-500",
  "cap-i": "from-indigo-500 to-blue-500",
};

interface SubjectItem {
  id: string;
  name: string;
  color: string;
  icon: string;
}

interface TopicGroup {
  name: string;
  count: number;
  easy: number;
  medium: number;
  hard: number;
}

function PracticeContent() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState<"quiz" | "homework" | "daily">("quiz");
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [subjectsData, questionsData] = await Promise.all([
          api.getSubjects(),
          api.getQuestions({ limit: 1000 }),
        ]);
        setSubjects(subjectsData || []);
        setQuestions(questionsData || []);
      } catch (error) {
        console.error("Failed to fetch practice data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalQuestions = questions.length;
  const questionsBySubject = questions.reduce<Record<string, any[]>>((acc, q) => {
    const s = q.subject;
    if (!acc[s]) acc[s] = [];
    acc[s].push(q);
    return acc;
  }, {});

  const topicsBySubject = Object.entries(questionsBySubject).reduce<Record<string, TopicGroup[]>>((acc, [subject, qs]) => {
    const grouped = qs.reduce<Record<string, { easy: number; medium: number; hard: number }>>((tacc, q) => {
      const t = q.topic || "General";
      if (!tacc[t]) tacc[t] = { easy: 0, medium: 0, hard: 0 };
      const d = (q.difficulty || "medium") as string;
      if (d === "easy") tacc[t].easy++;
      else if (d === "medium") tacc[t].medium++;
      else tacc[t].hard++;
      return tacc;
    }, {});

    acc[subject] = Object.entries(grouped)
      .map(([name, counts]) => ({
        name,
        count: counts.easy + counts.medium + counts.hard,
        ...counts,
      }))
      .sort((a, b) => b.count - a.count);

    return acc;
  }, {});

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
  const selectedTopics = selectedSubject ? (topicsBySubject[selectedSubject] || []) : [];
  const selectedSubjectQuestionCount = selectedSubject ? (questionsBySubject[selectedSubject]?.length || 0) : 0;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Practice" }]} />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-teal" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-6 md:py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Practice" }]} />

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Practice Center</h1>
          <p className="text-slate-light text-sm">Choose your subject and start practicing</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={practiceMode === "quiz" ? "default" : "secondary"} size="sm" onClick={() => setPracticeMode("quiz")}>
            <Bookmark className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Quiz Mode</span>
            <span className="sm:hidden">Quiz</span>
          </Button>
          <Button variant={practiceMode === "homework" ? "default" : "secondary"} size="sm" onClick={() => setPracticeMode("homework")}>
            <Filter className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Homework Set</span>
            <span className="sm:hidden">HW</span>
          </Button>
          <Button variant={practiceMode === "daily" ? "default" : "secondary"} size="sm" onClick={() => setPracticeMode("daily")}>
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Daily Practice</span>
            <span className="sm:hidden">Daily</span>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 md:gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm md:text-base">Subjects</h3>
              <span className="text-xs text-slate">{totalQuestions} total</span>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {subjects.map((subject) => {
                const Icon = subjectIcons[subject.id] || BookOpen;
                const color = subject.color || subjectColors[subject.id] || "from-teal-500 to-emerald-500";
                const count = questionsBySubject[subject.id]?.length || 0;
                return (
                  <button
                    key={subject.id}
                    onClick={() => setSelectedSubject(subject.id)}
                    className={cn(
                      "w-full flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl transition-all text-sm md:text-base",
                      selectedSubject === subject.id
                        ? "bg-teal/20 text-teal border border-teal"
                        : "bg-navy hover:bg-navy-light text-white"
                    )}
                  >
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-xs md:text-sm truncate">{subject.name}</p>
                      <p className="text-xs text-slate hidden sm:block">{count} questions</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {!selectedSubject ? (
            <Card className="p-8 md:p-12 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-teal/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-7 h-7 md:w-8 md:h-8 text-teal" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Select a Subject</h3>
              <p className="text-slate-light text-sm">Choose a subject from the left to see available topics</p>
            </Card>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <Card className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold">{selectedSubjectData?.name || selectedSubject}</h2>
                    <p className="text-xs md:text-sm text-slate">{selectedSubjectQuestionCount} questions across {selectedTopics.length} topics</p>
                  </div>
                  <Link href={`/quiz?subject=${selectedSubject}`}>
                    <Button size="sm" className="w-full sm:w-auto">
                      <Shuffle className="w-3 h-3 md:w-4 md:h-4" />
                      Random Mix
                    </Button>
                  </Link>
                </div>
                {selectedTopics.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {selectedTopics.map((topic) => {
                      const dominant = topic.hard > topic.medium && topic.hard > topic.easy
                        ? "hard" : topic.medium > topic.easy ? "medium" : "easy";
                      return (
                        <div
                          key={topic.name}
                          className="p-3 md:p-4 bg-navy rounded-xl hover:bg-navy-light transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm md:text-base mb-1 truncate">{topic.name}</h4>
                              <p className="text-xs text-slate">
                                {topic.count} q
                                {topic.easy > 0 && <span className="text-emerald-400 ml-1">{topic.easy}E</span>}
                                {topic.medium > 0 && <span className="text-amber-400 ml-1">{topic.medium}M</span>}
                                {topic.hard > 0 && <span className="text-red-400 ml-1">{topic.hard}H</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={cn(
                                "text-xs px-2 py-0.5 rounded-full",
                                dominant === "hard" ? "bg-red-500/20 text-red-400" :
                                dominant === "medium" ? "bg-amber-500/20 text-amber-400" :
                                "bg-emerald-500/20 text-emerald-400"
                              )}>
                                {dominant}
                              </span>
                              <Link href={`/quiz?subject=${selectedSubject}&topic=${encodeURIComponent(topic.name)}`}>
                                <Button size="sm" variant="ghost" className="p-2">
                                  <Play className="w-3 h-3 md:w-4 md:h-4" />
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 md:py-8 text-slate">
                    <BookOpen className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 opacity-50" />
                    <p>No questions available for this subject yet.</p>
                  </div>
                )}
              </Card>

              <Card className="p-4 md:p-6 gradient-primary border-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base md:text-xl font-semibold mb-1">Daily Practice Challenge</h3>
                    <p className="text-slate-light text-xs md:text-sm">Get 10 practice questions based on your weak areas</p>
                  </div>
                  <Link href="/quiz">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Sparkles className="w-4 h-4" />
                      Start Now
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-4 md:p-6">
                <h3 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">Question Distribution</h3>
                <div className="space-y-2 md:space-y-3">
                  {["easy", "medium", "hard"].map(diff => {
                    const count = questions.filter(q => (q.difficulty || "medium") === diff).length;
                    const pct = totalQuestions > 0 ? (count / totalQuestions) * 100 : 0;
                    return (
                      <div key={diff} className="flex items-center gap-2 md:gap-3">
                        <span className="text-xs md:text-sm text-slate w-12 md:w-16 capitalize">{diff}</span>
                        <div className="flex-1 h-3 md:h-4 bg-navy rounded-lg overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all",
                              diff === "easy" ? "bg-emerald-500" : diff === "medium" ? "bg-amber-500" : "bg-red-500"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate w-8 md:w-12 text-right">{count}</span>
                      </div>
                    );
                  })}
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

      <main className="md:ml-64 pt-16 pb-24 md:pb-8 px-4 md:px-6">
        <ProtectedRoute>
          <PracticeContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}