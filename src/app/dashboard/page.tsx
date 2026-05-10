"use client";

import { Sidebar, TopBar, MobileNav } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { mockSubjects, mockRecentActivity, mockStudyPlan } from "@/data/mockData";
import { useStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import {
  TrendingUp,
  Flame,
  Target,
  BookOpen,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  Calculator,
  ShieldCheck,
  TrendingDown,
  FileQuestion,
  Award,
  Calendar,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

function StatCard({ icon: Icon, label, value, trend, color }: {
  icon: any;
  label: string;
  value: string;
  trend?: string;
  color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs ${trend.startsWith("+") ? "text-emerald-400" : "text-red-400"}`}>
            {trend.startsWith("+") ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
      <p className="text-sm text-slate">{label}</p>
    </Card>
  );
}

function DashboardContent() {
  const { user, recordStudySession } = useAuth();
  const { progress } = useStore();
  
  const userStats = user?.stats;
  
  const totalStudyHours = userStats ? Math.floor(userStats.totalStudyMinutes / 60) : 0;
  const studyMinutes = userStats ? userStats.totalStudyMinutes % 60 : 0;
  
  const accuracyRate = userStats && userStats.totalQuestions > 0 
    ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100) 
    : 0;

  const overallMastery = Object.values(progress.subjectMastery).reduce((a, b) => a + b, 0) / Object.keys(progress.subjectMastery).length;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋</h1>
          <p className="text-slate-light">Ready to master the ledger today?</p>
        </div>
        {userStats && (
          <div className="flex items-center gap-2 bg-amber-500/20 px-4 py-2 rounded-full">
            <Flame className="w-5 h-5 text-amber-400" />
            <span className="text-amber-400 font-bold">{userStats.streak} Day Streak</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-1 p-6 flex flex-col items-center justify-center">
          <ProgressRing progress={overallMastery} size={140} strokeWidth={10} />
          <p className="text-center mt-4 text-slate-light">Overall Readiness</p>
          <p className="text-sm text-slate">Based on diagnostic + practice</p>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            icon={BookOpen}
            label="Questions Today"
            value={userStats ? String(userStats.weeklyData[userStats.weeklyData.length - 1]?.questions || 0) : "0"}
            trend="+2"
            color="bg-teal/20 text-teal"
          />
          <StatCard
            icon={Target}
            label="Accuracy Rate"
            value={userStats ? `${accuracyRate}%` : "0%"}
            trend={accuracyRate > 0 ? "+3%" : undefined}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            icon={Clock}
            label="Study Time"
            value={userStats ? `${totalStudyHours}h ${studyMinutes}m` : "0h"}
            trend="+15m"
            color="bg-violet-500/20 text-violet-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Tasks Done"
            value={userStats ? `${userStats.tasksCompleted}/${userStats.tasksTotal}` : "0/0"}
            color="bg-amber-500/20 text-amber-400"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Subject Mastery</h2>
              <Link href="/progress" className="text-sm text-teal hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {mockSubjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center`}>
                        {subject.id === "accounting" && <Calculator className="w-4 h-4 text-white" />}
                        {subject.id === "assurance" && <ShieldCheck className="w-4 h-4 text-white" />}
                        {subject.id === "business-finance" && <TrendingUp className="w-4 h-4 text-white" />}
                        {subject.id === "law" && <FileQuestion className="w-4 h-4 text-white" />}
                        {subject.id === "taxation" && <Award className="w-4 h-4 text-white" />}
                      </div>
                      <span className="font-medium">{subject.name}</span>
                    </div>
                    <span className={subject.mastery >= 60 ? "text-emerald-400" : subject.mastery >= 40 ? "text-amber-400" : "text-red-400"}>
                      {subject.mastery}%
                    </span>
                  </div>
                  <Progress value={subject.mastery} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div>
          <Card className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">Recommended Practice</h2>
            <div className="space-y-3 mb-6">
              {progress.weakTopics.slice(0, 4).map((topic, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-navy rounded-xl">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-red-400" />
                  </div>
                  <span className="text-sm flex-1">{topic}</span>
                  <Link href="/practice">
                    <Button size="sm" variant="ghost" className="text-teal">
                      <Play className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
            <Link href="/practice">
              <Button className="w-full">
                Start Practice Session
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Today&apos;s Study Plan</h2>
            <Link href="/planner" className="text-sm text-teal hover:underline flex items-center gap-1">
              View Calendar <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {mockStudyPlan.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-xl ${task.completed ? "bg-emerald-500/10" : "bg-navy"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed ? "bg-emerald-500" : "border-2 border-slate"}`}>
                  {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? "line-through text-slate" : ""}`}>{task.title}</p>
                  <p className="text-xs text-slate">{task.subject} • Due {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${task.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-slate/20 text-slate"}`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Weekly Progress</h2>
          <div className="space-y-4">
            {userStats?.weeklyData.map((day, i) => {
              const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
              const percent = Math.min((day.minutes / 120) * 100, 100);
              return (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm text-slate w-8">{dayName}</span>
                  <div className="flex-1 h-6 bg-navy rounded-lg overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal to-emerald-400 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-sm text-teal w-12 text-right">{day.minutes}m</span>
                </div>
              );
            })}
          </div>
          {userStats && (
            <div className="mt-6 p-4 bg-navy rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate">This Week</span>
                <span className="font-bold text-teal">
                  {userStats.weeklyData.reduce((sum, d) => sum + d.minutes, 0)} minutes
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-slate">Questions</span>
                <span className="font-bold">
                  {userStats.weeklyData.reduce((sum, d) => sum + d.questions, 0)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Sidebar />
      <TopBar />

      <main className="ml-64 pt-16 pb-24 md:pb-8 px-6">
        <ProtectedRoute>
          <DashboardContent />
        </ProtectedRoute>
      </main>

      <MobileNav />
    </div>
  );
}