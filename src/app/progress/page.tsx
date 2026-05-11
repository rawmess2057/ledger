"use client";

import { useState, useEffect } from "react";
import { Sidebar, TopBar, MobileNav, Breadcrumb } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
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
  Loader2,
} from "lucide-react";

function ProgressContent() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    streak: number;
    totalQuestions: number;
    correctAnswers: number;
    totalStudyMinutes: number;
    weeklyData: { date: string; minutes: number; questions: number }[];
  } | null>(null);
  const [mastery, setMastery] = useState<{
    subject_id: string;
    subject_name: string;
    mastery_score: number;
    questions_attempted: number;
    questions_correct: number;
    color: string;
  }[]>([]);

  useEffect(() => {
    async function fetchProgress() {
      if (!user) return;
      
      try {
        setLoading(true);
        const [statsData, masteryData] = await Promise.all([
          api.getProgressOverview(),
          api.getSubjectMastery(),
        ]);
        setStats({
          streak: statsData.streak || 0,
          totalQuestions: statsData.total_questions || 0,
          correctAnswers: statsData.correct_answers || 0,
          totalStudyMinutes: statsData.total_study_minutes || 0,
          weeklyData: statsData.weekly_data || [],
        });
        setMastery(masteryData || []);
      } catch (error) {
        console.error("Failed to fetch progress:", error);
        setStats({
          streak: user?.stats?.streak || 0,
          totalQuestions: user?.stats?.totalQuestions || 0,
          correctAnswers: user?.stats?.correctAnswers || 0,
          totalStudyMinutes: user?.stats?.totalStudyMinutes || 0,
          weeklyData: user?.stats?.weeklyData || [],
        });
      } finally {
        setLoading(false);
      }
    }
    
    fetchProgress();
  }, [user]);

  const overallMastery = stats 
    ? (stats.totalQuestions > 0 
        ? Math.round((stats.correctAnswers / stats.totalQuestions) * 100) 
        : 0)
    : 0;

  const studyHours = stats ? Math.round(stats.totalStudyMinutes / 60) : 0;

  const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-teal" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <Breadcrumb items={[{ label: "Dashboard", href: "/dashboard" }, { label: "Progress" }]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
          <p className="text-slate-light">
            {stats?.totalQuestions === 0 
              ? "Start practicing to track your progress!" 
              : "Track your mastery and identify areas for improvement"}
          </p>
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
          <p className="text-sm text-slate">
            {stats?.totalQuestions === 0 
              ? "No questions attempted yet" 
              : `Based on ${stats?.totalQuestions || 0} questions`}
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="relative w-[120px] h-[120px] mx-auto mb-4">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-navy-light"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${Math.min(studyHours * 4, 327)} 327`}
                className="text-teal transition-all duration-500"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{studyHours}h</span>
            </div>
          </div>
          <p className="text-slate-light mt-4">Study Hours</p>
          <p className="text-sm text-slate">
            {stats?.totalStudyMinutes === 0 
              ? "Start studying to track time" 
              : `${stats?.totalStudyMinutes || 0} minutes total`}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Study Streak</h3>
            <div className="flex items-center gap-2 bg-amber-500/20 px-3 py-1 rounded-full">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">{stats?.streak || 0} days</span>
            </div>
          </div>
          <div className="flex justify-between items-end h-20">
            {weekDays.map((day, i) => {
              const dayIndex = (i + 1) % 7;
              const weeklyData = stats?.weeklyData || [];
              const dayData = weeklyData.find((d: { date: string }) => {
                const date = new Date(d.date);
                return date.getDay() === dayIndex;
              });
              const hasActivity = dayData && dayData.minutes > 0;
              const height = hasActivity ? Math.min((dayData.minutes / 60) * 60 + 20, 60) : 8;
              
              return (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className={cn(
                      "w-8 rounded-lg transition-all",
                      hasActivity ? "bg-teal" : "bg-navy-light"
                    )} 
                    style={{ height: `${height}px` }} 
                  />
                  <span className="text-xs text-slate">{day}</span>
                </div>
              );
            })}
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
              <h3 className="font-semibold mb-6">Weekly Activity</h3>
              {stats?.weeklyData && stats.weeklyData.length > 0 ? (
                <div className="space-y-3">
                  {stats.weeklyData.slice(-7).map((day: { date: string; minutes: number; questions: number }, i: number) => (
                    <div key={i} className="flex items-center gap-4">
                      <span className="w-20 text-sm text-slate">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <div className="flex-1 bg-navy-light rounded-full h-2 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal to-emerald-400 rounded-full"
                          style={{ width: `${Math.min((day.minutes / 60) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-sm text-slate">
                        {day.minutes}m / {day.questions}q
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No study data yet</p>
                  <p className="text-sm">Complete quizzes to see your weekly activity</p>
                </div>
              )}
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
                      <p className="text-sm text-slate">Total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-400">{stats?.correctAnswers || 0}</p>
                    <p className="text-sm text-slate">
                      {overallMastery}% accuracy
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-navy rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                      <XCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                      <p className="font-medium">Incorrect Answers</p>
                      <p className="text-sm text-slate">Total</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-400">
                      {(stats?.totalQuestions || 0) - (stats?.correctAnswers || 0)}
                    </p>
                    <p className="text-sm text-slate">
                      {100 - overallMastery}% errors
                    </p>
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
                    <p className="text-2xl font-bold">{stats?.totalQuestions || 0}</p>
                    <p className="text-sm text-slate">
                      {stats?.weeklyData?.slice(-1)[0]?.questions || 0} this week
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subjects">
          <Card className="p-6">
            <h3 className="font-semibold mb-6">Subject-wise Mastery</h3>
            {mastery && mastery.length > 0 ? (
              <div className="space-y-6">
                {mastery.map((subject) => (
                  <div key={subject.subject_id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${subject.color || "from-teal-500 to-emerald-500"} flex items-center justify-center`}>
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{subject.subject_name}</p>
                          <p className="text-sm text-slate">
                            {subject.questions_attempted} questions attempted
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={cn(
                          "text-lg font-bold",
                          subject.mastery_score >= 60 ? "text-emerald-400" : subject.mastery_score >= 40 ? "text-amber-400" : "text-slate"
                        )}>
                          {subject.mastery_score}%
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate" />
                      </div>
                    </div>
                    <Progress value={subject.mastery_score} className="mb-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No subject data yet</p>
                <p className="text-sm">Complete quizzes to see your subject mastery</p>
              </div>
            )}
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
            {mastery && mastery.filter(s => s.mastery_score < 60).length > 0 ? (
              <div className="space-y-4">
                {mastery
                  .filter(s => s.mastery_score < 60)
                  .sort((a, b) => a.mastery_score - b.mastery_score)
                  .map((subject) => (
                    <div key={subject.subject_id} className="p-4 bg-navy rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                          <Target className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium">{subject.subject_name}</p>
                          <p className="text-sm text-slate">{subject.questions_attempted} questions attempted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-red-400">{subject.mastery_score}%</span>
                        <Button size="sm" variant="ghost">
                          <BookOpen className="w-4 h-4" />
                          Practice
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No weak areas identified</p>
                <p className="text-sm">Keep practicing to track your weak areas</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="p-6">
        <h3 className="font-semibold mb-6">Recent Activity</h3>
        {stats?.totalQuestions === 0 ? (
          <div className="text-center py-8 text-slate">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm">Start taking quizzes to see your activity here</p>
          </div>
        ) : (
          <div className="text-center py-4 text-slate">
            <p>Your quiz history will appear here</p>
            <Button className="mt-4" onClick={() => window.location.href = "/quiz"}>
              Start a Quiz
            </Button>
          </div>
        )}
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