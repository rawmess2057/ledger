"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar, TopBar, MobileNav } from "@/components/Navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import api from "@/lib/api";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Home,
  Send,
  Loader2,
  FileText,
  GraduationCap,
  Award,
  ListChecks,
  AlertTriangle,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  difficulty: string;
  topic: string;
  subtopic?: string;
  subject: string;
  marks: number;
}

interface QuestionState {
  selectedAnswer: string;
  isAnswered: boolean;
  timeSpent: number;
}

interface SessionData {
  session_id: string;
  mock_test_id: string;
  title: string;
  subject?: string;
  duration_minutes: number;
  total_marks: number;
  questions: Question[];
  started_at: string;
}

interface QuestionResult {
  question_id: string;
  question: string;
  type: string;
  difficulty: string;
  topic: string;
  marks: number;
  user_answer: string;
  correct_answer: string;
  explanation?: string;
  is_correct: boolean;
}

interface ResultData {
  session_id: string;
  title: string;
  subject?: string;
  total_questions: number;
  total_marks: number;
  obtained_marks: number;
  score_percentage: number;
  correct_answers: number;
  time_taken_seconds: number;
  completed_at: string;
  questions: QuestionResult[];
}

function MockExamContent() {
  const params = useParams();
  const router = useRouter();
  const testId = params.test_id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [questionStates, setQuestionStates] = useState<Record<string, QuestionState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState(Date.now());
  const [result, setResult] = useState<ResultData | null>(null);
  const [sectionTime, setSectionTime] = useState(0);

  const question = session?.questions[currentIndex];
  const totalQuestions = session?.questions.length || 0;
  const currentState = question ? questionStates[question.id] : null;

  useEffect(() => {
    async function init() {
      try {
        setIsLoading(true);
        const data = await api.startMockTest(testId);
        setSession(data);
        setTimeLeft(data.duration_minutes * 60);

        const initial: Record<string, QuestionState> = {};
        data.questions.forEach((q: Question) => {
          initial[q.id] = { selectedAnswer: "", isAnswered: false, timeSpent: 0 };
        });
        setQuestionStates(initial);
      } catch (e) {
        console.error("Failed to start mock test:", e);
      } finally {
        setIsLoading(false);
      }
    }
    if (testId) init();
  }, [testId]);

  useEffect(() => {
    if (!session || quizComplete) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { handleSubmit(); return 0; }
        return t - 1;
      });
      setSectionTime((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [session, quizComplete]);

  useEffect(() => {
    if (question && !currentState?.isAnswered) {
      setQuestionStates((prev) => ({
        ...prev,
        [question.id]: { ...prev[question.id], timeSpent: (prev[question.id]?.timeSpent || 0) + 1 },
      }));
    }
  }, [sectionTime]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + "h " : ""}${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const handleSelectAnswer = (answer: string) => {
    if (!question || currentState?.isAnswered) return;
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: { ...prev[question.id], selectedAnswer: answer },
    }));
  };

  const handleSubmitAnswer = () => {
    if (!question || !currentState?.selectedAnswer.trim()) return;
    setQuestionStates((prev) => ({
      ...prev,
      [question.id]: { ...prev[question.id], isAnswered: true },
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleFinish = async () => {
    if (!session) return;
    try {
      setIsSubmitting(true);
      const answers = Object.entries(questionStates).map(([qid, state]) => ({
        question_id: qid,
        user_answer: state.selectedAnswer || "",
        time_spent_seconds: state.timeSpent || 0,
      }));
      const res = await api.submitMockTest(session.session_id, {
        answers,
        time_taken_seconds: Math.round((Date.now() - startTime) / 1000),
      });
      setResult(res);
      setQuizComplete(true);
    } catch (e) {
      console.error("Failed to submit:", e);
      setQuizComplete(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.values(questionStates).filter((s) => s.isAnswered).length;
  const answeredMarks = Object.entries(questionStates)
    .filter(([, s]) => s.isAnswered)
    .reduce((sum, [id]) => {
      const q = session?.questions.find((q) => q.id === id);
      return sum + (q?.marks || 0);
    }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-teal animate-spin" />
          <p className="text-slate">Starting mock exam...</p>
        </div>
      </div>
    );
  }

  if (quizComplete && result) {
    const percentage = result.score_percentage;
    const grade = percentage >= 70 ? "Excellent" : percentage >= 50 ? "Good" : percentage >= 35 ? "Fair" : "Needs Improvement";
    const gradeColor = percentage >= 70 ? "text-emerald-400" : percentage >= 50 ? "text-amber-400" : percentage >= 35 ? "text-orange-400" : "text-red-400";

    return (
      <div className="min-h-screen bg-navy py-6 md:py-8 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.push("/mocks")} className="flex items-center gap-2 text-slate hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Mock Exams
          </button>

          <Card className="p-6 md:p-8 text-center mb-6">
            <div className={cn("w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 flex items-center justify-center", percentage >= 70 ? "bg-emerald-500/20" : percentage >= 50 ? "bg-amber-500/20" : "bg-red-500/20")}>
              {percentage >= 70 ? <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" /> : percentage >= 50 ? <Lightbulb className="w-10 h-10 md:w-12 md:h-12 text-amber-400" /> : <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-400" />}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{result.title}</h1>
            <p className={cn("text-lg font-semibold", gradeColor)}>{grade}</p>
            <div className="text-5xl md:text-6xl font-bold my-4 gradient-text">{percentage}%</div>
            <div className="grid grid-cols-3 gap-2 md:gap-4 mb-6">
              <div className="p-3 md:p-4 bg-navy rounded-xl">
                <p className="text-xl md:text-2xl font-bold text-emerald-400">{result.obtained_marks}</p>
                <p className="text-xs text-slate">Obtained</p>
              </div>
              <div className="p-3 md:p-4 bg-navy rounded-xl">
                <p className="text-xl md:text-2xl font-bold text-teal">{result.total_marks}</p>
                <p className="text-xs text-slate">Total Marks</p>
              </div>
              <div className="p-3 md:p-4 bg-navy rounded-xl">
                <p className="text-xl md:text-2xl font-bold text-amber-400">{formatTime(result.time_taken_seconds)}</p>
                <p className="text-xs text-slate">Time</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 mb-6">
            <h2 className="font-semibold mb-4">Question Review</h2>
            <div className="space-y-3">
              {result.questions.map((q, i) => {
                const hasUserAnswer = q.user_answer && q.user_answer.trim().length > 0;
                return (
                  <div key={q.question_id} className={cn("p-3 md:p-4 rounded-xl border", q.is_correct ? "bg-emerald-500/10 border-emerald-500/30" : "bg-red-500/10 border-red-500/30")}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate mb-1">Q{i + 1} ({q.marks} marks) - {q.topic}</p>
                        <p className="text-sm font-medium line-clamp-2">{q.question.substring(0, 150)}{q.question.length > 150 ? "..." : ""}</p>
                      </div>
                      {q.is_correct ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                      )}
                    </div>
                    <div className="space-y-1 text-xs">
                      {hasUserAnswer && (
                        <p><span className="text-slate">Your answer:</span> <span className={cn(q.is_correct ? "text-emerald-400" : "text-red-400")}>{q.user_answer.substring(0, 100)}</span></p>
                      )}
                      {!q.is_correct && (
                        <p><span className="text-slate">Correct:</span> <span className="text-teal">{q.correct_answer.substring(0, 100)}</span></p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <div className="flex gap-3 justify-center">
            <Link href="/mocks"><Button variant="secondary"><ArrowLeft className="w-4 h-4" /> More Mock Exams</Button></Link>
            <Link href="/dashboard"><Button><Home className="w-4 h-4" /> Dashboard</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !question) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Card className="p-8 text-center"><p className="text-slate mb-4">Failed to load mock exam</p><Link href="/mocks"><Button>Back to Mocks</Button></Link></Card>
      </div>
    );
  }

  const timeRatio = timeLeft / (session.duration_minutes * 60);
  const isLowTime = timeLeft < 300;

  return (
    <div className="min-h-screen bg-navy">
      <main className="pt-4 pb-28 md:pb-8 px-3 md:px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-3 gap-2">
            <button onClick={() => router.push("/mocks")} className="flex items-center gap-1 text-xs md:text-sm text-slate hover:text-white"><ArrowLeft className="w-3 h-3 md:w-4 md:h-4" /> Exit</button>
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate hidden sm:block">{answeredCount}/{totalQuestions} answered</div>
              <div className={cn("flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl", isLowTime ? "bg-red-500/20" : "bg-navy-light")}>
                <Clock className={cn("w-3 h-3 md:w-5 md:h-5", isLowTime ? "text-red-400" : "text-slate")} />
                <span className={cn("font-mono font-bold text-xs md:text-base", isLowTime && "text-red-400")}>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          <Progress value={(1 - timeRatio) * 100} className="mb-4" />

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-48 shrink-0 order-2 lg:order-1">
              <Card className="p-3">
                <p className="text-xs font-semibold text-slate mb-2">Question Navigator</p>
                <div className="grid grid-cols-6 lg:grid-cols-3 gap-1.5">
                  {session.questions.map((q, i) => {
                    const state = questionStates[q.id];
                    return (
                      <button key={i} onClick={() => setCurrentIndex(i)}
                        className={cn("w-8 h-8 rounded-lg text-xs font-medium transition-all", i === currentIndex ? "bg-teal text-navy" : state?.isAnswered ? "bg-emerald-500/30 text-emerald-400" : state?.selectedAnswer ? "bg-amber-500/20 text-amber-400" : "bg-navy-light text-slate hover:bg-slate/30")}>
                        {i + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-3 space-y-1 text-xs text-slate">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-teal" /> Current</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-emerald-500/30" /> Answered</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-navy-light" /> Unanswered</div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate/20 space-y-1 text-xs text-slate">
                  <div className="flex justify-between"><span>Answered</span><span className="text-white">{answeredCount}</span></div>
                  <div className="flex justify-between"><span>Marks</span><span className="text-white">{answeredMarks}/{session.total_marks}</span></div>
                  <div className="flex justify-between"><span>Remaining</span><span className="text-white">{session.total_marks - answeredMarks}</span></div>
                </div>
              </Card>
            </div>

            <div className="flex-1 order-1 lg:order-2">
              <div className="flex items-center gap-2 mb-3 text-xs text-slate">
                <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
                <span>{session.title}</span>
                <span className="text-slate/30">•</span>
                <span>{question.topic}</span>
                <span className="text-slate/30">•</span>
                <span className={cn("px-1.5 py-0.5 rounded-full capitalize", question.difficulty === "easy" ? "bg-emerald-500/20 text-emerald-400" : question.difficulty === "medium" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400")}>
                  {question.difficulty}
                </span>
                <span className="text-slate/30">•</span>
                <Award className="w-3 h-3 md:w-4 md:h-4" />
                <span>{question.marks} marks</span>
              </div>

              <Card className="p-4 md:p-6 mb-4">
                <div className="flex items-start gap-2 mb-4">
                  <span className="text-xs font-bold text-slate bg-navy-light px-2 py-1 rounded shrink-0 mt-0.5">Q{currentIndex + 1}.</span>
                  <div className="whitespace-pre-wrap text-sm md:text-base">{question.question}</div>
                </div>

                <textarea
                  placeholder="Type your answer here..."
                  value={currentState?.selectedAnswer || ""}
                  onChange={(e) => !currentState?.isAnswered && handleSelectAnswer(e.target.value)}
                  disabled={currentState?.isAnswered}
                  rows={6}
                  className="w-full p-3 md:p-4 bg-navy border border-slate/20 rounded-xl text-sm font-mono focus:outline-none focus:border-teal disabled:opacity-40 resize-y min-h-[120px]"
                />

                {currentState?.isAnswered && (
                  <div className="mt-4 p-3 md:p-4 bg-navy-light rounded-xl">
                    <p className="text-xs text-slate-light mb-1">Your answer submitted:</p>
                    <pre className="text-teal font-mono text-xs whitespace-pre-wrap">{currentState.selectedAnswer}</pre>
                  </div>
                )}
              </Card>

              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={handlePrev} disabled={currentIndex === 0}>
                  <ChevronLeft className="w-3 h-3 md:w-4 md:h-4" /> Previous
                </Button>
                <div className="flex gap-2">
                  {!currentState?.isAnswered ? (
                    <Button onClick={handleSubmitAnswer} disabled={!currentState?.selectedAnswer?.trim()} size="sm">
                      <Send className="w-3 h-3 md:w-4 md:h-4" /> Submit Answer
                    </Button>
                  ) : currentIndex < totalQuestions - 1 ? (
                    <Button onClick={handleNext} size="sm">
                      Next <ChevronRight className="w-3 h-3 md:w-4 md:h-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleFinish} disabled={isSubmitting} size="sm">
                      {isSubmitting ? <><Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" /> Submitting...</> : <>Finish Exam</>}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function MockExamPage() {
  return (
    <ProtectedRoute>
      <MockExamContent />
    </ProtectedRoute>
  );
}
