"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, TopBar, MobileNav } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { TASK_EVENTS, emitTaskEvent } from "@/lib/taskEvents";
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
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

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

const subjectIcons: Record<string, any> = {
  accounting: Calculator,
  assurance: ShieldCheck,
  "business-finance": TrendingUp,
  law: FileQuestion,
  taxation: Award,
};

const subjectColors: Record<string, string> = {
  accounting: "from-teal-500 to-emerald-500",
  assurance: "from-blue-500 to-cyan-500",
  "business-finance": "from-violet-500 to-purple-500",
  law: "from-amber-500 to-orange-500",
  taxation: "from-rose-500 to-pink-500",
};

function DashboardContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [mastery, setMastery] = useState<{
    subject_id: string;
    subject_name: string;
    mastery_score: number;
    questions_attempted: number;
    questions_correct: number;
  }[]>([]);
  const [tasks, setTasks] = useState<{
    id: string;
    title: string;
    subject: string;
    due_date: string;
    priority: string;
    completed: boolean;
  }[]>([]);

  async function fetchTasks() {
    try {
      const tasksData = await api.getTasks();
      setTasks(tasksData.tasks || []);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  }

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;

      try {
        setLoading(true);
        const [masteryData] = await Promise.all([
          api.getSubjectMastery(),
        ]);
        setMastery(masteryData || []);
        await fetchTasks();
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  useEffect(() => {
    const handleFocus = () => {
      fetchTasks();
    };
    const handleTaskCreated = (e: Event) => {
      const task = (e as CustomEvent).detail;
      setTasks(prev => {
        if (prev.find(t => t.id === task.id)) return prev;
        const todayStr = new Date().toISOString().split('T')[0];
        const taskDate = task.due_date?.split('T')[0];
        if (taskDate === todayStr) return [...prev, task];
        return prev;
      });
    };
    const handleTaskUpdated = (e: Event) => {
      const task = (e as CustomEvent).detail;
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, ...task } : t));
    };
    const handleTaskDeleted = (e: Event) => {
      const { id } = (e as CustomEvent).detail;
      setTasks(prev => prev.filter(t => t.id !== id));
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener(TASK_EVENTS.CREATED, handleTaskCreated);
    window.addEventListener(TASK_EVENTS.UPDATED, handleTaskUpdated);
    window.addEventListener(TASK_EVENTS.DELETED, handleTaskDeleted);
    const interval = setInterval(fetchTasks, 30000);
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener(TASK_EVENTS.CREATED, handleTaskCreated);
      window.removeEventListener(TASK_EVENTS.UPDATED, handleTaskUpdated);
      window.removeEventListener(TASK_EVENTS.DELETED, handleTaskDeleted);
      clearInterval(interval);
    };
  }, []);

  const userStats = user?.stats;

  const totalStudyHours = userStats ? Math.floor(userStats.totalStudyMinutes / 60) : 0;
  const studyMinutes = userStats ? userStats.totalStudyMinutes % 60 : 0;

  const accuracyRate = userStats?.accuracyRate || 0;

  const overallMastery = userStats?.totalQuestions
    ? Math.round((userStats.correctAnswers / userStats.totalQuestions) * 100)
    : 0;

  const todayQuestions = userStats?.weeklyData?.[userStats.weeklyData.length - 1]?.questions || 0;

  const weakSubjects = mastery
    .filter(s => s.mastery_score < 60 && s.questions_attempted > 0)
    .sort((a, b) => a.mastery_score - b.mastery_score)
    .slice(0, 4);

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const todayTasks = tasks.filter(task => {
    const taskDate = task.due_date.split('T')[0];
    return taskDate === todayStr && !task.completed;
  }).slice(0, 4);

  if (loading && !mastery.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋</h1>
          <p className="text-slate-light">
            {userStats?.totalQuestions === 0
              ? "Start your first quiz to begin tracking progress!"
              : "Ready to master the ledger today?"}
          </p>
        </div>
        {userStats && userStats.streak > 0 && (
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
          <p className="text-sm text-slate">
            {userStats?.totalQuestions === 0
              ? "Complete quizzes to see your score"
              : `Based on ${userStats?.totalQuestions || 0} questions`}
          </p>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <StatCard
            icon={BookOpen}
            label="Questions Today"
            value={String(todayQuestions)}
            color="bg-teal/20 text-teal"
          />
          <StatCard
            icon={Target}
            label="Accuracy Rate"
            value={`${accuracyRate}%`}
            trend={accuracyRate > 0 ? "+3%" : undefined}
            color="bg-emerald-500/20 text-emerald-400"
          />
          <StatCard
            icon={Clock}
            label="Study Time"
            value={`${totalStudyHours}h ${studyMinutes}m`}
            color="bg-violet-500/20 text-violet-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Tasks Done"
            value={`${userStats?.tasksCompleted || 0}/${userStats?.tasksTotal || 0}`}
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
            {mastery.length > 0 ? (
              <div className="space-y-4">
                {mastery.map((subject) => {
                  const IconComponent = subjectIcons[subject.subject_id] || BookOpen;
                  const color = subjectColors[subject.subject_id] || "from-teal-500 to-emerald-500";
                  return (
                    <div key={subject.subject_id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                            <IconComponent className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-medium">{subject.subject_name}</span>
                        </div>
                        <span className={cn(
                          subject.mastery_score >= 60 ? "text-emerald-400" : subject.mastery_score >= 40 ? "text-amber-400" : "text-slate"
                        )}>
                          {subject.mastery_score}%
                        </span>
                      </div>
                      <Progress value={subject.mastery_score} />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No subject data yet</p>
                <p className="text-sm">Complete quizzes to see your subject mastery</p>
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">Recommended Practice</h2>
            {weakSubjects.length > 0 ? (
              <>
                <div className="space-y-3 mb-6">
                  {weakSubjects.map((subject) => (
                    <div key={subject.subject_id} className="flex items-center gap-3 p-3 bg-navy rounded-xl">
                      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <Target className="w-4 h-4 text-red-400" />
                      </div>
                      <span className="text-sm flex-1">{subject.subject_name}</span>
                      <Link href="/practice">
                        <Button size="sm" variant="ghost" className="text-teal">
                          <Play className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-slate mb-6">
                <p className="text-sm">
                  {userStats?.totalQuestions === 0
                    ? "Start practicing to see recommendations"
                    : "Great job! No weak areas identified"}
                </p>
              </div>
            )}
            <Link href="/quiz">
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
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-4 rounded-xl ${task.completed ? "bg-emerald-500/10" : "bg-navy"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${task.completed ? "bg-emerald-500" : "border-2 border-slate"}`}>
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${task.completed ? "line-through text-slate" : ""}`}>{task.title}</p>
                    <p className="text-xs text-slate">{task.subject} • Due {new Date(task.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${task.priority === "high" ? "bg-red-500/20 text-red-400" : "bg-slate/20 text-slate"}`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tasks for today</p>
              <Link href="/planner" className="text-sm text-teal hover:underline">
                Create a study plan
              </Link>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Weekly Progress</h2>
          {userStats?.weeklyData && userStats.weeklyData.length > 0 ? (
            <>
              <div className="space-y-4">
                {userStats.weeklyData.slice(-7).map((day, i) => {
                  const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });
                  const percent = Math.min((day.minutes / 60) * 100, 100);
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
            </>
          ) : (
            <div className="text-center py-8 text-slate">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No weekly data yet</p>
              <p className="text-sm">Complete quizzes to track your weekly progress</p>
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