"use client";

import { useState } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { mockSubjects } from "@/data/mockData";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Calendar,
  Flame,
  BookOpen,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Download,
  Share2,
} from "lucide-react";

const performanceData = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 58 },
  { month: "Apr", score: 65 },
  { month: "May", score: 72 },
];

const weakTopics = [
  { topic: "Consolidation Accounting", subject: "Accounting", mastery: 25, trend: -5 },
  { topic: "Bank Reconciliation", subject: "Accounting", mastery: 35, trend: +3 },
  { topic: "NFRS 10", subject: "Assurance", mastery: 30, trend: -2 },
  { topic: "VAT Calculation", subject: "Taxation", mastery: 40, trend: +8 },
  { topic: "Partnership Dissolution", subject: "Accounting", mastery: 28, trend: -1 },
];

const recentActivity = [
  { date: "May 10", subject: "Accounting", topic: "Depreciation", score: 80, type: "quiz" },
  { date: "May 9", subject: "Taxation", topic: "VAT", score: 90, type: "quiz" },
  { date: "May 8", subject: "Business Law", topic: "Contract Law", score: 65, type: "quiz" },
  { date: "May 8", subject: "All", topic: "Mock Test 2", score: 72, type: "mock" },
  { date: "May 6", subject: "Assurance", topic: "Audit Sampling", score: 55, type: "quiz" },
];

function ProgressContent() {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("month");

  const overallMastery = 41;
  const predictedPassProbability = 68;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Progress" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-slate-light">Track your mastery and identify areas for improvement</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button variant="ghost">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 text-center">
          <ProgressRing progress={overallMastery} size={120} strokeWidth={8} />
          <p className="text-slate-light mt-4">Overall Mastery</p>
          <p className="text-sm text-slate">Based on 450+ questions</p>
        </Card>

        <Card className="p-6 text-center">
          <ProgressRing progress={predictedPassProbability} size={120} strokeWidth={8} />
          <p className="text-slate-light mt-4">Pass Probability</p>
          <p className="text-sm text-emerald-400">↑ 12% from last month</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Study Streak</h3>
            <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">7 days</span>
            </div>
          </div>
          <div className="flex justify-between items-end h-20">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 rounded-lg ${i < 7 - new Date().getDay() ? "bg-teal" : "bg-navy-light"}`} style={{ height: `${Math.random() * 40 + 30}px` }} />
                <span className="text-xs text-slate">{day}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="mb-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="weak-areas">Weak Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-6">Performance Trend</h3>
              <div className="h-48 flex items-end justify-between gap-4">
                {performanceData.map((data, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-gradient-to-t from-teal to-emerald-400 rounded-t-lg transition-all"
                      style={{ height: `${data.score}%` }}
                    />
                    <span className="text-sm text-slate">{data.month}</span>
                    <span className="text-xs font-medium text-teal">{data.score}%</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-6">Question Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-navy rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Correct Answers</p>
                      <p className="text-sm text-slate">Last 30 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">156</p>
                    <p className="text-sm text-slate">78% accuracy</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-navy rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Incorrect Answers</p>
                      <p className="text-sm text-slate">Last 30 days</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">44</p>
                    <p className="text-sm text-slate">22% errors</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-navy rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-teal/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-teal" />
                    </div>
                    <div>
                      <p className="font-medium">Questions Attempted</p>
                      <p className="text-sm text-slate">Total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">450</p>
                    <p className="text-sm text-slate">This month: 124</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Subject-wise Mastery</h3>
            <div className="space-y-6">
              {mockSubjects.map((subject) => (
                <div key={subject.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">{subject.name}</p>
                        <p className="text-sm text-slate">{subject.papers} papers • {subject.questions} questions</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={cn(
                        "text-lg font-bold",
                        subject.mastery >= 60 ? "text-emerald-400" : subject.mastery >= 40 ? "text-amber-400" : "text-red-400"
                      )}>
                        {subject.mastery}%
                      </span>
                      <ChevronRight className="w-5 h-5 text-slate" />
                    </div>
                  </div>
                  <Progress value={subject.mastery} className="mb-4" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="weak-areas">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Areas Needing Attention</h3>
              <Button variant="secondary" size="sm">
                <Target className="w-4 h-4" />
                Create Practice Plan
              </Button>
            </div>
            <div className="space-y-4">
              {weakTopics.map((topic, i) => (
                <div key={i} className="p-4 bg-navy rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <Target className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">{topic.topic}</p>
                      <p className="text-sm text-slate">{topic.subject}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-red-400">{topic.mastery}%</span>
                      <span className={cn(
                        "flex items-center gap-1 text-xs",
                        topic.trend > 0 ? "text-emerald-400" : "text-red-400"
                      )}>
                        {topic.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(topic.trend)}%
                      </span>
                    </div>
                    <Button size="sm" variant="ghost">
                      <BookOpen className="w-4 h-4" />
                      Practice
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((activity, i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-navy rounded-xl hover:bg-navy-light transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activity.type === "mock" ? "bg-violet-500/20" : "bg-teal/20"}`}>
                  {activity.type === "mock" ? (
                    <Award className="w-5 h-5 text-violet-400" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-teal" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{activity.topic}</p>
                  <p className="text-sm text-slate">{activity.subject} • {activity.date}</p>
                </div>
              </div>
              <span className={cn(
                "text-lg font-bold",
                activity.score >= 80 ? "text-emerald-400" : activity.score >= 60 ? "text-amber-400" : "text-red-400"
              )}>
                {activity.score}%
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-16 pb-24 md:pb-8 px-6">
        <ProtectedRoute>
          <ProgressContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}